import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { LaravelIndex, ModelInfo, ModelRelationInfo, SourceRange } from "./projectIndex.js";
import { resolvePhpClassReference } from "./phpResolver.js";

// Expressions that evaluate to the authenticated user instance. Intelephense
// only sees the `Authenticatable|null` contract here, so member access through
// these expressions gets no navigation without this inference.
const AUTH_USER_CALL =
  "(?:\\\\?Auth::(?:guard\\([^)]*\\)->)?user\\(\\)|auth\\(\\)->(?:guard\\([^)]*\\)->)?user\\(\\)|\\$request->user\\(\\)|request\\(\\)->user\\(\\))";

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
  const model = builderChainModelForPrefix(documentText, prefix, index);
  return model ? frameworkBuilderMethodTarget(model, member) : null;
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
  const model = instanceModelForPrefix(documentText, prefix, index);
  if (model) {
    return instanceMemberTarget(model, member);
  }

  const relationChain = relationChainForPrefix(documentText, prefix, index);
  if (!relationChain) {
    return null;
  }

  const relatedModel = relationChain.relation.relatedModel
    ? findIndexedModel(index, resolvePhpClassReference(documentText, relationChain.relation.relatedModel))
    : null;
  const relatedModelTarget = relatedModel ? instanceMemberTarget(relatedModel, member) : null;
  if (relatedModelTarget) {
    return relatedModelTarget;
  }

  return frameworkRelationMethodTarget(relationChain.model, relationChain.relation, member);
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
  if (!variable) {
    return null;
  }

  const docblockModel = docblockVariableModel(documentText, variable, index);
  if (docblockModel) {
    return docblockModel;
  }

  const escapedVariable = variable.replace("$", "\\$");
  if (new RegExp(`${escapedVariable}\\s*=\\s*${AUTH_USER_CALL}`).test(documentText)) {
    return authUserModel(index);
  }

  return null;
}

function relationChainForPrefix(
  documentText: string,
  prefix: string,
  index: LaravelIndex,
): { model: ModelInfo; relation: ModelRelationInfo } | null {
  const receiver = prefix.replace(/(\?->|->)\s*$/, "");
  if (receiver === prefix) {
    return null;
  }

  const expression = chainExpression(receiver);
  const rootMatch = new RegExp(`^\\s*(${AUTH_USER_CALL}|\\$[A-Za-z_][A-Za-z0-9_]*)`).exec(expression);
  if (!rootMatch) {
    return null;
  }

  const model = modelForReceiver(documentText, rootMatch[1], index);
  if (!model) {
    return null;
  }

  const calls = [...expression.slice(rootMatch[0].length).matchAll(/(?:->|\?->)\s*([A-Za-z_][A-Za-z0-9_]*)\s*\(/g)];
  for (const call of calls) {
    const relation = model.relations.find((candidate) => candidate.name === call[1]);
    if (relation) {
      return { model, relation };
    }
  }

  return null;
}

function chainExpression(receiver: string): string {
  const statementStart = Math.max(receiver.lastIndexOf(";"), receiver.lastIndexOf("{"));
  const statement = receiver.slice(statementStart + 1).trim();
  return /^\$[A-Za-z_][A-Za-z0-9_]*\s*=\s*([\s\S]*)$/.exec(statement)?.[1] ?? statement;
}

function frameworkRelationMethodTarget(
  model: ModelInfo,
  relation: ModelRelationInfo,
  member: string,
): InstanceMemberTarget | null {
  return frameworkMethodTarget(model, member, frameworkClassCandidates(relation), relation);
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

function builderChainModelForPrefix(
  documentText: string,
  prefix: string,
  index: LaravelIndex,
): ModelInfo | null {
  const staticCall = /\b([A-Za-z_\\][A-Za-z0-9_\\]*)::\s*$/.exec(prefix)?.[1];
  if (staticCall) {
    return findIndexedModel(index, resolvePhpClassReference(documentText, staticCall));
  }

  const classRefs = [...prefix.matchAll(/\b([A-Za-z_\\][A-Za-z0-9_\\]*)::/g)].reverse();
  for (const classRef of classRefs) {
    const suffix = prefix.slice(classRef.index ?? 0);
    if (!/::[\s\S]*(?:->|\?->)\s*$/.test(suffix)) {
      continue;
    }

    const model = findIndexedModel(index, resolvePhpClassReference(documentText, classRef[1]));
    if (model) {
      return model;
    }
  }

  return null;
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
