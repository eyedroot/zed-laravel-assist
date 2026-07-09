import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";
import { implementationsForDocument } from "../src/implementations.js";
import { buildLaravelIndex, emptyIndex, LaravelIndex, PhpClassInfo, SourceRange } from "../src/projectIndex.js";
import { TextDocument } from "vscode-languageserver-textdocument";

function phpClass(overrides: Partial<PhpClassInfo> & Pick<PhpClassInfo, "fqcn" | "filePath">): PhpClassInfo {
  return {
    extends: [],
    implements: [],
    isAbstract: false,
    isFinal: false,
    kind: "class",
    name: overrides.fqcn.split("\\").at(-1) ?? overrides.fqcn,
    nameRange: range(0, 0),
    namespace: null,
    ...overrides,
  };
}

function range(line: number, character: number): SourceRange {
  return {
    end: { character: character + 4, line },
    start: { character, line },
  };
}

function indexWith(classes: PhpClassInfo[]): LaravelIndex {
  return { ...emptyIndex(), phpClasses: classes };
}

function document(content: string, uri = "file:///app/app/Watchers/AbstractWatcher.php"): TextDocument {
  return TextDocument.create(uri, "php", 1, content);
}

describe("Laravel implementations", () => {
  it("lists subclasses of an abstract class from its own declaration", () => {
    const index = indexWith([
      phpClass({
        fqcn: "App\\Watchers\\AbstractWatcher",
        filePath: "/app/app/Watchers/AbstractWatcher.php",
        isAbstract: true,
        namespace: "App\\Watchers",
      }),
      phpClass({
        extends: ["App\\Watchers\\AbstractWatcher"],
        fqcn: "App\\Watchers\\FileWatcher",
        filePath: "/app/app/Watchers/FileWatcher.php",
        nameRange: range(3, 6),
        namespace: "App\\Watchers",
      }),
      phpClass({
        extends: ["App\\Watchers\\AbstractWatcher"],
        fqcn: "App\\Watchers\\QueueWatcher",
        filePath: "/app/app/Watchers/QueueWatcher.php",
        nameRange: range(3, 6),
        namespace: "App\\Watchers",
      }),
    ]);

    const doc = document(
      ["<?php", "namespace App\\Watchers;", "", "abstract class AbstractWatcher", "{", "}"].join("\n"),
    );

    expect(implementationsForDocument(doc, { line: 3, character: 20 }, index)).toEqual([
      { range: range(3, 6), uri: "file:///app/app/Watchers/FileWatcher.php" },
      { range: range(3, 6), uri: "file:///app/app/Watchers/QueueWatcher.php" },
    ]);
  });

  it("lists implementers of an interface", () => {
    const index = indexWith([
      phpClass({
        fqcn: "App\\Contracts\\Reportable",
        filePath: "/app/app/Contracts/Reportable.php",
        kind: "interface",
        namespace: "App\\Contracts",
      }),
      phpClass({
        fqcn: "App\\Reports\\JsonReport",
        filePath: "/app/app/Reports/JsonReport.php",
        implements: ["App\\Contracts\\Reportable"],
        nameRange: range(4, 6),
        namespace: "App\\Reports",
      }),
    ]);

    const doc = document(
      ["<?php", "namespace App\\Contracts;", "", "interface Reportable", "{", "}"].join("\n"),
      "file:///app/app/Contracts/Reportable.php",
    );

    expect(implementationsForDocument(doc, { line: 3, character: 12 }, index)).toEqual([
      { range: range(4, 6), uri: "file:///app/app/Reports/JsonReport.php" },
    ]);
  });

  it("walks the hierarchy transitively across extends and interface chains", () => {
    const index = indexWith([
      phpClass({
        fqcn: "App\\Contracts\\Watcher",
        filePath: "/app/app/Contracts/Watcher.php",
        kind: "interface",
        namespace: "App\\Contracts",
      }),
      phpClass({
        extends: [],
        fqcn: "App\\Watchers\\AbstractWatcher",
        filePath: "/app/app/Watchers/AbstractWatcher.php",
        implements: ["App\\Contracts\\Watcher"],
        isAbstract: true,
        nameRange: range(3, 6),
        namespace: "App\\Watchers",
      }),
      phpClass({
        extends: ["App\\Watchers\\AbstractWatcher"],
        fqcn: "App\\Watchers\\FileWatcher",
        filePath: "/app/app/Watchers/FileWatcher.php",
        nameRange: range(3, 6),
        namespace: "App\\Watchers",
      }),
      phpClass({
        extends: ["App\\Watchers\\FileWatcher"],
        fqcn: "App\\Watchers\\TailFileWatcher",
        filePath: "/app/app/Watchers/TailFileWatcher.php",
        nameRange: range(3, 6),
        namespace: "App\\Watchers",
      }),
    ]);

    const doc = document(
      ["<?php", "namespace App\\Contracts;", "", "interface Watcher", "{", "}"].join("\n"),
      "file:///app/app/Contracts/Watcher.php",
    );

    // From the root interface, every descendant (abstract class, its subclass,
    // and the subclass of that subclass) must surface.
    expect(implementationsForDocument(doc, { line: 3, character: 12 }, index).map((location) => location.uri)).toEqual([
      "file:///app/app/Watchers/AbstractWatcher.php",
      "file:///app/app/Watchers/FileWatcher.php",
      "file:///app/app/Watchers/TailFileWatcher.php",
    ]);
  });

  it("resolves the target from an extends clause reference", () => {
    const index = indexWith([
      phpClass({
        fqcn: "App\\Watchers\\AbstractWatcher",
        filePath: "/app/app/Watchers/AbstractWatcher.php",
        isAbstract: true,
        namespace: "App\\Watchers",
      }),
      phpClass({
        extends: ["App\\Watchers\\AbstractWatcher"],
        fqcn: "App\\Watchers\\FileWatcher",
        filePath: "/app/app/Watchers/FileWatcher.php",
        nameRange: range(2, 6),
        namespace: "App\\Watchers",
      }),
    ]);

    const doc = document(
      ["<?php", "namespace App\\Watchers;", "class FileWatcher extends AbstractWatcher", "{", "}"].join("\n"),
      "file:///app/app/Watchers/FileWatcher.php",
    );

    // Cursor sits within the `AbstractWatcher` token of the extends clause.
    expect(implementationsForDocument(doc, { line: 2, character: 30 }, index)).toEqual([
      { range: range(2, 6), uri: "file:///app/app/Watchers/FileWatcher.php" },
    ]);
  });

  it("resolves an imported alias to its fully-qualified target", () => {
    const index = indexWith([
      phpClass({
        extends: ["App\\Watchers\\AbstractWatcher"],
        fqcn: "App\\Watchers\\FileWatcher",
        filePath: "/app/app/Watchers/FileWatcher.php",
        nameRange: range(4, 6),
        namespace: "App\\Watchers",
      }),
    ]);

    const doc = document(
      [
        "<?php",
        "namespace App\\Console;",
        "use App\\Watchers\\AbstractWatcher;",
        "",
        "$watcher = AbstractWatcher::class;",
      ].join("\n"),
      "file:///app/app/Console/Kernel.php",
    );

    // `AbstractWatcher` here is the imported short name; it must resolve through
    // the `use` statement to the same FQCN the subclass extends.
    expect(implementationsForDocument(doc, { line: 4, character: 15 }, index)).toEqual([
      { range: range(4, 6), uri: "file:///app/app/Watchers/FileWatcher.php" },
    ]);
  });

  it("returns nothing for a type with no descendants", () => {
    const index = indexWith([
      phpClass({
        fqcn: "App\\Watchers\\AbstractWatcher",
        filePath: "/app/app/Watchers/AbstractWatcher.php",
        isAbstract: true,
        namespace: "App\\Watchers",
      }),
    ]);

    const doc = document(
      ["<?php", "namespace App\\Watchers;", "", "abstract class AbstractWatcher", "{", "}"].join("\n"),
    );

    expect(implementationsForDocument(doc, { line: 3, character: 20 }, index)).toEqual([]);
  });

  it("returns nothing when the cursor is not on a class token", () => {
    const index = indexWith([
      phpClass({
        extends: ["App\\Watchers\\AbstractWatcher"],
        fqcn: "App\\Watchers\\FileWatcher",
        filePath: "/app/app/Watchers/FileWatcher.php",
        namespace: "App\\Watchers",
      }),
    ]);

    const doc = document(["<?php", "namespace App\\Watchers;", "$total = 1 + 2;"].join("\n"));

    expect(implementationsForDocument(doc, { line: 2, character: 4 }, index)).toEqual([]);
  });
});

