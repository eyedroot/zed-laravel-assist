import { existsSync, readFileSync } from "node:fs";
import { LaravelIndex, ModelCastInfo, PhpClassInfo, SchemaColumnInfo } from "./projectIndex.js";
import { resolvePhpClassReference } from "./phpResolver.js";

// PHP types produced by Eloquent's HasAttributes::castAttribute() for each
// built-in cast keyword. Parameterized forms (`decimal:2`, `datetime:Y-m-d`,
// `encrypted:collection`) are normalized before lookup.
const PRIMITIVE_CAST_TYPES = new Map<string, string>([
  ["array", "array"],
  ["bool", "bool"],
  ["boolean", "bool"],
  ["collection", "\\Illuminate\\Support\\Collection"],
  ["date", "\\Illuminate\\Support\\Carbon"],
  ["datetime", "\\Illuminate\\Support\\Carbon"],
  ["decimal", "string"],
  ["double", "float"],
  ["encrypted", "string"],
  ["float", "float"],
  ["hashed", "string"],
  ["immutable_date", "\\Carbon\\CarbonImmutable"],
  ["immutable_datetime", "\\Carbon\\CarbonImmutable"],
  ["int", "int"],
  ["integer", "int"],
  ["json", "array"],
  ["object", "object"],
  ["real", "float"],
  ["string", "string"],
  ["timestamp", "int"],
]);

// Framework-shipped cast classes referenced as `AsCollection::class`; these
// live in vendor and are never part of the project class index.
const BUILTIN_CAST_CLASS_TYPES = new Map<string, string>([
  ["Illuminate\\Database\\Eloquent\\Casts\\AsArrayObject", "\\Illuminate\\Database\\Eloquent\\Casts\\ArrayObject"],
  ["Illuminate\\Database\\Eloquent\\Casts\\AsBinary", "string"],
  ["Illuminate\\Database\\Eloquent\\Casts\\AsCollection", "\\Illuminate\\Support\\Collection"],
  ["Illuminate\\Database\\Eloquent\\Casts\\AsEncryptedArrayObject", "\\Illuminate\\Database\\Eloquent\\Casts\\ArrayObject"],
  ["Illuminate\\Database\\Eloquent\\Casts\\AsEncryptedCollection", "\\Illuminate\\Support\\Collection"],
  ["Illuminate\\Database\\Eloquent\\Casts\\AsEnumArrayObject", "\\Illuminate\\Database\\Eloquent\\Casts\\ArrayObject"],
  ["Illuminate\\Database\\Eloquent\\Casts\\AsEnumCollection", "\\Illuminate\\Support\\Collection"],
  ["Illuminate\\Database\\Eloquent\\Casts\\AsFluent", "\\Illuminate\\Support\\Fluent"],
  ["Illuminate\\Database\\Eloquent\\Casts\\AsStringable", "\\Illuminate\\Support\\Stringable"],
  ["Illuminate\\Database\\Eloquent\\Casts\\AsUri", "\\Illuminate\\Support\\Uri"],
]);

const SCALAR_RETURN_TYPES = new Set(["array", "bool", "callable", "false", "float", "int", "iterable", "null", "object", "string", "true"]);

// Return types that carry no usable attribute type.
const OPAQUE_RETURN_TYPES = new Set(["mixed", "never", "void"]);

export interface ResolvedCastType {
  // Indexed project class backing an enum or custom cast, for navigation.
  castClass?: PhpClassInfo;
  kind: "primitive" | "builtinCastClass" | "enum" | "castable" | "customCast";
  // True when the cast itself may return null for non-null column values
  // (custom cast `get()` declared nullable).
  nullable: boolean;
  // Canonical PHP type: scalars bare (`bool`), classes fully qualified
  // (`\App\Enums\Status`).
  phpType: string;
}

// Resolves the PHP type Eloquent attribute access produces for an indexed
// cast. Attribute values that are null in the database bypass the cast
// entirely, so combine with the schema column through `castTypeDisplay` for a
// null-aware rendering.
export function resolveCastType(cast: ModelCastInfo, index: LaravelIndex): ResolvedCastType | null {
  if (cast.classFqcn) {
    return resolveClassCastType(cast.classFqcn, index);
  }

  const phpType = PRIMITIVE_CAST_TYPES.get(normalizePrimitiveCast(cast.type));
  return phpType ? { kind: "primitive", nullable: false, phpType } : null;
}

