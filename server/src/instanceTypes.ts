import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { LaravelIndex, ModelInfo, ModelRelationInfo, SourceRange } from "./projectIndex.js";
import { resolvePhpClassReference } from "./phpResolver.js";

// Expressions that evaluate to the authenticated user instance. Intelephense
// only sees the `Authenticatable|null` contract here, so member access through
// these expressions gets no navigation without this inference.
const AUTH_USER_CALL =
  "(?:\\\\?Auth::(?:guard\\([^)]*\\)->)?user\\(\\)|auth\\(\\)->(?:guard\\([^)]*\\)->)?user\\(\\)|\\$request->user\\(\\)|request\\(\\)->user\\(\\))";

// Fluent calls that return a single model instance: the model type survives
// them, but any relation/builder context ends.
const CHAIN_INSTANCE_METHODS = new Set([
  "create",
  "find",
  "findOrFail",
  "findOrNew",
  "first",
  "firstOr",
  "firstOrCreate",
  "firstOrFail",
  "firstOrNew",
  "firstWhere",
  "forceCreate",
  "fresh",
  "load",
  "loadCount",
  "loadMissing",
  "refresh",
  "replicate",
  "sole",
  "updateOrCreate",
]);

// Builder calls that leave the fluent Eloquent context (collections, scalars,
// pagination, or write operations): members chained after them can no longer
// be resolved against the model/builder surface.
const CHAIN_TERMINAL_METHODS = new Set([
  "all",
  "avg",
  "chunk",
  "chunkById",
  "chunkMap",
  "count",
  "cursor",
  "cursorPaginate",
  "delete",
  "doesntExist",
  "each",
  "exists",
  "get",
  "getBindings",
  "implode",
  "insert",
  "insertGetId",
  "lazy",
  "lazyById",
  "lazyByIdDesc",
  "max",
  "min",
  "paginate",
  "pluck",
  "simplePaginate",
  "sum",
  "toArray",
  "toBase",
  "toRawSql",
  "toSql",
  "update",
  "value",
]);

// Relation types whose property access yields a single related model
// instance; the remaining types yield collections this resolver cannot type.
const SINGLE_INSTANCE_RELATION_TYPES = new Set(["belongsTo", "hasOne", "hasOneThrough", "morphOne", "morphTo"]);

// Resolves the Eloquent model behind an instance member access such as
// `$user->roles()` or `Auth::user()->roles()`. `prefix` is the line content up
// to (excluding) the member name, ending with `->` or `?->`.
export function instanceModelForPrefix(
  documentText: string,
  prefix: string,
  index: LaravelIndex,
): ModelInfo | null {
  const arrowMatch = /(\?->|->)\s*$/.exec(prefix);
  if (!arrowMatch) {
    return null;
  }

  const receiver = prefix.slice(0, prefix.length - arrowMatch[0].length);
  return modelForReceiver(documentText, receiver, index);
}

// `/** @var \App\Models\User $user */` annotations pin a variable to a model;
// the quick fix this extension offers for Intelephense P1006 emits exactly
// this shape.
function docblockVariableModel(documentText: string, variable: string, index: LaravelIndex): ModelInfo | null {
  const escapedVariable = variable.replace("$", "\\$");
  const annotation = new RegExp(`@var\\s+\\\\?([A-Za-z_\\\\][A-Za-z0-9_\\\\]*)(?:\\|[^\\s]*)?\\s+${escapedVariable}\\b`).exec(
    documentText,
  );
  if (!annotation) {
    return null;
  }

  return findIndexedModel(index, resolvePhpClassReference(documentText, annotation[1]));
}

export function authUserModel(index: LaravelIndex): ModelInfo | null {
  if (index.authUserModel) {
    const configured = findIndexedModel(index, index.authUserModel);
    if (configured) {
      return configured;
    }
  }

  // Without an indexed auth config, fall back to the conventional model name,
  // preferring a candidate that actually looks like an Eloquent model.
  const candidates = index.models.filter((model) => model.className === "User");
  return candidates.find((model) => model.relations.length > 0) ?? candidates[0] ?? null;
}

