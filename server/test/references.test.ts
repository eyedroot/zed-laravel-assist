import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { TextDocument } from "vscode-languageserver-textdocument";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { emptyIndex, LaravelIndex } from "../src/projectIndex.js";
import { referencesForDocument } from "../src/references.js";

describe("Laravel references", () => {
  let rootPath: string;
  let controllerPath: string;
  let bladePath: string;
  let layoutPath: string;
  let routePath: string;
  let componentPath: string;
  let providerPath: string;
  let consolePath: string;
  let langPath: string;
  let bootstrapPath: string;
  let providersPath: string;
  let modelPath: string;
  let migrationPath: string;
  let requestPath: string;
  let factoryPath: string;
  let databaseSeederPath: string;
  let userSeederPath: string;
  let eventPath: string;
  let jobPath: string;
  let facadePath: string;
  let builderPath: string;

  beforeEach(async () => {
    rootPath = await mkdtemp(path.join(tmpdir(), "laravel-assist-references-"));
    controllerPath = path.join(rootPath, "app/Http/Controllers/UserController.php");
    bladePath = path.join(rootPath, "resources/views/users/index.blade.php");
    layoutPath = path.join(rootPath, "resources/views/layouts/app.blade.php");
    routePath = path.join(rootPath, "routes/web.php");
    componentPath = path.join(rootPath, "app/View/Components/Forms/Input.php");
    providerPath = path.join(rootPath, "app/Providers/AppServiceProvider.php");
    consolePath = path.join(rootPath, "routes/console.php");
    langPath = path.join(rootPath, "lang/en/messages.php");
    bootstrapPath = path.join(rootPath, "bootstrap/app.php");
    providersPath = path.join(rootPath, "bootstrap/providers.php");
    modelPath = path.join(rootPath, "app/Models/User.php");
    migrationPath = path.join(rootPath, "database/migrations/2024_01_01_000000_create_users_table.php");
    requestPath = path.join(rootPath, "app/Http/Requests/StoreUserRequest.php");
    factoryPath = path.join(rootPath, "database/factories/UserFactory.php");
    databaseSeederPath = path.join(rootPath, "database/seeders/DatabaseSeeder.php");
    userSeederPath = path.join(rootPath, "database/seeders/UserSeeder.php");
    eventPath = path.join(rootPath, "app/Events/OrderShipped.php");
    jobPath = path.join(rootPath, "app/Jobs/SyncUsers.php");
    facadePath = path.join(rootPath, "app/Facades/Reports.php");
    builderPath = path.join(rootPath, "app/Models/Builders/UserBuilder.php");

    await mkdir(path.dirname(controllerPath), { recursive: true });
    await mkdir(path.dirname(bladePath), { recursive: true });
    await mkdir(path.dirname(layoutPath), { recursive: true });
    await mkdir(path.dirname(routePath), { recursive: true });
    await mkdir(path.dirname(componentPath), { recursive: true });
    await mkdir(path.dirname(providerPath), { recursive: true });
    await mkdir(path.dirname(consolePath), { recursive: true });
    await mkdir(path.dirname(langPath), { recursive: true });
    await mkdir(path.dirname(bootstrapPath), { recursive: true });
    await mkdir(path.dirname(providersPath), { recursive: true });
    await mkdir(path.dirname(modelPath), { recursive: true });
    await mkdir(path.dirname(migrationPath), { recursive: true });
    await mkdir(path.dirname(requestPath), { recursive: true });
    await mkdir(path.dirname(factoryPath), { recursive: true });
    await mkdir(path.dirname(databaseSeederPath), { recursive: true });
    await mkdir(path.dirname(eventPath), { recursive: true });
    await mkdir(path.dirname(jobPath), { recursive: true });
    await mkdir(path.dirname(facadePath), { recursive: true });
    await mkdir(path.dirname(builderPath), { recursive: true });

    await writeFile(routePath, "<?php\nRoute::get('/dashboard', DashboardController::class)->name('dashboard');");
    await writeFile(
      controllerPath,
      "<?php\nroute('dashboard');\nreturn view('users.index');",
    );
    await writeFile(
      bladePath,
      "@include('users.index')\n<x-forms.input />\n<x-forms:input />",
    );
    await writeFile(layoutPath, "@yield('content')\n@yield('scripts')");
    await writeFile(componentPath, "<?php\nclass Input {}\n");
    await writeFile(
      providerPath,
      "<?php\napp('reporter');\nGate::allows('publish-posts');\nconfig('services.mailgun.domain');\nenv('APP_NAME');",
    );
    await writeFile(consolePath, "<?php\nArtisan::call('users:sync');");
    await writeFile(langPath, "<?php\nreturn ['welcome' => 'Welcome'];");
    await writeFile(bootstrapPath, "<?php\nRoute::middleware('auth.admin');");
    await writeFile(providersPath, "<?php\nreturn [App\\Providers\\AppServiceProvider::class];");
    await writeFile(modelPath, "<?php\nclass User extends Model\n{\n    protected $fillable = ['email'];\n}\n");
    await writeFile(builderPath, "<?php\nclass UserBuilder extends Builder\n{\n    public function popularForTenant(): static { return $this; }\n}\n");
    await writeFile(migrationPath, "<?php\nSchema::create('users', fn ($table) => $table->string('email')->unique());");
    await writeFile(requestPath, "<?php\nclass StoreUserRequest extends FormRequest\n{\n    public function rules(): array { return ['email' => ['required', 'email']]; }\n}\n");
    await writeFile(factoryPath, "<?php\nclass UserFactory extends Factory\n{\n    public function suspended(): static { return $this->state(fn () => []); }\n}\n");
    await writeFile(databaseSeederPath, "<?php\n$this->call([UserSeeder::class]);");
    await writeFile(userSeederPath, "<?php\nclass UserSeeder extends Seeder {}\n");
    await writeFile(eventPath, "<?php\nclass OrderShipped {}\n");
    await writeFile(jobPath, "<?php\nclass SyncUsers {}\n");
    await writeFile(facadePath, "<?php\nclass Reports extends Facade {}\n");
  });

  afterEach(async () => {
    await rm(rootPath, { force: true, recursive: true });
  });

  it("finds route references in the current document", async () => {
    const document = TextDocument.create(
      pathToFileURL(controllerPath).toString(),
      "php",
      1,
      "<?php\nroute('dashboard');",
    );

    await expect(referencesForDocument(document, { line: 1, character: 10 }, indexFixture())).resolves.toEqual([
      {
        range: {
          end: { character: 16, line: 1 },
          start: { character: 7, line: 1 },
        },
        uri: pathToFileURL(controllerPath).toString(),
      },
    ]);
  });

  it("finds route references in broader route helper contexts", async () => {
    await writeFile(routePath, "<?php\nredirect()->route('dashboard');");
    const document = TextDocument.create(
      pathToFileURL(controllerPath).toString(),
      "php",
      1,
      "<?php\nto_route('dashboard');\nrequest()->routeIs('dashboard');",
    );

    await expect(referencesForDocument(document, { line: 1, character: 12 }, indexFixture())).resolves.toEqual([
      {
        range: {
          end: { character: 19, line: 1 },
          start: { character: 10, line: 1 },
        },
        uri: pathToFileURL(controllerPath).toString(),
      },
      {
        range: {
          end: { character: 29, line: 2 },
          start: { character: 20, line: 2 },
        },
        uri: pathToFileURL(controllerPath).toString(),
      },
      {
        range: {
          end: { character: 28, line: 1 },
          start: { character: 19, line: 1 },
        },
        uri: pathToFileURL(routePath).toString(),
      },
    ]);
  });

  it("finds named route parameter references across indexed files", async () => {
    const source = [
      "<?php",
      "route('users.show', ['user' => $user]);",
      "route('users.show', ['team' => $team, 'user' => $user]);",
    ].join("\n");
    await writeFile(controllerPath, source);
    const document = TextDocument.create(pathToFileURL(controllerPath).toString(), "php", 1, source);

    await expect(referencesForDocument(document, { line: 1, character: 23 }, indexFixture())).resolves.toEqual([
      {
        range: {
          end: { character: 26, line: 1 },
          start: { character: 22, line: 1 },
        },
        uri: pathToFileURL(controllerPath).toString(),
      },
      {
        range: {
          end: { character: 43, line: 2 },
          start: { character: 39, line: 2 },
        },
        uri: pathToFileURL(controllerPath).toString(),
      },
    ]);
  });

  it("finds view references across indexed files", async () => {
    const document = TextDocument.create(
      pathToFileURL(controllerPath).toString(),
      "php",
      1,
      "<?php\nreturn view('users.index');",
    );

    await expect(referencesForDocument(document, { line: 1, character: 16 }, indexFixture())).resolves.toEqual([
      {
        range: {
          end: { character: 24, line: 1 },
          start: { character: 13, line: 1 },
        },
        uri: pathToFileURL(controllerPath).toString(),
      },
      {
        range: {
          end: { character: 21, line: 0 },
          start: { character: 10, line: 0 },
        },
        uri: pathToFileURL(bladePath).toString(),
      },
    ]);
  });

  it("finds Blade component tag references with dot and colon names", async () => {
    const document = TextDocument.create(
      pathToFileURL(bladePath).toString(),
      "blade",
      1,
      "<x-forms.input />\n<x-forms:input />",
    );

    await expect(referencesForDocument(document, { line: 0, character: 5 }, indexFixture())).resolves.toEqual([
      {
        range: {
          end: { character: 14, line: 0 },
          start: { character: 3, line: 0 },
        },
        uri: pathToFileURL(bladePath).toString(),
      },
      {
        range: {
          end: { character: 14, line: 1 },
          start: { character: 3, line: 1 },
        },
        uri: pathToFileURL(bladePath).toString(),
      },
    ]);
  });

  it("finds Blade component prop references with dot and colon component names", async () => {
    const source = '<x-forms.input label-text="Email" />\n<x-forms:input :label-text="$label" />';
    await writeFile(bladePath, source);
    const document = TextDocument.create(pathToFileURL(bladePath).toString(), "blade", 1, source);

    await expect(referencesForDocument(document, { line: 0, character: 18 }, indexFixture())).resolves.toEqual([
      {
        range: {
          end: { character: 25, line: 0 },
          start: { character: 15, line: 0 },
        },
        uri: pathToFileURL(bladePath).toString(),
      },
      {
        range: {
          end: { character: 26, line: 1 },
          start: { character: 16, line: 1 },
        },
        uri: pathToFileURL(bladePath).toString(),
      },
    ]);
  });

  it("finds Blade section references scoped to the extended layout", async () => {
    const source = "@extends('layouts.app')\n@section('content')\n@section('content')";
    await writeFile(bladePath, source);
    const document = TextDocument.create(pathToFileURL(bladePath).toString(), "blade", 1, source);

    await expect(referencesForDocument(document, { line: 1, character: 12 }, indexFixture())).resolves.toEqual([
      {
        range: {
          end: { character: 17, line: 1 },
          start: { character: 10, line: 1 },
        },
        uri: pathToFileURL(bladePath).toString(),
      },
      {
        range: {
          end: { character: 17, line: 2 },
          start: { character: 10, line: 2 },
        },
        uri: pathToFileURL(bladePath).toString(),
      },
    ]);
  });

  it("finds Blade stack references scoped to the extended layout", async () => {
    const source = "@extends('layouts.app')\n@push('scripts')\n@prepend('scripts')";
    await writeFile(bladePath, source);
    const document = TextDocument.create(pathToFileURL(bladePath).toString(), "blade", 1, source);

    await expect(referencesForDocument(document, { line: 1, character: 10 }, indexFixture())).resolves.toEqual([
      {
        range: {
          end: { character: 14, line: 1 },
          start: { character: 7, line: 1 },
        },
        uri: pathToFileURL(bladePath).toString(),
      },
      {
        range: {
          end: { character: 17, line: 2 },
          start: { character: 10, line: 2 },
        },
        uri: pathToFileURL(bladePath).toString(),
      },
    ]);
  });

  it("finds broader Laravel string references across indexed files", async () => {
    const document = TextDocument.create(
      pathToFileURL(controllerPath).toString(),
      "php",
      1,
      [
        "<?php",
        "__('messages.welcome');",
        "Gate::allows('publish-posts');",
        "app('reporter');",
        "Artisan::call('users:sync');",
        "Route::middleware('auth.admin');",
        "config('services.mailgun.domain');",
        "env('APP_NAME');",
      ].join("\n"),
    );

    await expect(referencesForDocument(document, { line: 1, character: 8 }, indexFixture())).resolves.toEqual([
      {
        range: {
          end: { character: 20, line: 1 },
          start: { character: 4, line: 1 },
        },
        uri: pathToFileURL(controllerPath).toString(),
      },
    ]);
    await expect(referencesForDocument(document, { line: 2, character: 16 }, indexFixture())).resolves.toEqual([
      {
        range: {
          end: { character: 27, line: 2 },
          start: { character: 14, line: 2 },
        },
        uri: pathToFileURL(controllerPath).toString(),
      },
      {
        range: {
          end: { character: 27, line: 2 },
          start: { character: 14, line: 2 },
        },
        uri: pathToFileURL(providerPath).toString(),
      },
    ]);
    await expect(referencesForDocument(document, { line: 3, character: 8 }, indexFixture())).resolves.toEqual([
      {
        range: {
          end: { character: 13, line: 3 },
          start: { character: 5, line: 3 },
        },
        uri: pathToFileURL(controllerPath).toString(),
      },
      {
        range: {
          end: { character: 13, line: 1 },
          start: { character: 5, line: 1 },
        },
        uri: pathToFileURL(providerPath).toString(),
      },
    ]);
    await expect(referencesForDocument(document, { line: 4, character: 18 }, indexFixture())).resolves.toEqual([
      {
        range: {
          end: { character: 25, line: 4 },
          start: { character: 15, line: 4 },
        },
        uri: pathToFileURL(controllerPath).toString(),
      },
      {
        range: {
          end: { character: 25, line: 1 },
          start: { character: 15, line: 1 },
        },
        uri: pathToFileURL(consolePath).toString(),
      },
    ]);
    await expect(referencesForDocument(document, { line: 5, character: 22 }, indexFixture())).resolves.toEqual([
      {
        range: {
          end: { character: 29, line: 5 },
          start: { character: 19, line: 5 },
        },
        uri: pathToFileURL(controllerPath).toString(),
      },
      {
        range: {
          end: { character: 29, line: 1 },
          start: { character: 19, line: 1 },
        },
        uri: pathToFileURL(bootstrapPath).toString(),
      },
    ]);
    await expect(referencesForDocument(document, { line: 6, character: 11 }, indexFixture())).resolves.toEqual([
      {
        range: {
          end: { character: 31, line: 6 },
          start: { character: 8, line: 6 },
        },
        uri: pathToFileURL(controllerPath).toString(),
      },
      {
        range: {
          end: { character: 31, line: 3 },
          start: { character: 8, line: 3 },
        },
        uri: pathToFileURL(providerPath).toString(),
      },
    ]);
    await expect(referencesForDocument(document, { line: 7, character: 6 }, indexFixture())).resolves.toEqual([
      {
        range: {
          end: { character: 13, line: 7 },
          start: { character: 5, line: 7 },
        },
        uri: pathToFileURL(controllerPath).toString(),
      },
      {
        range: {
          end: { character: 13, line: 4 },
          start: { character: 5, line: 4 },
        },
        uri: pathToFileURL(providerPath).toString(),
      },
    ]);
  });

  it("finds Eloquent relation, scope, and attribute references", async () => {
    const controllerDocument = TextDocument.create(
      pathToFileURL(controllerPath).toString(),
      "php",
      1,
      "<?php\nUser::with('posts');\nUser::active();",
    );
    const modelDocument = TextDocument.create(
      pathToFileURL(modelPath).toString(),
      "php",
      1,
      "<?php\nclass User extends Model\n{\n    protected $fillable = ['email'];\n}\n",
    );

    await expect(referencesForDocument(controllerDocument, { line: 1, character: 13 }, indexFixture())).resolves.toEqual([
      {
        range: {
          end: { character: 17, line: 1 },
          start: { character: 12, line: 1 },
        },
        uri: pathToFileURL(controllerPath).toString(),
      },
    ]);
    await expect(referencesForDocument(controllerDocument, { line: 2, character: 8 }, indexFixture())).resolves.toEqual([
      {
        range: {
          end: { character: 12, line: 2 },
          start: { character: 6, line: 2 },
        },
        uri: pathToFileURL(controllerPath).toString(),
      },
    ]);
    await expect(referencesForDocument(modelDocument, { line: 3, character: 31 }, indexFixture())).resolves.toEqual([
      {
        range: {
          end: { character: 33, line: 3 },
          start: { character: 28, line: 3 },
        },
        uri: pathToFileURL(modelPath).toString(),
      },
    ]);
  });

  it("finds custom Eloquent builder method references", async () => {
    const document = TextDocument.create(
      pathToFileURL(controllerPath).toString(),
      "php",
      1,
      "<?php\nUser::query()->popularForTenant();",
    );

    await expect(referencesForDocument(document, { line: 1, character: 18 }, indexFixture())).resolves.toEqual([
      {
        range: {
          end: { character: 31, line: 1 },
          start: { character: 15, line: 1 },
        },
        uri: pathToFileURL(controllerPath).toString(),
      },
    ]);
  });

  it("finds factory state references", async () => {
    await writeFile(routePath, "<?php\nUser::factory()->suspended();");
    const document = TextDocument.create(
      pathToFileURL(controllerPath).toString(),
      "php",
      1,
      "<?php\nUser::factory()->suspended();\nUser::factory()->count(2)->suspended();",
    );

    await expect(referencesForDocument(document, { line: 1, character: 20 }, indexFixture())).resolves.toEqual([
      {
        range: {
          end: { character: 26, line: 1 },
          start: { character: 17, line: 1 },
        },
        uri: pathToFileURL(controllerPath).toString(),
      },
      {
        range: {
          end: { character: 36, line: 2 },
          start: { character: 27, line: 2 },
        },
        uri: pathToFileURL(controllerPath).toString(),
      },
      {
        range: {
          end: { character: 26, line: 1 },
          start: { character: 17, line: 1 },
        },
        uri: pathToFileURL(routePath).toString(),
      },
    ]);
  });

  it("finds seeder class references", async () => {
    await writeFile(databaseSeederPath, "<?php\n$this->call([UserSeeder::class]);");
    const document = TextDocument.create(
      pathToFileURL(controllerPath).toString(),
      "php",
      1,
      "<?php\n$this->call([UserSeeder::class, Database\\Seeders\\UserSeeder::class]);",
    );

    await expect(referencesForDocument(document, { line: 1, character: 15 }, indexFixture())).resolves.toEqual([
      {
        range: {
          end: { character: 23, line: 1 },
          start: { character: 13, line: 1 },
        },
        uri: pathToFileURL(controllerPath).toString(),
      },
      {
        range: {
          end: { character: 59, line: 1 },
          start: { character: 32, line: 1 },
        },
        uri: pathToFileURL(controllerPath).toString(),
      },
      {
        range: {
          end: { character: 23, line: 1 },
          start: { character: 13, line: 1 },
        },
        uri: pathToFileURL(databaseSeederPath).toString(),
      },
    ]);
  });

  it("finds macro method references", async () => {
    await writeFile(routePath, "<?php\nStr::headlineSlug();");
    const document = TextDocument.create(
      pathToFileURL(controllerPath).toString(),
      "php",
      1,
      "<?php\nStr::headlineSlug();",
    );

    await expect(referencesForDocument(document, { line: 1, character: 8 }, indexFixture())).resolves.toEqual([
      {
        range: {
          end: { character: 17, line: 1 },
          start: { character: 5, line: 1 },
        },
        uri: pathToFileURL(controllerPath).toString(),
      },
      {
        range: {
          end: { character: 17, line: 1 },
          start: { character: 5, line: 1 },
        },
        uri: pathToFileURL(routePath).toString(),
      },
    ]);
  });

  it("finds Laravel artifact class references", async () => {
    await writeFile(routePath, "<?php\nevent(new OrderShipped());\nSyncUsers::dispatch();");
    const document = TextDocument.create(
      pathToFileURL(controllerPath).toString(),
      "php",
      1,
      "<?php\nevent(new OrderShipped());\nSyncUsers::dispatch();",
    );

    await expect(referencesForDocument(document, { line: 1, character: 12 }, indexFixture())).resolves.toEqual([
      {
        range: {
          end: { character: 22, line: 1 },
          start: { character: 10, line: 1 },
        },
        uri: pathToFileURL(controllerPath).toString(),
      },
      {
        range: {
          end: { character: 22, line: 1 },
          start: { character: 10, line: 1 },
        },
        uri: pathToFileURL(routePath).toString(),
      },
    ]);
    await expect(referencesForDocument(document, { line: 2, character: 3 }, indexFixture())).resolves.toEqual([
      {
        range: {
          end: { character: 9, line: 2 },
          start: { character: 0, line: 2 },
        },
        uri: pathToFileURL(controllerPath).toString(),
      },
      {
        range: {
          end: { character: 9, line: 2 },
          start: { character: 0, line: 2 },
        },
        uri: pathToFileURL(routePath).toString(),
      },
    ]);
  });

  it("finds custom facade static call references", async () => {
    await writeFile(routePath, "<?php\nReports::monthly();");
    const document = TextDocument.create(
      pathToFileURL(controllerPath).toString(),
      "php",
      1,
      "<?php\nReports::monthly();",
    );

    await expect(referencesForDocument(document, { line: 1, character: 2 }, indexFixture())).resolves.toEqual([
      {
        range: {
          end: { character: 7, line: 1 },
          start: { character: 0, line: 1 },
        },
        uri: pathToFileURL(controllerPath).toString(),
      },
      {
        range: {
          end: { character: 7, line: 1 },
          start: { character: 0, line: 1 },
        },
        uri: pathToFileURL(routePath).toString(),
      },
    ]);
  });

  it("finds service provider registration references", async () => {
    const document = TextDocument.create(
      pathToFileURL(providersPath).toString(),
      "php",
      1,
      "<?php\nreturn [App\\Providers\\AppServiceProvider::class];",
    );

    await expect(referencesForDocument(document, { line: 1, character: 24 }, indexFixture())).resolves.toEqual([
      {
        range: {
          end: { character: 40, line: 1 },
          start: { character: 8, line: 1 },
        },
        uri: pathToFileURL(providersPath).toString(),
      },
    ]);
  });

  it("finds route controller and action references", async () => {
    const document = TextDocument.create(
      pathToFileURL(routePath).toString(),
      "php",
      1,
      "<?php\nRoute::get('/users', [UserController::class, 'index']);",
    );

    await expect(referencesForDocument(document, { line: 1, character: 28 }, indexFixture())).resolves.toEqual([
      {
        range: {
          end: { character: 36, line: 1 },
          start: { character: 22, line: 1 },
        },
        uri: pathToFileURL(routePath).toString(),
      },
    ]);
    await expect(referencesForDocument(document, { line: 1, character: 50 }, indexFixture())).resolves.toEqual([
      {
        range: {
          end: { character: 51, line: 1 },
          start: { character: 46, line: 1 },
        },
        uri: pathToFileURL(routePath).toString(),
      },
    ]);
  });

  it("finds route controller group action references", async () => {
    const source = [
      "<?php",
      "Route::controller(UserController::class)->group(function () {",
      "    Route::get('/users', 'index');",
      "    Route::get('/profile', 'index');",
      "});",
    ].join("\n");
    await writeFile(routePath, source);
    const document = TextDocument.create(pathToFileURL(routePath).toString(), "php", 1, source);

    await expect(referencesForDocument(document, { line: 2, character: 28 }, indexFixture())).resolves.toEqual([
      {
        range: {
          end: { character: 31, line: 2 },
          start: { character: 26, line: 2 },
        },
        uri: pathToFileURL(routePath).toString(),
      },
      {
        range: {
          end: { character: 33, line: 3 },
          start: { character: 28, line: 3 },
        },
        uri: pathToFileURL(routePath).toString(),
      },
    ]);
  });

  it("finds route controller alias references", async () => {
    const document = TextDocument.create(
      pathToFileURL(routePath).toString(),
      "php",
      1,
      "<?php\nuse App\\Http\\Controllers\\UserController as Users;\nRoute::get('/users', [Users::class, 'index']);",
    );

    await expect(referencesForDocument(document, { line: 2, character: 24 }, indexFixture())).resolves.toEqual([
      {
        range: {
          end: { character: 27, line: 2 },
          start: { character: 22, line: 2 },
        },
        uri: pathToFileURL(routePath).toString(),
      },
    ]);
    await expect(referencesForDocument(document, { line: 2, character: 38 }, indexFixture())).resolves.toEqual([
      {
        range: {
          end: { character: 42, line: 2 },
          start: { character: 37, line: 2 },
        },
        uri: pathToFileURL(routePath).toString(),
      },
    ]);
  });

  it("finds validated request field references", async () => {
    await writeFile(routePath, "<?php\n$request->input('email');");
    const document = TextDocument.create(
      pathToFileURL(controllerPath).toString(),
      "php",
      1,
      "<?php\nclass UserController { public function store(StoreUserRequest $request) { $request->validated('email'); $request->safe()->only(['email']); } }",
    );

    await expect(referencesForDocument(document, { line: 1, character: 97 }, indexFixture())).resolves.toEqual([
      {
        range: {
          end: { character: 100, line: 1 },
          start: { character: 95, line: 1 },
        },
        uri: pathToFileURL(controllerPath).toString(),
      },
      {
        range: {
          end: { character: 134, line: 1 },
          start: { character: 129, line: 1 },
        },
        uri: pathToFileURL(controllerPath).toString(),
      },
      {
        range: {
          end: { character: 22, line: 1 },
          start: { character: 17, line: 1 },
        },
        uri: pathToFileURL(routePath).toString(),
      },
    ]);
  });

  function indexFixture(): LaravelIndex {
    return {
      ...emptyIndex(),
      bladeComponents: [
        {
          filePath: componentPath,
          name: "forms.input",
          props: ["label-text"],
          source: "class",
          viewName: "components.forms.input",
        },
      ],
      bladeViews: [
        {
          components: ["forms.input"],
          extends: "layouts.app",
          filePath: bladePath,
          includes: ["users.index"],
          name: "users.index",
          props: [],
          sections: ["content"],
          yields: [],
        },
        {
          components: [],
          extends: null,
          filePath: layoutPath,
          includes: [],
          name: "layouts.app",
          props: [],
          sections: [],
          stacks: ["scripts"],
          yields: ["content", "scripts"],
        },
      ],
      authorization: [
        {
          ability: "publish-posts",
          filePath: providerPath,
          model: "Post",
          policy: "PostPolicy",
          source: "gate",
        },
      ],
      commands: [
        {
          className: null,
          description: null,
          filePath: consolePath,
          name: "users:sync",
          namespace: null,
          signature: "users:sync",
          source: "closure",
        },
      ],
      controllers: [
        {
          actions: ["index", "store"],
          className: "UserController",
          filePath: controllerPath,
          namespace: "App\\Http\\Controllers",
        },
      ],
      containerBindings: [
        {
          abstract: "reporter",
          concrete: "DatabaseReporter",
          filePath: providerPath,
          lifetime: "singleton",
        },
      ],
      configEntries: [
        {
          filePath: path.join(rootPath, "config/services.php"),
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
          filePath: path.join(rootPath, ".env"),
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
          filePath: factoryPath,
          model: "User",
          namespace: "Database\\Factories",
          states: ["suspended"],
        },
      ],
      middleware: [
        {
          alias: "auth.admin",
          className: "App\\Http\\Middleware\\EnsureAdmin",
          filePath: bootstrapPath,
          range: { end: { character: 10, line: 5 }, start: { character: 4, line: 5 } },
          source: "bootstrap",
        },
      ],
      macros: [
        {
          className: "Str",
          filePath: providerPath,
          method: "headlineSlug",
        },
      ],
      artifacts: [
        {
          className: "OrderShipped",
          filePath: eventPath,
          kind: "event",
          namespace: "App\\Events",
          related: [],
        },
        {
          className: "SyncUsers",
          filePath: jobPath,
          kind: "job",
          namespace: "App\\Jobs",
          related: [],
        },
      ],
      facades: [
        {
          accessor: "reports",
          className: "Reports",
          filePath: facadePath,
          namespace: "App\\Facades",
        },
      ],
      providers: [
        {
          classFilePath: providerPath,
          className: "AppServiceProvider",
          filePath: providersPath,
          namespace: "App\\Providers",
          source: "bootstrap",
        },
      ],
      seeders: [
        {
          calls: ["UserSeeder"],
          className: "DatabaseSeeder",
          filePath: databaseSeederPath,
          namespace: "Database\\Seeders",
        },
        {
          calls: [],
          className: "UserSeeder",
          filePath: userSeederPath,
          namespace: "Database\\Seeders",
        },
      ],
      models: [
        {
          casts: [],
          className: "User",
          customBuilder: {
            className: "UserBuilder",
            filePath: builderPath,
            methods: [
              {
                name: "popularForTenant",
                returnType: "static",
              },
            ],
            namespace: "App\\Models\\Builders",
          },
          filePath: modelPath,
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
          filePath: routePath,
          methods: ["GET"],
          middleware: [],
          name: "dashboard",
          namePrefix: "",
          range: {
            end: { character: 72, line: 1 },
            start: { character: 0, line: 1 },
          },
          uri: "/dashboard",
          uriPrefix: "",
        },
        {
          action: "UserController::class",
          domain: null,
          filePath: routePath,
          methods: ["GET"],
          middleware: [],
          name: "users.show",
          namePrefix: "",
          range: {
            end: { character: 72, line: 1 },
            start: { character: 0, line: 1 },
          },
          uri: "users/{user}/teams/{team?}",
          uriPrefix: "",
        },
      ],
      schemaTables: [
        {
          columns: [
            {
              filePath: migrationPath,
              modifiers: ["unique"],
              name: "email",
              tableName: "users",
              type: "string",
            },
          ],
          filePath: migrationPath,
          name: "users",
        },
      ],
      translationKeys: [
        {
          filePath: langPath,
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
          filePath: requestPath,
          namespace: "App\\Http\\Requests",
          source: "formRequest",
        },
      ],
      views: ["users.index"],
    };
  }
});
