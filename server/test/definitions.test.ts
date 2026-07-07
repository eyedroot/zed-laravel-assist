import { TextDocument } from "vscode-languageserver-textdocument";
import { describe, expect, it } from "vitest";
import { definitionsForDocument } from "../src/definitions.js";
import { emptyIndex, LaravelIndex } from "../src/projectIndex.js";

describe("Laravel definitions", () => {
  it("resolves named route definitions", () => {
    const document = TextDocument.create(
      "file:///app/app/Http/Controllers/DashboardController.php",
      "php",
      1,
      "<?php\nroute('dashboard')",
    );

    expect(definitionsForDocument(document, { line: 1, character: 10 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 64, line: 0 },
          start: { character: 0, line: 0 },
        },
        uri: "file:///app/routes/web.php",
      },
    ]);
  });

  it("resolves route definitions in broader route helper contexts", () => {
    const cases = [
      { character: 12, source: "<?php\nto_route('dashboard')" },
      { character: 21, source: "<?php\nredirect()->route('dashboard')" },
      { character: 22, source: "<?php\nrequest()->routeIs('dashboard')" },
    ];

    for (const testCase of cases) {
      const document = TextDocument.create(
        "file:///app/app/Http/Controllers/DashboardController.php",
        "php",
        1,
        testCase.source,
      );

      expect(definitionsForDocument(document, { line: 1, character: testCase.character }, indexFixture)).toEqual([
        {
          range: {
            end: { character: 64, line: 0 },
            start: { character: 0, line: 0 },
          },
          uri: "file:///app/routes/web.php",
        },
      ]);
    }
  });

  it("resolves named route parameter definitions", () => {
    const document = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      "<?php\nroute('users.show', ['user' => $user]);",
    );

    expect(definitionsForDocument(document, { line: 1, character: 23 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 72, line: 0 },
          start: { character: 0, line: 0 },
        },
        uri: "file:///app/routes/web.php",
      },
    ]);
  });

  it("resolves view helper and Blade directive definitions", () => {
    const helperDocument = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      "<?php\nview('users.index')",
    );
    const bladeDocument = TextDocument.create(
      "file:///app/resources/views/dashboard.blade.php",
      "blade",
      1,
      "@include('users.index')",
    );

    expect(definitionsForDocument(helperDocument, { line: 1, character: 9 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 0, line: 0 },
          start: { character: 0, line: 0 },
        },
        uri: "file:///app/resources/views/users/index.blade.php",
      },
    ]);
    expect(definitionsForDocument(bladeDocument, { line: 0, character: 13 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 0, line: 0 },
          start: { character: 0, line: 0 },
        },
        uri: "file:///app/resources/views/users/index.blade.php",
      },
    ]);
  });

  it("resolves Blade section definitions to the extended layout", () => {
    const document = TextDocument.create(
      "file:///app/resources/views/users/index.blade.php",
      "blade",
      1,
      "@section('content')",
    );

    expect(definitionsForDocument(document, { line: 0, character: 12 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 0, line: 0 },
          start: { character: 0, line: 0 },
        },
        uri: "file:///app/resources/views/layouts/app.blade.php",
      },
    ]);
  });

  it("resolves Blade stack definitions to the extended layout", () => {
    const document = TextDocument.create(
      "file:///app/resources/views/users/index.blade.php",
      "blade",
      1,
      "@push('scripts')",
    );

    expect(definitionsForDocument(document, { line: 0, character: 10 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 0, line: 0 },
          start: { character: 0, line: 0 },
        },
        uri: "file:///app/resources/views/layouts/app.blade.php",
      },
    ]);
  });

  it("resolves Blade component tag definitions", () => {
    const document = TextDocument.create(
      "file:///app/resources/views/users/index.blade.php",
      "blade",
      1,
      "<x-forms.input />",
    );

    expect(definitionsForDocument(document, { line: 0, character: 5 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 0, line: 0 },
          start: { character: 0, line: 0 },
        },
        uri: "file:///app/app/View/Components/Forms/Input.php",
      },
    ]);
  });

  it("resolves Blade component prop definitions", () => {
    const document = TextDocument.create(
      "file:///app/resources/views/users/index.blade.php",
      "blade",
      1,
      '<x-forms.input label-text="Email" />',
    );

    expect(definitionsForDocument(document, { line: 0, character: 18 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 0, line: 0 },
          start: { character: 0, line: 0 },
        },
        uri: "file:///app/app/View/Components/Forms/Input.php",
      },
    ]);
  });

  it("resolves broader Laravel string definitions", () => {
    const cases = [
      {
        character: 11,
        source: "<?php\n__('messages.welcome')",
        uri: "file:///app/lang/en/messages.php",
      },
      {
        character: 16,
        source: "<?php\nGate::allows('publish-posts')",
        uri: "file:///app/app/Providers/AuthServiceProvider.php",
      },
      {
        character: 11,
        source: "<?php\napp('reporter')",
        uri: "file:///app/app/Providers/AppServiceProvider.php",
      },
      {
        character: 18,
        source: "<?php\nArtisan::call('users:sync')",
        uri: "file:///app/app/Console/Commands/SyncUsersCommand.php",
      },
      {
        character: 22,
        range: {
          end: { character: 10, line: 5 },
          start: { character: 4, line: 5 },
        },
        source: "<?php\nRoute::middleware('auth.admin')",
        uri: "file:///app/bootstrap/app.php",
      },
      {
        character: 97,
        source: "<?php\nclass UserController { public function store(StoreUserRequest $request) { $request->validated('email'); } }",
        uri: "file:///app/app/Http/Requests/StoreUserRequest.php",
      },
    ];

    for (const testCase of cases) {
      const document = TextDocument.create(
        "file:///app/app/Http/Controllers/UserController.php",
        "php",
        1,
        testCase.source,
      );

      expect(definitionsForDocument(document, { line: 1, character: testCase.character }, indexFixture)).toEqual([
        {
          range: testCase.range ?? {
            end: { character: 0, line: 0 },
            start: { character: 0, line: 0 },
          },
          uri: testCase.uri,
        },
      ]);
    }
  });

  it("resolves config and env definitions to indexed source ranges", () => {
    const configDocument = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      "<?php\nconfig('services.mailgun.domain')",
    );
    const envDocument = TextDocument.create(
      "file:///app/config/app.php",
      "php",
      1,
      "<?php\nenv('APP_NAME')",
    );

    expect(definitionsForDocument(configDocument, { line: 1, character: 11 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 18, line: 4 },
          start: { character: 12, line: 4 },
        },
        uri: "file:///app/config/services.php",
      },
    ]);
    expect(definitionsForDocument(envDocument, { line: 1, character: 6 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 8, line: 0 },
          start: { character: 0, line: 0 },
        },
        uri: "file:///app/.env",
      },
    ]);
  });

  it("resolves schema table and column definitions inside validation Rule calls", () => {
    const tableSource = "<?php\nRule::exists('users', 'email')";
    const columnSource = "<?php\nRule::exists('users', 'email')";
    const tableLine = tableSource.split("\n")[1];
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

    expect(definitionsForDocument(tableDocument, { line: 1, character: tableLine.indexOf("users") + 1 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 0, line: 0 },
          start: { character: 0, line: 0 },
        },
        uri: "file:///app/database/migrations/2024_01_01_000000_create_users_table.php",
      },
    ]);
    expect(definitionsForDocument(columnDocument, { line: 1, character: tableLine.indexOf("email") + 1 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 0, line: 0 },
          start: { character: 0, line: 0 },
        },
        uri: "file:///app/database/migrations/2024_01_01_000000_create_users_table.php",
      },
    ]);
  });

  it("resolves Eloquent relation, scope, and attribute definitions", () => {
    const relationDocument = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      "<?php\nUser::with('posts');",
    );
    const scopeDocument = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      "<?php\nUser::active();",
    );
    const attributeDocument = TextDocument.create(
      "file:///app/app/Models/User.php",
      "php",
      1,
      "<?php\nclass User extends Model\n{\n    protected $fillable = ['email'];\n}\n",
    );

    expect(definitionsForDocument(relationDocument, { line: 1, character: 13 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 0, line: 0 },
          start: { character: 0, line: 0 },
        },
        uri: "file:///app/app/Models/User.php",
      },
    ]);
    expect(definitionsForDocument(scopeDocument, { line: 1, character: 8 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 0, line: 0 },
          start: { character: 0, line: 0 },
        },
        uri: "file:///app/app/Models/User.php",
      },
    ]);
    expect(definitionsForDocument(attributeDocument, { line: 3, character: 31 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 0, line: 0 },
          start: { character: 0, line: 0 },
        },
        uri: "file:///app/database/migrations/2024_01_01_000000_create_users_table.php",
      },
    ]);
  });

  it("resolves custom Eloquent builder method definitions", () => {
    const document = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      "<?php\nUser::query()->popularForTenant();",
    );

    expect(definitionsForDocument(document, { line: 1, character: 18 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 0, line: 0 },
          start: { character: 0, line: 0 },
        },
        uri: "file:///app/app/Models/Builders/UserBuilder.php",
      },
    ]);
  });

  it("resolves Laravel builder methods in static model chains", () => {
    const whereNullDocument = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      "<?php\nUser::whereNull('email')->get();",
    );
    const chainDocument = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      [
        "<?php",
        "return User::where('email', $email)",
        "    ->where('id', $id)",
        "    ->when($id, function ($query, $id) {",
        "        return $query->where('id', $id);",
        "    })",
        "    ->max('id');",
      ].join("\n"),
    );

    expect(definitionsForDocument(whereNullDocument, { line: 1, character: 8 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 0, line: 0 },
          start: { character: 0, line: 0 },
        },
        uri: "file:///app/vendor/laravel/framework/src/Illuminate/Database/Query/Builder.php",
      },
    ]);
    expect(definitionsForDocument(chainDocument, { line: 3, character: 8 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 0, line: 0 },
          start: { character: 0, line: 0 },
        },
        uri: "file:///app/vendor/laravel/framework/src/Illuminate/Support/Traits/Conditionable.php",
      },
    ]);
    expect(definitionsForDocument(chainDocument, { line: 6, character: 8 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 0, line: 0 },
          start: { character: 0, line: 0 },
        },
        uri: "file:///app/vendor/laravel/framework/src/Illuminate/Database/Query/Builder.php",
      },
    ]);
  });

  it("resolves model members accessed through the authenticated user", () => {
    const assignedDocument = TextDocument.create(
      "file:///app/app/Http/Middleware/RoleMiddleware.php",
      "php",
      1,
      ["<?php", "$user = Auth::user();", "$userRole = $user->posts()->first();"].join("\n"),
    );
    const chainedDocument = TextDocument.create(
      "file:///app/app/Http/Middleware/RoleMiddleware.php",
      "php",
      1,
      "<?php\nAuth::user()->posts;",
    );
    const docblockDocument = TextDocument.create(
      "file:///app/app/Http/Middleware/RoleMiddleware.php",
      "php",
      1,
      ["<?php", "/** @var \\App\\Models\\User $member */", "$member->posts();"].join("\n"),
    );

    const expected = [
      {
        range: {
          end: { character: 28, line: 42 },
          start: { character: 24, line: 42 },
        },
        uri: "file:///app/app/Models/User.php",
      },
    ];

    expect(definitionsForDocument(assignedDocument, { line: 2, character: 20 }, indexFixture)).toEqual(expected);
    expect(definitionsForDocument(chainedDocument, { line: 1, character: 15 }, indexFixture)).toEqual(expected);
    expect(definitionsForDocument(docblockDocument, { line: 2, character: 10 }, indexFixture)).toEqual(expected);
  });

  it("resolves model property accessors and relation properties", () => {
    const accessorDocument = TextDocument.create(
      "file:///app/app/Http/Middleware/SetLocalePerUser.php",
      "php",
      1,
      ["<?php", "$user = Auth::user();", "app()->setLocale($user->language_code);"].join("\n"),
    );
    const relationPropertyDocument = TextDocument.create(
      "file:///app/app/Models/User.php",
      "php",
      1,
      ["<?php", "class User extends Model", "{", "    public function getLanguageCodeAttribute()", "    {", "        return $this->language->code_2char;", "    }", "}"].join("\n"),
    );

    expect(definitionsForDocument(accessorDocument, { line: 2, character: 24 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 43, line: 54 },
          start: { character: 19, line: 54 },
        },
        uri: "file:///app/app/Models/User.php",
      },
    ]);
    expect(definitionsForDocument(relationPropertyDocument, { line: 5, character: 23 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 28, line: 52 },
          start: { character: 20, line: 52 },
        },
        uri: "file:///app/app/Models/User.php",
      },
    ]);
    expect(definitionsForDocument(relationPropertyDocument, { line: 5, character: 33 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 0, line: 0 },
          start: { character: 0, line: 0 },
        },
        uri: "file:///app/app/Models/Language.php",
      },
    ]);
  });

  it("resolves Laravel relation methods in authenticated user chains", () => {
    const source = [
      "<?php",
      "$user = Auth::user();",
      "$userRole = $user->roles()",
      "    ->wherePivotIn('role_id', $roles->pluck('id'))",
      "    ->first();",
    ].join("\n");
    const document = TextDocument.create(
      "file:///app/app/Http/Middleware/RoleMiddleware.php",
      "php",
      1,
      source,
    );

    expect(definitionsForDocument(document, { line: 3, character: 8 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 0, line: 0 },
          start: { character: 0, line: 0 },
        },
        uri: "file:///app/vendor/laravel/framework/src/Illuminate/Database/Eloquent/Relations/BelongsToMany.php",
      },
    ]);
  });

  it("does not resolve members of untyped variables", () => {
    const document = TextDocument.create(
      "file:///app/app/Http/Middleware/RoleMiddleware.php",
      "php",
      1,
      "<?php\n$mystery->posts();",
    );

    expect(definitionsForDocument(document, { line: 1, character: 11 }, indexFixture)).toEqual([]);
  });

  it("resolves factory state definitions", () => {
    const document = TextDocument.create(
      "file:///app/database/seeders/DatabaseSeeder.php",
      "php",
      1,
      "<?php\nUser::factory()->suspended();",
    );

    expect(definitionsForDocument(document, { line: 1, character: 21 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 0, line: 0 },
          start: { character: 0, line: 0 },
        },
        uri: "file:///app/database/factories/UserFactory.php",
      },
    ]);
  });

  it("resolves seeder class definitions inside seeder calls", () => {
    const document = TextDocument.create(
      "file:///app/database/seeders/DatabaseSeeder.php",
      "php",
      1,
      "<?php\n$this->call([UserSeeder::class, Database\\Seeders\\DatabaseSeeder::class]);",
    );

    expect(definitionsForDocument(document, { line: 1, character: 15 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 0, line: 0 },
          start: { character: 0, line: 0 },
        },
        uri: "file:///app/database/seeders/UserSeeder.php",
      },
    ]);
    expect(definitionsForDocument(document, { line: 1, character: 48 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 0, line: 0 },
          start: { character: 0, line: 0 },
        },
        uri: "file:///app/database/seeders/DatabaseSeeder.php",
      },
    ]);
  });

  it("resolves macro method definitions", () => {
    const document = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      "<?php\nStr::headlineSlug();",
    );

    expect(definitionsForDocument(document, { line: 1, character: 8 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 0, line: 0 },
          start: { character: 0, line: 0 },
        },
        uri: "file:///app/app/Providers/AppServiceProvider.php",
      },
    ]);
  });

  it("resolves Laravel artifact class definitions", () => {
    const eventDocument = TextDocument.create(
      "file:///app/app/Http/Controllers/OrderController.php",
      "php",
      1,
      "<?php\nevent(new OrderShipped());",
    );
    const jobDocument = TextDocument.create(
      "file:///app/app/Http/Controllers/OrderController.php",
      "php",
      1,
      "<?php\nSyncUsers::dispatch();",
    );
    const eventDispatchDocument = TextDocument.create(
      "file:///app/app/Http/Controllers/OrderController.php",
      "php",
      1,
      "<?php\nOrderShipped::dispatch($order);",
    );

    expect(definitionsForDocument(eventDocument, { line: 1, character: 12 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 0, line: 0 },
          start: { character: 0, line: 0 },
        },
        uri: "file:///app/app/Events/OrderShipped.php",
      },
    ]);
    expect(definitionsForDocument(jobDocument, { line: 1, character: 3 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 0, line: 0 },
          start: { character: 0, line: 0 },
        },
        uri: "file:///app/app/Jobs/SyncUsers.php",
      },
    ]);
    expect(definitionsForDocument(eventDispatchDocument, { line: 1, character: 3 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 0, line: 0 },
          start: { character: 0, line: 0 },
        },
        uri: "file:///app/app/Events/OrderShipped.php",
      },
    ]);
  });

  it("resolves custom facade static call definitions", () => {
    const document = TextDocument.create(
      "file:///app/app/Http/Controllers/ReportController.php",
      "php",
      1,
      "<?php\nReports::monthly();",
    );

    expect(definitionsForDocument(document, { line: 1, character: 2 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 0, line: 0 },
          start: { character: 0, line: 0 },
        },
        uri: "file:///app/app/Facades/Reports.php",
      },
    ]);
  });

  it("resolves root facade alias definitions", () => {
    const document = TextDocument.create(
      "file:///app/app/Http/Controllers/ReportController.php",
      "php",
      1,
      "<?php\n\\Auth::check();",
    );

    expect(definitionsForDocument(document, { line: 1, character: 2 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 0, line: 0 },
          start: { character: 0, line: 0 },
        },
        uri: "file:///app/vendor/laravel/framework/src/Illuminate/Support/Facades/Auth.php",
      },
    ]);
  });

  it("resolves service provider registration definitions", () => {
    const document = TextDocument.create(
      "file:///app/bootstrap/providers.php",
      "php",
      1,
      "<?php\nreturn [App\\Providers\\ReportServiceProvider::class];",
    );

    expect(definitionsForDocument(document, { line: 1, character: 24 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 0, line: 0 },
          start: { character: 0, line: 0 },
        },
        uri: "file:///app/app/Providers/ReportServiceProvider.php",
      },
    ]);
  });

  it("resolves route controller and action definitions", () => {
    const document = TextDocument.create(
      "file:///app/routes/web.php",
      "php",
      1,
      "<?php\nRoute::get('/users', [UserController::class, 'index']);",
    );

    expect(definitionsForDocument(document, { line: 1, character: 28 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 0, line: 0 },
          start: { character: 0, line: 0 },
        },
        uri: "file:///app/app/Http/Controllers/UserController.php",
      },
    ]);
    expect(definitionsForDocument(document, { line: 1, character: 50 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 25, line: 4 },
          start: { character: 20, line: 4 },
        },
        uri: "file:///app/app/Http/Controllers/UserController.php",
      },
    ]);
  });

  it("resolves legacy string route actions to the controller class and method", () => {
    const document = TextDocument.create(
      "file:///app/modules/Console/router.php",
      "php",
      1,
      "<?php\nRoute::post('/', 'WorkspaceController@store');",
    );

    expect(definitionsForDocument(document, { line: 1, character: 22 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 0, line: 0 },
          start: { character: 0, line: 0 },
        },
        uri: "file:///app/modules/Console/Controllers/Workspace/WorkspaceController.php",
      },
    ]);
    expect(definitionsForDocument(document, { line: 1, character: 40 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 24, line: 12 },
          start: { character: 19, line: 12 },
        },
        uri: "file:///app/modules/Console/Controllers/Workspace/WorkspaceController.php",
      },
    ]);
  });

  it("resolves namespaced legacy string route actions", () => {
    const document = TextDocument.create(
      "file:///app/modules/Console/router.php",
      "php",
      1,
      "<?php\nRoute::post('/', 'Workspace\\\\WorkspaceController@store');",
    );

    expect(definitionsForDocument(document, { line: 1, character: 30 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 0, line: 0 },
          start: { character: 0, line: 0 },
        },
        uri: "file:///app/modules/Console/Controllers/Workspace/WorkspaceController.php",
      },
    ]);
  });

  it("resolves middleware aliases with parameters and in later array elements", () => {
    const document = TextDocument.create(
      "file:///app/routes/web.php",
      "php",
      1,
      "<?php\nRoute::middleware(['auth.admin:strict', 'auth.admin'])->group(function () {});",
    );

    const expected = [
      {
        range: {
          end: { character: 10, line: 5 },
          start: { character: 4, line: 5 },
        },
        uri: "file:///app/bootstrap/app.php",
      },
    ];
    expect(definitionsForDocument(document, { line: 1, character: 25 }, indexFixture)).toEqual(expected);
    expect(definitionsForDocument(document, { line: 1, character: 45 }, indexFixture)).toEqual(expected);
  });

  it("resolves route controller aliases", () => {
    const document = TextDocument.create(
      "file:///app/routes/web.php",
      "php",
      1,
      "<?php\nuse App\\Http\\Controllers\\UserController as Users;\nRoute::get('/users', [Users::class, 'index']);",
    );

    expect(definitionsForDocument(document, { line: 2, character: 24 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 0, line: 0 },
          start: { character: 0, line: 0 },
        },
        uri: "file:///app/app/Http/Controllers/UserController.php",
      },
    ]);
    expect(definitionsForDocument(document, { line: 2, character: 38 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 25, line: 4 },
          start: { character: 20, line: 4 },
        },
        uri: "file:///app/app/Http/Controllers/UserController.php",
      },
    ]);
  });

  it("resolves route controller group action definitions", () => {
    const document = TextDocument.create(
      "file:///app/routes/web.php",
      "php",
      1,
      "<?php\nRoute::controller(UserController::class)->group(function () {\n    Route::get('/users', 'index');\n});",
    );

    expect(definitionsForDocument(document, { line: 2, character: 28 }, indexFixture)).toEqual([
      {
        range: {
          end: { character: 25, line: 4 },
          start: { character: 20, line: 4 },
        },
        uri: "file:///app/app/Http/Controllers/UserController.php",
      },
    ]);
  });
});

