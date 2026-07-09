import { pathToFileURL } from "node:url";
import { Location, Position } from "vscode-languageserver/node.js";
import { TextDocument } from "vscode-languageserver-textdocument";
import { LaravelIndex, PhpClassInfo } from "./projectIndex.js";
import { resolvePhpClassReference } from "./phpResolver.js";

// The reverse inheritance graph (parent FQCN -> declaring children) is derived
// lazily from `index.phpClasses` and memoised against that array. `indexFromCache`
// produces a fresh array on every rebuild, so the WeakMap entry is discarded
// automatically once the index changes and never goes stale.
const childrenCache = new WeakMap<PhpClassInfo[], Map<string, PhpClassInfo[]>>();

// Resolves the class/interface reference under the cursor to the concrete
// declarations that extend or implement it, transitively. Works whether the
// cursor sits on the type's own declaration, an `extends`/`implements` clause,
// a `use` import, a type hint, or a `Foo::class` reference — anything that
// resolves to a fully-qualified name with descendants in the project.
export function implementationsForDocument(
  document: TextDocument,
  position: Position,
  index: LaravelIndex,
): Location[] {
  const target = classFqcnAtPosition(document, position);
  if (!target) {
    return [];
  }

  const children = childrenByParent(index.phpClasses);
  const descendants = collectDescendants(target, children);
  if (descendants.length === 0) {
    return [];
  }

  const locations: Location[] = [];
  const seen = new Set<string>();
  for (const descendant of descendants) {
    const key = `${descendant.filePath}:${descendant.nameRange.start.line}:${descendant.nameRange.start.character}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    locations.push(
      Location.create(pathToFileURL(descendant.filePath).toString(), {
        end: descendant.nameRange.end,
        start: descendant.nameRange.start,
      }),
    );
  }

  return locations.sort(
    (left, right) =>
      left.uri.localeCompare(right.uri) ||
      left.range.start.line - right.range.start.line ||
      left.range.start.character - right.range.start.character,
  );
}

function classFqcnAtPosition(document: TextDocument, position: Position): string | null {
  const line = document.getText().split(/\r?\n/)[position.line];
  if (line === undefined) {
    return null;
  }

  const token = classTokenAtPosition(line, position.character);
  if (!token) {
    return null;
  }

  return resolvePhpClassReference(document.getText(), token);
}

function classTokenAtPosition(line: string, character: number): string | null {
  for (const match of line.matchAll(/\\?[A-Za-z_][A-Za-z0-9_\\]*/g)) {
    const start = match.index ?? 0;
    const end = start + match[0].length;
    if (character >= start && character <= end) {
      return match[0];
    }
  }

  return null;
}

function childrenByParent(classes: PhpClassInfo[]): Map<string, PhpClassInfo[]> {
  const cached = childrenCache.get(classes);
  if (cached) {
    return cached;
  }

  const children = new Map<string, PhpClassInfo[]>();
  for (const phpClass of classes) {
    for (const parent of [...phpClass.extends, ...phpClass.implements]) {
      const bucket = children.get(parent);
      if (bucket) {
        bucket.push(phpClass);
      } else {
        children.set(parent, [phpClass]);
      }
    }
  }

  childrenCache.set(classes, children);
  return children;
}

// Breadth-first walk over the reverse graph so a subclass of a subclass (or an
// implementer of an interface that another class extends) is still surfaced,
// matching how dedicated PHP IDEs list every implementation. `visitedParents`
// guards against inheritance cycles from malformed source.
function collectDescendants(
  rootFqcn: string,
  children: Map<string, PhpClassInfo[]>,
): PhpClassInfo[] {
  const descendants: PhpClassInfo[] = [];
  const visitedParents = new Set<string>([rootFqcn]);
  const queue: string[] = [rootFqcn];

  while (queue.length > 0) {
    const parent = queue.shift() as string;
    for (const child of children.get(parent) ?? []) {
      descendants.push(child);
      if (!visitedParents.has(child.fqcn)) {
        visitedParents.add(child.fqcn);
        queue.push(child.fqcn);
      }
    }
  }

  return descendants;
}