function findIndexedModel(index: LaravelIndex, className: string): ModelInfo | null {
  return (
    index.models.find(
      (model) => model.className === className || `${model.namespace}\\${model.className}` === className,
    ) ?? null
  );
}

export interface InstanceMemberTarget {
  className?: string;
  filePath: string;
  kind: "framework" | "method" | "relation" | "scope";
  model: ModelInfo;
  name: string;
  relation?: ModelRelationInfo;
  range?: SourceRange;
}

export function frameworkBuilderMethodTargetForPrefix(
  documentText: string,
  prefix: string,
  index: LaravelIndex,
  member: string,
): InstanceMemberTarget | null {
  const chain = chainContextForPrefix(documentText, prefix, index);
  if (!chain) {
    return null;
  }

  return chain.relation
    ? frameworkMethodTarget(chain.anchor, member, frameworkClassCandidates(chain.relation), chain.relation)
    : frameworkBuilderMethodTarget(chain.anchor, member);
}

export function isKnownEloquentBuilderMethod(method: string): boolean {
  return frameworkClassCandidates().some((className) => fallbackFrameworkMethods(className).has(method));
}

export function instanceMemberTargetForPrefix(
  documentText: string,
  prefix: string,
  index: LaravelIndex,
  member: string,
): InstanceMemberTarget | null {
  // Fast path: the member is accessed directly on a typed variable or an
  // auth-user expression. Builder methods forwarded through `Model::__call`
  // (`$user->where(...)`) fall back to the framework surface.
  const direct = instanceModelForPrefix(documentText, prefix, index);
  if (direct) {
    return instanceMemberTarget(direct, member) ?? frameworkBuilderMethodTarget(direct, member);
  }

  const chain = chainContextForPrefix(documentText, prefix, index);
  if (!chain) {
    return null;
  }

  if (chain.model) {
    const memberTarget = instanceMemberTarget(chain.model, member);
    if (memberTarget) {
      return memberTarget;
    }

    const builderMethod = chain.model.customBuilder?.methods.find((candidate) => candidate.name === member);
    if (builderMethod && chain.model.customBuilder?.filePath) {
      return { filePath: chain.model.customBuilder.filePath, kind: "method", model: chain.model, name: member };
    }
  }

  return chain.relation
    ? frameworkMethodTarget(chain.anchor, member, frameworkClassCandidates(chain.relation), chain.relation)
    : frameworkBuilderMethodTarget(chain.anchor, member);
}

// Locates a member (method, relation, or merged trait scope) on the resolved
// model, preferring the precise declaration range when the index has one.
export function instanceMemberTarget(model: ModelInfo, member: string): InstanceMemberTarget | null {
  const method = model.methodDetails?.find((candidate) => candidate.name === member);
  if (method) {
    return {
      filePath: model.filePath,
      kind: model.relations.some((relation) => relation.name === member) ? "relation" : "method",
      model,
      name: member,
      range: method.range,
    };
  }

  const traitScope = model.scopeDetails?.find((candidate) => candidate.name === member);
  if (traitScope) {
    return { filePath: traitScope.filePath, kind: "scope", model, name: member };
  }

  if (model.relations.some((relation) => relation.name === member)) {
    return { filePath: model.filePath, kind: "relation", model, name: member };
  }

  if (model.scopes.includes(member)) {
    return { filePath: model.filePath, kind: "scope", model, name: member };
  }

  return null;
}

function modelForReceiver(documentText: string, receiver: string, index: LaravelIndex): ModelInfo | null {
  if (new RegExp(`${AUTH_USER_CALL}\\s*$`).test(receiver)) {
    return authUserModel(index);
  }

  const variable = /(\$[A-Za-z_][A-Za-z0-9_]*)\s*$/.exec(receiver)?.[1];
  return variable ? modelForVariable(documentText, variable, index) : null;
}

