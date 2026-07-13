import { TextDocument } from "vscode-languageserver-textdocument";
import { describe, expect, it } from "vitest";
import { completionsForDocument } from "../src/completions.js";
import { emptyIndex, LaravelIndex } from "../src/projectIndex.js";

describe("Laravel completions", () => {
  it("completes schema columns inside model attribute arrays", () => {
    const document = TextDocument.create(
      "file:///app/app/Models/User.php",
      "php",
      1,
      "<?php\nclass User extends Model\n{\n    protected $fillable = ['\n}\n",
    );

    const completions = completionsForDocument(document, { line: 3, character: 28 }, indexFixture);

    expect(completions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "users string unique",
          label: "email",
        }),
        expect.objectContaining({
          detail: "users foreignId",
          label: "team_id",
        }),
      ]),
    );
  });

  it("completes Blade views inside directives", () => {
    const document = TextDocument.create(
      "file:///app/resources/views/users/index.blade.php",
      "blade",
      1,
      "@include('",
    );

    const completions = completionsForDocument(document, { line: 0, character: 10 }, indexFixture);

    expect(completions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "Laravel view extends layouts.app",
          label: "users.index",
        }),
      ]),
    );
  });

  it("completes Blade sections from the extended layout", () => {
    const document = TextDocument.create(
      "file:///app/resources/views/users/index.blade.php",
      "blade",
      1,
      "@section('",
    );

    expect(completionsForDocument(document, { line: 0, character: 10 }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "Blade section layouts.app",
          label: "content",
        }),
        expect.objectContaining({
          detail: "Blade section layouts.app",
          label: "scripts",
        }),
      ]),
    );
  });

  it("completes Blade stacks from the extended layout", () => {
    const document = TextDocument.create(
      "file:///app/resources/views/users/index.blade.php",
      "blade",
      1,
      "@push('",
    );

    expect(completionsForDocument(document, { line: 0, character: 7 }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "Blade stack layouts.app",
          label: "scripts",
        }),
      ]),
    );
  });

  it("completes Blade component tags and props", () => {
    const tagDocument = TextDocument.create(
      "file:///app/resources/views/users/index.blade.php",
      "blade",
      1,
      "<x-",
    );
    const propDocument = TextDocument.create(
      "file:///app/resources/views/users/index.blade.php",
      "blade",
      1,
      "<x-alert ",
    );
    const classPropDocument = TextDocument.create(
      "file:///app/resources/views/users/index.blade.php",
      "blade",
      1,
      "<x-forms.input ",
    );

    expect(completionsForDocument(tagDocument, { line: 0, character: 3 }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "Blade anonymous component",
          label: "alert",
        }),
        expect.objectContaining({
          detail: "Blade class component",
          label: "forms.input",
        }),
      ]),
    );
    expect(completionsForDocument(propDocument, { line: 0, character: 9 }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "Blade anonymous component prop alert",
          label: "type",
        }),
      ]),
    );
    expect(completionsForDocument(classPropDocument, { line: 0, character: 15 }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "Blade class component prop forms.input",
          label: "label-text",
        }),
      ]),
    );
  });

  it("completes validated request fields from injected FormRequest", () => {
    const document = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      "<?php\nclass UserController\n{\n    public function store(StoreUserRequest $request)\n    {\n        $request->validated('\n    }\n}\n",
    );

    const completions = completionsForDocument(document, { line: 5, character: 29 }, indexFixture);

    expect(completions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "Validation field email|required",
          label: "email",
        }),
        expect.objectContaining({
          detail: "Validation field max:255|nullable|string",
          label: "profile.name",
        }),
      ]),
    );
  });

  it("completes schema tables and columns inside validation Rule calls", () => {
    const tableSource = "<?php\nRule::unique('";
    const columnSource = "<?php\nRule::exists('users', '";
    const tableDocument = TextDocument.create(
      "file:///app/app/Http/Requests/StoreUserRequest.php",
      "php",
      1,
      tableSource,
    );
    const columnDocument = TextDocument.create(
      "file:///app/app/Http/Requests/StoreUserRequest.php",
      "php",
      1,
      columnSource,
    );

    expect(completionsForDocument(tableDocument, { line: 1, character: tableSource.split("\n")[1].length }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "Schema table 3 columns",
          label: "users",
        }),
      ]),
    );
    expect(completionsForDocument(columnDocument, { line: 1, character: columnSource.split("\n")[1].length }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "users string unique",
          label: "email",
        }),
      ]),
    );
  });

  it("completes validation rule names inside rule strings", () => {
    const lines = [
      "<?php",
      "class StoreUserRequest extends FormRequest",
      "{",
      "    public function rules(): array",
      "    {",
      "        return [",
      "            'email' => 'required|",
    ];
    const document = TextDocument.create(
      "file:///app/app/Http/Requests/StoreUserRequest.php",
      "php",
      1,
      lines.join("\n"),
    );

    expect(completionsForDocument(document, { line: 6, character: lines[6].length }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ detail: "Laravel validation rule", label: "string" }),
        expect.objectContaining({ detail: "Laravel validation rule", label: "exists" }),
      ]),
    );

    const arrayFormLine = "            'email' => ['required', '";
    const arrayDocument = TextDocument.create(
      "file:///app/app/Http/Requests/StoreUserRequest.php",
      "php",
      1,
      [...lines.slice(0, 6), arrayFormLine].join("\n"),
    );
    expect(completionsForDocument(arrayDocument, { line: 6, character: arrayFormLine.length }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ detail: "Laravel validation rule", label: "nullable" }),
      ]),
    );

    const validateLine = "$request->validate(['email' => '";
    const validateDocument = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      `<?php\n${validateLine}`,
    );
    expect(completionsForDocument(validateDocument, { line: 1, character: validateLine.length }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ detail: "Laravel validation rule", label: "required" }),
      ]),
    );

    const outsideLine = "$value = ['email' => 'requi";
    const outsideDocument = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      `<?php\n${outsideLine}`,
    );
    expect(completionsForDocument(outsideDocument, { line: 1, character: outsideLine.length }, indexFixture)).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ label: "required" })]),
    );
  });

  it("completes Livewire component names in tags and @livewire directives", () => {
    const expected = expect.arrayContaining([
      expect.objectContaining({ detail: "Livewire component App\\Livewire\\UserCard", label: "user-card" }),
    ]);

    for (const line of ["<livewire:", "@livewire('"]) {
      const document = TextDocument.create(
        "file:///app/resources/views/dashboard.blade.php",
        "blade",
        1,
        line,
      );
      expect(completionsForDocument(document, { line: 0, character: line.length }, indexFixture)).toEqual(expected);
    }
  });

  it("completes Livewire tag parameters and wire bindings", () => {
    const tagLine = "<livewire:user-card ";
    const tagDocument = TextDocument.create(
      "file:///app/resources/views/dashboard.blade.php",
      "blade",
      1,
      tagLine,
    );
    expect(completionsForDocument(tagDocument, { line: 0, character: tagLine.length }, indexFixture)).toEqual([
      expect.objectContaining({ detail: "Livewire property UserCard::$search", label: "search" }),
      expect.objectContaining({ detail: "Livewire property UserCard::$userId", label: "user-id" }),
    ]);

    const modelLine = '<input wire:model="';
    const componentView = "file:///app/resources/views/livewire/user-card.blade.php";
    const modelDocument = TextDocument.create(componentView, "blade", 1, modelLine);
    expect(completionsForDocument(modelDocument, { line: 0, character: modelLine.length }, indexFixture)).toEqual([
      expect.objectContaining({ detail: "Livewire property UserCard::$search", label: "search" }),
      expect.objectContaining({ detail: "Livewire property UserCard::$userId", label: "userId" }),
    ]);

    const clickLine = '<button wire:click="';
    const clickDocument = TextDocument.create(componentView, "blade", 1, clickLine);
    expect(completionsForDocument(clickDocument, { line: 0, character: clickLine.length }, indexFixture)).toEqual([
      expect.objectContaining({ detail: "Livewire action UserCard::deletePost()", label: "deletePost" }),
      expect.objectContaining({ detail: "Livewire action UserCard::save()", label: "save" }),
    ]);

    const outsideDocument = TextDocument.create(
      "file:///app/resources/views/dashboard.blade.php",
      "blade",
      1,
      clickLine,
    );
    expect(completionsForDocument(outsideDocument, { line: 0, character: clickLine.length }, indexFixture)).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ label: "save" })]),
    );
  });

  it("completes Inertia page names in render contexts", () => {
    const expected = expect.arrayContaining([
      expect.objectContaining({ detail: "Inertia page", label: "Users/Index" }),
      expect.objectContaining({ detail: "Inertia page", label: "Dashboard" }),
    ]);

    for (const line of ["Inertia::render('", "return inertia('", "Route::inertia('/users', '"]) {
      const document = TextDocument.create(
        "file:///app/app/Http/Controllers/UserController.php",
        "php",
        1,
        `<?php\n${line}`,
      );
      expect(completionsForDocument(document, { line: 1, character: line.length }, indexFixture)).toEqual(expected);
    }

    const uriLine = "Route::inertia('";
    const uriDocument = TextDocument.create(
      "file:///app/routes/web.php",
      "php",
      1,
      `<?php\n${uriLine}`,
    );
    expect(completionsForDocument(uriDocument, { line: 1, character: uriLine.length }, indexFixture)).not.toEqual(expected);
  });

  it("completes filesystem disk names inside Storage::disk calls", () => {
    const line = "Storage::disk('";
    const document = TextDocument.create(
      "file:///app/app/Http/Controllers/UploadController.php",
      "php",
      1,
      `<?php\n${line}`,
    );

    expect(completionsForDocument(document, { line: 1, character: line.length }, indexFixture)).toEqual([
      expect.objectContaining({ detail: "Laravel filesystem disk", label: "local" }),
      expect.objectContaining({ detail: "Laravel filesystem disk", label: "s3" }),
    ]);
  });

  it("completes schema tables and columns in DB::table query chains", () => {
    const tableLine = "DB::table('";
    const tableDocument = TextDocument.create(
      "file:///app/app/Http/Controllers/ReportController.php",
      "php",
      1,
      `<?php\n${tableLine}`,
    );
    expect(completionsForDocument(tableDocument, { line: 1, character: tableLine.length }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ detail: "Schema table 3 columns", label: "users" }),
      ]),
    );

    const columnLine = "DB::table('users')->where('";
    const columnDocument = TextDocument.create(
      "file:///app/app/Http/Controllers/ReportController.php",
      "php",
      1,
      `<?php\n${columnLine}`,
    );
    expect(completionsForDocument(columnDocument, { line: 1, character: columnLine.length }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ detail: "users string unique", label: "email" }),
      ]),
    );

    const connectionLine = "DB::connection('reporting')->table('";
    const connectionDocument = TextDocument.create(
      "file:///app/app/Http/Controllers/ReportController.php",
      "php",
      1,
      `<?php\n${connectionLine}`,
    );
    expect(completionsForDocument(connectionDocument, { line: 1, character: connectionLine.length }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ detail: "Schema table 3 columns", label: "users" }),
      ]),
    );
  });

  it("completes schema tables and columns after exists:/unique: in rule strings", () => {
    const lines = [
      "<?php",
      "class StoreUserRequest extends FormRequest",
      "{",
      "    public function rules(): array",
      "    {",
      "        return [",
      "            'team_id' => 'required|exists:",
    ];
    const tableDocument = TextDocument.create(
      "file:///app/app/Http/Requests/StoreUserRequest.php",
      "php",
      1,
      lines.join("\n"),
    );
    expect(completionsForDocument(tableDocument, { line: 6, character: lines[6].length }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ detail: "Schema table 3 columns", label: "users" }),
      ]),
    );

    const columnLine = "            'team_id' => 'required|exists:users,";
    const columnDocument = TextDocument.create(
      "file:///app/app/Http/Requests/StoreUserRequest.php",
      "php",
      1,
      [...lines.slice(0, 6), columnLine].join("\n"),
    );
    expect(completionsForDocument(columnDocument, { line: 6, character: columnLine.length }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ detail: "users foreignId", label: "team_id" }),
      ]),
    );
  });

  it("completes translation keys inside translation helpers", () => {
    const document = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      "<?php\n__('",
    );

    const completions = completionsForDocument(document, { line: 1, character: 4 }, indexFixture);

    expect(completions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "Laravel translation en php",
          label: "messages.welcome",
        }),
        expect.objectContaining({
          detail: "Laravel translation en json",
          label: "Reset Password",
        }),
      ]),
    );
  });

  it("completes deep config keys", () => {
    const document = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      "<?php\nconfig('",
    );

    expect(completionsForDocument(document, { line: 1, character: 8 }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "Laravel config key",
          label: "services.mailgun.domain",
        }),
      ]),
    );
  });

  it("completes container bindings and authorization abilities", () => {
    const containerDocument = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      "<?php\napp('",
    );
    const authorizationDocument = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      "<?php\nGate::allows('",
    );

    expect(
      completionsForDocument(containerDocument, { line: 1, character: 5 }, indexFixture),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "Container binding singleton DatabaseReportService",
          label: "ReportService",
        }),
      ]),
    );
    expect(
      completionsForDocument(authorizationDocument, { line: 1, character: 14 }, indexFixture),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "Laravel ability gate",
          label: "publish-posts",
        }),
        expect.objectContaining({
          detail: "Laravel ability policy PostPolicy",
          label: "update",
        }),
      ]),
    );
  });

  it("completes container class references and app-resolved methods", () => {
    const serviceIndex: LaravelIndex = {
      ...indexFixture,
      containerBindings: [
        ...indexFixture.containerBindings,
        {
          abstract: "App\\Contracts\\ServiceAccountInterface",
          concrete: "App\\Services\\ServiceAccountLibrary",
          filePath: "/app/app/Providers/AppServiceProvider.php",
          lifetime: "singleton",
        },
      ],
      phpClasses: [
        {
          extends: [],
          filePath: "/app/app/Contracts/ServiceAccountInterface.php",
          fqcn: "App\\Contracts\\ServiceAccountInterface",
          implements: [],
          isAbstract: false,
          isFinal: false,
          kind: "interface",
          methods: [
            {
              name: "setGrade",
              range: { end: { character: 29, line: 5 }, start: { character: 21, line: 5 } },
              visibility: "public" as const,
            },
          ],
          name: "ServiceAccountInterface",
          nameRange: { end: { character: 31, line: 3 }, start: { character: 8, line: 3 } },
          namespace: "App\\Contracts",
        },
        {
          extends: [],
          filePath: "/app/app/Services/ServiceAccountLibrary.php",
          fqcn: "App\\Services\\ServiceAccountLibrary",
          implements: ["App\\Contracts\\ServiceAccountInterface"],
          isAbstract: false,
          isFinal: false,
          kind: "class",
          methods: [
            {
              name: "provisionWorkspace",
              range: { end: { character: 36, line: 8 }, start: { character: 18, line: 8 } },
              visibility: "public" as const,
            },
          ],
          name: "ServiceAccountLibrary",
          nameRange: { end: { character: 27, line: 3 }, start: { character: 6, line: 3 } },
          namespace: "App\\Services",
        },
      ],
    };
    const classDocument = TextDocument.create(
      "file:///app/app/Services/SelfSignupService.php",
      "php",
      1,
      "<?php\napp(",
    );
    const methodSource = [
      "<?php",
      "namespace App\\Services;",
      "use App\\Contracts\\ServiceAccountInterface;",
      "/** @var ServiceAccountInterface $serviceAccountLibrary */",
      "$serviceAccountLibrary = app(ServiceAccountInterface::class, [$user, true]);",
      "$serviceAccountLibrary->",
    ].join("\n");
    const methodDocument = TextDocument.create(
      "file:///app/app/Services/SelfSignupService.php",
      "php",
      1,
      methodSource,
    );

    expect(completionsForDocument(classDocument, { line: 1, character: 5 }, serviceIndex)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "PHP interface",
          label: "App\\Contracts\\ServiceAccountInterface",
        }),
      ]),
    );
    expect(completionsForDocument(methodDocument, { line: 5, character: "$serviceAccountLibrary->".length }, serviceIndex)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "PHP interface App\\Contracts\\ServiceAccountInterface",
          label: "setGrade",
        }),
        expect.objectContaining({
          detail: "PHP class App\\Services\\ServiceAccountLibrary",
          label: "provisionWorkspace",
        }),
      ]),
    );

    // Class-name completion must fire for every resolution entry point, not only app().
    const classArgumentSources = [
      "<?php\nApp::make(",
      "<?php\nApp::makeWith(",
      "<?php\napp()->make(",
      "<?php\nresolve(",
      "<?php\nContainer::getInstance()->build(",
      "<?php\nclass Provider {\n  public function register(): void {\n    $this->app->make(",
    ];
    for (const source of classArgumentSources) {
      const lines = source.split("\n");
      const document = TextDocument.create("file:///app/app/Services/EntryPoint.php", "php", 1, source);
      expect(
        completionsForDocument(
          document,
          { line: lines.length - 1, character: lines[lines.length - 1].length },
          serviceIndex,
        ),
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ label: "App\\Contracts\\ServiceAccountInterface" }),
        ]),
      );
    }

    // Member completion for a directly chained resolution call (App facade form).
    const chainedSource = [
      "<?php",
      "namespace App\\Services;",
      "use App\\Contracts\\ServiceAccountInterface;",
      "App::make(ServiceAccountInterface::class)->",
    ].join("\n");
    const chainedDocument = TextDocument.create("file:///app/app/Services/Chained.php", "php", 1, chainedSource);
    expect(
      completionsForDocument(
        chainedDocument,
        { line: 3, character: "App::make(ServiceAccountInterface::class)->".length },
        serviceIndex,
      ),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "setGrade" }),
        expect.objectContaining({ label: "provisionWorkspace" }),
      ]),
    );

    // Binding-name string completion for a facade method form.
    const bindingStringDocument = TextDocument.create(
      "file:///app/app/Services/Binding.php",
      "php",
      1,
      "<?php\nApp::makeWith('",
    );
    expect(
      completionsForDocument(bindingStringDocument, { line: 1, character: "App::makeWith('".length }, serviceIndex),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "ReportService" }),
      ]),
    );
  });

  it("completes PHPUnit mock method names for overridable methods only", () => {
    const source = [
      "<?php",
      "$registry = $this->createMock(SelfSignupPlanRegistry::class);",
      "$registry->method('",
    ].join("\n");
    const document = TextDocument.create("file:///app/tests/Unit/RegistryTest.php", "php", 1, source);

    const completions = completionsForDocument(
      document,
      { line: 2, character: "$registry->method('".length },
      phpunitMockIndex,
    );

    expect(completions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "PHPUnit mock method App\\Contracts\\SelfSignupPlanRegistry",
          label: "isSelfSignupGrade",
        }),
        expect.objectContaining({
          detail: "PHPUnit mock method App\\Contracts\\SelfSignupPlanRegistry",
          label: "resolvePlanTier",
        }),
      ]),
    );
    expect(completions.map((item) => item.label)).not.toContain("planCacheKey");
  });

  it("completes Artisan command names", () => {
    const artisanDocument = TextDocument.create(
      "file:///app/app/Http/Controllers/ReportController.php",
      "php",
      1,
      "<?php\nArtisan::call('",
    );
    const scheduleDocument = TextDocument.create(
      "file:///app/routes/console.php",
      "php",
      1,
      "<?php\nSchedule::command('",
    );

    expect(completionsForDocument(artisanDocument, { line: 1, character: 15 }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "Artisan command reports:send-digest {user} Send digest",
          label: "reports:send-digest",
        }),
      ]),
    );
    expect(completionsForDocument(scheduleDocument, { line: 1, character: 19 }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "Artisan command reports:prune {--days=30}",
          label: "reports:prune",
        }),
      ]),
    );
  });

  it("completes route middleware aliases", () => {
    const routeDocument = TextDocument.create(
      "file:///app/routes/web.php",
      "php",
      1,
      "<?php\nRoute::middleware(['",
    );
    const chainedDocument = TextDocument.create(
      "file:///app/routes/web.php",
      "php",
      1,
      "<?php\nRoute::get('/admin')->middleware('",
    );

    expect(completionsForDocument(routeDocument, { line: 1, character: 21 }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "Laravel middleware bootstrap EnsureUserIsSubscribed",
          label: "subscribed",
        }),
      ]),
    );
    expect(completionsForDocument(chainedDocument, { line: 1, character: 35 }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "Laravel middleware kernel ResolveTenant",
          label: "tenant",
        }),
      ]),
    );
  });

  it("completes named route parameter array keys", () => {
    const document = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      "<?php\nroute('users.show', ['",
    );

    expect(completionsForDocument(document, { line: 1, character: 23 }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "Route parameter users.show users/{user}/teams/{team?}",
          label: "user",
        }),
        expect.objectContaining({
          detail: "Route parameter users.show users/{user}/teams/{team?}",
          label: "team",
        }),
      ]),
    );
  });

  it("completes route names in broader route helper contexts", () => {
    const document = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      "<?php\nto_route('",
    );

    expect(completionsForDocument(document, { line: 1, character: 10 }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "Laravel route GET users/{user}/teams/{team?}",
          label: "users.show",
        }),
      ]),
    );
  });

  it("completes macro methods on static class calls", () => {
    const document = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      "<?php\nStr::head",
    );

    expect(completionsForDocument(document, { line: 1, character: 9 }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "Laravel macro Str",
          label: "headlineSlug",
        }),
      ]),
    );
  });

  it("completes Eloquent local scopes on model query calls", () => {
    const staticDocument = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      "<?php\nUser::act",
    );
    const queryDocument = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      "<?php\nUser::query()->pop",
    );

    expect(completionsForDocument(staticDocument, { line: 1, character: 9 }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "Eloquent scope User",
          label: "active",
        }),
      ]),
    );
    expect(completionsForDocument(queryDocument, { line: 1, character: 19 }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "Eloquent scope User",
          label: "popular",
        }),
      ]),
    );
  });

  it("completes custom Eloquent builder methods on query calls", () => {
    const document = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      "<?php\nUser::query()->pop",
    );

    expect(completionsForDocument(document, { line: 1, character: 19 }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "Custom Eloquent builder UserBuilder",
          label: "popularForTenant",
        }),
      ]),
    );
  });

  it("completes Eloquent relationships inside relation string calls", () => {
    const staticDocument = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      "<?php\nUser::with('",
    );
    const queryDocument = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      "<?php\nUser::query()->whereHas('",
    );

    expect(completionsForDocument(staticDocument, { line: 1, character: 12 }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "Eloquent relation User hasMany Post",
          label: "posts",
        }),
      ]),
    );
    expect(completionsForDocument(queryDocument, { line: 1, character: 25 }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "Eloquent relation User hasMany Post",
          label: "posts",
        }),
      ]),
    );
  });

  it("completes factory states and seeder classes", () => {
    const factoryDocument = TextDocument.create(
      "file:///app/database/seeders/DatabaseSeeder.php",
      "php",
      1,
      "<?php\nUser::factory()->sus",
    );
    const seederDocument = TextDocument.create(
      "file:///app/database/seeders/DatabaseSeeder.php",
      "php",
      1,
      "<?php\n$this->call([",
    );

    expect(completionsForDocument(factoryDocument, { line: 1, character: 21 }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "Factory state UserFactory",
          label: "suspended",
        }),
      ]),
    );
    expect(completionsForDocument(seederDocument, { line: 1, character: 14 }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "Seeder calls UserSeeder",
          label: "Database\\Seeders\\DatabaseSeeder",
        }),
      ]),
    );
  });

  it("completes Laravel artifacts in dispatch and class contexts", () => {
    const eventDocument = TextDocument.create(
      "file:///app/app/Http/Controllers/OrderController.php",
      "php",
      1,
      "<?php\nevent(new ",
    );
    const classDocument = TextDocument.create(
      "file:///app/app/Http/Controllers/OrderController.php",
      "php",
      1,
      "<?php\nnew ",
    );

    expect(completionsForDocument(eventDocument, { line: 1, character: 10 }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "Laravel event __construct(Order $order)",
          label: "App\\Events\\OrderShipped",
        }),
      ]),
    );
    expect(completionsForDocument(classDocument, { line: 1, character: 4 }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "Laravel facade reports singleton binding DatabaseReportService",
          label: "App\\Facades\\Reports",
        }),
        expect.objectContaining({
          detail: "Laravel facade auth Illuminate\\Support\\Facades\\Auth",
          label: "Auth",
        }),
        expect.objectContaining({
          detail: "Laravel resource",
          label: "App\\Http\\Resources\\UserResource",
        }),
      ]),
    );
  });

  it("completes service providers inside provider arrays", () => {
    const document = TextDocument.create(
      "file:///app/bootstrap/providers.php",
      "php",
      1,
      "<?php\nreturn [",
    );

    expect(completionsForDocument(document, { line: 1, character: 8 }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "Laravel service provider",
          label: "App\\Providers\\ReportServiceProvider",
        }),
      ]),
    );
  });

  it("completes route controller classes and actions", () => {
    const controllerDocument = TextDocument.create(
      "file:///app/routes/web.php",
      "php",
      1,
      "<?php\nRoute::get('/users', [",
    );
    const actionDocument = TextDocument.create(
      "file:///app/routes/web.php",
      "php",
      1,
      "<?php\nRoute::get('/users', [UserController::class, '",
    );

    expect(completionsForDocument(controllerDocument, { line: 1, character: 23 }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "Laravel controller",
          label: "App\\Http\\Controllers\\UserController",
        }),
      ]),
    );
    expect(completionsForDocument(actionDocument, { line: 1, character: 47 }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "Laravel controller action UserController",
          label: "index",
        }),
      ]),
    );
  });

  it("completes route controller actions through imported aliases", () => {
    const document = TextDocument.create(
      "file:///app/routes/web.php",
      "php",
      1,
      "<?php\nuse App\\Http\\Controllers\\UserController as Users;\nRoute::get('/users', [Users::class, '",
    );

    expect(completionsForDocument(document, { line: 2, character: 37 }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "Laravel controller action UserController",
          label: "index",
        }),
      ]),
    );
  });

  it("completes route controller actions through grouped imported aliases", () => {
    const document = TextDocument.create(
      "file:///app/routes/web.php",
      "php",
      1,
      "<?php\nuse App\\Http\\Controllers\\{UserController as Users};\nRoute::get('/users', [Users::class, '",
    );

    expect(completionsForDocument(document, { line: 2, character: 37 }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "Laravel controller action UserController",
          label: "index",
        }),
      ]),
    );
  });

  it("completes route controller group actions", () => {
    const document = TextDocument.create(
      "file:///app/routes/web.php",
      "php",
      1,
      "<?php\nRoute::controller(UserController::class)->group(function () {\n    Route::get('/users', '",
    );

    expect(completionsForDocument(document, { line: 2, character: 26 }, indexFixture)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "Laravel controller action UserController",
          label: "index",
        }),
      ]),
    );
  });
  it("completes model attributes, relations, and accessors after property access", () => {
    const document = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      "<?php\n$user = User::query()->first();\n$user->",
    );

    const completions = completionsForDocument(document, { line: 2, character: 7 }, indexFixture);
    const labels = completions.map((item) => item.label);
    expect(labels).toEqual(expect.arrayContaining(["email", "team_id", "status", "full_name", "kind_name", "posts", "posts_count"]));
    expect(completions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          detail: "users boolean cast: boolean",
          label: "status",
        }),
        expect.objectContaining({
          detail: "Accessor on User: string",
          label: "full_name",
        }),
        expect.objectContaining({
          detail: "Appended Eloquent attribute on User",
          label: "kind_name",
        }),
      ]),
    );
  });

  it("completes model attributes for type-hinted variables", () => {
    const document = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      "<?php\nfunction show(User $member) {\n    $member->\n}",
    );

    const labels = completionsForDocument(document, { line: 2, character: 13 }, indexFixture).map(
      (item) => item.label,
    );
    expect(labels).toContain("email");
  });

  it("completes schema columns inside Eloquent column arguments", () => {
    const whereDocument = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      "<?php\nUser::where('",
    );
    const orderByDocument = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      "<?php\nUser::query()->latest()->orderBy('",
    );

    for (const [document, character] of [[whereDocument, 13], [orderByDocument, 34]] as const) {
      const labels = completionsForDocument(document, { line: 1, character }, indexFixture).map(
        (item) => item.label,
      );
      expect(labels).toEqual(expect.arrayContaining(["email", "team_id"]));
      expect(labels).not.toContain("where");
    }
  });

  it("completes builder methods, scopes, macros, and soft delete helpers in query chains", () => {
    const document = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      "<?php\nUser::query()->",
    );

    const labels = completionsForDocument(document, { line: 1, character: 15 }, indexFixture).map(
      (item) => item.label,
    );
    expect(labels).toEqual(
      expect.arrayContaining([
        "where",
        "whereKey",
        "whereKeyNot",
        "firstOrFail",
        "active",
        "popular",
        "popularForTenant",
        "whereLike",
        "withTrashed",
      ]),
    );
    expect(labels).not.toContain("headlineSlug");
  });

});

