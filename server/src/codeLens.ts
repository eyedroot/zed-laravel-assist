import { readFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { CodeLens, Location, Range } from "vscode-languageserver/node.js";
import { TextDocument } from "vscode-languageserver-textdocument";
import { containerResolvedMemberClass } from "./containerResolution.js";
import { LaravelIndex, SourceRange } from "./projectIndex.js";
import { resolvePhpClassReference } from "./phpResolver.js";

const SHOW_REFERENCES_COMMAND = "editor.action.showReferences";

type UsageCodeLensData =
  | {
      classFqcn: string;
      className: string;
      kind: "phpClass";
      range: Range;
      uri: string;
    }
  | {
      classFqcn: string;
      className: string;
      kind: "phpMethod";
      methodName: string;
      range: Range;
      uri: string;
    };

type UsageSource = {
  filePath: string;
  source: string;
};

export function codeLensesForDocument(document: TextDocument, index: LaravelIndex): CodeLens[] {
  const filePath = pathFromUri(document.uri);
  if (!filePath) {
    return [];
  }

  const lenses: CodeLens[] = [];
  for (const phpClass of index.phpClasses.filter((candidate) => candidate.filePath === filePath)) {
    const classRange = toRange(phpClass.nameRange);
    lenses.push({
      data: {
        classFqcn: phpClass.fqcn,
        className: phpClass.name,
        kind: "phpClass",
        range: classRange,
        uri: document.uri,
      } satisfies UsageCodeLensData,
      range: classRange,
    });

    for (const method of phpClass.methods ?? []) {
      const methodRange = toRange(method.range);
      lenses.push({
        data: {
          classFqcn: phpClass.fqcn,
          className: phpClass.name,
          kind: "phpMethod",
          methodName: method.name,
          range: methodRange,
          uri: document.uri,
        } satisfies UsageCodeLensData,
        range: methodRange,
      });
    }
  }

  return lenses.sort(compareCodeLens);
}

export function codeLensDocumentUri(lens: CodeLens): string | null {
  return usageCodeLensData(lens.data)?.uri ?? null;
}

export async function resolveUsageCodeLens(
  lens: CodeLens,
  document: TextDocument | undefined,
  index: LaravelIndex,
): Promise<CodeLens> {
  const data = usageCodeLensData(lens.data);
  if (!data || !document) {
    return lens;
  }

  const locations = data.kind === "phpClass"
    ? await phpClassUsageLocations(document, data, index)
    : await phpMethodUsageLocations(document, data, index);

  return {
    ...lens,
    command: {
      arguments: [data.uri, data.range.start, locations],
      command: SHOW_REFERENCES_COMMAND,
      title: usageTitle(locations.length),
    },
  };
}

async function phpClassUsageLocations(
  document: TextDocument,
  target: Extract<UsageCodeLensData, { kind: "phpClass" }>,
  index: LaravelIndex,
): Promise<Location[]> {
  const sources = await usageSources(document, index);
  const locations = sources.flatMap((source) => phpClassUsageLocationsInSource(source, target));
  return sortLocations(uniqueLocations(locations));
}

async function phpMethodUsageLocations(
  document: TextDocument,
  target: Extract<UsageCodeLensData, { kind: "phpMethod" }>,
  index: LaravelIndex,
): Promise<Location[]> {
  const sources = await usageSources(document, index);
  const locations = [
    ...sources.flatMap((source) => phpMethodUsageLocationsInSource(source, target, index)),
    ...routeActionUsageLocations(target, index),
  ];
  return sortLocations(uniqueLocations(locations));
}

async function usageSources(document: TextDocument, index: LaravelIndex): Promise<UsageSource[]> {
  const documentPath = pathFromUri(document.uri);
  const filePaths = indexedUsageFilePaths(index);
  if (documentPath) {
    filePaths.add(documentPath);
  }

  const sources: UsageSource[] = [];
  for (const filePath of filePaths) {
    if (documentPath && filePath === documentPath) {
      sources.push({ filePath, source: document.getText() });
      continue;
    }

    const source = await readFileSafely(filePath);
    if (source !== null) {
      sources.push({ filePath, source });
    }
  }

  return sources;
}

function indexedUsageFilePaths(index: LaravelIndex): Set<string> {
  const filePaths = new Set<string>();
  const add = (filePath: string | null | undefined) => {
    if (filePath) {
      filePaths.add(filePath);
    }
  };

  index.artifacts.forEach((artifact) => add(artifact.filePath));
  index.authorization.forEach((entry) => add(entry.filePath));
  index.bladeComponents.forEach((component) => add(component.filePath));
  index.bladeViews.forEach((view) => add(view.filePath));
  index.commands.forEach((command) => add(command.filePath));
  index.configEntries.forEach((entry) => add(entry.filePath));
  index.containerBindings.forEach((binding) => add(binding.filePath));
  index.controllers.forEach((controller) => add(controller.filePath));
  index.envEntries.forEach((entry) => add(entry.filePath));
  index.factories.forEach((factory) => add(factory.filePath));
  index.facades.forEach((facade) => add(facade.filePath));
  index.inertiaPages.forEach((page) => add(page.filePath));
  index.livewireComponents.forEach((component) => add(component.filePath));
  index.macros.forEach((macro) => add(macro.filePath));
  index.middleware.forEach((middleware) => add(middleware.filePath));
  index.models.forEach((model) => {
    add(model.filePath);
    add(model.customBuilder?.filePath);
  });
  index.phpClasses.forEach((phpClass) => add(phpClass.filePath));
  index.providers.forEach((provider) => {
    add(provider.filePath);
    add(provider.classFilePath);
  });
  index.routes.forEach((route) => add(route.filePath));
  index.schemaTables.forEach((table) => {
    add(table.filePath);
    table.columns.forEach((column) => add(column.filePath));
  });
  index.seeders.forEach((seeder) => add(seeder.filePath));
  index.translationKeys.forEach((translation) => add(translation.filePath));
  index.validationRules.forEach((ruleSet) => add(ruleSet.filePath));

  return filePaths;
}

async function readFileSafely(filePath: string): Promise<string | null> {
  try {
    return await readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

function phpClassUsageLocationsInSource(
  source: UsageSource,
  target: Extract<UsageCodeLensData, { kind: "phpClass" }>,
): Location[] {
  const locations: Location[] = [];

  for (const match of source.source.matchAll(/\\?[A-Za-z_][A-Za-z0-9_\\]*/g)) {
    const start = match.index ?? 0;
    const value = match[0];
    if (isOffsetInIgnoredPhpSource(source.source, start) || !isLikelyClassReference(source.source, start, value)) {
      continue;
    }

    const resolved = resolvePhpClassReference(source.source, value);
    if (sameClassReference(target.classFqcn, resolved)) {
      locations.push(Location.create(pathToFileURL(source.filePath).toString(), sourceRangeForOffset(source.source, start, value.length)));
    }
  }

  return locations;
}

function phpMethodUsageLocationsInSource(
  source: UsageSource,
  target: Extract<UsageCodeLensData, { kind: "phpMethod" }>,
  index: LaravelIndex,
): Location[] {
  const locations: Location[] = [];
  const method = escapeRegExp(target.methodName);

  for (const match of source.source.matchAll(new RegExp(`\\b(\\$this|self|static|parent|\\\\?[A-Za-z_][A-Za-z0-9_\\\\]*)::\\s*(${method})\\s*\\(`, "g"))) {
    const receiver = match[1];
    const methodStart = (match.index ?? 0) + match[0].lastIndexOf(match[2]);
    if (isOffsetInIgnoredPhpSource(source.source, methodStart)) {
      continue;
    }

    const receiverClass = ["self", "static", "parent"].includes(receiver)
      ? enclosingPhpClassFqcn(source.source, methodStart)
      : resolvePhpClassReference(source.source, receiver);

    if (receiverClass && classCanReferenceTarget(receiverClass, target.classFqcn, index)) {
      locations.push(Location.create(pathToFileURL(source.filePath).toString(), sourceRangeForOffset(source.source, methodStart, target.methodName.length)));
    }
  }

  for (const match of source.source.matchAll(new RegExp(`(?:\\?->|->)\\s*(${method})\\s*\\(`, "g"))) {
    const methodStart = (match.index ?? 0) + match[0].lastIndexOf(match[1]);
    if (isOffsetInIgnoredPhpSource(source.source, methodStart)) {
      continue;
    }

    const receiverClass = memberReceiverClass(source.source, methodStart, index);
    if (receiverClass && classCanReferenceTarget(receiverClass, target.classFqcn, index)) {
      locations.push(Location.create(pathToFileURL(source.filePath).toString(), sourceRangeForOffset(source.source, methodStart, target.methodName.length)));
    }
  }

  return locations;
}

function routeActionUsageLocations(
  target: Extract<UsageCodeLensData, { kind: "phpMethod" }>,
  index: LaravelIndex,
): Location[] {
  return index.routes
    .filter((route) => route.action && routeActionMatches(route.action, target))
    .map((route) => Location.create(pathToFileURL(route.filePath).toString(), toRange(route.range)));
}

function routeActionMatches(
  action: string,
  target: Extract<UsageCodeLensData, { kind: "phpMethod" }>,
): boolean {
  const actionTargets = [
    ...[...action.matchAll(/\b([A-Za-z_\\][A-Za-z0-9_\\]*)::class\s*,\s*['"]([A-Za-z_][A-Za-z0-9_]*)['"]/g)]
      .map((match) => ({ classReference: match[1], method: match[2] })),
    ...[...action.matchAll(/\b([A-Za-z_\\][A-Za-z0-9_\\]*)::class@([A-Za-z_][A-Za-z0-9_]*)\b/g)]
      .map((match) => ({ classReference: match[1], method: match[2] })),
    ...[...action.matchAll(/\b([A-Za-z_\\][A-Za-z0-9_\\]*)@([A-Za-z_][A-Za-z0-9_]*)\b/g)]
      .map((match) => ({ classReference: match[1], method: match[2] })),
  ];

  return actionTargets.some((candidate) =>
    candidate.method === target.methodName &&
    (sameClassReference(target.classFqcn, candidate.classReference) || target.className === candidate.classReference.split("\\").at(-1))
  );
}

function memberReceiverClass(source: string, methodStart: number, index: LaravelIndex): string | null {
  const lineStart = source.lastIndexOf("\n", methodStart) + 1;
  const linePrefix = source.slice(lineStart, methodStart + tokenAt(source, methodStart).length);
  const documentPrefix = source.slice(0, methodStart);
  const containerClass = containerResolvedMemberClass(documentPrefix, linePrefix, index);
  if (containerClass) {
    return containerClass;
  }

  const receiver = receiverBeforeMember(source, methodStart);
  if (!receiver) {
    return null;
  }

  if (receiver.kind === "this") {
    return enclosingPhpClassFqcn(source, methodStart);
  }

  if (receiver.kind === "thisProperty") {
    return phpClassForThisProperty(source, receiver.property);
  }

  return phpClassForVariable(source, receiver.variable, methodStart);
}

type MemberReceiver =
  | {
      kind: "this";
    }
  | {
      kind: "thisProperty";
      property: string;
    }
  | {
      kind: "variable";
      variable: string;
    };

function receiverBeforeMember(source: string, methodStart: number): MemberReceiver | null {
  const prefix = source.slice(0, methodStart);
  const propertyMatch = /\$this\s*(?:\?->|->)\s*([A-Za-z_][A-Za-z0-9_]*)\s*(?:\?->|->)\s*$/.exec(prefix);
  if (propertyMatch) {
    return { kind: "thisProperty", property: propertyMatch[1] };
  }

  if (/\$this\s*(?:\?->|->)\s*$/.test(prefix)) {
    return { kind: "this" };
  }

  const variableMatch = /(\$[A-Za-z_][A-Za-z0-9_]*)\s*(?:\?->|->)\s*$/.exec(prefix);
  return variableMatch ? { kind: "variable", variable: variableMatch[1] } : null;
}

function phpClassForVariable(source: string, variable: string, offset: number): string | null {
  const prefix = source.slice(0, offset);
  const escapedVariable = escapeRegExp(variable);
  const matches: Array<{ classReference: string; offset: number }> = [];

  for (const match of prefix.matchAll(new RegExp(`@var\\s+([^\\s]+)\\s+${escapedVariable}\\b`, "g"))) {
    const classReference = firstClassReferenceFromType(match[1]);
    if (classReference) {
      matches.push({ classReference, offset: match.index ?? 0 });
    }
  }

  for (const pattern of [
    new RegExp(`\\??(\\\\?[A-Z][A-Za-z0-9_\\\\]*)(?:\\|[^\\s$]+)?\\s+${escapedVariable}\\b`, "g"),
    new RegExp(`${escapedVariable}\\s*=\\s*new\\s+(\\\\?[A-Z][A-Za-z0-9_\\\\]*)`, "g"),
    new RegExp(`${escapedVariable}\\s*=\\s*(?:app|resolve)\\s*\\(\\s*(\\\\?[A-Z][A-Za-z0-9_\\\\]*)::class\\b`, "g"),
    new RegExp(`${escapedVariable}\\s*=\\s*(?:App::|app\\(\\)\\s*(?:\\?->|->)|\\$this\\s*(?:\\?->|->)\\s*app\\s*(?:\\?->|->)|Container::getInstance\\(\\)\\s*(?:\\?->|->))(?:make|makeWith|build|get)\\s*\\(\\s*(\\\\?[A-Z][A-Za-z0-9_\\\\]*)::class\\b`, "g"),
  ]) {
    for (const match of prefix.matchAll(pattern)) {
      matches.push({ classReference: match[1], offset: match.index ?? 0 });
    }
  }

  const latest = matches.sort((left, right) => right.offset - left.offset)[0];
  return latest ? resolvePhpClassReference(source, latest.classReference) : null;
}

function phpClassForThisProperty(source: string, property: string): string | null {
  const escapedProperty = escapeRegExp(property);
  const propertyPattern = new RegExp(
    `\\b(?:public|protected|private)\\s+(?:readonly\\s+)?(?:static\\s+)?\\??(\\\\?[A-Z][A-Za-z0-9_\\\\]*)(?:\\|[^\\s$]+)?\\s+\\$${escapedProperty}\\b`,
    "g",
  );

  let classReference: string | null = null;
  for (const match of source.matchAll(propertyPattern)) {
    classReference = match[1];
  }

  return classReference ? resolvePhpClassReference(source, classReference) : null;
}

function firstClassReferenceFromType(type: string): string | null {
  return type
    .split("|")
    .map((part) => part.trim())
    .map((part) => part.replace(/^\?/, ""))
    .find((part) => /^\\?[A-Z][A-Za-z0-9_\\]*$/.test(part)) ?? null;
}

function isOffsetInIgnoredPhpSource(source: string, offset: number): boolean {
  let quote: string | null = null;
  let lineComment = false;
  let blockComment = false;

  for (let index = 0; index < offset; index += 1) {
    const char = source[index];
    const next = source[index + 1];
    const previous = source[index - 1];

    if (lineComment) {
      if (char === "\n" || char === "\r") {
        lineComment = false;
      }
      continue;
    }

    if (blockComment) {
      if (char === "*" && next === "/") {
        blockComment = false;
        index += 1;
      }
      continue;
    }

    if (quote) {
      if (char === quote && previous !== "\\") {
        quote = null;
      }
      continue;
    }

    if ((char === "/" && next === "/") || char === "#") {
      lineComment = true;
      index += char === "/" ? 1 : 0;
      continue;
    }

    if (char === "/" && next === "*") {
      blockComment = true;
      index += 1;
      continue;
    }

    if (char === "'" || char === "\"") {
      quote = char;
    }
  }

  return Boolean(quote || lineComment || blockComment);
}

function enclosingPhpClassFqcn(source: string, offset: number): string | null {
  for (const phpClass of phpClassRanges(source)) {
    if (offset >= phpClass.bodyStart && offset <= phpClass.bodyEnd) {
      return resolvePhpClassReference(source, phpClass.name);
    }
  }

  return null;
}

function phpClassRanges(source: string): Array<{ bodyEnd: number; bodyStart: number; name: string }> {
  const ranges: Array<{ bodyEnd: number; bodyStart: number; name: string }> = [];
  const declarationPattern = /\b(?:abstract\s+|final\s+|readonly\s+)*(?:class|interface|trait|enum)\s+([A-Za-z_][A-Za-z0-9_]*)\b[^{;]*/g;

  for (const match of source.matchAll(declarationPattern)) {
    const bodyStart = source.indexOf("{", match.index ?? 0);
    if (bodyStart < 0) {
      continue;
    }
    ranges.push({
      bodyEnd: matchingBraceIndex(source, bodyStart) ?? source.length,
      bodyStart,
      name: match[1],
    });
  }

  return ranges;
}

function isLikelyClassReference(source: string, start: number, value: string): boolean {
  const bounds = lineBounds(source, start);
  const line = source.slice(bounds.start, bounds.end);
  const before = source.slice(bounds.start, start);
  const after = source.slice(start + value.length, bounds.end);

  if (/^\s*use\s+/.test(line) || /\b(?:class|interface|trait|enum)\s+$/.test(before)) {
    return false;
  }

  return /^\s*::/.test(after) ||
    /\bnew\s+$/.test(before) ||
    /\b(?:extends|implements)\s+(?:\\?[A-Za-z_][A-Za-z0-9_\\]*\s*,\s*)*$/.test(before) ||
    /\binstanceof\s+$/.test(before) ||
    /\bcatch\s*\([^)]*(?:\|\s*)?$/.test(before) ||
    /(?:^|[\s(:,|?])$/.test(before) && /^\s+(?:&\s*)?(?:\.\.\.\s*)?\$[A-Za-z_]/.test(after) ||
    /:\s*\??$/.test(before);
}

// A call site counts toward the target method when runtime dispatch can land
// on the target class: the receiver is the target itself, a subclass that
// inherits the method, or a supertype (interface or parent class) whose typed
// call sites dispatch to the target's implementation — matching how dedicated
// PHP IDEs attribute interface-typed calls to implementation methods.
function classCanReferenceTarget(candidateFqcn: string, targetFqcn: string, index: LaravelIndex): boolean {
  const normalizedCandidate = normalizeClassReference(candidateFqcn);
  const normalizedTarget = normalizeClassReference(targetFqcn);
  return normalizedCandidate === normalizedTarget ||
    inheritsFrom(normalizedCandidate, normalizedTarget, index) ||
    inheritsFrom(normalizedTarget, normalizedCandidate, index);
}

function inheritsFrom(descendantFqcn: string, ancestorFqcn: string, index: LaravelIndex): boolean {
  const descendant = index.phpClasses.find((phpClass) => normalizeClassReference(phpClass.fqcn) === descendantFqcn);
  if (!descendant) {
    return false;
  }

  const visited = new Set<string>();
  const queue = [...descendant.extends, ...descendant.implements].map(normalizeClassReference);
  while (queue.length > 0) {
    const parent = queue.shift() as string;
    if (parent === ancestorFqcn) {
      return true;
    }
    if (visited.has(parent)) {
      continue;
    }
    visited.add(parent);

    const parentClass = index.phpClasses.find((phpClass) => normalizeClassReference(phpClass.fqcn) === parent);
    if (parentClass) {
      queue.push(...[...parentClass.extends, ...parentClass.implements].map(normalizeClassReference));
    }
  }

  return false;
}

function sameClassReference(left: string, right: string): boolean {
  return normalizeClassReference(left) === normalizeClassReference(right);
}

function normalizeClassReference(value: string): string {
  return value.replace(/^\\+/, "");
}

function matchingBraceIndex(source: string, openIndex: number): number | null {
  let depth = 0;
  let quote: string | null = null;
  let lineComment = false;
  let blockComment = false;

  for (let index = openIndex; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];
    const previous = source[index - 1];

    if (lineComment) {
      if (char === "\n" || char === "\r") {
        lineComment = false;
      }
      continue;
    }

    if (blockComment) {
      if (char === "*" && next === "/") {
        blockComment = false;
        index += 1;
      }
      continue;
    }

    if (quote) {
      if (char === quote && previous !== "\\") {
        quote = null;
      }
      continue;
    }

    if ((char === "/" && next === "/") || char === "#") {
      lineComment = true;
      index += char === "/" ? 1 : 0;
      continue;
    }

    if (char === "/" && next === "*") {
      blockComment = true;
      index += 1;
      continue;
    }

    if (char === "'" || char === "\"") {
      quote = char;
      continue;
    }

    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return index;
      }
    }
  }

  return null;
}

function lineBounds(source: string, offset: number): { end: number; start: number } {
  const start = source.lastIndexOf("\n", offset) + 1;
  const nextNewline = source.indexOf("\n", offset);
  return {
    end: nextNewline >= 0 ? nextNewline : source.length,
    start,
  };
}

function sourceRangeForOffset(source: string, startOffset: number, length: number): Range {
  return {
    end: sourcePositionForOffset(source, startOffset + length),
    start: sourcePositionForOffset(source, startOffset),
  };
}

function sourcePositionForOffset(source: string, offset: number): Range["start"] {
  const beforeOffset = source.slice(0, offset);
  const lines = beforeOffset.split(/\r?\n/);

  return {
    character: lines[lines.length - 1].length,
    line: lines.length - 1,
  };
}

function tokenAt(source: string, offset: number): string {
  return /^[A-Za-z_][A-Za-z0-9_]*/.exec(source.slice(offset))?.[0] ?? "";
}

function toRange(range: SourceRange): Range {
  return {
    end: range.end,
    start: range.start,
  };
}

function pathFromUri(uri: string): string | null {
  try {
    return fileURLToPath(uri);
  } catch {
    return null;
  }
}

function usageTitle(count: number): string {
  return `${count} ${count === 1 ? "usage" : "usages"}`;
}

function usageCodeLensData(value: unknown): UsageCodeLensData | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<UsageCodeLensData>;
  if (
    typeof candidate.classFqcn !== "string" ||
    typeof candidate.className !== "string" ||
    typeof candidate.uri !== "string" ||
    !isRange(candidate.range)
  ) {
    return null;
  }

  if (candidate.kind === "phpClass") {
    return candidate as Extract<UsageCodeLensData, { kind: "phpClass" }>;
  }

  if (candidate.kind === "phpMethod" && typeof candidate.methodName === "string") {
    return candidate as Extract<UsageCodeLensData, { kind: "phpMethod" }>;
  }

  return null;
}

function isRange(value: unknown): value is Range {
  const range = value as Partial<Range> | null;
  return Boolean(
    range &&
      typeof range === "object" &&
      typeof range.start?.line === "number" &&
      typeof range.start.character === "number" &&
      typeof range.end?.line === "number" &&
      typeof range.end.character === "number",
  );
}

function uniqueLocations(locations: Location[]): Location[] {
  const seen = new Set<string>();
  const unique: Location[] = [];

  for (const item of locations) {
    const key = [
      item.uri,
      item.range.start.line,
      item.range.start.character,
      item.range.end.line,
      item.range.end.character,
    ].join(":");
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(item);
  }

  return unique;
}

function sortLocations(locations: Location[]): Location[] {
  return locations.sort(
    (left, right) =>
      left.uri.localeCompare(right.uri) ||
      left.range.start.line - right.range.start.line ||
      left.range.start.character - right.range.start.character ||
      left.range.end.line - right.range.end.line ||
      left.range.end.character - right.range.end.character,
  );
}

function compareCodeLens(left: CodeLens, right: CodeLens): number {
  return left.range.start.line - right.range.start.line ||
    left.range.start.character - right.range.start.character ||
    left.range.end.line - right.range.end.line ||
    left.range.end.character - right.range.end.character;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
