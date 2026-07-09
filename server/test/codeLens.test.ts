import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { TextDocument } from "vscode-languageserver-textdocument";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { codeLensesForDocument, resolveUsageCodeLens } from "../src/codeLens.js";
import { emptyIndex, extractPhpClasses, extractRouteInfo, LaravelIndex } from "../src/projectIndex.js";

describe("Laravel usage code lens", () => {
  let rootPath: string;
  let controllerPath: string;
  let routePath: string;
  let servicePath: string;

  beforeEach(async () => {
    rootPath = await mkdtemp(path.join(tmpdir(), "laravel-assist-code-lens-"));
    controllerPath = path.join(rootPath, "app/Http/Controllers/SelfSignupController.php");
    routePath = path.join(rootPath, "routes/web.php");
    servicePath = path.join(rootPath, "app/Services/SelfSignupService.php");

    await mkdir(path.dirname(controllerPath), { recursive: true });
    await mkdir(path.dirname(routePath), { recursive: true });
    await mkdir(path.dirname(servicePath), { recursive: true });
  });

  afterEach(async () => {
    await rm(rootPath, { force: true, recursive: true });
  });

  it("creates unresolved usage lenses for indexed PHP classes and public methods", () => {
    const source = [
      "<?php",
      "namespace App\\Services;",
      "",
      "class SelfSignupService",
      "{",
      "    public function completeSignup(): void {}",
      "    protected function internalOnly(): void {}",
      "}",
    ].join("\n");
    const document = TextDocument.create(pathToFileURL(servicePath).toString(), "php", 1, source);
    const index = indexFixture({ phpSources: [{ filePath: servicePath, source }] });

    const lenses = codeLensesForDocument(document, index);

    expect(lenses.map((lens) => (lens.data as { kind: string }).kind)).toEqual(["phpClass", "phpMethod"]);
    expect(lenses.map((lens) => lens.command)).toEqual([undefined, undefined]);
  });

  it("resolves class and method usage counts with show-references commands", async () => {
    const serviceSource = [
      "<?php",
      "namespace App\\Services;",
      "",
      "class SelfSignupService",
      "{",
      "    public function completeSignup(User $user, array $data): array",
      "    {",
      "        return [];",
      "    }",
      "",
      "    public function unused(): void {}",
      "}",
    ].join("\n");
    const controllerSource = [
      "<?php",
      "namespace App\\Http\\Controllers;",
      "",
      "use App\\Services\\SelfSignupService;",
      "",
      "class SelfSignupController",
      "{",
      "    public function __construct(private ?SelfSignupService $selfSignupService) {}",
      "",
      "    public function store(?SelfSignupService $service): void",
      "    {",
      "        // $service->completeSignup($user, []);",
      "        // new SelfSignupService();",
      "        $service->completeSignup($user, []);",
      "        $this->selfSignupService->completeSignup($user, []);",
      "        app(SelfSignupService::class)->completeSignup($user, []);",
      "    }",
      "}",
    ].join("\n");
    await writeFile(servicePath, serviceSource);
    await writeFile(controllerPath, controllerSource);

    const document = TextDocument.create(pathToFileURL(servicePath).toString(), "php", 1, serviceSource);
    const index = indexFixture({
      phpSources: [
        { filePath: servicePath, source: serviceSource },
        { filePath: controllerPath, source: controllerSource },
      ],
    });

    const lenses = codeLensesForDocument(document, index);
    const classLens = lenses.find((lens) => (lens.data as { kind: string }).kind === "phpClass");
    const methodLens = lenses.find((lens) => (lens.data as { methodName?: string }).methodName === "completeSignup");

    const resolvedClass = await resolveUsageCodeLens(classLens!, document, index);
    const resolvedMethod = await resolveUsageCodeLens(methodLens!, document, index);

    expect(resolvedClass.command?.title).toBe("3 usages");
    expect(resolvedClass.command?.command).toBe("editor.action.showReferences");
    expect((resolvedClass.command?.arguments?.[2] as Array<{ uri: string }>).map((location) => location.uri)).toEqual([
      pathToFileURL(controllerPath).toString(),
      pathToFileURL(controllerPath).toString(),
      pathToFileURL(controllerPath).toString(),
    ]);

    expect(resolvedMethod.command?.title).toBe("3 usages");
    expect(resolvedMethod.command?.command).toBe("editor.action.showReferences");
    expect((resolvedMethod.command?.arguments?.[2] as Array<{ uri: string }>).map((location) => location.uri)).toEqual([
      pathToFileURL(controllerPath).toString(),
      pathToFileURL(controllerPath).toString(),
      pathToFileURL(controllerPath).toString(),
    ]);
  });

  it("counts Laravel route action declarations as controller method usages", async () => {
    const controllerSource = [
      "<?php",
      "namespace App\\Http\\Controllers;",
      "",
      "class UserController",
      "{",
      "    public function show(): void {}",
      "}",
    ].join("\n");
    const routeSource = [
      "<?php",
      "use App\\Http\\Controllers\\UserController;",
      "",
      "Route::get('/users/{user}', [UserController::class, 'show']);",
    ].join("\n");
    await writeFile(controllerPath, controllerSource);
    await writeFile(routePath, routeSource);

    const document = TextDocument.create(pathToFileURL(controllerPath).toString(), "php", 1, controllerSource);
    const index = indexFixture({
      phpSources: [{ filePath: controllerPath, source: controllerSource }],
      routeSources: [{ filePath: routePath, source: routeSource }],
    });
    const showLens = codeLensesForDocument(document, index).find((lens) => (lens.data as { methodName?: string }).methodName === "show");

    const resolved = await resolveUsageCodeLens(showLens!, document, index);

    expect(resolved.command?.title).toBe("1 usage");
    expect((resolved.command?.arguments?.[2] as Array<{ uri: string }>).map((location) => location.uri)).toEqual([
      pathToFileURL(routePath).toString(),
    ]);
  });
});

function indexFixture({
  phpSources = [],
  routeSources = [],
}: {
  phpSources?: Array<{ filePath: string; source: string }>;
  routeSources?: Array<{ filePath: string; source: string }>;
}): LaravelIndex {
  return {
    ...emptyIndex(),
    phpClasses: phpSources.flatMap(({ filePath, source }) => extractPhpClasses(filePath, source)),
    routes: routeSources.flatMap(({ filePath, source }) => extractRouteInfo(filePath, source)),
  };
}