const indexFixture: LaravelIndex = {
  ...emptyIndex(),
  inertiaPages: [
    { filePath: "/app/resources/js/Pages/Users/Index.vue", name: "Users/Index" },
    { filePath: "/app/resources/js/Pages/Dashboard.vue", name: "Dashboard" },
  ],
  livewireComponents: [
    {
      className: "UserCard",
      filePath: "/app/app/Livewire/UserCard.php",
      methods: ["deletePost", "save"],
      name: "user-card",
      namespace: "App\\Livewire",
      properties: ["search", "userId"],
    },
  ],
  configEntries: [
    {
      filePath: "/app/config/filesystems.php",
      key: "filesystems.disks.local.driver",
      range: { end: { character: 0, line: 10 }, start: { character: 0, line: 10 } },
    },
    {
      filePath: "/app/config/filesystems.php",
      key: "filesystems.disks.s3.driver",
      range: { end: { character: 0, line: 20 }, start: { character: 0, line: 20 } },
    },
  ],
  authorization: [
    {
      ability: "publish-posts",
      filePath: "/app/app/Providers/AuthServiceProvider.php",
      model: null,
      policy: null,
      source: "gate",
    },
    {
      ability: "update",
      filePath: "/app/app/Policies/PostPolicy.php",
      model: null,
      policy: "PostPolicy",
      source: "policy",
    },
  ],
  bladeComponents: [
    {
      filePath: "/app/resources/views/components/alert.blade.php",
      name: "alert",
      props: ["message", "type"],
      source: "anonymous",
      viewName: "components.alert",
    },
    {
      filePath: "/app/app/View/Components/Forms/Input.php",
      name: "forms.input",
      props: ["label-text", "required"],
      source: "class",
      viewName: "components.forms.input",
    },
  ],
  bladeViews: [
    {
      components: ["alert"],
      extends: "layouts.app",
      filePath: "/app/resources/views/users/index.blade.php",
      includes: ["users.partials.card"],
      name: "users.index",
      props: [],
      sections: ["content"],
      yields: [],
    },
    {
      components: [],
      extends: null,
      filePath: "/app/resources/views/layouts/app.blade.php",
      includes: [],
      name: "layouts.app",
      props: [],
      sections: [],
      stacks: ["scripts"],
      yields: ["content", "scripts"],
    },
    {
      components: [],
      extends: null,
      filePath: "/app/resources/views/components/alert.blade.php",
      includes: [],
      name: "components.alert",
      props: ["message", "type"],
      sections: [],
      yields: [],
    },
  ],
  configKeys: ["app.name", "services.mailgun", "services.mailgun.domain"],
  commands: [
    {
      className: "SendDigest",
      description: "Send digest",
      filePath: "/app/app/Console/Commands/SendDigest.php",
      name: "reports:send-digest",
      namespace: "App\\Console\\Commands",
      signature: "reports:send-digest {user}",
      source: "class",
    },
    {
      className: null,
      description: null,
      filePath: "/app/routes/console.php",
      name: "reports:prune",
      namespace: null,
      signature: "reports:prune {--days=30}",
      source: "closure",
    },
  ],
  middleware: [
    {
      alias: "subscribed",
      className: "EnsureUserIsSubscribed",
      filePath: "/app/bootstrap/app.php",
      range: { end: { character: 10, line: 5 }, start: { character: 4, line: 5 } },
      source: "bootstrap",
    },
    {
      alias: "tenant",
      className: "ResolveTenant",
      filePath: "/app/app/Http/Kernel.php",
      range: { end: { character: 10, line: 5 }, start: { character: 4, line: 5 } },
      source: "kernel",
    },
  ],
  containerBindings: [
    {
      abstract: "ReportService",
      concrete: "DatabaseReportService",
      filePath: "/app/app/Providers/AppServiceProvider.php",
      lifetime: "singleton",
    },
  ],
  controllers: [
    {
      actions: ["index", "store"],
      className: "UserController",
      filePath: "/app/app/Http/Controllers/UserController.php",
      namespace: "App\\Http\\Controllers",
    },
  ],
  envKeys: [],
  artifacts: [
    {
      className: "OrderShipped",
      constructorSignature: "Order $order",
      filePath: "/app/app/Events/OrderShipped.php",
      kind: "event",
      namespace: "App\\Events",
      related: [],
    },
    {
      className: "UserResource",
      filePath: "/app/app/Http/Resources/UserResource.php",
      kind: "resource",
      namespace: "App\\Http\\Resources",
      related: [],
    },
  ],
  factories: [
    {
      className: "UserFactory",
      definitionFields: ["email", "name"],
      filePath: "/app/database/factories/UserFactory.php",
      model: "User",
      namespace: "Database\\Factories",
      states: ["suspended"],
    },
  ],
  facades: [
    {
      accessor: "reports",
      binding: {
        abstract: "reports",
        concrete: "DatabaseReportService",
        filePath: "/app/app/Providers/AppServiceProvider.php",
        lifetime: "singleton",
      },
      className: "Reports",
      filePath: "/app/app/Facades/Reports.php",
      namespace: "App\\Facades",
    },
    {
      accessor: "auth",
      className: "Auth",
      filePath: "/app/vendor/laravel/framework/src/Illuminate/Support/Facades/Auth.php",
      namespace: null,
      source: "builtIn",
      target: "Illuminate\\Support\\Facades\\Auth",
    },
  ],
  providers: [
    {
      classFilePath: "/app/app/Providers/ReportServiceProvider.php",
      className: "ReportServiceProvider",
      filePath: "/app/app/Providers/ReportServiceProvider.php",
      namespace: "App\\Providers",
      source: "class",
    },
  ],
  macros: [
    {
      className: "Str",
      filePath: "/app/app/Providers/AppServiceProvider.php",
      method: "headlineSlug",
    },
    {
      className: "Builder",
      filePath: "/app/app/Providers/AppServiceProvider.php",
      method: "whereLike",
    },
  ],
  seeders: [
    {
      calls: ["UserSeeder"],
      className: "DatabaseSeeder",
      filePath: "/app/database/seeders/DatabaseSeeder.php",
      namespace: "Database\\Seeders",
    },
  ],
  models: [
    {
      accessorDetails: [
        {
          name: "full_name",
          returnType: "string",
          source: "classic",
        },
      ],
      accessors: ["full_name"],
      appends: ["kind_name"],
      casts: ["status"],
      castDetails: [
        {
          name: "status",
          type: "boolean",
        },
      ],
      className: "User",
      customBuilder: {
        className: "UserBuilder",
        filePath: "/app/app/Models/Builders/UserBuilder.php",
        methods: [
          {
            name: "popularForTenant",
            returnType: "static",
          },
        ],
        namespace: "App\\Models\\Builders",
      },
      filePath: "/app/app/Models/User.php",
      usesSoftDeletes: true,
      fillable: [],
      guarded: [],
      namespace: null,
      relations: [
        {
          name: "posts",
          relatedModel: "Post",
          type: "hasMany",
        },
      ],
      relationships: ["posts"],
      scopes: ["active", "popular"],
      tableName: "users",
    },
  ],
  routes: [
    {
      action: "UserController::class",
      domain: null,
      filePath: "/app/routes/web.php",
      methods: ["GET"],
      middleware: ["web"],
      name: "users.show",
      namePrefix: "",
      range: {
        end: { character: 72, line: 0 },
        start: { character: 0, line: 0 },
      },
      uri: "users/{user}/teams/{team?}",
      uriPrefix: "",
    },
  ],
  schemaTables: [
    {
      columns: [
        {
          filePath: "/app/database/migrations/create_users.php",
          modifiers: ["unique"],
          name: "email",
          tableName: "users",
          type: "string",
        },
        {
          filePath: "/app/database/migrations/create_users.php",
          modifiers: [],
          name: "team_id",
          tableName: "users",
          type: "foreignId",
        },
        {
          filePath: "/app/database/migrations/create_users.php",
          modifiers: [],
          name: "status",
          tableName: "users",
          type: "boolean",
        },
      ],
      filePath: "/app/database/migrations/create_users.php",
      name: "users",
    },
  ],
  translationKeys: [
    {
      filePath: "/app/lang/en/messages.php",
      key: "messages.welcome",
      locale: "en",
      namespace: null,
      source: "php",
    },
    {
      filePath: "/app/lang/en.json",
      key: "Reset Password",
      locale: "en",
      namespace: null,
      source: "json",
    },
  ],
  validationRules: [
    {
      className: "StoreUserRequest",
      fields: [
        { field: "email", rules: ["email", "required"] },
        { field: "profile.name", rules: ["max:255", "nullable", "string"] },
      ],
      filePath: "/app/app/Http/Requests/StoreUserRequest.php",
      namespace: "App\\Http\\Requests",
      source: "formRequest",
    },
  ],
  views: [],
};

