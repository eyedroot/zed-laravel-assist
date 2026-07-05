import { TextDocument } from "vscode-languageserver-textdocument";
import { describe, expect, it } from "vitest";
import { hoverForDocument } from "../src/hovers.js";
import { emptyIndex, LaravelIndex } from "../src/projectIndex.js";

describe("Laravel hovers", () => {
  it("shows route metadata", () => {
    const document = TextDocument.create(
      "file:///app/app/Http/Controllers/DashboardController.php",
      "php",
      1,
      "<?php\nroute('dashboard')",
    );

    expect(hoverForDocument(document, { line: 1, character: 10 }, indexFixture)).toEqual({
      contents: {
        kind: "markdown",
        value:
          "**Laravel route** `dashboard`\n- Methods: `GET`\n- URI: `/dashboard`\n- Action: `DashboardController::class`\n- Middleware: `auth`\n- File: `/app/routes/web.php`",
      },
    });
  });

  it("shows route metadata in broader route helper contexts", () => {
    const document = TextDocument.create(
      "file:///app/app/Http/Controllers/DashboardController.php",
      "php",
      1,
      "<?php\nredirect()->route('dashboard')",
    );

    expect(hoverForDocument(document, { line: 1, character: 21 }, indexFixture)).toEqual({
      contents: {
        kind: "markdown",
        value:
          "**Laravel route** `dashboard`\n- Methods: `GET`\n- URI: `/dashboard`\n- Action: `DashboardController::class`\n- Middleware: `auth`\n- File: `/app/routes/web.php`",
      },
    });
  });

  it("shows named route parameter metadata", () => {
    const document = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      "<?php\nroute('users.show', ['team' => $team]);",
    );

    expect(hoverForDocument(document, { line: 1, character: 23 }, indexFixture)).toEqual({
      contents: {
        kind: "markdown",
        value:
          "**Route parameter** `users.show.team`\n- URI: `users/{user}/teams/{team?}`\n- File: `/app/routes/web.php`",
      },
    });
  });

  it("shows view metadata", () => {
    const document = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      "<?php\nview('users.index')",
    );

    expect(hoverForDocument(document, { line: 1, character: 9 }, indexFixture)).toEqual({
      contents: {
        kind: "markdown",
        value:
          "**Laravel view** `users.index`\n- Extends: `layouts.app`\n- Sections: `content`\n- File: `/app/resources/views/users/index.blade.php`",
      },
    });
  });

  it("shows Blade section metadata from the extended layout", () => {
    const document = TextDocument.create(
      "file:///app/resources/views/users/index.blade.php",
      "blade",
      1,
      "@section('content')",
    );

    expect(hoverForDocument(document, { line: 0, character: 12 }, indexFixture)).toEqual({
      contents: {
        kind: "markdown",
        value:
          "**Blade section** `content`\n- Layout: `layouts.app`\n- File: `/app/resources/views/layouts/app.blade.php`",
      },
    });
  });

  it("shows Blade stack metadata from the extended layout", () => {
    const document = TextDocument.create(
      "file:///app/resources/views/users/index.blade.php",
      "blade",
      1,
      "@push('scripts')",
    );

    expect(hoverForDocument(document, { line: 0, character: 10 }, indexFixture)).toEqual({
      contents: {
        kind: "markdown",
        value:
          "**Blade stack** `scripts`\n- Layout: `layouts.app`\n- File: `/app/resources/views/layouts/app.blade.php`",
      },
    });
  });

  it("shows Blade component metadata", () => {
    const document = TextDocument.create(
      "file:///app/resources/views/users/index.blade.php",
      "blade",
      1,
      "<x-forms.input />",
    );

    expect(hoverForDocument(document, { line: 0, character: 5 }, indexFixture)).toEqual({
      contents: {
        kind: "markdown",
        value:
          "**Blade class component** `forms.input`\n- Props: `label-text, required`\n- View: `components.forms.input`\n- File: `/app/app/View/Components/Forms/Input.php`",
      },
    });
  });

  it("shows Blade component prop metadata", () => {
    const document = TextDocument.create(
      "file:///app/resources/views/users/index.blade.php",
      "blade",
      1,
      '<x-forms.input label-text="Email" />',
    );

    expect(hoverForDocument(document, { line: 0, character: 18 }, indexFixture)).toEqual({
      contents: {
        kind: "markdown",
        value:
          "**Blade component prop** `forms.input.label-text`\n- Component: `forms.input`\n- File: `/app/app/View/Components/Forms/Input.php`",
      },
    });
  });

  it("shows config and env metadata", () => {
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

    expect(hoverForDocument(configDocument, { line: 1, character: 11 }, indexFixture)).toEqual({
      contents: {
        kind: "markdown",
        value: "**Laravel config** `services.mailgun.domain`\n- File: `/app/config/services.php`",
      },
    });
    expect(hoverForDocument(envDocument, { line: 1, character: 6 }, indexFixture)).toEqual({
      contents: {
        kind: "markdown",
        value: "**Environment key** `APP_NAME`\n- File: `/app/.env`",
      },
    });
  });

  it("shows broader Laravel string metadata", () => {
    const translationDocument = TextDocument.create(
      "file:///app/resources/views/dashboard.blade.php",
      "blade",
      1,
      "@lang('messages.welcome')",
    );
    const authorizationDocument = TextDocument.create(
      "file:///app/app/Http/Controllers/PostController.php",
      "php",
      1,
      "<?php\nGate::allows('publish-posts')",
    );
    const containerDocument = TextDocument.create(
      "file:///app/app/Http/Controllers/ReportController.php",
      "php",
      1,
      "<?php\napp('reporter')",
    );
    const commandDocument = TextDocument.create(
      "file:///app/routes/console.php",
      "php",
      1,
      "<?php\nArtisan::call('users:sync')",
    );
    const middlewareDocument = TextDocument.create(
      "file:///app/routes/web.php",
      "php",
      1,
      "<?php\nRoute::middleware('auth.admin')",
    );
    const validationDocument = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      "<?php\nclass UserController { public function store(StoreUserRequest $request) { $request->validated('email'); } }",
    );

    expect(hoverForDocument(translationDocument, { line: 0, character: 10 }, indexFixture)).toEqual({
      contents: {
        kind: "markdown",
        value:
          "**Laravel translation** `messages.welcome`\n- Locale: `en`\n- Source: `php`\n- File: `/app/lang/en/messages.php`",
      },
    });
    expect(hoverForDocument(authorizationDocument, { line: 1, character: 16 }, indexFixture)).toEqual({
      contents: {
        kind: "markdown",
        value:
          "**Laravel ability** `publish-posts`\n- Source: `gate`\n- Policy: `PostPolicy`\n- Model: `Post`\n- File: `/app/app/Providers/AuthServiceProvider.php`",
      },
    });
    expect(hoverForDocument(containerDocument, { line: 1, character: 11 }, indexFixture)).toEqual({
      contents: {
        kind: "markdown",
        value:
          "**Container binding** `reporter`\n- Lifetime: `singleton`\n- Concrete: `DatabaseReporter`\n- File: `/app/app/Providers/AppServiceProvider.php`",
      },
    });
    expect(hoverForDocument(commandDocument, { line: 1, character: 18 }, indexFixture)).toEqual({
      contents: {
        kind: "markdown",
        value:
          "**Artisan command** `users:sync`\n- Signature: `users:sync {--force}`\n- Description: `Sync users`\n- Class: `SyncUsersCommand`\n- File: `/app/app/Console/Commands/SyncUsersCommand.php`",
      },
    });
    expect(hoverForDocument(middlewareDocument, { line: 1, character: 22 }, indexFixture)).toEqual({
      contents: {
        kind: "markdown",
        value:
          "**Laravel middleware** `auth.admin`\n- Source: `bootstrap`\n- Class: `App\\Http\\Middleware\\EnsureAdmin`\n- File: `/app/bootstrap/app.php`",
      },
    });
    expect(hoverForDocument(validationDocument, { line: 1, character: 97 }, indexFixture)).toEqual({
      contents: {
        kind: "markdown",
        value:
          "**Validated request field** `email`\n- Rules: `email|required`\n- File: `/app/app/Http/Requests/StoreUserRequest.php`",
      },
    });
  });

  it("shows Eloquent relation, scope, and attribute metadata", () => {
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
      "<?php\nUser::query()->active();",
    );
    const attributeDocument = TextDocument.create(
      "file:///app/app/Models/User.php",
      "php",
      1,
      "<?php\nclass User extends Model\n{\n    protected $fillable = ['email'];\n}\n",
    );

    expect(hoverForDocument(relationDocument, { line: 1, character: 13 }, indexFixture)).toEqual({
      contents: {
        kind: "markdown",
        value:
          "**Eloquent relation** `User.posts`\n- Type: `hasMany`\n- Related: `Post`\n- Table: `users`\n- File: `/app/app/Models/User.php`",
      },
    });
    expect(hoverForDocument(scopeDocument, { line: 1, character: 18 }, indexFixture)).toEqual({
      contents: {
        kind: "markdown",
        value:
          "**Eloquent scope** `User.active`\n- Table: `users`\n- File: `/app/app/Models/User.php`",
      },
    });
    expect(hoverForDocument(attributeDocument, { line: 3, character: 31 }, indexFixture)).toEqual({
      contents: {
        kind: "markdown",
        value:
          "**Eloquent attribute** `users.email`\n- Type: `string`\n- Modifiers: `unique`\n- File: `/app/database/migrations/2024_01_01_000000_create_users_table.php`",
      },
    });
  });

  it("shows schema table and column metadata inside validation Rule calls", () => {
    const source = "<?php\nRule::exists('users', 'email')";
    const line = source.split("\n")[1];
    const document = TextDocument.create(
      "file:///app/app/Http/Requests/StoreUserRequest.php",
      "php",
      1,
      source,
    );

    expect(hoverForDocument(document, { line: 1, character: line.indexOf("users") + 1 }, indexFixture)).toEqual({
      contents: {
        kind: "markdown",
        value:
          "**Schema table** `users`\n- Columns: `email`\n- File: `/app/database/migrations/2024_01_01_000000_create_users_table.php`",
      },
    });
    expect(hoverForDocument(document, { line: 1, character: line.indexOf("email") + 1 }, indexFixture)).toEqual({
      contents: {
        kind: "markdown",
        value:
          "**Schema column** `users.email`\n- Type: `string`\n- Modifiers: `unique`\n- File: `/app/database/migrations/2024_01_01_000000_create_users_table.php`",
      },
    });
  });

  it("shows custom Eloquent builder method metadata", () => {
    const document = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      "<?php\nUser::query()->popularForTenant();",
    );

    expect(hoverForDocument(document, { line: 1, character: 18 }, indexFixture)).toEqual({
      contents: {
        kind: "markdown",
        value:
          "**Custom Eloquent builder method** `User.popularForTenant`\n- Builder: `UserBuilder`\n- Returns: `static`\n- File: `/app/app/Models/Builders/UserBuilder.php`",
      },
    });
  });

  it("shows factory state metadata", () => {
    const document = TextDocument.create(
      "file:///app/database/seeders/DatabaseSeeder.php",
      "php",
      1,
      "<?php\nUser::factory()->suspended();",
    );

    expect(hoverForDocument(document, { line: 1, character: 21 }, indexFixture)).toEqual({
      contents: {
        kind: "markdown",
        value:
          "**Factory state** `User.suspended`\n- Factory: `UserFactory`\n- File: `/app/database/factories/UserFactory.php`",
      },
    });
  });

  it("shows seeder metadata inside seeder calls", () => {
    const document = TextDocument.create(
      "file:///app/database/seeders/DatabaseSeeder.php",
      "php",
      1,
      "<?php\n$this->call([UserSeeder::class]);",
    );

    expect(hoverForDocument(document, { line: 1, character: 15 }, indexFixture)).toEqual({
      contents: {
        kind: "markdown",
        value:
          "**Laravel seeder** `UserSeeder`\n- Namespace: `Database\\Seeders`\n- File: `/app/database/seeders/UserSeeder.php`",
      },
    });
  });

  it("shows macro method metadata", () => {
    const document = TextDocument.create(
      "file:///app/app/Http/Controllers/UserController.php",
      "php",
      1,
      "<?php\nStr::headlineSlug();",
    );

    expect(hoverForDocument(document, { line: 1, character: 8 }, indexFixture)).toEqual({
      contents: {
        kind: "markdown",
        value:
          "**Laravel macro** `Str::headlineSlug`\n- File: `/app/app/Providers/AppServiceProvider.php`",
      },
    });
  });

  it("shows Laravel artifact metadata", () => {
    const document = TextDocument.create(
      "file:///app/app/Http/Controllers/OrderController.php",
      "php",
      1,
      "<?php\nevent(new OrderShipped());",
    );

    expect(hoverForDocument(document, { line: 1, character: 12 }, indexFixture)).toEqual({
      contents: {
        kind: "markdown",
        value:
          "**Laravel event** `App\\Events\\OrderShipped`\n- Related: `SendShipmentNotification`\n- File: `/app/app/Events/OrderShipped.php`",
      },
    });
  });

  it("shows custom facade metadata", () => {
    const document = TextDocument.create(
      "file:///app/app/Http/Controllers/ReportController.php",
      "php",
      1,
      "<?php\nReports::monthly();",
    );

    expect(hoverForDocument(document, { line: 1, character: 2 }, indexFixture)).toEqual({
      contents: {
        kind: "markdown",
        value:
          "**Laravel facade** `App\\Facades\\Reports`\n- Accessor: `reports`\n- Binding: `singleton reports`\n- Concrete: `DatabaseReporter`\n- Binding file: `/app/app/Providers/AppServiceProvider.php`\n- File: `/app/app/Facades/Reports.php`",
      },
    });
  });

  it("shows custom facade metadata through imported aliases", () => {
    const document = TextDocument.create(
      "file:///app/app/Http/Controllers/ReportController.php",
      "php",
      1,
      "<?php\nuse App\\Facades\\Reports as ReportFacade;\nReportFacade::monthly();",
    );

    expect(hoverForDocument(document, { line: 2, character: 2 }, indexFixture)).toEqual({
      contents: {
        kind: "markdown",
        value:
          "**Laravel facade** `App\\Facades\\Reports`\n- Accessor: `reports`\n- Binding: `singleton reports`\n- Concrete: `DatabaseReporter`\n- Binding file: `/app/app/Providers/AppServiceProvider.php`\n- File: `/app/app/Facades/Reports.php`",
      },
    });
  });

  it("shows service provider metadata", () => {
    const document = TextDocument.create(
      "file:///app/bootstrap/providers.php",
      "php",
      1,
      "<?php\nreturn [App\\Providers\\ReportServiceProvider::class];",
    );

    expect(hoverForDocument(document, { line: 1, character: 24 }, indexFixture)).toEqual({
      contents: {
        kind: "markdown",
        value:
          "**Laravel service provider** `App\\Providers\\ReportServiceProvider`\n- Source: `bootstrap`\n- Class file: `/app/app/Providers/ReportServiceProvider.php`\n- Registered in: `/app/bootstrap/providers.php`",
      },
    });
  });

  it("shows route controller metadata", () => {
    const classDocument = TextDocument.create(
      "file:///app/routes/web.php",
      "php",
      1,
      "<?php\nRoute::get('/users', [UserController::class, 'index']);",
    );
    const actionDocument = TextDocument.create(
      "file:///app/routes/web.php",
      "php",
      1,
      "<?php\nRoute::get('/users', [UserController::class, 'index']);",
    );

    expect(hoverForDocument(classDocument, { line: 1, character: 28 }, indexFixture)).toEqual({
      contents: {
        kind: "markdown",
        value:
          "**Laravel controller** `App\\Http\\Controllers\\UserController`\n- Actions: `index, store`\n- File: `/app/app/Http/Controllers/UserController.php`",
      },
    });
    expect(hoverForDocument(actionDocument, { line: 1, character: 50 }, indexFixture)).toEqual({
      contents: {
        kind: "markdown",
        value:
          "**Laravel controller action** `UserController@index`\n- File: `/app/app/Http/Controllers/UserController.php`",
      },
    });
  });

  it("shows route controller group action metadata", () => {
    const document = TextDocument.create(
      "file:///app/routes/web.php",
      "php",
      1,
      "<?php\nRoute::controller(UserController::class)->group(function () {\n    Route::get('/users', 'index');\n});",
    );

    expect(hoverForDocument(document, { line: 2, character: 28 }, indexFixture)).toEqual({
      contents: {
        kind: "markdown",
        value:
          "**Laravel controller action** `UserController@index`\n- File: `/app/app/Http/Controllers/UserController.php`",
      },
    });
  });
});

const indexFixture: LaravelIndex = {
  ...emptyIndex(),
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
      scopes: ["active"],
      tableName: "users",
    },
  ],
  routes: [
    {
      action: "DashboardController::class",
      domain: null,
      filePath: "/app/routes/web.php",
      methods: ["GET"],
      middleware: ["auth"],
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
      ],
      filePath: "/app/app/Http/Requests/StoreUserRequest.php",
      namespace: "App\\Http\\Requests",
      source: "formRequest",
    },
  ],
  artifacts: [
    {
      className: "OrderShipped",
      filePath: "/app/app/Events/OrderShipped.php",
      kind: "event",
      namespace: "App\\Events",
      related: ["SendShipmentNotification"],
    },
  ],
  facades: [
    {
      accessor: "reports",
      binding: {
        abstract: "reports",
        concrete: "DatabaseReporter",
        filePath: "/app/app/Providers/AppServiceProvider.php",
        lifetime: "singleton",
      },
      className: "Reports",
      filePath: "/app/app/Facades/Reports.php",
      namespace: "App\\Facades",
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
  views: ["users.index"],
};
