import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { TextDocument } from "vscode-languageserver-textdocument";
import { afterEach, describe, expect, it } from "vitest";
import { completionsForDocument } from "../src/completions.js";
import { definitionsForDocument } from "../src/definitions.js";
import { hoverForDocument } from "../src/hovers.js";
import { emptyIndex, extractModelInfo, extractPhpClasses, extractSchemaTables, LaravelIndex } from "../src/projectIndex.js";

describe("Eloquent cast language features", () => {
  let rootPath: string | null = null;

  afterEach(async () => {
    if (rootPath) {
      await rm(rootPath, { force: true, recursive: true });
      rootPath = null;
    }
  });

  it("surfaces primitive, enum, and custom cast types in hover, completion, and definition", async () => {
    rootPath = await mkdtemp(path.join(os.tmpdir(), "laravel-assist-cast-integration-"));
    const modelPath = path.join(rootPath, "app/Models/Order.php");
    const enumPath = path.join(rootPath, "app/Enums/Status.php");
    const castPath = path.join(rootPath, "app/Casts/AsMoney.php");
    const migrationPath = path.join(rootPath, "database/migrations/create_orders.php");
    const consumerPath = path.join(rootPath, "app/Http/OrderController.php");

    const modelSource = `<?php
namespace App\\Models;
use App\\Casts\\AsMoney;
use App\\Enums\\Status;
use Illuminate\\Database\\Eloquent\\Model;
class Order extends Model
{
    protected $casts = [
        'paid' => 'boolean',
        'status' => Status::class,
        'total' => AsMoney::class,
        'virtual_flag' => 'boolean',
    ];

    public function status()
    {
        return $this->belongsTo(StatusModel::class);
    }
}`;
    const enumSource = "<?php\nnamespace App\\Enums;\nenum Status: string { case Paid = 'paid'; }";
    const castSource = `<?php
namespace App\\Casts;
use App\\ValueObjects\\Money;
class AsMoney
{
    public function get($model, string $key, mixed $value, array $attributes): Money
    {
        return new Money($value);
    }
}`;
    const migrationSource = `<?php
Schema::create('orders', function (Blueprint $table) {
    $table->boolean('paid')->nullable();
    $table->string('status');
    $table->integer('total');
});`;
    const consumerSource = `<?php
namespace App\\Http;
use App\\Models\\Order;
$order = Order::query()->first();
$order->paid;
$order->status;
$order->total;
$order->virtual_flag;
$order->`;

    await Promise.all([
      writePhp(modelPath, modelSource),
      writePhp(enumPath, enumSource),
      writePhp(castPath, castSource),
      writePhp(migrationPath, migrationSource),
      writePhp(consumerPath, consumerSource),
    ]);

    const model = extractModelInfo(modelPath, modelSource);
    const phpClasses = [
      ...extractPhpClasses(modelPath, modelSource),
      ...extractPhpClasses(enumPath, enumSource),
      ...extractPhpClasses(castPath, castSource),
    ];
    const index: LaravelIndex = {
      ...emptyIndex(),
      models: model ? [model] : [],
      phpClasses,
      schemaTables: extractSchemaTables(migrationPath, migrationSource),
    };
    const document = TextDocument.create(pathToFileURL(consumerPath).toString(), "php", 1, consumerSource);

    expect(hoverValue(document, 4, index)).toContain("- Type: `bool|null`");
    expect(hoverValue(document, 5, index)).toContain("- Type: `\\App\\Enums\\Status`");
    expect(hoverValue(document, 5, index)).toContain("**Model attribute** `Order.status`");
    expect(hoverValue(document, 6, index)).toContain("- Type: `\\App\\ValueObjects\\Money`");
    expect(hoverValue(document, 7, index)).toContain("- Type: `bool`");
    expect(hoverValue(document, 7, index)).toContain(`- File: \`${modelPath}\``);

    const completions = completionsForDocument(document, { line: 8, character: 8 }, index);
    const byLabel = new Map(completions.map((item) => [item.label, item]));
    expect(byLabel.get("paid")?.detail).toContain("type: bool|null");
    expect(byLabel.get("status")?.detail).toContain("type: \\App\\Enums\\Status");
    expect(byLabel.get("status")?.detail).not.toContain("relation");
    expect(byLabel.get("total")?.detail).toContain("type: \\App\\ValueObjects\\Money");
    expect(byLabel.get("virtual_flag")?.detail).toBe("Cast attribute on Order type: bool cast: boolean");

    const enumClass = phpClasses.find((candidate) => candidate.fqcn === "App\\Enums\\Status")!;
    const customCastClass = phpClasses.find((candidate) => candidate.fqcn === "App\\Casts\\AsMoney")!;
    expect(definitionsForDocument(document, { line: 5, character: 10 }, index)).toEqual([
      { range: enumClass.nameRange, uri: pathToFileURL(enumPath).toString() },
    ]);
    expect(definitionsForDocument(document, { line: 6, character: 10 }, index)).toEqual([
      { range: customCastClass.nameRange, uri: pathToFileURL(castPath).toString() },
    ]);
    expect(definitionsForDocument(document, { line: 7, character: 12 }, index)).toEqual([
      {
        range: { end: { character: 0, line: 0 }, start: { character: 0, line: 0 } },
        uri: pathToFileURL(modelPath).toString(),
      },
    ]);
  });
});

function hoverValue(document: TextDocument, line: number, index: LaravelIndex): string {
  const contents = hoverForDocument(document, { line, character: 10 }, index)?.contents;
  return typeof contents === "object" && !Array.isArray(contents) && "value" in contents
    ? String(contents.value)
    : "";
}

async function writePhp(filePath: string, source: string): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, source);
}