const phpunitMockIndex: LaravelIndex = {
  ...emptyIndex(),
  phpClasses: [
    {
      extends: [],
      filePath: "/app/app/Contracts/SelfSignupPlanRegistry.php",
      fqcn: "App\\Contracts\\SelfSignupPlanRegistry",
      implements: [],
      isAbstract: false,
      isFinal: false,
      kind: "class",
      methods: [
        { name: "isSelfSignupGrade", range: { end: { character: 35, line: 6 }, start: { character: 20, line: 6 } }, visibility: "public" as const },
        { name: "fallbackGrade", range: { end: { character: 33, line: 7 }, start: { character: 20, line: 7 } }, visibility: "public" as const },
        { name: "resolvePlanTier", range: { end: { character: 38, line: 8 }, start: { character: 23, line: 8 } }, visibility: "protected" as const },
        { name: "planCacheKey", range: { end: { character: 33, line: 9 }, start: { character: 21, line: 9 } }, visibility: "private" as const },
      ],
      name: "SelfSignupPlanRegistry",
      nameRange: { end: { character: 32, line: 3 }, start: { character: 10, line: 3 } },
      namespace: "App\\Contracts",
    },
  ],
};

// Cursor at the end of `content`; positions are expressed relative to it so
// multi-line fixtures read naturally.
function endPosition(content: string): { character: number; line: number } {
  const lines = content.split("\n");
  return { character: lines[lines.length - 1].length, line: lines.length - 1 };
}