describe("class hierarchy indexing", () => {
  it("indexes extends/implements across the project and resolves implementations end to end", async () => {
    const rootPath = await mkdtemp(path.join(os.tmpdir(), "laravel-assist-hierarchy-"));

    try {
      await mkdir(path.join(rootPath, "app", "Watchers"), { recursive: true });
      await mkdir(path.join(rootPath, "app", "Contracts"), { recursive: true });
      await mkdir(path.join(rootPath, "app", "Reports"), { recursive: true });

      const abstractWatcher = [
        "<?php",
        "namespace App\\Watchers;",
        "",
        "abstract class AbstractWatcher",
        "{",
        "}",
      ].join("\n");
      const abstractWatcherPath = path.join(rootPath, "app", "Watchers", "AbstractWatcher.php");
      await writeFile(abstractWatcherPath, abstractWatcher);
      await writeFile(
        path.join(rootPath, "app", "Watchers", "FileWatcher.php"),
        ["<?php", "namespace App\\Watchers;", "", "final class FileWatcher extends AbstractWatcher", "{", "}"].join(
          "\n",
        ),
      );
      await writeFile(
        path.join(rootPath, "app", "Watchers", "QueueWatcher.php"),
        ["<?php", "namespace App\\Watchers;", "", "class QueueWatcher extends AbstractWatcher", "{", "}"].join("\n"),
      );
      await writeFile(
        path.join(rootPath, "app", "Contracts", "Reportable.php"),
        ["<?php", "namespace App\\Contracts;", "", "interface Reportable", "{", "}"].join("\n"),
      );
      await writeFile(
        path.join(rootPath, "app", "Reports", "JsonReport.php"),
        [
          "<?php",
          "namespace App\\Reports;",
          "",
          "use App\\Contracts\\Reportable;",
          "",
          "class JsonReport implements Reportable",
          "{",
          "}",
        ].join("\n"),
      );

      const { index } = await buildLaravelIndex(rootPath);

      const byFqcn = (fqcn: string) => index.phpClasses.find((phpClass) => phpClass.fqcn === fqcn);

      expect(byFqcn("App\\Watchers\\AbstractWatcher")).toMatchObject({
        extends: [],
        implements: [],
        isAbstract: true,
        kind: "class",
      });
      expect(byFqcn("App\\Watchers\\FileWatcher")).toMatchObject({
        extends: ["App\\Watchers\\AbstractWatcher"],
        isFinal: true,
      });
      expect(byFqcn("App\\Watchers\\QueueWatcher")?.extends).toEqual(["App\\Watchers\\AbstractWatcher"]);
      expect(byFqcn("App\\Reports\\JsonReport")).toMatchObject({
        implements: ["App\\Contracts\\Reportable"],
        kind: "class",
      });

      const doc = TextDocument.create(pathToFileURL(abstractWatcherPath).toString(), "php", 1, abstractWatcher);
      const locations = implementationsForDocument(doc, { line: 3, character: 20 }, index);

      expect(locations.map((location) => location.uri).sort()).toEqual([
        pathToFileURL(path.join(rootPath, "app", "Watchers", "FileWatcher.php")).toString(),
        pathToFileURL(path.join(rootPath, "app", "Watchers", "QueueWatcher.php")).toString(),
      ]);
      // Navigation lands on the subclass name token, not the file head.
      expect(locations.every((location) => location.range.start.line === 3)).toBe(true);
    } finally {
      await rm(rootPath, { force: true, recursive: true });
    }
  });

  it("indexes enum implementations and interface extension chains", async () => {
    const rootPath = await mkdtemp(path.join(os.tmpdir(), "laravel-assist-enum-"));

    try {
      await mkdir(path.join(rootPath, "app", "Contracts"), { recursive: true });
      await mkdir(path.join(rootPath, "app", "Enums"), { recursive: true });

      await writeFile(
        path.join(rootPath, "app", "Contracts", "HasLabel.php"),
        ["<?php", "namespace App\\Contracts;", "", "interface HasLabel", "{", "}"].join("\n"),
      );
      await writeFile(
        path.join(rootPath, "app", "Contracts", "HasColor.php"),
        [
          "<?php",
          "namespace App\\Contracts;",
          "",
          "interface HasColor extends HasLabel",
          "{",
          "}",
        ].join("\n"),
      );
      await writeFile(
        path.join(rootPath, "app", "Enums", "Status.php"),
        [
          "<?php",
          "namespace App\\Enums;",
          "",
          "use App\\Contracts\\HasColor;",
          "",
          "enum Status: string implements HasColor",
          "{",
          "    case Active = 'active';",
          "}",
        ].join("\n"),
      );

      const { index } = await buildLaravelIndex(rootPath);
      const byFqcn = (fqcn: string) => index.phpClasses.find((phpClass) => phpClass.fqcn === fqcn);

      expect(byFqcn("App\\Contracts\\HasColor")?.extends).toEqual(["App\\Contracts\\HasLabel"]);
      expect(byFqcn("App\\Enums\\Status")).toMatchObject({
        implements: ["App\\Contracts\\HasColor"],
        kind: "enum",
      });

      const doc = TextDocument.create(
        "file:///contracts/HasLabel.php",
        "php",
        1,
        ["<?php", "namespace App\\Contracts;", "", "interface HasLabel", "{", "}"].join("\n"),
      );

      // HasColor extends HasLabel, and Status implements HasColor, so both must
      // surface as implementations of HasLabel.
      const uris = implementationsForDocument(doc, { line: 3, character: 12 }, index).map((location) => location.uri);
      expect(uris).toContain(pathToFileURL(path.join(rootPath, "app", "Contracts", "HasColor.php")).toString());
      expect(uris).toContain(pathToFileURL(path.join(rootPath, "app", "Enums", "Status.php")).toString());
    } finally {
      await rm(rootPath, { force: true, recursive: true });
    }
  });
});
