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
          detail: "Schema table 2 columns",
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
          detail: "Laravel event",
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
});

const indexFixture: LaravelIndex = {
  ...emptyIndex(),
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
      source: "bootstrap",
    },
    {
      alias: "tenant",
      className: "ResolveTenant",
      filePath: "/app/app/Http/Kernel.php",
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