function labelsAt(content: string, uri = "file:///app/app/Http/Controllers/UserController.php"): string[] {
  const document = TextDocument.create(uri, "php", 1, content);
  return completionsForDocument(document, endPosition(content), relationIndex).map((item) => item.label);
}

describe("Eloquent relation, closure, and write-array completions", () => {
  it("completes nested relations through a dotted `with` path", () => {
    const labels = labelsAt("<?php\nUser::with('posts.");
    expect(labels).toEqual(expect.arrayContaining(["comments", "author"]));
    expect(labels).not.toContain("posts");
    expect(labels).not.toContain("title");
  });

  it("keeps completing root relations at the first `with` segment", () => {
    const labels = labelsAt("<?php\nUser::with('");
    expect(labels).toEqual(expect.arrayContaining(["posts", "profile"]));
  });

  it("completes related-model columns inside an arrow-function relation closure", () => {
    const labels = labelsAt("<?php\nUser::whereHas('posts', fn ($q) => $q->where('");
    expect(labels).toEqual(expect.arrayContaining(["title", "body", "user_id"]));
    expect(labels).not.toContain("team_id");
  });

  it("completes related-model columns inside a multi-line closure block", () => {
    const labels = labelsAt(
      "<?php\nUser::whereHas('posts', function ($q) {\n    $q->orderBy('",
    );
    expect(labels).toEqual(expect.arrayContaining(["title", "body"]));
  });

  it("resolves the innermost model across nested relation closures", () => {
    const labels = labelsAt(
      "<?php\nUser::whereHas('posts', fn ($q) => $q->whereHas('comments', fn ($c) => $c->where('",
    );
    expect(labels).toEqual(expect.arrayContaining(["message", "post_id"]));
    expect(labels).not.toContain("title");
  });

  it("resolves dotted relation names for relation closure builders", () => {
    const labels = labelsAt("<?php\nUser::whereHas('posts.comments', fn ($q) => $q->where('");
    expect(labels).toEqual(expect.arrayContaining(["message", "post_id"]));
    expect(labels).not.toContain("title");
  });

  it("completes related-model relations inside a relation closure", () => {
    const labels = labelsAt("<?php\nUser::whereHas('posts', fn ($q) => $q->whereHas('");
    expect(labels).toEqual(expect.arrayContaining(["comments", "author"]));
  });

  it("completes columns through an intermediate relation call", () => {
    const labels = labelsAt("<?php\n$user = new User();\n$user->posts()->orderBy('");
    expect(labels).toEqual(expect.arrayContaining(["title", "body"]));
    expect(labels).not.toContain("team_id");
  });

  it("completes writable columns for a static create array", () => {
    const labels = labelsAt("<?php\nUser::create(['");
    expect(labels).toEqual(expect.arrayContaining(["name", "email", "team_id"]));
  });

  it("completes writable columns for an instance update array with prior keys", () => {
    const labels = labelsAt(
      "<?php\n$user = new User();\n$user->update([\n    'name' => 'x',\n    '",
    );
    expect(labels).toEqual(expect.arrayContaining(["email", "team_id"]));
  });

  it("does not complete columns in a write array value position", () => {
    const labels = labelsAt("<?php\nUser::create(['email' => '");
    expect(labels).not.toContain("team_id");
  });

  it("does not bind a closure variable that is not the closure parameter", () => {
    const labels = labelsAt("<?php\nUser::whereHas('posts', fn ($q) => $other->where('");
    expect(labels).not.toContain("title");
  });

  it("ignores relation closures that appear only inside comments", () => {
    const labels = labelsAt(
      "<?php\n// User::whereHas('posts', fn ($q) => $q->where('x'))\n$q->where('",
    );
    expect(labels).not.toContain("title");
  });
});

