import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { castTypeDisplay, resolveCastType } from "../src/castTypes.js";
import { emptyIndex, extractPhpClasses, LaravelIndex, SchemaColumnInfo } from "../src/projectIndex.js";

describe("Eloquent cast type resolution", () => {
  let rootPath: string | null = null;

  afterEach(async () => {
    if (rootPath) {
      await rm(rootPath, { force: true, recursive: true });
      rootPath = null;
    }
  });

  it("maps primitive, parameterized, and encrypted casts to PHP result types", () => {
    const index = emptyIndex();
    const cases = [
      ["boolean", "bool"],
      ["decimal:2", "string"],
      ["datetime:Y-m-d H:i:s", "\\Illuminate\\Support\\Carbon"],
      ["encrypted:collection", "\\Illuminate\\Support\\Collection"],
      ["json:unicode", "array"],
    ] as const;

    for (const [type, phpType] of cases) {
      expect(resolveCastType({ name: "value", type }, index)).toEqual({
        kind: "primitive",
        nullable: false,
        phpType,
      });
    }

    expect(resolveCastType({ name: "value", type: "unknown" }, index)).toBeNull();
  });

  it("combines cast nullability with nullable schema columns", () => {
    const resolved = resolveCastType({ name: "enabled", type: "boolean" }, emptyIndex());
    const column: SchemaColumnInfo = {
      filePath: "/app/database/migrations/create_users.php",
      modifiers: ["nullable"],
      name: "enabled",
      tableName: "users",
      type: "boolean",
    };

    expect(resolved && castTypeDisplay(resolved, column)).toBe("bool|null");
  });

  it("resolves enum, framework class, custom, and Castable value-object casts", async () => {
    rootPath = await mkdtemp(path.join(os.tmpdir(), "laravel-assist-casts-"));
    const enumPath = path.join(rootPath, "app/Enums/Status.php");
    const customPath = path.join(rootPath, "app/Casts/AsMoney.php");
    const castablePath = path.join(rootPath, "app/ValueObjects/Address.php");
    const jsonPath = path.join(rootPath, "app/Casts/AsJson.php");
    const inboundPath = path.join(rootPath, "app/Casts/AsHash.php");

    const enumSource = "<?php\nnamespace App\\Enums;\nenum Status: string { case Active = 'active'; }";
    const customSource = `<?php
namespace App\\Casts;
use App\\ValueObjects\\Money;
use Illuminate\\Contracts\\Database\\Eloquent\\CastsAttributes;
class AsMoney implements CastsAttributes
{
    public function get($model, string $key, mixed $value, array $attributes): Money | null
    {
        return null;
    }
    public function set($model, string $key, mixed $value, array $attributes): string { return ''; }
}`;
    const castableSource = `<?php
namespace App\\ValueObjects;
use Illuminate\\Contracts\\Database\\Eloquent\\Castable;
class Address implements Castable
{
    public static function castUsing(array $arguments): string { return AsAddress::class; }
}`;
    const jsonSource = `<?php
namespace App\\Casts;
class AsJson
{
    /** @return array<string, mixed> */
    public function get($model, string $key, mixed $value, array $attributes)
    {
        return [];
    }
}`;
    const inboundSource = `<?php
namespace App\\Casts;
class AsHash
{
    public function set($model, string $key, mixed $value, array $attributes): string { return ''; }
}`;

    await Promise.all([
      writePhp(enumPath, enumSource),
      writePhp(customPath, customSource),
      writePhp(castablePath, castableSource),
      writePhp(jsonPath, jsonSource),
      writePhp(inboundPath, inboundSource),
    ]);

    const index: LaravelIndex = {
      ...emptyIndex(),
      phpClasses: [
        ...extractPhpClasses(enumPath, enumSource),
        ...extractPhpClasses(customPath, customSource),
        ...extractPhpClasses(castablePath, castableSource),
        ...extractPhpClasses(jsonPath, jsonSource),
        ...extractPhpClasses(inboundPath, inboundSource),
      ],
    };

    expect(resolveCastType(classCast("App\\Enums\\Status"), index)).toEqual(
      expect.objectContaining({ kind: "enum", nullable: false, phpType: "\\App\\Enums\\Status" }),
    );
    expect(resolveCastType(classCast("Illuminate\\Database\\Eloquent\\Casts\\AsStringable"), index)).toEqual({
      kind: "builtinCastClass",
      nullable: false,
      phpType: "\\Illuminate\\Support\\Stringable",
    });
    expect(resolveCastType(classCast("Illuminate\\Database\\Eloquent\\Casts\\AsBinary"), index)).toEqual({
      kind: "builtinCastClass",
      nullable: false,
      phpType: "string",
    });
    expect(resolveCastType(classCast("App\\Casts\\AsMoney"), index)).toEqual(
      expect.objectContaining({ kind: "customCast", nullable: true, phpType: "\\App\\ValueObjects\\Money" }),
    );
    expect(resolveCastType(classCast("App\\Casts\\AsJson"), index)).toEqual(
      expect.objectContaining({ kind: "customCast", nullable: false, phpType: "array" }),
    );
    expect(resolveCastType(classCast("App\\ValueObjects\\Address"), index)).toEqual(
      expect.objectContaining({ kind: "castable", nullable: false, phpType: "\\App\\ValueObjects\\Address" }),
    );
    expect(resolveCastType(classCast("App\\Casts\\AsHash"), index)).toBeNull();
  });
});

function classCast(classFqcn: string) {
  return { classFqcn, name: "value", type: classFqcn };
}

async function writePhp(filePath: string, source: string): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, source);
}