// Infers the model type of a variable from, in priority order: `@var`
// docblocks, auth-user assignments, `new Model` / `Model::...` assignments,
// and `Model $variable` type hints (parameters, promoted properties). Only
// indexed Eloquent models are accepted, so matches against framework classes
// or keywords fall through harmlessly.
function modelForVariable(documentText: string, variable: string, index: LaravelIndex): ModelInfo | null {
  if (variable === "$this") {
    return enclosingClassModel(documentText, index);
  }

  const docblockModel = docblockVariableModel(documentText, variable, index);
  if (docblockModel) {
    return docblockModel;
  }

  const escapedVariable = variable.replace("$", "\\$");
  if (new RegExp(`${escapedVariable}\\s*=\\s*${AUTH_USER_CALL}`).test(documentText)) {
    return authUserModel(index);
  }

  const typedPatterns = [
    new RegExp(`${escapedVariable}\\s*=\\s*new\\s+(\\\\?[A-Za-z_][A-Za-z0-9_\\\\]*)`, "g"),
    new RegExp(`${escapedVariable}\\s*=\\s*(\\\\?[A-Za-z_][A-Za-z0-9_\\\\]*)::[A-Za-z_]`, "g"),
    new RegExp(`(\\\\?[A-Z][A-Za-z0-9_\\\\]*)\\s+${escapedVariable}\\b`, "g"),
  ];

  for (const pattern of typedPatterns) {
    for (const match of documentText.matchAll(pattern)) {
      const model = findIndexedModel(index, resolvePhpClassReference(documentText, match[1]));
      if (model) {
        return model;
      }
    }
  }

  return null;
}