const relationIndex: LaravelIndex = {
  ...emptyIndex(),
  models: [
    {
      className: "User",
      filePath: "/app/app/Models/User.php",
      fillable: ["name", "email"],
      guarded: [],
      namespace: "App\\Models",
      relations: [
        { name: "posts", relatedModel: "Post", type: "hasMany" },
        { name: "profile", relatedModel: "Profile", type: "hasOne" },
      ],
      relationships: ["posts", "profile"],
      casts: [],
      scopes: [],
      tableName: "users",
    },
    {
      className: "Post",
      filePath: "/app/app/Models/Post.php",
      fillable: ["title", "body"],
      guarded: [],
      namespace: "App\\Models",
      relations: [
        { name: "comments", relatedModel: "Comment", type: "hasMany" },
        { name: "author", relatedModel: "User", type: "belongsTo" },
      ],
      relationships: ["comments", "author"],
      casts: [],
      scopes: [],
      tableName: "posts",
    },
    {
      className: "Comment",
      filePath: "/app/app/Models/Comment.php",
      fillable: [],
      guarded: [],
      namespace: "App\\Models",
      relations: [],
      relationships: [],
      casts: [],
      scopes: [],
      tableName: "comments",
    },
    {
      className: "Profile",
      filePath: "/app/app/Models/Profile.php",
      fillable: [],
      guarded: [],
      namespace: "App\\Models",
      relations: [],
      relationships: [],
      casts: [],
      scopes: [],
      tableName: "profiles",
    },
  ],
  schemaTables: [
    {
      columns: [
        { filePath: "/app/database/migrations/create_users.php", modifiers: [], name: "name", tableName: "users", type: "string" },
        { filePath: "/app/database/migrations/create_users.php", modifiers: [], name: "email", tableName: "users", type: "string" },
        { filePath: "/app/database/migrations/create_users.php", modifiers: [], name: "team_id", tableName: "users", type: "foreignId" },
      ],
      filePath: "/app/database/migrations/create_users.php",
      name: "users",
    },
    {
      columns: [
        { filePath: "/app/database/migrations/create_posts.php", modifiers: [], name: "title", tableName: "posts", type: "string" },
        { filePath: "/app/database/migrations/create_posts.php", modifiers: [], name: "body", tableName: "posts", type: "text" },
        { filePath: "/app/database/migrations/create_posts.php", modifiers: [], name: "user_id", tableName: "posts", type: "foreignId" },
      ],
      filePath: "/app/database/migrations/create_posts.php",
      name: "posts",
    },
    {
      columns: [
        { filePath: "/app/database/migrations/create_comments.php", modifiers: [], name: "message", tableName: "comments", type: "text" },
        { filePath: "/app/database/migrations/create_comments.php", modifiers: [], name: "post_id", tableName: "comments", type: "foreignId" },
      ],
      filePath: "/app/database/migrations/create_comments.php",
      name: "comments",
    },
  ],
};