const indexFixture: LaravelIndex = {
  ...emptyIndex(),
  authUserModel: "App\\Models\\User",
  bladeComponents: [
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
      components: [],
      extends: "layouts.app",
      filePath: "/app/resources/views/users/index.blade.php",
      includes: [],
      name: "users.index",
      props: [],
      sections: [],
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
  ],
  routes: [
    {
      action: "DashboardController::class",
      domain: null,
      filePath: "/app/routes/web.php",
      methods: ["GET"],
      middleware: [],
      name: "dashboard",
      namePrefix: "",
      range: {
        end: { character: 64, line: 0 },
        start: { character: 0, line: 0 },
      },
      uri: "/dashboard",
      uriPrefix: "",
    },
    {
      action: "UserController::class",
      domain: null,
      filePath: "/app/routes/web.php",
      methods: ["GET"],
      middleware: [],
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
  authorization: [
    {
      ability: "publish-posts",
      filePath: "/app/app/Providers/AuthServiceProvider.php",
      model: "Post",
      policy: "PostPolicy",
      source: "gate",
    },
  ],
  commands: [
    {
      className: "SyncUsersCommand",
      description: "Sync users",
      filePath: "/app/app/Console/Commands/SyncUsersCommand.php",
      name: "users:sync",
      namespace: "App\\Console\\Commands",
      signature: "users:sync {--force}",
      source: "class",
    },
  ],
  containerBindings: [
    {
      abstract: "reporter",
      concrete: "DatabaseReporter",
      filePath: "/app/app/Providers/AppServiceProvider.php",
      lifetime: "singleton",
    },
  ],
  controllers: [
    {
      actionDetails: [
        {
          name: "index",
          range: {
            end: { character: 25, line: 4 },
            start: { character: 20, line: 4 },
          },
        },
        {
          name: "store",
          range: {
            end: { character: 25, line: 8 },
            start: { character: 20, line: 8 },
          },
        },
      ],
      actions: ["index", "store"],
      className: "UserController",
      filePath: "/app/app/Http/Controllers/UserController.php",
      namespace: "App\\Http\\Controllers",
    },
    {
      actionDetails: [
        {
          name: "store",
          range: {
            end: { character: 24, line: 12 },
            start: { character: 19, line: 12 },
          },
        },
      ],
      actions: ["index", "store"],
      className: "WorkspaceController",
      filePath: "/app/modules/Console/Controllers/Workspace/WorkspaceController.php",
      namespace: "Modules\\Console\\Controllers\\Workspace",
    },
  ],
  middleware: [
    {
      alias: "auth.admin",
      className: "App\\Http\\Middleware\\EnsureAdmin",
      filePath: "/app/bootstrap/app.php",
      range: { end: { character: 10, line: 5 }, start: { character: 4, line: 5 } },
      source: "bootstrap",
    },
  ],
  models: [
    {
      casts: ["use_language"],
      className: "Language",
      filePath: "/app/app/Models/Language.php",
      fillable: ["code_2char", "english_name", "use_language"],
      guarded: [],
      namespace: "App\\Models",
      relations: [],
      relationships: [],
      scopes: [],
      tableName: "languages",
    },
    {
      casts: [],
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
      fillable: ["email"],
      guarded: [],
      accessorDetails: [
        {
          name: "language_code",
          range: { end: { character: 43, line: 54 }, start: { character: 19, line: 54 } },
          returnType: "string",
          source: "classic",
        },
      ],
      accessors: ["language_code"],
      methodDetails: [
        {
          name: "posts",
          range: { end: { character: 28, line: 42 }, start: { character: 24, line: 42 } },
        },
        {
          name: "language",
          range: { end: { character: 28, line: 52 }, start: { character: 20, line: 52 } },
        },
        {
          name: "roles",
          range: { end: { character: 28, line: 48 }, start: { character: 24, line: 48 } },
        },
      ],
      namespace: "App\\Models",
      relations: [
        {
          name: "posts",
          relatedModel: "Post",
          type: "hasMany",
        },
        {
          name: "language",
          relatedModel: "Language",
          type: "belongsTo",
        },
        {
          name: "roles",
          relatedModel: "Role",
          type: "belongsToMany",
        },
      ],
      relationships: ["language", "posts", "roles"],
      scopes: ["active"],
      tableName: "users",
    },
  ],
  schemaTables: [
    {
      columns: [
        {
          filePath: "/app/database/migrations/2024_01_01_000000_create_users_table.php",
          modifiers: ["unique"],
          name: "email",
          tableName: "users",
          type: "string",
        },
      ],
      filePath: "/app/database/migrations/2024_01_01_000000_create_users_table.php",
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
  ],
  configEntries: [
    {
      filePath: "/app/config/services.php",
      key: "services.mailgun.domain",
      range: {
        end: { character: 18, line: 4 },
        start: { character: 12, line: 4 },
      },
    },
  ],
  configKeys: ["services.mailgun.domain"],
  envEntries: [
    {
      filePath: "/app/.env",
      key: "APP_NAME",
      range: {
        end: { character: 8, line: 0 },
        start: { character: 0, line: 0 },
      },
    },
  ],
  envKeys: ["APP_NAME"],
  factories: [
    {
      className: "UserFactory",
      definitionFields: ["email"],
      filePath: "/app/database/factories/UserFactory.php",
      model: "User",
      namespace: "Database\\Factories",
      states: ["suspended"],
    },
  ],
  seeders: [
    {
      calls: ["UserSeeder"],
      className: "DatabaseSeeder",
      filePath: "/app/database/seeders/DatabaseSeeder.php",
      namespace: "Database\\Seeders",
    },
    {
      calls: [],
      className: "UserSeeder",
      filePath: "/app/database/seeders/UserSeeder.php",
      namespace: "Database\\Seeders",
    },
  ],
  macros: [
    {
      className: "Str",
      filePath: "/app/app/Providers/AppServiceProvider.php",
      method: "headlineSlug",
    },
  ],
  artifacts: [
    {
      className: "OrderShipped",
      filePath: "/app/app/Events/OrderShipped.php",
      kind: "event",
      namespace: "App\\Events",
      related: [],
    },
    {
      className: "SyncUsers",
      filePath: "/app/app/Jobs/SyncUsers.php",
      kind: "job",
      namespace: "App\\Jobs",
      related: [],
    },
  ],
  facades: [
    {
      accessor: "reports",
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
      filePath: "/app/bootstrap/providers.php",
      namespace: "App\\Providers",
      source: "bootstrap",
    },
  ],
  validationRules: [
    {
      className: "StoreUserRequest",
      fields: [
        {
          field: "email",
          rules: ["email", "required"],
        },
      ],
      filePath: "/app/app/Http/Requests/StoreUserRequest.php",
      namespace: "App\\Http\\Requests",
      source: "formRequest",
    },
  ],
  views: ["users.index"],
};