function enclosingClassModel(documentText: string, index: LaravelIndex): ModelInfo | null {
  const className = /\bclass\s+([A-Za-z_][A-Za-z0-9_]*)/.exec(documentText)?.[1];
  if (!className) {
    return null;
  }

  const namespace = /\bnamespace\s+([^;{\s]+)/.exec(documentText)?.[1];
  return findIndexedModel(index, namespace ? `${namespace}\\${className}` : className);
}

interface ChainScanSegment {
  isCall: boolean;
  name: string;
}

type ChainScanRoot =
  | { kind: "functionCall"; name: string }
  | { kind: "staticCall"; className: string; method: string | null }
  | { kind: "variable"; name: string };

interface ChainScan {
  root: ChainScanRoot;
  segments: ChainScanSegment[];
}

interface ChainContext {
  // Model rooting the chain; used to locate the project's vendor directory.
  anchor: ModelInfo;
  // Model whose members apply at the cursor, when the walk could keep typing.
  model: ModelInfo | null;
  // Innermost relation still governing the builder surface at the cursor.
  relation: ModelRelationInfo | null;
}

// Resolves the typing context at the end of a fluent chain: the chain is
// scanned backwards from the cursor, the root receiver is typed, and each
// intermediate segment is walked forward through relations and known
// context-changing builder calls.
function chainContextForPrefix(
  documentText: string,
  prefix: string,
  index: LaravelIndex,
): ChainContext | null {
  const scan = scanChainForPrefix(prefix);
  if (!scan) {
    return null;
  }

  const root = chainRootModel(documentText, scan, index);
  if (!root) {
    return null;
  }

  const walkSegments: ChainScanSegment[] = [
    ...(root.rootMethod ? [{ isCall: true, name: root.rootMethod }] : []),
    ...scan.segments.slice(root.consumedSegments),
  ];

  let model: ModelInfo | null = root.model;
  let relation: ModelRelationInfo | null = null;

  for (const segment of walkSegments) {
    const segmentRelation = model?.relations.find((candidate) => candidate.name === segment.name) ?? null;

    if (segmentRelation && segment.isCall) {
      relation = segmentRelation;
      model = relatedIndexedModel(documentText, segmentRelation, index);
      continue;
    }

    if (segmentRelation) {
      // Property access: single-instance relations yield the related model;
      // collection relations leave typed territory entirely.
      if (!SINGLE_INSTANCE_RELATION_TYPES.has(segmentRelation.type)) {
        return null;
      }
      relation = null;
      model = relatedIndexedModel(documentText, segmentRelation, index);
      if (!model) {
        return null;
      }
      continue;
    }

    if (!segment.isCall) {
      // Untyped property (accessor, column): the chain type is unknown.
      return null;
    }

    if (CHAIN_TERMINAL_METHODS.has(segment.name)) {
      return null;
    }

    if (CHAIN_INSTANCE_METHODS.has(segment.name)) {
      relation = null;
      continue;
    }

    // Scopes, builder methods, and unrecognized fluent calls keep the current
    // context: Eloquent chains are overwhelmingly self-returning.
  }

  return { anchor: root.model, model, relation };
}

function chainRootModel(
  documentText: string,
  scan: ChainScan,
  index: LaravelIndex,
): { consumedSegments: number; model: ModelInfo; rootMethod?: string } | null {
  const { root, segments } = scan;

  if (root.kind === "variable") {
    if (root.name === "$request" && isCallSegment(segments[0], "user")) {
      const model = authUserModel(index);
      return model ? { consumedSegments: 1, model } : null;
    }

    const model = modelForVariable(documentText, root.name, index);
    return model ? { consumedSegments: 0, model } : null;
  }

  if (root.kind === "staticCall") {
    if (isAuthFacadeReference(documentText, root.className)) {
      if (root.method === "user") {
        const model = authUserModel(index);
        return model ? { consumedSegments: 0, model } : null;
      }
      if (root.method === "guard" && isCallSegment(segments[0], "user")) {
        const model = authUserModel(index);
        return model ? { consumedSegments: 1, model } : null;
      }
      return null;
    }

    const model = ["self", "static"].includes(root.className)
      ? enclosingClassModel(documentText, index)
      : findIndexedModel(index, resolvePhpClassReference(documentText, root.className));
    return model
      ? { consumedSegments: 0, model, ...(root.method ? { rootMethod: root.method } : {}) }
      : null;
  }

  if (root.name === "auth") {
    if (isCallSegment(segments[0], "user")) {
      const model = authUserModel(index);
      return model ? { consumedSegments: 1, model } : null;
    }
    if (isCallSegment(segments[0], "guard") && isCallSegment(segments[1], "user")) {
      const model = authUserModel(index);
      return model ? { consumedSegments: 2, model } : null;
    }
    return null;
  }

  if (root.name === "request" && isCallSegment(segments[0], "user")) {
    const model = authUserModel(index);
    return model ? { consumedSegments: 1, model } : null;
  }

  return null;
}

function isCallSegment(segment: ChainScanSegment | undefined, name: string): boolean {
  return segment?.isCall === true && segment.name === name;
}

function isAuthFacadeReference(documentText: string, className: string): boolean {
  // Laravel registers `Auth` as a global alias, so a bare reference counts
  // even when the file has no matching import.
  if (className.replace(/^\\+/, "") === "Auth") {
    return true;
  }

  return resolvePhpClassReference(documentText, className) === "Illuminate\\Support\\Facades\\Auth";
}

function relatedIndexedModel(
  documentText: string,
  relation: ModelRelationInfo,
  index: LaravelIndex,
): ModelInfo | null {
  if (!relation.relatedModel) {
    return null;
  }

  // The related class name was captured in the model's own file, so resolving
  // it against the current document's imports can mangle it; fall back to the
  // raw reference before giving up.
  return (
    findIndexedModel(index, resolvePhpClassReference(documentText, relation.relatedModel)) ??
    findIndexedModel(index, relation.relatedModel)
  );
}

// Scans backwards from the end of `prefix` (which ends right before the
// member under the cursor, i.e. with `->`, `?->`, or `::`) and reconstructs
// the receiver chain. Working on sanitized source keeps string literals,
// comments, and heredocs from confusing the paren balancing, so chains inside
// `return`/`if`/argument positions and across lines all resolve.
function scanChainForPrefix(prefix: string): ChainScan | null {
  const text = sanitizePhpSource(prefix);
  let end = skipTrailingWhitespace(text, text.length);

  if (sliceEndsWith(text, end, "::")) {
    const className = qualifiedClassNameEndingAt(text, end - 2);
    return className ? { root: { className, kind: "staticCall", method: null }, segments: [] } : null;
  }

  if (!sliceEndsWith(text, end, "->")) {
    return null;
  }
  end -= 2;
  if (text[end - 1] === "?") {
    end -= 1;
  }

  const segments: ChainScanSegment[] = [];
  for (let hops = 0; hops < 64; hops += 1) {
    end = skipTrailingWhitespace(text, end);

    let isCall = false;
    if (text[end - 1] === ")") {
      const openParen = matchingOpenParenIndex(text, end - 1);
      if (openParen === null) {
        return null;
      }
      end = skipTrailingWhitespace(text, openParen);
      isCall = true;
    }

    const name = identifierEndingAt(text, end);
    if (!name) {
      return null;
    }
    const start = skipTrailingWhitespace(text, end - name.length);

    if (text[start - 1] === "$") {
      return isCall ? null : { root: { kind: "variable", name: `$${name}` }, segments };
    }

    if (sliceEndsWith(text, start, "::")) {
      const className = qualifiedClassNameEndingAt(text, start - 2);
      return className && isCall ? { root: { className, kind: "staticCall", method: name }, segments } : null;
    }

    if (sliceEndsWith(text, start, "->")) {
      segments.unshift({ isCall, name });
      end = start - 2;
      if (text[end - 1] === "?") {
        end -= 1;
      }
      continue;
    }

    // Bare call at the chain root: `auth()->`, `request()->`, ...
    return isCall ? { root: { kind: "functionCall", name }, segments } : null;
  }

  return null;
}

function sliceEndsWith(text: string, end: number, token: string): boolean {
  return end >= token.length && text.slice(end - token.length, end) === token;
}

function skipTrailingWhitespace(text: string, end: number): number {
  let cursor = end;
  while (cursor > 0 && /\s/.test(text[cursor - 1])) {
    cursor -= 1;
  }
  return cursor;
}

function matchingOpenParenIndex(text: string, closeIndex: number): number | null {
  let depth = 0;
  for (let cursor = closeIndex; cursor >= 0; cursor -= 1) {
    if (text[cursor] === ")") {
      depth += 1;
    } else if (text[cursor] === "(") {
      depth -= 1;
      if (depth === 0) {
        return cursor;
      }
    }
  }

  return null;
}

function identifierEndingAt(text: string, end: number): string | null {
  let start = end;
  while (start > 0 && /[A-Za-z0-9_]/.test(text[start - 1])) {
    start -= 1;
  }

  const value = text.slice(start, end);
  return value && !/^[0-9]/.test(value) ? value : null;
}

function qualifiedClassNameEndingAt(text: string, end: number): string | null {
  let start = end;
  while (start > 0 && /[A-Za-z0-9_\\]/.test(text[start - 1])) {
    start -= 1;
  }

  const value = text.slice(start, end);
  return /^\\?[A-Za-z_][A-Za-z0-9_\\]*$/.test(value) ? value : null;
}

// Blanks the bodies of comments, string literals, and heredocs while keeping
// every offset (and newline) in place, so structural scanning cannot be
// derailed by `;`, `->`, quotes, or parens inside them. Quote characters are
// kept so string boundaries stay visible.
function sanitizePhpSource(source: string): string {
  const characters = [...source];
  const blank = (index: number): void => {
    if (characters[index] !== "\n" && characters[index] !== "\r") {
      characters[index] = " ";
    }
  };

  let i = 0;
  while (i < source.length) {
    const char = source[i];
    const next = source[i + 1];

    if (char === "'" || char === '"') {
      i += 1;
      while (i < source.length && source[i] !== char) {
        blank(i);
        if (source[i] === "\\" && i + 1 < source.length) {
          blank(i + 1);
          i += 1;
        }
        i += 1;
      }
      i += 1;
      continue;
    }

    if ((char === "/" && next === "/") || (char === "#" && next !== "[")) {
      while (i < source.length && source[i] !== "\n") {
        blank(i);
        i += 1;
      }
      continue;
    }

    if (char === "/" && next === "*") {
      blank(i);
      blank(i + 1);
      i += 2;
      while (i < source.length && !(source[i] === "*" && source[i + 1] === "/")) {
        blank(i);
        i += 1;
      }
      if (i < source.length) {
        blank(i);
        blank(i + 1);
        i += 2;
      }
      continue;
    }

    if (char === "<" && source.startsWith("<<<", i)) {
      const opener = /^<<<[ \t]*(["']?)([A-Za-z_][A-Za-z0-9_]*)\1[ \t]*\r?\n/.exec(source.slice(i));
      if (opener) {
        const terminator = new RegExp(`^[ \\t]*${opener[2]}\\b`);
        i += opener[0].length;
        while (i < source.length) {
          const lineEnd = source.indexOf("\n", i);
          const lineStop = lineEnd === -1 ? source.length : lineEnd;
          const terminatorMatch = terminator.exec(source.slice(i, lineStop));
          if (terminatorMatch) {
            i += terminatorMatch[0].length;
            break;
          }
          for (let cursor = i; cursor < lineStop; cursor += 1) {
            blank(cursor);
          }
          i = lineStop + 1;
        }
        continue;
      }
    }

    i += 1;
  }

  return characters.join("");
}

function frameworkBuilderMethodTarget(model: ModelInfo, member: string): InstanceMemberTarget | null {
  return frameworkMethodTarget(model, member, frameworkClassCandidates());
}

function frameworkMethodTarget(
  model: ModelInfo,
  member: string,
  classNames: string[],
  relation?: ModelRelationInfo,
): InstanceMemberTarget | null {
  const rootPath = projectRootForModel(model);
  if (!rootPath) {
    return null;
  }

  for (const className of classNames) {
    const filePath = path.join(rootPath, "vendor", "laravel", "framework", "src", `${className.replace(/\\/g, path.sep)}.php`);
    const range = methodRangeInFile(filePath, member);
    if (range) {
      return { className, filePath, kind: "framework", model, name: member, ...(relation ? { relation } : {}), range };
    }

    if (!existsSync(filePath) && fallbackFrameworkMethods(className).has(member)) {
      return { className, filePath, kind: "framework", model, name: member, ...(relation ? { relation } : {}) };
    }
  }

  return null;
}

function frameworkClassCandidates(relation?: ModelRelationInfo): string[] {
  const relationClasses: string[] = [];
  if (relation) {
    const relationClass =
      relation.type === "morphedByMany" ? "MorphToMany" : `${relation.type[0].toUpperCase()}${relation.type.slice(1)}`;
    relationClasses.push(`Illuminate\\Database\\Eloquent\\Relations\\${relationClass}`);
    if (["belongsToMany", "morphToMany", "morphedByMany"].includes(relation.type)) {
      relationClasses.push("Illuminate\\Database\\Eloquent\\Relations\\BelongsToMany");
    }
  }

  return [
    ...new Set(relationClasses),
    "Illuminate\\Database\\Eloquent\\Builder",
    "Illuminate\\Database\\Eloquent\\Relations\\Relation",
    "Illuminate\\Database\\Concerns\\BuildsQueries",
    "Illuminate\\Support\\Traits\\Conditionable",
    "Illuminate\\Database\\Query\\Builder",
  ];
}

function fallbackFrameworkMethods(className: string): Set<string> {
  if (className.endsWith("\\Eloquent\\Builder")) {
    return new Set([
      "create",
      "doesntHave",
      "find",
      "findMany",
      "findOrFail",
      "findOrNew",
      "first",
      "firstOr",
      "firstOrCreate",
      "firstOrFail",
      "firstOrNew",
      "firstWhere",
      "forceCreate",
      "get",
      "has",
      "orWhere",
      "orWhereDoesntHave",
      "orWhereHas",
      "query",
      "where",
      "whereDoesntHave",
      "whereHas",
      "with",
      "withAvg",
      "withCount",
      "withExists",
      "withMax",
      "withMin",
      "withOnly",
      "withSum",
      "withWhereHas",
      "without",
    ]);
  }

  if (className.endsWith("\\Query\\Builder")) {
    return new Set([
      "addSelect",
      "aggregate",
      "avg",
      "count",
      "dd",
      "delete",
      "distinct",
      "doesntExist",
      "dump",
      "exists",
      "explain",
      "getBindings",
      "getConnection",
      "getGrammar",
      "groupBy",
      "having",
      "inRandomOrder",
      "insert",
      "insertGetId",
      "insertOrIgnore",
      "insertUsing",
      "join",
      "latest",
      "leftJoin",
      "limit",
      "lockForUpdate",
      "max",
      "min",
      "offset",
      "oldest",
      "orWhere",
      "orWhereBetween",
      "orWhereIn",
      "orWhereNotIn",
      "orWhereNotNull",
      "orWhereNull",
      "orderBy",
      "orderByDesc",
      "pluck",
      "raw",
      "select",
      "sharedLock",
      "skip",
      "sum",
      "take",
      "toSql",
      "update",
      "value",
      "where",
      "whereBetween",
      "whereDate",
      "whereIn",
      "whereNot",
      "whereNotIn",
      "whereNotNull",
      "whereNull",
    ]);
  }

  if (className.endsWith("\\BuildsQueries")) {
    return new Set([
      "chunk",
      "chunkById",
      "chunkMap",
      "cursor",
      "each",
      "lazy",
      "lazyById",
      "paginate",
      "simplePaginate",
      "sole",
      "tap",
    ]);
  }

  if (className.endsWith("\\Conditionable")) {
    return new Set(["unless", "when"]);
  }

  if (className.endsWith("\\BelongsToMany")) {
    return new Set([
      "as",
      "attach",
      "detach",
      "first",
      "orderByPivot",
      "orWherePivot",
      "orWherePivotBetween",
      "orWherePivotIn",
      "orWherePivotNotBetween",
      "orWherePivotNotIn",
      "sync",
      "syncWithoutDetaching",
      "toggle",
      "updateExistingPivot",
      "wherePivot",
      "wherePivotBetween",
      "wherePivotIn",
      "wherePivotNotBetween",
      "wherePivotNotIn",
      "withPivot",
      "withTimestamps",
    ]);
  }

  return new Set();
}

function projectRootForModel(model: ModelInfo): string | null {
  const marker = `${path.sep}app${path.sep}`;
  const markerIndex = model.filePath.lastIndexOf(marker);
  if (markerIndex < 0) {
    return null;
  }

  return model.filePath.slice(0, markerIndex) || path.sep;
}

function methodRangeInFile(filePath: string, method: string): SourceRange | null {
  if (!existsSync(filePath)) {
    return null;
  }

  try {
    const source = readFileSync(filePath, "utf8");
    const match = new RegExp(`\\bfunction\\s+&?${escapeRegExp(method)}\\s*\\(`).exec(source);
    if (!match) {
      return null;
    }

    const nameOffset = match.index + match[0].indexOf(method);
    return sourceRangeForOffset(source, nameOffset, method.length);
  } catch {
    return null;
  }
}

function sourceRangeForOffset(source: string, offset: number, length: number): SourceRange {
  const start = sourcePositionForOffset(source, offset);
  const end = sourcePositionForOffset(source, offset + length);
  return { end, start };
}

function sourcePositionForOffset(source: string, offset: number): SourceRange["start"] {
  const lines = source.slice(0, offset).split(/\r?\n/);
  return {
    character: lines.at(-1)?.length ?? 0,
    line: lines.length - 1,
  };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
