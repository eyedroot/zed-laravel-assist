import { TextDocument } from "vscode-languageserver-textdocument";
import { describe, expect, it } from "vitest";
import { diagnosticsForDocument } from "../src/diagnostics.js";
import { emptyIndex, LaravelIndex } from "../src/projectIndex.js";

describe("Laravel diagnostics", () => {
  it("reports unresolved Laravel string references", () => {
    const document = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      [
        "<?php",
        "route('missing.route');",
        "view('missing.view');",
        "<x-missing-card />",
        "config('missing.key');",
        "env('MISSING_ENV');",
        "__('messages.missing');",
        "Gate::allows('missing-ability');",
        "app('missing.service');",
        "Artisan::call('missing:command');",
        "Route::middleware('missing.middleware');",
        "User::with('missingPosts');",
        "User::missingScope();",
        "class StoreUserController { public function store(StoreUserRequest $request) { $request->validated('emali'); } }",
      ].join("\n"),
    );

    expect(diagnosticsForDocument(document, indexFixture)).toEqual([
      expect.objectContaining({
        data: {
          kind: "route",
          value: "missing.route",
        },
        message: "Unknown Laravel route 'missing.route'.",
        range: { end: { character: 20, line: 1 }, start: { character: 7, line: 1 } },
      }),
      expect.objectContaining({
        message: "Unknown Blade view 'missing.view'.",
        range: { end: { character: 18, line: 2 }, start: { character: 6, line: 2 } },
      }),
      expect.objectContaining({
        data: {
          kind: "component",
          value: "missing-card",
        },
        message: "Unknown Blade component 'missing-card'.",
        range: { end: { character: 15, line: 3 }, start: { character: 3, line: 3 } },
      }),
      expect.objectContaining({
        message: "Unknown Laravel config key 'missing.key'.",
        range: { end: { character: 19, line: 4 }, start: { character: 8, line: 4 } },
      }),
      expect.objectContaining({
        message: "Unknown environment key 'MISSING_ENV'.",
        range: { end: { character: 16, line: 5 }, start: { character: 5, line: 5 } },
      }),
      expect.objectContaining({
        data: {
          kind: "translation",
          value: "messages.missing",
        },
        message: "Unknown translation key 'messages.missing'.",
        range: { end: { character: 20, line: 6 }, start: { character: 4, line: 6 } },
      }),
      expect.objectContaining({
        data: {
          kind: "authorization",
          value: "missing-ability",
        },
        message: "Unknown authorization ability 'missing-ability'.",
        range: { end: { character: 29, line: 7 }, start: { character: 14, line: 7 } },
      }),
      expect.objectContaining({
        data: {
          kind: "container",
          value: "missing.service",
        },
        message: "Unknown container binding 'missing.service'.",
        range: { end: { character: 20, line: 8 }, start: { character: 5, line: 8 } },
      }),
      expect.objectContaining({
        data: {
          kind: "command",
          value: "missing:command",
        },
        message: "Unknown Artisan command 'missing:command'.",
        range: { end: { character: 30, line: 9 }, start: { character: 15, line: 9 } },
      }),
      expect.objectContaining({
        data: {
          kind: "middleware",
          value: "missing.middleware",
        },
        message: "Unknown middleware alias 'missing.middleware'.",
        range: { end: { character: 37, line: 10 }, start: { character: 19, line: 10 } },
      }),
      expect.objectContaining({
        data: {
          kind: "relation",
          model: "User",
          value: "missingPosts",
        },
        message: "Unknown Eloquent relation 'User.missingPosts'.",
        range: { end: { character: 24, line: 11 }, start: { character: 12, line: 11 } },
      }),
      expect.objectContaining({
        data: {
          kind: "scope",
          model: "User",
          value: "missingScope",
        },
        message: "Unknown Eloquent scope 'User.missingScope'.",
        range: { end: { character: 18, line: 12 }, start: { character: 6, line: 12 } },
      }),
      expect.objectContaining({
        data: {
          kind: "validationField",
          value: "emali",
        },
        message: "Unknown validated request field 'emali'.",
        range: { end: { character: 105, line: 13 }, start: { character: 100, line: 13 } },
      }),
    ]);
  });

  it("does not report indexed Laravel string references", () => {
    const document = TextDocument.create(
      "file:///app/resources/views/dashboard.blade.php",
      "blade",
      1,
      [
        "@include('users.index')",
        "<x-forms.input />",
        "<?php route('dashboard');",
        "<?php config('services.mailgun.domain');",
        "<?php env('APP_NAME');",
        "<?php __('messages.welcome');",
        "<?php Gate::allows('publish-posts');",
        "<?php app('reporter');",
        "<?php Artisan::call('users:sync');",
        "<?php Route::middleware('auth.admin');",
        "<?php User::with('posts');",
        "<?php User::active();",
        "<?php User::query()->popularForTenant();",
        "<?php class StoreUserController { public function store(StoreUserRequest $request) { $request->validated('email'); } }",
      ].join("\n"),
    );

    expect(diagnosticsForDocument(document, indexFixture)).toEqual([]);
  });

  it("does not report static model methods or trait scopes as unknown scopes", () => {
    const document = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      [
        "<?php",
        "User::getValueByKey('use_content_encryption');",
        "User::forReference()->get();",
      ].join("\n"),
    );

    expect(diagnosticsForDocument(document, indexFixture)).toEqual([]);
  });

  it("does not report Laravel builder methods as unknown Eloquent scopes", () => {
    const document = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      [
        "<?php",
        "User::whereNull('email')->get();",
        "User::where('email', $email)",
        "    ->where('id', $id)",
        "    ->when($id, function ($query, $id) {",
        "        return $query->where('id', $id);",
        "    })",
        "    ->max('id');",
      ].join("\n"),
    );

    expect(diagnosticsForDocument(document, indexFixture)).toEqual([]);
  });

  it("reports unresolved Blade sections for the extended layout", () => {
    const document = TextDocument.create(
      "file:///app/resources/views/users/index.blade.php",
      "blade",
      1,
      "@section('sidebar')",
    );

    expect(diagnosticsForDocument(document, indexFixture)).toEqual([
      expect.objectContaining({
        data: {
          kind: "bladeSection",
          model: "layouts.app",
          value: "sidebar",
        },
        message: "Unknown Blade section 'layouts.app.sidebar'.",
        range: { end: { character: 17, line: 0 }, start: { character: 10, line: 0 } },
      }),
    ]);
  });

  it("reports unresolved Blade stacks for the extended layout", () => {
    const document = TextDocument.create(
      "file:///app/resources/views/users/index.blade.php",
      "blade",
      1,
      "@push('styles')",
    );

    expect(diagnosticsForDocument(document, indexFixture)).toEqual([
      expect.objectContaining({
        data: {
          kind: "bladeStack",
          model: "layouts.app",
          value: "styles",
        },
        message: "Unknown Blade stack 'layouts.app.styles'.",
        range: { end: { character: 13, line: 0 }, start: { character: 7, line: 0 } },
      }),
    ]);
  });

  it("reports unresolved Blade component props conservatively", () => {
    const document = TextDocument.create(
      "file:///app/resources/views/users/index.blade.php",
      "blade",
      1,
      '<x-forms.input label-tex="Email" class="w-full" />',
    );

    expect(diagnosticsForDocument(document, indexFixture)).toEqual([
      expect.objectContaining({
        data: {
          kind: "componentProp",
          model: "forms.input",
          value: "label-tex",
        },
        message: "Unknown Blade component prop 'forms.input.label-tex'.",
        range: { end: { character: 24, line: 0 }, start: { character: 15, line: 0 } },
      }),
    ]);
  });

  it("reports unresolved named route parameters", () => {
    const document = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      "<?php\nroute('users.show', ['member' => $user]);",
    );

    expect(diagnosticsForDocument(document, indexFixture)).toEqual([
      expect.objectContaining({
        data: {
          kind: "routeParameter",
          model: "users.show",
          value: "member",
        },
        message: "Unknown route parameter 'users.show.member'.",
        range: { end: { character: 28, line: 1 }, start: { character: 22, line: 1 } },
      }),
    ]);
  });

  it("reports unresolved route names in broader route helper contexts", () => {
    const document = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      "<?php\nto_route('missing.route');\nrequest()->routeIs('missing.route');",
    );

    expect(diagnosticsForDocument(document, indexFixture)).toEqual([
      expect.objectContaining({
        data: {
          kind: "route",
          value: "missing.route",
        },
        message: "Unknown Laravel route 'missing.route'.",
        range: { end: { character: 23, line: 1 }, start: { character: 10, line: 1 } },
      }),
      expect.objectContaining({
        data: {
          kind: "route",
          value: "missing.route",
        },
        message: "Unknown Laravel route 'missing.route'.",
        range: { end: { character: 33, line: 2 }, start: { character: 20, line: 2 } },
      }),
    ]);
  });

  it("reports unresolved service provider registrations", () => {
    const document = TextDocument.create(
      "file:///app/bootstrap/providers.php",
      "php",
      1,
      "<?php\nreturn [App\\Providers\\MissingServiceProvider::class];",
    );

    expect(diagnosticsForDocument(document, indexFixture)).toEqual([
      expect.objectContaining({
        data: {
          kind: "serviceProvider",
          value: "App\\Providers\\MissingServiceProvider",
        },
        message: "Unknown service provider 'App\\Providers\\MissingServiceProvider'.",
        range: { end: { character: 44, line: 1 }, start: { character: 8, line: 1 } },
      }),
    ]);
  });

  it("reports unresolved route controller actions", () => {
    const document = TextDocument.create(
      "file:///app/routes/web.php",
      "php",
      1,
      "<?php\nRoute::get('/users', [UserController::class, 'missing']);",
    );

    expect(diagnosticsForDocument(document, indexFixture)).toEqual([
      expect.objectContaining({
        data: {
          kind: "controllerAction",
          model: "UserController",
          value: "missing",
        },
        message: "Unknown controller action 'UserController@missing'.",
        range: { end: { character: 53, line: 1 }, start: { character: 46, line: 1 } },
      }),
    ]);
  });

  it("reports unresolved route controller group actions", () => {
    const document = TextDocument.create(
      "file:///app/routes/web.php",
      "php",
      1,
      "<?php\nRoute::controller(UserController::class)->group(function () {\n    Route::get('/users', 'missing');\n});",
    );

    expect(diagnosticsForDocument(document, indexFixture)).toEqual([
      expect.objectContaining({
        data: {
          kind: "controllerAction",
          model: "UserController",
          value: "missing",
        },
        message: "Unknown controller action 'UserController@missing'.",
        range: { end: { character: 33, line: 2 }, start: { character: 26, line: 2 } },
      }),
    ]);
  });

  it("does not report imported controller aliases", () => {
    const document = TextDocument.create(
      "file:///app/routes/web.php",
      "php",
      1,
      "<?php\nuse App\\Http\\Controllers\\UserController as Users;\nRoute::get('/users', [Users::class, 'index']);",
    );

    expect(diagnosticsForDocument(document, indexFixture)).toEqual([]);
  });

  it("reports unresolved Eloquent model attributes", () => {
    const document = TextDocument.create(
      "file:///app/app/Models/User.php",
      "php",
      1,
      "<?php\nclass User extends Model\n{\n    protected $fillable = ['missing_email'];\n}\n",
    );

    expect(diagnosticsForDocument(document, indexFixture)).toEqual([
      expect.objectContaining({
        data: {
          kind: "modelAttribute",
          tableName: "users",
          value: "missing_email",
        },
        message: "Unknown Eloquent attribute 'users.missing_email'.",
        range: { end: { character: 41, line: 3 }, start: { character: 28, line: 3 } },
      }),
    ]);
  });

  it("reports unresolved schema tables and columns inside validation Rule calls", () => {
    const document = TextDocument.create(
      "file:///app/app/Http/Requests/StoreUserRequest.php",
      "php",
      1,
      "<?php\nRule::exists('userz', 'email');\nRule::unique('users', 'emali');",
    );

    expect(diagnosticsForDocument(document, indexFixture)).toEqual([
      expect.objectContaining({
        data: {
          kind: "schemaTable",
          value: "userz",
        },
        message: "Unknown schema table 'userz'.",
      }),
      expect.objectContaining({
        data: {
          kind: "schemaColumn",
          tableName: "users",
          value: "emali",
        },
        message: "Unknown schema column 'users.emali'.",
      }),
    ]);
  });

  it("reports unresolved factory states", () => {
    const document = TextDocument.create(
      "file:///app/database/seeders/DatabaseSeeder.php",
      "php",
      1,
      "<?php\nUser::factory()->suspneded();\nUser::factory()->count(10)->create();",
    );

    expect(diagnosticsForDocument(document, indexFixture)).toEqual([
      expect.objectContaining({
        data: {
          kind: "factoryState",
          model: "User",
          value: "suspneded",
        },
        message: "Unknown factory state 'User.suspneded'.",
        range: { end: { character: 26, line: 1 }, start: { character: 17, line: 1 } },
      }),
    ]);
  });

  it("reports unresolved seeder class references", () => {
    const document = TextDocument.create(
      "file:///app/database/seeders/DatabaseSeeder.php",
      "php",
      1,
      "<?php\n$this->call([UsrSeeder::class, Database\\Seeders\\UserSeeder::class]);",
    );

    expect(diagnosticsForDocument(document, indexFixture)).toEqual([
      expect.objectContaining({
        data: {
          kind: "seeder",
          value: "UsrSeeder",
        },
        message: "Unknown seeder 'UsrSeeder'.",
        range: { end: { character: 22, line: 1 }, start: { character: 13, line: 1 } },
      }),
    ]);
  });

  it("reports unresolved Inertia pages only when pages are indexed", () => {
    const document = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      [
        "<?php",
        "Inertia::render('Users/Index');",
        "Inertia::render('Users/Missing');",
      ].join("\n"),
    );

    expect(diagnosticsForDocument(document, indexFixture)).toEqual([
      expect.objectContaining({
        data: {
          kind: "inertiaPage",
          value: "Users/Missing",
        },
        message: "Unknown Inertia page 'Users/Missing'.",
        range: { end: { character: 30, line: 2 }, start: { character: 17, line: 2 } },
      }),
    ]);

    expect(diagnosticsForDocument(document, { ...indexFixture, inertiaPages: [] })).toEqual([]);
  });

  it("reports unresolved Livewire components only when components are indexed", () => {
    const document = TextDocument.create(
      "file:///app/resources/views/dashboard.blade.php",
      "blade",
      1,
      [
        "<livewire:user-card />",
        "<livewire:missing-card />",
        "@livewire('missing-card')",
      ].join("\n"),
    );

    expect(diagnosticsForDocument(document, indexFixture)).toEqual([
      expect.objectContaining({
        data: {
          kind: "livewireComponent",
          value: "missing-card",
        },
        message: "Unknown Livewire component 'missing-card'.",
        range: { end: { character: 22, line: 1 }, start: { character: 10, line: 1 } },
      }),
      expect.objectContaining({
        message: "Unknown Livewire component 'missing-card'.",
        range: { end: { character: 23, line: 2 }, start: { character: 11, line: 2 } },
      }),
    ]);

    expect(diagnosticsForDocument(document, { ...indexFixture, livewireComponents: [] })).toEqual([]);
  });

  it("reports policy, request, and resource naming convention mismatches", () => {
    const policyMapDocument = TextDocument.create(
      "file:///app/app/Providers/AuthServiceProvider.php",
      "php",
      1,
      "<?php\nuse App\\Models\\User;\nuse App\\Policies\\AccountPolicy;\nreturn [User::class => AccountPolicy::class];",
    );
    const requestDocument = TextDocument.create(
      "file:///app/app/Http/Requests/StoreMemberRequest.php",
      "php",
      1,
      "<?php\nclass StoreMemberRequest extends FormRequest {}",
    );
    const resourceDocument = TextDocument.create(
      "file:///app/app/Http/Resources/MemberResource.php",
      "php",
      1,
      "<?php\nclass MemberResource extends JsonResource {}",
    );
    const conventionIndex: LaravelIndex = {
      ...indexFixture,
      artifacts: [
        {
          className: "MemberResource",
          filePath: "/app/app/Http/Resources/MemberResource.php",
          kind: "resource",
          namespace: "App\\Http\\Resources",
          related: [],
        },
      ],
      validationRules: [
        ...indexFixture.validationRules,
        {
          className: "StoreMemberRequest",
          fields: [],
          filePath: "/app/app/Http/Requests/StoreMemberRequest.php",
          namespace: "App\\Http\\Requests",
          source: "formRequest",
        },
      ],
    };

    expect(diagnosticsForDocument(policyMapDocument, conventionIndex)).toEqual([
      expect.objectContaining({
        data: {
          kind: "policyConvention",
          model: "User",
          value: "AccountPolicy",
        },
        message: "Policy 'AccountPolicy' does not follow the expected 'UserPolicy' name for model 'User'.",
      }),
    ]);
    expect(diagnosticsForDocument(requestDocument, conventionIndex)).toEqual([
      expect.objectContaining({
        data: {
          kind: "requestConvention",
          model: "Member",
          value: "StoreMemberRequest",
        },
        message: "Form request 'StoreMemberRequest' does not match an indexed model 'Member'.",
      }),
    ]);
    expect(diagnosticsForDocument(resourceDocument, conventionIndex)).toEqual([
      expect.objectContaining({
        data: {
          kind: "resourceConvention",
          model: "Member",
          value: "MemberResource",
        },
        message: "JSON resource 'MemberResource' does not match an indexed model 'Member'.",
      }),
    ]);
  });
});