export function castTypeDisplay(resolved: ResolvedCastType, column?: SchemaColumnInfo): string {
  const nullable = resolved.nullable || (column?.modifiers.includes("nullable") ?? false);
  return nullable ? `${resolved.phpType}|null` : resolved.phpType;
}

// Laravel's getCastType(): parameters follow the first `:`; `encrypted:x`
// takes the type of the wrapped cast `x`.
function normalizePrimitiveCast(castType: string): string {
  const base = castType.trim().toLowerCase();
  const [head, parameter] = base.split(":", 2);
  if (head === "encrypted" && parameter) {
    return parameter;
  }

  return head;
}

function resolveClassCastType(classFqcn: string, index: LaravelIndex): ResolvedCastType | null {
  const builtin = BUILTIN_CAST_CLASS_TYPES.get(classFqcn);
  if (builtin) {
    return { kind: "builtinCastClass", nullable: false, phpType: builtin };
  }

  const castClass = index.phpClasses.find((candidate) => candidate.fqcn === classFqcn);
  if (!castClass) {
    return null;
  }

  if (castClass.kind === "enum") {
    return { castClass, kind: "enum", nullable: false, phpType: `\\${classFqcn}` };
  }

  if (castClass.kind !== "class") {
    return null;
  }

  // A Castable value object is itself the value exposed by the model. Its
  // castUsing() method selects the converter, but that converter is an
  // implementation detail and does not change the property type.
  if (castClass.implements.includes("Illuminate\\Contracts\\Database\\Eloquent\\Castable")) {
    return { castClass, kind: "castable", nullable: false, phpType: `\\${classFqcn}` };
  }

  const returnType = castGetReturnType(castClass);
  return returnType
    ? { castClass, kind: "customCast", nullable: returnType.nullable, phpType: returnType.phpType }
    : null;
}

// Custom casts (CastsAttributes) transform reads through `get()`; its declared
// return type (or `@return` docblock) is the attribute type. Inbound-only
// casts have no `get()` and resolve to null.
function castGetReturnType(castClass: PhpClassInfo): { nullable: boolean; phpType: string } | null {
  const source = readCastSource(castClass.filePath);
  if (!source) {
    return null;
  }

  const method = /(?:\/\*\*([\s\S]*?)\*\/\s*)?(?:(?:public|protected|private)\s+)?function\s+get\s*\(([^)]*)\)\s*(?::\s*([^\{;]+?))?\s*\{/.exec(
    source,
  );
  if (!method) {
    return null;
  }

  const declared = method[3] ?? (method[1] ? /@return\s+([^\r\n*]+)/.exec(method[1])?.[1]?.trim() ?? null : null);
  return declared ? normalizeCastReturnType(source, declared, castClass) : null;
}

function normalizeCastReturnType(
  source: string,
  declared: string,
  castClass: PhpClassInfo,
): { nullable: boolean; phpType: string } | null {
  const normalized = declared.trim();
  let nullable = normalized.startsWith("?");
  const parts = normalized.replace(/^\?/, "").split("|").map((part) => part.trim()).filter((part) => {
    if (part.toLowerCase() === "null") {
      nullable = true;
      return false;
    }
    return true;
  });
  if (parts.length !== 1) {
    return null;
  }

  const bare = parts[0];
  if (/^(?:array|list)<.+>$/i.test(bare) || /^[^\s]+\[\]$/.test(bare)) {
    return { nullable, phpType: "array" };
  }

  const namedType = /^(\\?[A-Za-z_][\\A-Za-z0-9_]*)(?:<.+>)?$/.exec(bare)?.[1];
  if (!namedType) {
    return null;
  }

  if (OPAQUE_RETURN_TYPES.has(namedType.toLowerCase())) {
    return null;
  }

  if (SCALAR_RETURN_TYPES.has(namedType.toLowerCase())) {
    return { nullable, phpType: namedType.toLowerCase() };
  }

  if (["self", "static"].includes(namedType.toLowerCase())) {
    return { nullable, phpType: `\\${castClass.fqcn}` };
  }

  if (namedType.toLowerCase() === "parent") {
    return castClass.extends.length === 1
      ? { nullable, phpType: `\\${castClass.extends[0]}` }
      : null;
  }

  return { nullable, phpType: `\\${resolvePhpClassReference(source, namedType)}` };
}

function readCastSource(filePath: string): string | null {
  if (!existsSync(filePath)) {
    return null;
  }

  try {
    return readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}
