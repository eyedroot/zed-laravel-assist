import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { TextDocument } from "vscode-languageserver-textdocument";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { codeLensesForDocument, resolveUsageCodeLens } from "../src/codeLens.js";
import { emptyIndex, extractModelInfo, extractPhpClasses, extractRouteInfo, extractSchemaTables, LaravelIndex } from "../src/projectIndex.js";

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

  it("creates unresolved usage lenses for indexed PHP classes and methods of every visibility", () => {
    const source = [
      "<?php",
      "namespace App\\Services;",
      "",
      "class SelfSignupService",
      "{",
      "    public function completeSignup(): void {}",
      "    protected function internalOnly(): void {}",
      "    private function helper(): void {}",
      "}",
    ].join("\n");
    const document = TextDocument.create(pathToFileURL(servicePath).toString(), "php", 1, source);
    const index = indexFixture({ phpSources: [{ filePath: servicePath, source }] });

    const lenses = codeLensesForDocument(document, index);

    expect(lenses.map((lens) => (lens.data as { kind: string }).kind)).toEqual(["phpClass", "phpMethod", "phpMethod", "phpMethod"]);
    expect(lenses.map((lens) => lens.command)).toEqual([undefined, undefined, undefined, undefined]);
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

  it("counts internal $this-> calls for protected methods so a single usage can be jumped to directly", async () => {
    const librarySource = [
      "<?php",
      "namespace App\\Services;",
      "",
      "class SelfSignupService",
      "{",
      "    public function completeSignup(): void",
      "    {",
      "        $this->pipe(['payload'], true);",
      "    }",
      "",
      "    protected function pipe(array $payload, ...$bundle): void {}",
      "}",
    ].join("\n");
    await writeFile(servicePath, librarySource);

    const document = TextDocument.create(pathToFileURL(servicePath).toString(), "php", 1, librarySource);
    const index = indexFixture({ phpSources: [{ filePath: servicePath, source: librarySource }] });
    const pipeLens = codeLensesForDocument(document, index).find(
      (lens) => (lens.data as { methodName?: string }).methodName === "pipe",
    );

    const resolved = await resolveUsageCodeLens(pipeLens!, document, index);

    expect(resolved.command?.title).toBe("1 usage");
    expect((resolved.command?.arguments?.[2] as Array<{ range: { start: { line: number } } }>).map(
      (location) => location.range.start.line,
    )).toEqual([7]);
  });

  it("counts interface-typed receiver calls as implementation method usages", async () => {
    const interfacePath = path.join(rootPath, "app/Libraries/ServiceAccount/ServiceAccountInterface.php");
    const libraryPath = path.join(rootPath, "app/Libraries/ServiceAccount/ServiceAccountLibrary.php");
    const consumerPath = path.join(rootPath, "app/Services/AccountSignupService.php");
    const unrelatedPath = path.join(rootPath, "app/Services/UnrelatedRegistrar.php");
    const interfaceSource = [
      "<?php",
      "namespace App\\Libraries\\ServiceAccount;",
      "",
      "interface ServiceAccountInterface",
      "{",
      "    public function register(array $data, bool $includeInvitation = true);",
      "}",
    ].join("\n");
    const librarySource = [
      "<?php",
      "namespace App\\Libraries\\ServiceAccount;",
      "",
      "class ServiceAccountLibrary implements ServiceAccountInterface",
      "{",
      "    public function register(array $data, bool $includeInvitation = true)",
      "    {",
      "        return null;",
      "    }",
      "}",
    ].join("\n");
    const unrelatedSource = [
      "<?php",
      "namespace App\\Services;",
      "",
      "class UnrelatedRegistrar",
      "{",
      "    public function register(array $data): void {}",
      "}",
    ].join("\n");
    const consumerSource = [
      "<?php",
      "namespace App\\Services;",
      "",
      "use App\\Libraries\\ServiceAccount\\ServiceAccountInterface;",
      "",
      "class AccountSignupService",
      "{",
      "    public function handle(array $data): void",
      "    {",
      "        $serviceAccountLibrary = app(ServiceAccountInterface::class, [$data, true]);",
      "        $serviceAccountLibrary->register(['name' => 'demo']);",
      "",
      "        /** @var ServiceAccountInterface $fromDocblock */",
      "        $fromDocblock->register([]);",
      "",
      "        $unrelated = new UnrelatedRegistrar();",
      "        $unrelated->register([]);",
      "    }",
      "}",
    ].join("\n");
    await mkdir(path.dirname(interfacePath), { recursive: true });
    await mkdir(path.dirname(unrelatedPath), { recursive: true });
    await writeFile(interfacePath, interfaceSource);
    await writeFile(libraryPath, librarySource);
    await writeFile(consumerPath, consumerSource);
    await writeFile(unrelatedPath, unrelatedSource);

    const document = TextDocument.create(pathToFileURL(libraryPath).toString(), "php", 1, librarySource);
    const index = indexFixture({
      phpSources: [
        { filePath: interfacePath, source: interfaceSource },
        { filePath: libraryPath, source: librarySource },
        { filePath: consumerPath, source: consumerSource },
        { filePath: unrelatedPath, source: unrelatedSource },
      ],
    });
    const registerLens = codeLensesForDocument(document, index).find(
      (lens) => (lens.data as { methodName?: string }).methodName === "register",
    );

    const resolved = await resolveUsageCodeLens(registerLens!, document, index);

    expect(resolved.command?.title).toBe("2 usages");
    expect((resolved.command?.arguments?.[2] as Array<{ uri: string }>).map((location) => location.uri)).toEqual([
      pathToFileURL(consumerPath).toString(),
      pathToFileURL(consumerPath).toString(),
    ]);
  });

  it("counts parent-typed receiver calls toward subclass method overrides", async () => {
    const basePath = path.join(rootPath, "app/Notifications/BaseNotifier.php");
    const childPath = path.join(rootPath, "app/Notifications/MailNotifier.php");
    const callerPath = path.join(rootPath, "app/Services/NotifierConsumer.php");
    const baseSource = [
      "<?php",
      "namespace App\\Notifications;",
      "",
      "class BaseNotifier",
      "{",
      "    public function send(array $payload): void {}",
      "}",
    ].join("\n");
    const childSource = [
      "<?php",
      "namespace App\\Notifications;",
      "",
      "class MailNotifier extends BaseNotifier",
      "{",
      "    public function send(array $payload): void {}",
      "}",
    ].join("\n");
    const callerSource = [
      "<?php",
      "namespace App\\Services;",
      "",
      "use App\\Notifications\\BaseNotifier;",
      "",
      "class NotifierConsumer",
      "{",
      "    public function dispatch(BaseNotifier $notifier): void",
      "    {",
      "        $notifier->send([]);",
      "    }",
      "}",
    ].join("\n");
    await mkdir(path.dirname(basePath), { recursive: true });
    await writeFile(basePath, baseSource);
    await writeFile(childPath, childSource);
    await writeFile(callerPath, callerSource);

    const document = TextDocument.create(pathToFileURL(childPath).toString(), "php", 1, childSource);
    const index = indexFixture({
      phpSources: [
        { filePath: basePath, source: baseSource },
        { filePath: childPath, source: childSource },
        { filePath: callerPath, source: callerSource },
      ],
    });
    const sendLens = codeLensesForDocument(document, index).find(
      (lens) => (lens.data as { methodName?: string }).methodName === "send",
    );

    const resolved = await resolveUsageCodeLens(sendLens!, document, index);

    expect(resolved.command?.title).toBe("1 usage");
    expect((resolved.command?.arguments?.[2] as Array<{ uri: string }>).map((location) => location.uri)).toEqual([
      pathToFileURL(callerPath).toString(),
    ]);
  });

  it("counts namespace-relative class instantiations with and without constructor parentheses", async () => {
    const workPath = path.join(rootPath, "app/Kollus/Libraries/ServiceAccount/Works/Register/SetSelfSignupTranscoder.php");
    const libraryPath = path.join(rootPath, "app/Kollus/Libraries/ServiceAccount/ServiceAccountLibrary.php");
    const workSource = [
      "<?php",
      "namespace App\\Kollus\\Libraries\\ServiceAccount\\Works\\Register;",
      "",
      "class SetSelfSignupTranscoder {}",
    ].join("\n");
    const librarySource = [
      "<?php",
      "namespace App\\Kollus\\Libraries\\ServiceAccount;",
      "",
      "class ServiceAccountLibrary",
      "{",
      "    public function works(): array",
      "    {",
      "        return [",
      "            new Works\\Register\\SetSelfSignupTranscoder,",
      "            new Works\\Register\\SetSelfSignupTranscoder(),",
      "            // new Works\\Register\\SetSelfSignupTranscoder(),",
      "            'new Works\\\\Register\\\\SetSelfSignupTranscoder',",
      "        ];",
      "    }",
      "}",
    ].join("\n");
    await mkdir(path.dirname(workPath), { recursive: true });
    await writeFile(workPath, workSource);
    await writeFile(libraryPath, librarySource);

    const document = TextDocument.create(pathToFileURL(workPath).toString(), "php", 1, workSource);
    const index = indexFixture({
      phpSources: [
        { filePath: workPath, source: workSource },
        { filePath: libraryPath, source: librarySource },
      ],
    });
    const classLens = codeLensesForDocument(document, index).find((lens) => (lens.data as { kind: string }).kind === "phpClass");

    const resolved = await resolveUsageCodeLens(classLens!, document, index);

    expect(resolved.command?.title).toBe("2 usages");
    expect((resolved.command?.arguments?.[2] as Array<{ range: { start: { line: number } } }>).map(
      (location) => location.range.start.line,
    )).toEqual([8, 9]);
  });

  it("counts Eloquent relation property reads as relation method usages", async () => {
    const modelPath = path.join(rootPath, "app/Models/Country.php");
    const repositoryPath = path.join(rootPath, "app/Repositories/LanguageRepository.php");
    const modelSource = [
      "<?php",
      "namespace App\\Models;",
      "",
      "use Illuminate\\Database\\Eloquent\\Model;",
      "",
      "class Country extends Model",
      "{",
      "    public function language()",
      "    {",
      "        return $this->belongsTo(Language::class, 'language_id');",
      "    }",
      "",
      "    public function locale(): string",
      "    {",
      "        return 'ko';",
      "    }",
      "}",
    ].join("\n");
    const repositorySource = [
      "<?php",
      "namespace App\\Repositories;",
      "",
      "use App\\Models\\Country;",
      "",
      "class LanguageRepository",
      "{",
      "    public function findLanguage(?int $countryId, Country $typedCountry)",
      "    {",
      "        $country = Country::find($countryId);",
      "",
      "        $first = $country->language;",
      "        $second = $typedCountry?->",
      "            /* relation property */",
      "            language;",
      "        $third = Country::query()->first()?->language;",
      "        $fourth = $typedCountry /* receiver */ ?->language;",
      "",
      "        // $country->language;",
      "        $label = 'not $country->language';",
      "        $country->language /* assignment */ = null;",
      "        $country->languages;",
      "        $untyped->language;",
      "        $country->locale;",
      "        return [$first, $second, $third, $fourth];",
      "    }",
      "}",
    ].join("\n");
    await mkdir(path.dirname(modelPath), { recursive: true });
    await mkdir(path.dirname(repositoryPath), { recursive: true });
    await writeFile(modelPath, modelSource);
    await writeFile(repositoryPath, repositorySource);

    const document = TextDocument.create(pathToFileURL(modelPath).toString(), "php", 1, modelSource);
    const index = indexFixture({
      modelSources: [{ filePath: modelPath, source: modelSource }],
      phpSources: [{ filePath: repositoryPath, source: repositorySource }],
    });
    const languageLens = codeLensesForDocument(document, index).find(
      (lens) => (lens.data as { methodName?: string }).methodName === "language",
    );

    const resolved = await resolveUsageCodeLens(languageLens!, document, index);

    const locations = (resolved.command?.arguments?.[2] as Array<{ range: { start: { line: number } }; uri: string }>).map(
      (location) => ({ line: location.range.start.line, uri: location.uri }),
    );
    expect(locations).toEqual([
      { line: 11, uri: pathToFileURL(repositoryPath).toString() },
      { line: 14, uri: pathToFileURL(repositoryPath).toString() },
      { line: 15, uri: pathToFileURL(repositoryPath).toString() },
      { line: 16, uri: pathToFileURL(repositoryPath).toString() },
    ]);
    expect(resolved.command?.title).toBe("4 usages");

    const localeLens = codeLensesForDocument(document, index).find(
      (lens) => (lens.data as { methodName?: string }).methodName === "locale",
    );
    expect((await resolveUsageCodeLens(localeLens!, document, index)).command?.title).toBe("0 usages");
  });

  it("does not count relation property reads shadowed by a same-name schema column, cast, or accessor", async () => {
    const modelPath = path.join(rootPath, "app/Models/Country.php");
    const repositoryPath = path.join(rootPath, "app/Repositories/LanguageRepository.php");
    const migrationPath = path.join(rootPath, "database/migrations/2024_01_01_000000_create_countries_table.php");
    const modelSource = [
      "<?php",
      "namespace App\\Models;",
      "",
      "use Illuminate\\Database\\Eloquent\\Model;",
      "",
      "class Country extends Model",
      "{",
      "    protected $casts = ['timezone' => 'string'];",
      "",
      "    public function language()",
      "    {",
      "        return $this->belongsTo(Language::class, 'language_id');",
      "    }",
      "",
      "    public function timezone()",
      "    {",
      "        return $this->belongsTo(Timezone::class, 'timezone_id');",
      "    }",
      "",
      "    public function currency()",
      "    {",
      "        return $this->belongsTo(Currency::class, 'currency_id');",
      "    }",
      "",
      "    public function getCurrencyAttribute(): string",
      "    {",
      "        return 'USD';",
      "    }",
      "}",
    ].join("\n");
    const repositorySource = [
      "<?php",
      "namespace App\\Repositories;",
      "",
      "use App\\Models\\Country;",
      "",
      "class LanguageRepository",
      "{",
      "    public function findLanguage(Country $country)",
      "    {",
      "        $country->language()->first();",
      "        $country->timezone()->first();",
      "        $country->currency()->first();",
      "        $country->language;",
      "        $country->timezone;",
      "        $country->currency;",
      "    }",
      "}",
    ].join("\n");
    const migrationSource = [
      "<?php",
      "use Illuminate\\Database\\Migrations\\Migration;",
      "use Illuminate\\Database\\Schema\\Blueprint;",
      "use Illuminate\\Support\\Facades\\Schema;",
      "",
      "return new class extends Migration {",
      "    public function up(): void",
      "    {",
      "        Schema::create('countries', function (Blueprint $table) {",
      "            $table->id();",
      "            $table->string('language');",
      "        });",
      "    }",
      "};",
    ].join("\n");
    await mkdir(path.dirname(modelPath), { recursive: true });
    await mkdir(path.dirname(repositoryPath), { recursive: true });
    await mkdir(path.dirname(migrationPath), { recursive: true });
    await writeFile(modelPath, modelSource);
    await writeFile(repositoryPath, repositorySource);
    await writeFile(migrationPath, migrationSource);

    const document = TextDocument.create(pathToFileURL(modelPath).toString(), "php", 1, modelSource);
    const index = indexFixture({
      migrationSources: [{ filePath: migrationPath, source: migrationSource }],
      modelSources: [{ filePath: modelPath, source: modelSource }],
      phpSources: [{ filePath: repositoryPath, source: repositorySource }],
    });
    const lenses = codeLensesForDocument(document, index);
    for (const [methodName, expectedLine] of [["language", 9], ["timezone", 10], ["currency", 11]] as const) {
      const lens = lenses.find((candidate) => (candidate.data as { methodName?: string }).methodName === methodName);
      const resolved = await resolveUsageCodeLens(lens!, document, index);

      // The schema column, cast, and accessor each take precedence over a
      // same-name relation for property reads. The explicit method calls are
      // still references to their relation methods.
      expect(resolved.command?.title).toBe("1 usage");
      expect((resolved.command?.arguments?.[2] as Array<{ range: { start: { line: number } } }>).map(
        (location) => location.range.start.line,
      )).toEqual([expectedLine]);
    }
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
  migrationSources = [],
  modelSources = [],
  phpSources = [],
  routeSources = [],
}: {
  migrationSources?: Array<{ filePath: string; source: string }>;
  modelSources?: Array<{ filePath: string; source: string }>;
  phpSources?: Array<{ filePath: string; source: string }>;
  routeSources?: Array<{ filePath: string; source: string }>;
}): LaravelIndex {
  return {
    ...emptyIndex(),
    models: modelSources.flatMap(({ filePath, source }) => extractModelInfo(filePath, source) ?? []),
    phpClasses: [...phpSources, ...modelSources].flatMap(({ filePath, source }) => extractPhpClasses(filePath, source)),
    routes: routeSources.flatMap(({ filePath, source }) => extractRouteInfo(filePath, source)),
    schemaTables: migrationSources.flatMap(({ filePath, source }) => extractSchemaTables(filePath, source)),
  };
}