const indexFixture: LaravelIndex = {
  ...emptyIndex(),
  inertiaPages: [
    { filePath: "/app/resources/js/Pages/Users/Index.vue", name: "Users/Index" },
  ],
  livewireComponents: [
    {
      className: "UserCard",
      filePath: "/app/app/Livewire/UserCard.php",
      methods: ["save"],
      name: "user-card",
      namespace: "App\\Livewire",
      properties: ["search"],
    },
  ],
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
  configKeys: ["services.mailgun.domain"],
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
      signature: "users:sync",
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
      actions: ["index", "store"],
      className: "UserController",
      filePath: "/app/app/Http/Controllers/UserController.php",
      namespace: "App\\Http\\Controllers",
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
      namespace: "App\\Models",
      relations: [
        {
          name: "posts",
          relatedModel: "Post",
          type: "hasMany",
        },
      ],
      relationships: ["posts"],
      scopeDetails: [
        {
          filePath: "/app/app/Models/Concerns/HasReferenceScope.php",
          name: "forReference",
        },
      ],
      scopes: ["active", "forReference"],
      staticMethods: ["getValueByKey"],
      tableName: "users",
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
  validationRules: [
    {
      className: "StoreUserRequest",
      fields: [
        {
          field: "email",
          rules: ["email", "required"],
        },
        {
          field: "name",
          rules: ["required", "string"],
        },
      ],
      filePath: "/app/app/Http/Requests/StoreUserRequest.php",
      namespace: "App\\Http\\Requests",
      source: "formRequest",
    },
  ],
  views: ["users.index"],
};
