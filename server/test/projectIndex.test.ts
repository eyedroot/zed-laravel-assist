import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  buildLaravelIndex,
  extractBladeClassComponentInfo,
  extractAuthorizationInfo,
  extractBladeViewInfo,
  extractCommandInfo,
  extractContainerBindings,
  extractControllerInfo,
  extractConfigKeyInfo,
  extractConfigKeys,
  extractEnvKeyInfo,
  extractEnvKeys,
  extractFactoryInfo,
  extractFacadeInfo,
  extractInertiaPageInfo,
  extractLivewireComponentInfo,
  extractLaravelArtifacts,
  extractMacroInfo,
  extractMiddlewareInfo,
  extractModelInfo,
  extractPhpClasses,
  extractRouteInfo,
  extractRouteNames,
  extractSchemaTables,
  extractSeederInfo,
  extractServiceProviderInfo,
  extractTranslationKeys,
  extractValidationRules,
  indexFileKindForPath,
} from "../src/projectIndex.js";
import { resolvePhpClassReference } from "../src/phpResolver.js";

describe("project index extraction", () => {
  it("extracts public PHP type methods for container-resolved completions", () => {
    const source = [
      "<?php",
      "namespace App\\Services;",
      "",
      "interface ServiceAccountInterface",
      "{",
      "    public function setGrade(string $plan): void;",
      "    function register(array $data): void;",
      "}",
      "",
      "class ServiceAccountLibrary implements ServiceAccountInterface",
      "{",
      "    public function setGrade(string $plan): void {}",
      "    protected function internalOnly(): void {}",
      "}",
    ].join("\n");

    const classes = extractPhpClasses("/app/app/Services/ServiceAccountLibrary.php", source);

    expect(classes.find((phpClass) => phpClass.fqcn === "App\\Services\\ServiceAccountInterface")?.methods?.map((method) => method.name)).toEqual([
      "register",
      "setGrade",
    ]);
    expect(classes.find((phpClass) => phpClass.fqcn === "App\\Services\\ServiceAccountLibrary")?.methods?.map((method) => method.name)).toEqual([
      "setGrade",
    ]);
  });

  it("extracts Blade view graph metadata", () => {
    const source = `
      @extends('layouts.app')
      @section('content')
        @include('users.partials.card')
        <x-alert type="success" />
      @endsection
      @push('scripts')
      @endpush
      @stack('scripts')
    `;

    expect(
      extractBladeViewInfo("/app", "/app/resources/views/users/index.blade.php", source),
    ).toEqual({
      components: ["alert"],
      extends: "layouts.app",
      filePath: "/app/resources/views/users/index.blade.php",
      includes: ["users.partials.card"],
      name: "users.index",
      props: [],
      pushes: ["scripts"],
      sections: ["content"],
      stacks: ["scripts"],
      yields: [],
    });
  });

  it("extracts Blade component props", () => {
    const source = `
      @props(['type' => 'info', 'message'])
      @aware(['theme' => 'light'])
      <div>{{ $message }}</div>
    `;

    expect(
      extractBladeViewInfo("/app", "/app/resources/views/components/alert.blade.php", source),
    ).toEqual(
      expect.objectContaining({
        name: "components.alert",
        props: ["message", "theme", "type"],
      }),
    );
  });

  it("extracts class-based Blade components and public props", () => {
    const source = `
      namespace App\\View\\Components\\Forms;

      class Input extends Component
      {
          public string $helperText;

          public function __construct(
              public string $labelText,
              public bool $required = false,
          ) {
          }

          public function render(): View
          {
              return view('components.forms.input');
          }
      }
    `;

    expect(
      extractBladeClassComponentInfo("/app", "/app/app/View/Components/Forms/Input.php", source),
    ).toEqual([
      {
        filePath: "/app/app/View/Components/Forms/Input.php",
        name: "forms.input",
        props: ["helper-text", "label-text", "required"],
        source: "class",
        viewName: "components.forms.input",
      },
    ]);
  });

  it("extracts named Laravel routes", () => {
    const source = `
      Route::get('/dashboard', DashboardController::class)->name('dashboard');
      Route::name('admin.')->group(function () {
        Route::get('/users', UsersController::class)->name("users.index");
      });
    `;

    expect(extractRouteNames(source)).toEqual(["admin.users.index", "dashboard"]);
  });

  it("extracts Laravel route graph metadata", () => {
    const source = `
      Route::middleware(['web', 'auth'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/users', [UsersController::class, 'index'])->name("users.index")->middleware('verified');
        Route::resource('posts', PostController::class)->only(['index', 'show']);
        Route::controller(ReportsController::class)->prefix('reports')->name('reports.')->group(function () {
          Route::get('/monthly', 'monthly')->name('monthly');
        });
      });
    `;

    const routes = extractRouteInfo("/app/routes/web.php", source);

    expect(routes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          action: "[UsersController::class, 'index']",
          filePath: "/app/routes/web.php",
          methods: ["GET"],
          middleware: ["auth", "verified", "web"],
          name: "admin.users.index",
          namePrefix: "admin.",
          uri: "admin/users",
          uriPrefix: "admin",
        }),
        expect.objectContaining({
          action: "PostController::class@index",
          methods: ["GET"],
          name: "admin.posts.index",
          uri: "admin/posts",
        }),
        expect.objectContaining({
          action: "PostController::class@show",
          methods: ["GET"],
          name: "admin.posts.show",
          uri: "admin/posts/{post}",
        }),
        expect.objectContaining({
          action: "ReportsController@monthly",
          methods: ["GET"],
          name: "admin.reports.monthly",
          uri: "admin/reports/monthly",
        }),
      ]),
    );
    expect(routes).toHaveLength(4);
    expect(routes[0]?.range.start.line).toBeGreaterThanOrEqual(1);
  });

  it("extracts config keys under the config file namespace", () => {
    const source = `
      return [
        'name' => env('APP_NAME', 'Laravel'),
        "timezone" => "UTC",
        'mailers' => [
            'smtp' => [
                'host' => env('MAIL_HOST'),
                'port' => 587,
            ],
        ],
      ];
    `;

    expect(extractConfigKeys("/app/config/app.php", source)).toEqual([
      "app.mailers",
      "app.mailers.smtp",
      "app.mailers.smtp.host",
      "app.mailers.smtp.port",
      "app.name",
      "app.timezone",
    ]);
    expect(extractConfigKeyInfo("/app/config/app.php", source)).toContainEqual(
      expect.objectContaining({
        filePath: "/app/config/app.php",
        key: "app.mailers.smtp.host",
        range: {
          end: { character: 21, line: 6 },
          start: { character: 17, line: 6 },
        },
      }),
    );
  });

  it("applies mounted route file prefixes to route metadata", () => {
    const source = `
      Route::namespace('Auth')->group(function () {
        Route::prefix('me')->group(function () {
          Route::get('/', 'MeController');
          Route::get('analytics-dashboard-url', 'MeController@analyticsDashboardUrl')->name('analytics_dashboard_url');
        });
      });
    `;

    expect(extractRouteInfo("/app/modules/Console/router.php", source, { uriPrefix: "api-console" })).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          action: "'MeController'",
          methods: ["GET"],
          uri: "api-console/me",
        }),
        expect.objectContaining({
          action: "'MeController@analyticsDashboardUrl'",
          methods: ["GET"],
          name: "analytics_dashboard_url",
          uri: "api-console/me/analytics-dashboard-url",
        }),
      ]),
    );
  });

  it("extracts config keys across PHP comments containing quotes and brackets", () => {
    const source = `<?php

      /**
       * Shared defaults for the app's [core] services (web, cli).
       */
      return [
        /*
        |--------------------------------------------------------------------------
        | Application Name
        |--------------------------------------------------------------------------
        |
        | This value is the name of your application's "core", which you'll use
        | when the framework needs to place it in [notifications, views].
        |
        */
        'name' => env('APP_NAME', 'Laravel'),

        // The server's region key, one of: kr, jp, us
        'server_pop_region_key' => env('SERVER_POP_REGION_KEY', 'kr'), // trailing note (it's inline)
        # legacy hash comment with 'quotes' and [brackets]
        'push' => [
          'protocol' => env('PUSH_PROTOCOL', 'https'), /* the domain's scheme */
          'domain' => env('PUSH_DOMAIN'),
        ],
      ];
    `;

    expect(extractConfigKeys("/app/config/kollus.php", source)).toEqual([
      "kollus.name",
      "kollus.push",
      "kollus.push.domain",
      "kollus.push.protocol",
      "kollus.server_pop_region_key",
    ]);
  });

  it("anchors config parsing at the return statement", () => {
    const source = `<?php

      use App\\Support\\Region;

      $regions = ['kr', 'jp'];

      return [
        'default_region' => $regions[0],
        'name' => 'kollus',
      ];
    `;

    expect(extractConfigKeys("/app/config/kollus.php", source)).toEqual([
      "kollus.default_region",
      "kollus.name",
    ]);
  });

  it("extracts environment keys", () => {
    expect(extractEnvKeys("APP_NAME=Laravel\n# ignored\nDB_HOST=127.0.0.1")).toEqual([
      "APP_NAME",
      "DB_HOST",
    ]);
    expect(extractEnvKeyInfo("/app/.env", "APP_NAME=Laravel\n# ignored\nDB_HOST=127.0.0.1")).toContainEqual({
      filePath: "/app/.env",
      key: "DB_HOST",
      range: {
        end: { character: 7, line: 2 },
        start: { character: 0, line: 2 },
      },
    });
  });

  it("extracts model accessors and soft delete usage", () => {
    const source = `
      namespace App\\Models;

      /**
       * @property-read int $login_count
       */
      class User extends Model
      {
          use HasFactory, SoftDeletes;

          /**
           * @property-read string $full_name
           */
          public function getFullNameAttribute(): string
          {
              return $this->first_name . ' ' . $this->last_name;
          }

          public function getLoginCountAttribute()
          {
              return 0;
          }

          /**
           * @return string|null
           */
          protected function avatarUrl(): Attribute
          {
              return Attribute::make(get: fn () => '');
          }
      }
    `;

    const model = extractModelInfo("/app/app/Models/User.php", source);
    expect(model?.accessors).toEqual(["avatar_url", "full_name", "login_count"]);
    expect(model?.accessorDetails?.map(({ range: _range, ...accessor }) => accessor)).toEqual([
      {
        name: "avatar_url",
        returnType: "string|null",
        source: "attribute",
      },
      {
        name: "full_name",
        returnType: "string",
        source: "classic",
      },
      {
        name: "login_count",
        returnType: "int",
        source: "classic",
      },
    ]);
    expect(model?.accessorDetails?.filter((accessor) => accessor.range).map((accessor) => accessor.name)).toEqual([
      "avatar_url",
      "full_name",
      "login_count",
    ]);
    expect(model?.usesSoftDeletes).toBe(true);

    const plain = extractModelInfo("/app/app/Models/Post.php", "namespace App\\Models;\nclass Post extends Model {}");
    expect(plain?.accessors).toBeUndefined();
    expect(plain?.usesSoftDeletes).toBeUndefined();
  });

  it("extracts Eloquent model metadata and relationships", () => {
    const source = `
      namespace App\\Models;

      class User extends Model
      {
          public function posts(): HasMany
          {
              return $this->hasMany(Post::class);
          }

          public function deployments(): HasManyThrough
          {
              return $this->hasManyThrough(Deployment::class, Environment::class);
          }

          public function owner(): HasOneThrough
          {
              return $this->hasOneThrough(Owner::class, Team::class);
          }

          public function tags(): MorphToMany
          {
              return $this->morphedByMany(Tag::class, 'taggable');
          }

          public function scopePopular($query): void
          {
          }

          #[Scope]
          protected function active(Builder $query): void
          {
          }
      }
    `;

    const info = extractModelInfo("/app/app/Models/User.php", source);
    expect(info?.methodDetails?.map((method) => method.name)).toEqual([
      "active",
      "deployments",
      "owner",
      "posts",
      "scopePopular",
      "tags",
    ]);

    const { methodDetails: _methodDetails, ...rest } = info ?? {};
    expect(rest).toEqual({
      className: "User",
      namespace: "App\\Models",
      casts: [],
      filePath: "/app/app/Models/User.php",
      fillable: [],
      guarded: [],
      relations: [
        {
          name: "deployments",
          relatedModel: "Deployment",
          type: "hasManyThrough",
        },
        {
          name: "owner",
          relatedModel: "Owner",
          type: "hasOneThrough",
        },
        {
          name: "posts",
          relatedModel: "Post",
          type: "hasMany",
        },
        {
          name: "tags",
          relatedModel: "Tag",
          type: "morphedByMany",
        },
      ],
      relationships: ["deployments", "owner", "posts", "tags"],
      scopes: ["active", "popular"],
      tableName: "users",
    });
  });

  it("extracts static methods and used traits from a model", () => {
    const source = `
      namespace App\\Models;

      use App\\Models\\Concerns\\HasReferenceScope;
      use Illuminate\\Database\\Eloquent\\Model;

      class GlobalValue extends Model
      {
          use HasReferenceScope;

          public static function getValueByContentProviderId(string $key, int $contentProviderId)
          {
              return static::query()->where('key', $key)->first();
          }

          protected static function booted(): void
          {
          }

          public function scopeActive($query): void
          {
          }
      }
    `;

    const info = extractModelInfo("/app/app/Models/GlobalValue.php", source);
    expect(info?.staticMethods).toEqual(["booted", "getValueByContentProviderId"]);
    expect(info?.usedTraits).toEqual(["App\\Models\\Concerns\\HasReferenceScope"]);
    expect(info?.scopes).toEqual(["active"]);
  });

  it("extracts scope metadata from trait files", () => {
    const source = `
      namespace App\\Models\\Concerns;

      trait HasReferenceScope
      {
          public function scopeForReference($query)
          {
              return $query->select('id', 'name');
          }
      }
    `;

    const info = extractModelInfo("/app/app/Models/Concerns/HasReferenceScope.php", source);
    expect(info?.methodDetails?.map((method) => method.name)).toEqual(["scopeForReference"]);

    const { methodDetails: _methodDetails, ...rest } = info ?? {};
    expect(rest).toEqual({
      casts: [],
      className: "HasReferenceScope",
      filePath: "/app/app/Models/Concerns/HasReferenceScope.php",
      fillable: [],
      guarded: [],
      isTrait: true,
      namespace: "App\\Models\\Concerns",
      relations: [],
      relationships: [],
      scopes: ["forReference"],
      tableName: "",
    });
  });

  it("ignores traits without scopes, static methods, or nested traits", () => {
    const source = `
      namespace App\\Models\\Concerns;

      trait Timestamps
      {
          public function touchQuietly(): bool
          {
              return true;
          }
      }
    `;

    expect(extractModelInfo("/app/app/Models/Concerns/Timestamps.php", source)).toBeNull();
  });

  it("extracts custom Eloquent builder metadata", () => {
    const modelSource = `
      namespace App\\Models;

      use App\\Models\\Builders\\UserBuilder;

      class User extends Model
      {
          public function newEloquentBuilder($query): UserBuilder
          {
              return new UserBuilder($query);
          }
      }
    `;
    const builderSource = `
      namespace App\\Models\\Builders;

      class UserBuilder extends Builder
      {
          public function popular(): static
          {
              return $this;
          }
      }
    `;

    expect(extractModelInfo("/app/app/Models/User.php", modelSource)).toEqual(
      expect.objectContaining({
        customBuilder: {
          className: "UserBuilder",
          filePath: null,
          methods: [],
          namespace: "App\\Models\\Builders",
        },
      }),
    );
    expect(extractModelInfo("/app/app/Models/Builders/UserBuilder.php", builderSource)).toEqual(
      expect.objectContaining({
        builderMethods: [
          {
            name: "popular",
            returnType: "static",
          },
        ],
      }),
    );
  });

  it("extracts model table, fillable, guarded, and casts metadata", () => {
    const source = `
      class ProductCategory extends Model
      {
          protected $table = 'catalog_categories';
          protected $fillable = ['name', 'slug'];
          protected $guarded = ['id'];
          protected $casts = [
              'published_at' => 'datetime',
          ];
          protected $appends = ['kind_name'];

          protected function casts(): array
          {
              return [
                  'status' => 'boolean',
              ];
          }
      }
    `;

    expect(extractModelInfo("/app/app/Models/ProductCategory.php", source)).toEqual(
      expect.objectContaining({
        appends: ["kind_name"],
        casts: ["published_at", "status"],
        castDetails: [
          {
            name: "published_at",
            type: "datetime",
          },
          {
            name: "status",
            type: "boolean",
          },
        ],
        fillable: ["name", "slug"],
        guarded: ["id"],
        tableName: "catalog_categories",
      }),
    );
  });

  it("extracts database schema columns from migrations", () => {
    const source = `
      Schema::create('users', function (Blueprint $table) {
          $table->id();
          $table->string('email')->unique();
          $table->foreignId('team_id')->nullable()->constrained();
          $table->timestamps();
          $table->softDeletes();
      });
    `;

    expect(extractSchemaTables("/app/database/migrations/create_users.php", source)).toEqual([
      {
        columns: [
          {
            filePath: "/app/database/migrations/create_users.php",
            modifiers: [],
            name: "id",
            tableName: "users",
            type: "id",
          },
          {
            filePath: "/app/database/migrations/create_users.php",
            modifiers: ["unique"],
            name: "email",
            tableName: "users",
            type: "string",
          },
          {
            filePath: "/app/database/migrations/create_users.php",
            modifiers: ["nullable", "constrained"],
            name: "team_id",
            tableName: "users",
            type: "foreignId",
          },
          {
            filePath: "/app/database/migrations/create_users.php",
            modifiers: [],
            name: "created_at",
            tableName: "users",
            type: "timestamps",
          },
          {
            filePath: "/app/database/migrations/create_users.php",
            modifiers: [],
            name: "updated_at",
            tableName: "users",
            type: "timestamps",
          },
          {
            filePath: "/app/database/migrations/create_users.php",
            modifiers: [],
            name: "deleted_at",
            tableName: "users",
            type: "softDeletes",
          },
        ],
        filePath: "/app/database/migrations/create_users.php",
        name: "users",
      },
    ]);
  });

  it("extracts PHP and JSON translation keys", () => {
    const phpSource = `
      return [
        'welcome' => 'Welcome',
        'profile' => [
          'title' => 'Profile',
        ],
      ];
    `;
    const jsonSource = JSON.stringify({
      "Reset Password": "Reset Password",
      "Welcome back": "Welcome back",
    });

    expect(extractTranslationKeys("/app", "/app/lang/en/messages.php", phpSource)).toEqual([
      {
        filePath: "/app/lang/en/messages.php",
        key: "messages.profile.title",
        locale: "en",
        namespace: null,
        source: "php",
      },
      {
        filePath: "/app/lang/en/messages.php",
        key: "messages.welcome",
        locale: "en",
        namespace: null,
        source: "php",
      },
    ]);
    expect(extractTranslationKeys("/app", "/app/lang/en.json", jsonSource)).toEqual([
      {
        filePath: "/app/lang/en.json",
        key: "Reset Password",
        locale: "en",
        namespace: null,
        source: "json",
      },
      {
        filePath: "/app/lang/en.json",
        key: "Welcome back",
        locale: "en",
        namespace: null,
        source: "json",
      },
    ]);
  });

  it("extracts service container bindings from providers", () => {
    const source = `
      class AppServiceProvider extends ServiceProvider
      {
          public function register(): void
          {
              $this->app->singleton(ReportService::class, DatabaseReportService::class);
              $this->app->bind('billing.gateway', StripeGateway::class);
              $this->app->bind(ReportServer\\ReportServerInterface::class, function () {
                  return new ReportServer\\ReportServerLibrary($httpManager);
              });
              app()->scoped(CacheWarmer::class);
          }
      }
    `;

    expect(extractContainerBindings("/app/app/Providers/AppServiceProvider.php", source)).toEqual([
      {
        abstract: "billing.gateway",
        concrete: "StripeGateway",
        filePath: "/app/app/Providers/AppServiceProvider.php",
        lifetime: "bind",
      },
      {
        abstract: "CacheWarmer",
        concrete: null,
        filePath: "/app/app/Providers/AppServiceProvider.php",
        lifetime: "scoped",
      },
      {
        abstract: "ReportServer\\ReportServerInterface",
        concrete: "ReportServer\\ReportServerLibrary",
        filePath: "/app/app/Providers/AppServiceProvider.php",
        lifetime: "bind",
      },
      {
        abstract: "ReportService",
        concrete: "DatabaseReportService",
        filePath: "/app/app/Providers/AppServiceProvider.php",
        lifetime: "singleton",
      },
    ]);
  });

  it("resolves namespace import prefixes in service container bindings", () => {
    const source = `
      namespace App\\Kollus\\Providers;

      use App\\Kollus\\Libraries\\ReportServer;

      class LibraryServiceProvider extends ServiceProvider
      {
          public function register(): void
          {
              $this->app->bind(ReportServer\\ReportServerInterface::class, function () {
                  return new ReportServer\\ReportServerLibrary($httpManager);
              });
          }
      }
    `;

    expect(resolvePhpClassReference(source, "ReportServer\\ReportServerInterface")).toBe(
      "App\\Kollus\\Libraries\\ReportServer\\ReportServerInterface",
    );
    expect(extractContainerBindings("/app/app/Kollus/Providers/LibraryServiceProvider.php", source)).toEqual([
      {
        abstract: "App\\Kollus\\Libraries\\ReportServer\\ReportServerInterface",
        concrete: "App\\Kollus\\Libraries\\ReportServer\\ReportServerLibrary",
        filePath: "/app/app/Kollus/Providers/LibraryServiceProvider.php",
        lifetime: "bind",
      },
    ]);
  });

  it("indexes service container bindings from nested service provider directories", async () => {
    const rootPath = await mkdtemp(path.join(os.tmpdir(), "laravel-assist-nested-provider-"));

    try {
      await mkdir(path.join(rootPath, "app", "Kollus", "Providers"), { recursive: true });
      await writeFile(
        path.join(rootPath, "app", "Kollus", "Providers", "LibraryServiceProvider.php"),
        [
          "<?php",
          "namespace App\\Kollus\\Providers;",
          "use App\\Kollus\\Libraries\\ReportServer;",
          "class LibraryServiceProvider extends ServiceProvider {",
          "  public function register(): void {",
          "    $this->app->bind(ReportServer\\ReportServerInterface::class, function () {",
          "      return new ReportServer\\ReportServerLibrary($httpManager);",
          "    });",
          "  }",
          "}",
        ].join("\n"),
      );

      const { index } = await buildLaravelIndex(rootPath);

      expect(index.containerBindings).toContainEqual({
        abstract: "App\\Kollus\\Libraries\\ReportServer\\ReportServerInterface",
        concrete: "App\\Kollus\\Libraries\\ReportServer\\ReportServerLibrary",
        filePath: path.join(rootPath, "app", "Kollus", "Providers", "LibraryServiceProvider.php"),
        lifetime: "bind",
      });
    } finally {
      await rm(rootPath, { force: true, recursive: true });
    }
  });

  it("extracts controller actions", () => {
    const source = `
      namespace App\\Http\\Controllers;

      class UserController extends Controller
      {
          public function index(): View
          {
          }

          public function store(Request $request): RedirectResponse
          {
          }

          public function __construct()
          {
          }
      }
    `;

    expect(extractControllerInfo("/app/app/Http/Controllers/UserController.php", source)).toEqual([
      {
        actionDetails: [
          {
            name: "index",
            range: {
              end: { character: 31, line: 5 },
              start: { character: 26, line: 5 },
            },
          },
          {
            name: "store",
            range: {
              end: { character: 31, line: 9 },
              start: { character: 26, line: 9 },
            },
          },
        ],
        actions: ["index", "store"],
        className: "UserController",
        filePath: "/app/app/Http/Controllers/UserController.php",
        namespace: "App\\Http\\Controllers",
      },
    ]);
  });

  it("extracts middleware aliases from bootstrap app and HTTP Kernel", () => {
    const bootstrap = `
      ->withMiddleware(function (Middleware $middleware): void {
          $middleware->alias([
              'subscribed' => EnsureUserIsSubscribed::class,
              'admin' => \\App\\Http\\Middleware\\EnsureAdmin::class,
          ]);
      })
    `;
    const kernel = `
      class Kernel extends HttpKernel
      {
          protected $middlewareAliases = [
              'role' => CheckRole::class,
          ];

          protected $routeMiddleware = [
              'tenant' => ResolveTenant::class,
          ];
      }
    `;

    expect(extractMiddlewareInfo("/app/bootstrap/app.php", bootstrap)).toEqual([
      expect.objectContaining({
        alias: "admin",
        className: "\\App\\Http\\Middleware\\EnsureAdmin",
        filePath: "/app/bootstrap/app.php",
        source: "bootstrap",
      }),
      expect.objectContaining({
        alias: "subscribed",
        className: "EnsureUserIsSubscribed",
        filePath: "/app/bootstrap/app.php",
        range: {
          end: { character: 25, line: 3 },
          start: { character: 15, line: 3 },
        },
        source: "bootstrap",
      }),
    ]);
    expect(extractMiddlewareInfo("/app/app/Http/Kernel.php", kernel)).toEqual([
      expect.objectContaining({
        alias: "role",
        className: "CheckRole",
        filePath: "/app/app/Http/Kernel.php",
        range: {
          end: { character: 19, line: 4 },
          start: { character: 15, line: 4 },
        },
        source: "kernel",
      }),
      expect.objectContaining({
        alias: "tenant",
        className: "ResolveTenant",
        filePath: "/app/app/Http/Kernel.php",
        source: "kernel",
      }),
    ]);
  });

  it("extracts middleware group names as navigable aliases", () => {
    const kernel = `
      protected $middlewareGroups = [
          'web' => [
              \\App\\Http\\Middleware\\EncryptCookies::class,
          ],
          'api' => [
              'throttle:api',
          ],
      ];
    `;
    const bootstrap = `
      ->withMiddleware(function (Middleware $middleware): void {
          $middleware->appendToGroup('reporting', [EnsureReportingEnabled::class]);
      })
    `;

    const kernelEntries = extractMiddlewareInfo("/app/app/Http/Kernel.php", kernel);
    expect(kernelEntries.map((entry) => entry.alias)).toEqual(["api", "web"]);
    expect(kernelEntries[1]?.range).toEqual({
      end: { character: 14, line: 2 },
      start: { character: 11, line: 2 },
    });

    const bootstrapEntries = extractMiddlewareInfo("/app/bootstrap/app.php", bootstrap);
    expect(bootstrapEntries.map((entry) => entry.alias)).toEqual(["reporting"]);
  });

  it("extracts gates and policy abilities", () => {
    const provider = `
      class AuthServiceProvider extends ServiceProvider
      {
          protected $policies = [
              Post::class => PostPolicy::class,
          ];

          public function boot(): void
          {
              Gate::define('publish-posts', fn () => true);
              Gate::policy(Comment::class, CommentPolicy::class);
          }
      }
    `;
    const policy = `
      class PostPolicy
      {
          public function viewAny(User $user): bool { return true; }
          public function update(User $user, Post $post): bool { return true; }
          public function before(User $user): ?bool { return null; }
      }
    `;

    expect(extractAuthorizationInfo("/app/app/Providers/AuthServiceProvider.php", provider)).toEqual(
      [
        {
          ability: "comment",
          filePath: "/app/app/Providers/AuthServiceProvider.php",
          model: "Comment",
          policy: "CommentPolicy",
          source: "policyMap",
        },
        {
          ability: "post",
          filePath: "/app/app/Providers/AuthServiceProvider.php",
          model: "Post",
          policy: "PostPolicy",
          source: "policyMap",
        },
        {
          ability: "publish-posts",
          filePath: "/app/app/Providers/AuthServiceProvider.php",
          model: null,
          policy: null,
          source: "gate",
        },
      ],
    );
    expect(extractAuthorizationInfo("/app/app/Policies/PostPolicy.php", policy)).toEqual([
      {
        ability: "update",
        filePath: "/app/app/Policies/PostPolicy.php",
        model: null,
        policy: "PostPolicy",
        source: "policy",
      },
      {
        ability: "viewAny",
        filePath: "/app/app/Policies/PostPolicy.php",
        model: null,
        policy: "PostPolicy",
        source: "policy",
      },
    ]);
  });

  it("extracts custom facades and macro declarations", () => {
    const facade = `
      namespace App\\Facades;

      class Reports extends Facade
      {
          protected static function getFacadeAccessor(): string
          {
              return 'reports';
          }
      }
    `;
    const macros = `
      class AppServiceProvider extends ServiceProvider
      {
          public function boot(): void
          {
              Str::macro('headlineSlug', fn () => '');
              App\\Support\\Money::macro('formatted', fn () => '');
          }
      }
    `;
    const appConfig = `
      <?php

      return [
          'aliases' => Facade::defaultAliases()->merge([
              'Acl' => App\\Facades\\Acl::class,
              'Auth' => Illuminate\\Support\\Facades\\Auth::class,
          ])->toArray(),
      ];
    `;

    expect(extractFacadeInfo("/app/app/Facades/Reports.php", facade)).toEqual([
      {
        accessor: "reports",
        binding: null,
        className: "Reports",
        filePath: "/app/app/Facades/Reports.php",
        namespace: "App\\Facades",
      },
    ]);
    expect(extractMacroInfo("/app/app/Providers/AppServiceProvider.php", macros)).toEqual([
      {
        className: "App\\Support\\Money",
        filePath: "/app/app/Providers/AppServiceProvider.php",
        method: "formatted",
      },
      {
        className: "Str",
        filePath: "/app/app/Providers/AppServiceProvider.php",
        method: "headlineSlug",
      },
    ]);
    expect(extractFacadeInfo("/app/config/app.php", appConfig)).toEqual([
      {
        accessor: null,
        binding: null,
        className: "Acl",
        filePath: "/app/config/app.php",
        namespace: null,
        source: "alias",
        target: "App\\Facades\\Acl",
      },
      {
        accessor: "auth",
        binding: null,
        className: "Auth",
        filePath: "/app/config/app.php",
        namespace: null,
        source: "alias",
        target: "Illuminate\\Support\\Facades\\Auth",
      },
    ]);
  });

  it("extracts service provider classes and registrations", () => {
    const provider = `
      namespace App\\Providers;

      class EventServiceProvider extends ServiceProvider
      {
      }
    `;
    const bootstrapProviders = `<?php
      return [
          App\\Providers\\EventServiceProvider::class,
      ];
    `;
    const composer = JSON.stringify({
      extra: {
        laravel: {
          providers: ["Vendor\\Package\\PackageServiceProvider"],
        },
      },
    });

    expect(extractServiceProviderInfo("/app/app/Providers/EventServiceProvider.php", provider)).toEqual([
      {
        classFilePath: "/app/app/Providers/EventServiceProvider.php",
        className: "EventServiceProvider",
        filePath: "/app/app/Providers/EventServiceProvider.php",
        namespace: "App\\Providers",
        source: "class",
      },
    ]);
    expect(extractServiceProviderInfo("/app/bootstrap/providers.php", bootstrapProviders)).toEqual([
      {
        classFilePath: null,
        className: "EventServiceProvider",
        filePath: "/app/bootstrap/providers.php",
        namespace: "App\\Providers",
        source: "bootstrap",
      },
    ]);
    expect(extractServiceProviderInfo("/app/composer.json", composer)).toEqual([
      {
        classFilePath: null,
        className: "PackageServiceProvider",
        filePath: "/app/composer.json",
        namespace: "Vendor\\Package",
        source: "composer",
      },
    ]);
  });

  it("extracts factory metadata and seeder calls", () => {
    const factory = `
      namespace Database\\Factories;

      class UserFactory extends Factory
      {
          protected $model = User::class;

          public function definition(): array
          {
              return [
                  'name' => fake()->name(),
                  'email' => fake()->safeEmail(),
              ];
          }

          public function suspended(): static
          {
              return $this->state(fn () => []);
          }
      }
    `;
    const seeder = `
      namespace Database\\Seeders;

      class DatabaseSeeder extends Seeder
      {
          public function run(): void
          {
              $this->call([
                  UserSeeder::class,
                  TeamSeeder::class,
              ]);
          }
      }
    `;

    expect(extractFactoryInfo("/app/database/factories/UserFactory.php", factory)).toEqual([
      {
        className: "UserFactory",
        definitionFields: ["email", "name"],
        filePath: "/app/database/factories/UserFactory.php",
        model: "User",
        namespace: "Database\\Factories",
        states: ["suspended"],
      },
    ]);
    expect(extractSeederInfo("/app/database/seeders/DatabaseSeeder.php", seeder)).toEqual([
      {
        calls: ["TeamSeeder", "UserSeeder"],
        className: "DatabaseSeeder",
        filePath: "/app/database/seeders/DatabaseSeeder.php",
        namespace: "Database\\Seeders",
      },
    ]);
  });

  it("extracts Artisan command signatures", () => {
    const classCommand = `
      namespace App\\Console\\Commands;

      class SendDigest extends Command
      {
          protected $signature = 'reports:send-digest {user} {--queue}';
          protected $description = 'Send a digest report';
      }
    `;
    const closureCommands = `
      Artisan::command('reports:prune {--days=30}', function () {});
      Schedule::command('reports:send-digest')->daily();
    `;

    expect(extractCommandInfo("/app/app/Console/Commands/SendDigest.php", classCommand)).toEqual([
      {
        className: "SendDigest",
        description: "Send a digest report",
        filePath: "/app/app/Console/Commands/SendDigest.php",
        name: "reports:send-digest",
        namespace: "App\\Console\\Commands",
        signature: "reports:send-digest {user} {--queue}",
        source: "class",
      },
    ]);
    expect(extractCommandInfo("/app/routes/console.php", closureCommands)).toEqual([
      {
        className: null,
        description: null,
        filePath: "/app/routes/console.php",
        name: "reports:prune",
        namespace: null,
        signature: "reports:prune {--days=30}",
        source: "closure",
      },
      {
        className: null,
        description: null,
        filePath: "/app/routes/console.php",
        name: "reports:send-digest",
        namespace: null,
        signature: "reports:send-digest",
        source: "closure",
      },
    ]);
  });

  it("extracts Laravel application artifacts", () => {
    const listener = `
      namespace App\\Listeners;

      class SendShipmentNotification
      {
          public function handle(OrderShipped $event): void
          {
              SendShipmentEmail::dispatch();
              new ShipmentReadyNotification();
          }
      }
    `;
    const resource = `
      namespace App\\Http\\Resources;

      class UserResource extends JsonResource
      {
      }
    `;
    const mailable = `
      namespace App\\Mail;

      class OrderReceipt extends Mailable
      {
      }
    `;
    const job = `
      namespace App\\Jobs;

      class SyncUsers implements ShouldQueue
      {
          public function __construct(User $user, bool $force = false)
          {
          }
      }
    `;

    expect(extractLaravelArtifacts("/app", "/app/app/Listeners/SendShipmentNotification.php", listener)).toEqual([
      {
        className: "SendShipmentNotification",
        filePath: "/app/app/Listeners/SendShipmentNotification.php",
        kind: "listener",
        namespace: "App\\Listeners",
        related: ["OrderShipped", "SendShipmentEmail", "ShipmentReadyNotification"],
      },
    ]);
    expect(extractLaravelArtifacts("/app", "/app/app/Http/Resources/UserResource.php", resource)).toEqual([
      {
        className: "UserResource",
        filePath: "/app/app/Http/Resources/UserResource.php",
        kind: "resource",
        namespace: "App\\Http\\Resources",
        related: [],
      },
    ]);
    expect(extractLaravelArtifacts("/app", "/app/app/Mail/OrderReceipt.php", mailable)).toEqual([
      {
        className: "OrderReceipt",
        filePath: "/app/app/Mail/OrderReceipt.php",
        kind: "mailable",
        namespace: "App\\Mail",
        related: [],
      },
    ]);
    expect(extractLaravelArtifacts("/app", "/app/app/Jobs/SyncUsers.php", job)).toEqual([
      {
        className: "SyncUsers",
        constructorSignature: "User $user, bool $force = false",
        filePath: "/app/app/Jobs/SyncUsers.php",
        kind: "job",
        namespace: "App\\Jobs",
        related: [],
      },
    ]);
  });

  it("extracts FormRequest validation fields", () => {
    const source = `
      namespace App\\Http\\Requests;

      class StoreUserRequest extends FormRequest
      {
          public function rules(): array
          {
              return [
                  'email' => ['required', 'email'],
                  'profile.name' => 'nullable|string|max:255',
              ];
          }
      }
    `;

    expect(extractValidationRules("/app/app/Http/Requests/StoreUserRequest.php", source)).toEqual([
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
    ]);
  });

  it("extracts inline controller validation fields", () => {
    const source = `
      class UserController
      {
          public function store(Request $request)
          {
              $request->validate([
                  'name' => 'required|string',
                  'team_id' => ['nullable', 'integer'],
              ]);
          }
      }
    `;

    expect(extractValidationRules("/app/app/Http/Controllers/UserController.php", source)).toEqual([
      {
        className: "UserController",
        fields: [
          { field: "name", rules: ["required", "string"] },
          { field: "team_id", rules: ["integer", "nullable"] },
        ],
        filePath: "/app/app/Http/Controllers/UserController.php",
        namespace: null,
        source: "inline",
      },
    ]);
  });

  it("captures class values for config entries", () => {
    const source = [
      "<?php",
      "return [",
      "    'providers' => [",
      "        'users' => [",
      "            'driver' => 'eloquent',",
      "            'model' => App\\Kollus\\Models\\User::class,",
      "        ],",
      "    ],",
      "];",
    ].join("\n");

    expect(extractConfigKeyInfo("/app/config/auth.php", source)).toContainEqual(
      expect.objectContaining({
        key: "auth.providers.users.model",
        value: "App\\Kollus\\Models\\User",
      }),
    );
  });

  it("merges trait scopes and static methods into consuming models", async () => {
    const rootPath = await mkdtemp(path.join(os.tmpdir(), "laravel-assist-"));

    try {
      await mkdir(path.join(rootPath, "app", "Models", "Concerns"), { recursive: true });
      await mkdir(path.join(rootPath, "config"), { recursive: true });
      await writeFile(
        path.join(rootPath, "config", "auth.php"),
        "<?php return ['providers' => ['users' => ['model' => App\\Models\\GlobalValue::class]]];",
      );
      await writeFile(
        path.join(rootPath, "app", "Models", "GlobalValue.php"),
        [
          "<?php",
          "namespace App\\Models;",
          "use App\\Models\\Concerns\\HasReferenceScope;",
          "class GlobalValue extends Model",
          "{",
          "    use HasReferenceScope;",
          "    public static function getValueByContentProviderId(string $key, int $contentProviderId) {}",
          "    public function scopeActive($query): void {}",
          "}",
        ].join("\n"),
      );
      await writeFile(
        path.join(rootPath, "app", "Models", "Concerns", "HasReferenceScope.php"),
        [
          "<?php",
          "namespace App\\Models\\Concerns;",
          "trait HasReferenceScope",
          "{",
          "    public function scopeForReference($query) { return $query; }",
          "    public static function sharedHelper(): bool { return true; }",
          "}",
        ].join("\n"),
      );

      const { index } = await buildLaravelIndex(rootPath);
      expect(index.authUserModel).toBe("App\\Models\\GlobalValue");

      const model = index.models.find((candidate) => candidate.className === "GlobalValue");
      expect(model?.scopes).toEqual(["active", "forReference"]);
      expect(model?.methodDetails?.map((method) => method.name)).toEqual([
        "getValueByContentProviderId",
        "scopeActive",
      ]);
      expect(model?.staticMethods).toEqual(["getValueByContentProviderId", "sharedHelper"]);
      expect(model?.scopeDetails).toEqual([
        {
          filePath: path.join(rootPath, "app", "Models", "Concerns", "HasReferenceScope.php"),
          name: "forReference",
        },
      ]);
      expect(index.models.some((candidate) => candidate.className === "HasReferenceScope")).toBe(false);
    } finally {
      await rm(rootPath, { force: true, recursive: true });
    }
  });

  it("reuses unchanged file indexes and reindexes changed files", async () => {
    const rootPath = await createLaravelFixture();

    try {
      await writeFile(
        path.join(rootPath, "routes", "web.php"),
        "Route::get('/dashboard', DashboardController::class)->name('dashboard');",
      );
      await writeFile(
        path.join(rootPath, "routes", "console.php"),
        "Artisan::command('reports:prune {--days=30}', function () {});",
      );
      await writeFile(
        path.join(rootPath, "resources", "views", "dashboard.blade.php"),
        "<h1>Dashboard</h1>",
      );
      await writeFile(
        path.join(rootPath, "config", "app.php"),
        "<?php return ['name' => 'Laravel'];",
      );
      await writeFile(path.join(rootPath, ".env.example"), "APP_NAME=Laravel\n");
      await writeFile(
        path.join(rootPath, "bootstrap", "app.php"),
        "<?php return Application::configure()->withMiddleware(function (Middleware $middleware): void { $middleware->alias(['subscribed' => EnsureUserIsSubscribed::class]); });",
      );
      await writeFile(
        path.join(rootPath, "bootstrap", "providers.php"),
        "<?php return [App\\Providers\\AuthServiceProvider::class];",
      );
      await writeFile(
        path.join(rootPath, "composer.json"),
        JSON.stringify({ extra: { laravel: { providers: ["Vendor\\Package\\PackageServiceProvider"] } } }),
      );
      await writeFile(
        path.join(rootPath, "app", "Models", "User.php"),
        "<?php namespace App\\Models; use App\\Models\\Builders\\UserBuilder; class User extends Model { public function newEloquentBuilder($query): UserBuilder { return new UserBuilder($query); } }",
      );
      await mkdir(path.join(rootPath, "app", "Models", "Builders"), { recursive: true });
      await writeFile(
        path.join(rootPath, "app", "Models", "Builders", "UserBuilder.php"),
        "<?php namespace App\\Models\\Builders; class UserBuilder extends Builder { public function popular(): static { return $this; } }",
      );
      await writeFile(
        path.join(rootPath, "database", "migrations", "2024_01_01_000000_create_users.php"),
        "<?php Schema::create('users', function (Blueprint $table) {\n$table->id();\n$table->string('email');\n});",
      );
      await writeFile(
        path.join(rootPath, "app", "Http", "Requests", "StoreUserRequest.php"),
        "<?php class StoreUserRequest extends FormRequest { public function rules(): array { return ['email' => 'required|email']; } }",
      );
      await mkdir(path.join(rootPath, "app", "Http", "Controllers"), { recursive: true });
      await writeFile(
        path.join(rootPath, "app", "Http", "Controllers", "DashboardController.php"),
        "<?php namespace App\\Http\\Controllers; class DashboardController extends Controller { public function __invoke(): Response {} public function index(): Response {} }",
      );
      await writeFile(
        path.join(rootPath, "app", "Http", "Kernel.php"),
        "<?php class Kernel extends HttpKernel { protected $middlewareAliases = ['tenant' => ResolveTenant::class]; }",
      );
      await writeFile(
        path.join(rootPath, "lang", "en", "messages.php"),
        "<?php return ['welcome' => 'Welcome'];",
      );
      await writeFile(
        path.join(rootPath, "app", "Providers", "AuthServiceProvider.php"),
        "<?php class AuthServiceProvider extends ServiceProvider { public function register(): void { $this->app->singleton('reports', DatabaseReportService::class); } public function boot(): void { Gate::define('publish-posts', fn () => true); } }",
      );
      await writeFile(
        path.join(rootPath, "app", "Policies", "PostPolicy.php"),
        "<?php class PostPolicy { public function update(User $user, Post $post): bool { return true; } }",
      );
      await writeFile(
        path.join(rootPath, "app", "Facades", "Reports.php"),
        "<?php namespace App\\Facades; class Reports extends Facade { protected static function getFacadeAccessor(): string { return 'reports'; } }",
      );
      await writeFile(
        path.join(rootPath, "app", "Providers", "MacroServiceProvider.php"),
        "<?php class MacroServiceProvider extends ServiceProvider { public function boot(): void { Str::macro('headlineSlug', fn () => ''); } }",
      );
      await writeFile(
        path.join(rootPath, "database", "factories", "UserFactory.php"),
        "<?php namespace Database\\Factories; class UserFactory extends Factory { protected $model = User::class; public function definition(): array { return ['email' => fake()->email()]; } public function suspended(): static { return $this->state(fn () => []); } }",
      );
      await writeFile(
        path.join(rootPath, "database", "seeders", "DatabaseSeeder.php"),
        "<?php namespace Database\\Seeders; class DatabaseSeeder extends Seeder { public function run(): void { $this->call([UserSeeder::class]); } }",
      );
      await writeFile(
        path.join(rootPath, "app", "Console", "Commands", "SendDigest.php"),
        "<?php namespace App\\Console\\Commands; class SendDigest extends Command { protected $signature = 'reports:send-digest {user}'; protected $description = 'Send digest'; }",
      );
      await writeFile(
        path.join(rootPath, "app", "View", "Components", "Forms", "Input.php"),
        "<?php namespace App\\View\\Components\\Forms; class Input extends Component { public function __construct(public string $labelText, public bool $required = false) {} public function render(): View { return view('components.forms.input'); } }",
      );
      await writeFile(
        path.join(rootPath, "app", "Events", "OrderShipped.php"),
        "<?php namespace App\\Events; class OrderShipped {}",
      );
      await writeFile(
        path.join(rootPath, "app", "Listeners", "SendShipmentNotification.php"),
        "<?php namespace App\\Listeners; class SendShipmentNotification { public function handle(OrderShipped $event): void {} }",
      );
      await writeFile(
        path.join(rootPath, "app", "Jobs", "SyncOrder.php"),
        "<?php namespace App\\Jobs; class SyncOrder implements ShouldQueue {}",
      );
      await writeFile(
        path.join(rootPath, "app", "Mail", "OrderReceipt.php"),
        "<?php namespace App\\Mail; class OrderReceipt extends Mailable {}",
      );
      await writeFile(
        path.join(rootPath, "app", "Notifications", "InvoicePaid.php"),
        "<?php namespace App\\Notifications; class InvoicePaid extends Notification {}",
      );
      await writeFile(
        path.join(rootPath, "app", "Http", "Resources", "UserResource.php"),
        "<?php namespace App\\Http\\Resources; class UserResource extends JsonResource {}",
      );

      const first = await buildLaravelIndex(rootPath);
      expect(first.index.routes.map((route) => route.name)).toEqual(["dashboard"]);
      expect(first.index.bladeComponents.map((component) => component.name)).toEqual([
        "forms.input",
      ]);
      expect(first.index.bladeViews.map((view) => view.name)).toEqual(["dashboard"]);
      expect(first.index.schemaTables.map((table) => table.name)).toEqual(["users"]);
      expect(first.index.validationRules.map((rule) => rule.className)).toEqual([
        "StoreUserRequest",
      ]);
      expect(first.index.translationKeys.map((key) => key.key)).toEqual(["messages.welcome"]);
      expect(first.index.containerBindings.map((binding) => binding.abstract)).toEqual([
        "reports",
      ]);
      expect(first.index.authorization.map((entry) => entry.ability)).toEqual([
        "publish-posts",
        "update",
      ]);
      expect(first.index.facades.map((facade) => facade.className)).toEqual(
        expect.arrayContaining(["Auth", "DB", "Reports", "Route"]),
      );
      expect(first.index.facades.find((facade) => facade.className === "Reports")?.binding).toEqual({
        abstract: "reports",
        concrete: "DatabaseReportService",
        filePath: path.join(rootPath, "app", "Providers", "AuthServiceProvider.php"),
        lifetime: "singleton",
      });
      expect(first.index.providers.map((provider) => `${provider.source}:${provider.className}`)).toEqual([
        "class:AuthServiceProvider",
        "bootstrap:AuthServiceProvider",
        "class:MacroServiceProvider",
        "composer:PackageServiceProvider",
      ]);
      expect(first.index.providers.find((provider) => provider.source === "bootstrap")?.classFilePath).toBe(
        path.join(rootPath, "app", "Providers", "AuthServiceProvider.php"),
      );
      expect(first.index.commands.map((command) => command.name)).toEqual([
        "reports:prune",
        "reports:send-digest",
      ]);
      expect(first.index.controllers.map((controller) => controller.className)).toEqual([
        "DashboardController",
      ]);
      expect(first.index.controllers[0]?.actions).toEqual(["__invoke", "index"]);
      expect(first.index.middleware.map((entry) => entry.alias)).toEqual([
        "subscribed",
        "tenant",
      ]);
      expect(first.index.factories.map((factory) => factory.className)).toEqual(["UserFactory"]);
      expect(first.index.macros.map((macro) => macro.method)).toEqual(["headlineSlug"]);
      expect(first.index.seeders.map((seeder) => seeder.className)).toEqual(["DatabaseSeeder"]);
      expect(first.index.models.find((model) => model.className === "User")?.customBuilder).toEqual({
        className: "UserBuilder",
        filePath: path.join(rootPath, "app", "Models", "Builders", "UserBuilder.php"),
        methods: [{ name: "popular", returnType: "static" }],
        namespace: "App\\Models\\Builders",
      });
      expect(first.index.artifacts.map((artifact) => artifact.kind)).toEqual([
        "event",
        "job",
        "listener",
        "mailable",
        "notification",
        "resource",
      ]);
      expect(first.stats.indexedFiles).toBe(first.stats.discoveredFiles);
      expect(first.stats.reusedFiles).toBe(0);

      const second = await buildLaravelIndex(rootPath, first.cache);
      expect(second.index).toEqual(first.index);
      expect(second.stats.indexedFiles).toBe(0);
      expect(second.stats.reusedFiles).toBe(second.stats.discoveredFiles);

      await waitForFileTimestamp();
      await writeFile(
        path.join(rootPath, "routes", "web.php"),
        "Route::get('/profile', ProfileController::class)->name('profile');",
      );

      const third = await buildLaravelIndex(rootPath, second.cache, {
        changedFilePaths: [path.join(rootPath, "routes", "web.php")],
      });
      expect(third.index.routes.map((route) => route.name)).toEqual(["profile"]);
      expect(third.stats.discoveredFiles).toBe(1);
      expect(third.stats.indexedFiles).toBe(1);
      expect(third.stats.reusedFiles).toBe(0);
    } finally {
      await rm(rootPath, { force: true, recursive: true });
    }
  });

  it("derives Inertia page names from page files", () => {
    expect(extractInertiaPageInfo("/app", "/app/resources/js/Pages/Users/Index.vue")).toEqual({
      filePath: "/app/resources/js/Pages/Users/Index.vue",
      name: "Users/Index",
    });
    expect(extractInertiaPageInfo("/app", "/app/resources/js/pages/settings/profile.tsx")).toEqual({
      filePath: "/app/resources/js/pages/settings/profile.tsx",
      name: "settings/profile",
    });
    expect(extractInertiaPageInfo("/app", "/app/resources/js/Pages/Dashboard.svelte")).toEqual({
      filePath: "/app/resources/js/Pages/Dashboard.svelte",
      name: "Dashboard",
    });
  });

  it("extracts Livewire components with kebab-case names, properties, and actions", () => {
    const source = [
      "<?php",
      "namespace App\\Livewire\\Users;",
      "use Livewire\\Component;",
      "class ShowPost extends Component",
      "{",
      "    public int $userId = 0;",
      "    public $search = '';",
      "    public static $shared = [];",
      "    public function mount(): void {}",
      "    public function render() {}",
      "    public function updatedSearch(): void {}",
      "    public function save(): void {}",
      "    public function deletePost(int $id): void {}",
      "    private function helper(): void {}",
      "}",
    ].join("\n");

    expect(extractLivewireComponentInfo("/app", "/app/app/Livewire/Users/ShowPost.php", source)).toEqual({
      className: "ShowPost",
      filePath: "/app/app/Livewire/Users/ShowPost.php",
      methods: ["deletePost", "save"],
      name: "users.show-post",
      namespace: "App\\Livewire\\Users",
      properties: ["search", "userId"],
    });

    const legacy = "<?php\nnamespace App\\Http\\Livewire;\nclass Counter extends \\Livewire\\Component {}";
    expect(extractLivewireComponentInfo("/app", "/app/app/Http/Livewire/Counter.php", legacy)).toEqual(
      expect.objectContaining({ className: "Counter", name: "counter" }),
    );

    const plainClass = "<?php\nnamespace App\\Livewire;\nclass Helper extends Support {}";
    expect(extractLivewireComponentInfo("/app", "/app/app/Livewire/Helper.php", plainClass)).toBe(null);
  });

  it("maps changed paths to index kinds", () => {
    const rootPath = "/app";

    expect(indexFileKindForPath(rootPath, "/app/routes/web.php")).toBe("route");
    expect(indexFileKindForPath(rootPath, "/app/resources/views/users/index.blade.php")).toBe(
      "view",
    );
    expect(indexFileKindForPath(rootPath, "/app/resources/js/Pages/Users/Index.vue")).toBe(
      "inertiaPage",
    );
    expect(indexFileKindForPath(rootPath, "/app/resources/js/pages/settings/profile.tsx")).toBe(
      "inertiaPage",
    );
    expect(indexFileKindForPath(rootPath, "/app/resources/js/Pages/types.d.ts")).toBe(null);
    expect(indexFileKindForPath(rootPath, "/app/config/app.php")).toBe("config");
    expect(indexFileKindForPath(rootPath, "/app/bootstrap/providers.php")).toBe("provider");
    expect(indexFileKindForPath(rootPath, "/app/composer.json")).toBe("provider");
    expect(indexFileKindForPath(rootPath, "/app/.env.example")).toBe("env");
    expect(indexFileKindForPath(rootPath, "/app/app/Models/User.php")).toBe("model");
    expect(indexFileKindForPath(rootPath, "/app/database/migrations/create_users.php")).toBe(
      "schema",
    );
    expect(indexFileKindForPath(rootPath, "/app/database/factories/UserFactory.php")).toBe(
      "factory",
    );
    expect(indexFileKindForPath(rootPath, "/app/database/seeders/DatabaseSeeder.php")).toBe(
      "seeder",
    );
    expect(indexFileKindForPath(rootPath, "/app/app/Console/Commands/SendDigest.php")).toBe(
      "model",
    );
    expect(indexFileKindForPath(rootPath, "/app/app/Http/Controllers/UserController.php")).toBe(
      "model",
    );
    expect(indexFileKindForPath(rootPath, "/app/app/View/Components/Forms/Input.php")).toBe(
      "model",
    );
    expect(indexFileKindForPath(rootPath, "/app/routes/console.php")).toBe("route");
    expect(indexFileKindForPath(rootPath, "/app/modules/Console/router.php")).toBe("route");
    expect(indexFileKindForPath(rootPath, "/app/packages/Billing/router.php")).toBe("route");
    expect(indexFileKindForPath(rootPath, "/app/bootstrap/app.php")).toBe("middleware");
    expect(indexFileKindForPath(rootPath, "/app/app/Http/Kernel.php")).toBe("model");
    expect(indexFileKindForPath(rootPath, "/app/app/Http/Requests/StoreUserRequest.php")).toBe(
      "model",
    );
    expect(indexFileKindForPath(rootPath, "/app/lang/en/messages.php")).toBe("translation");
    expect(indexFileKindForPath(rootPath, "/app/resources/lang/en.json")).toBe("translation");
    expect(indexFileKindForPath(rootPath, "/app/app/Providers/AuthServiceProvider.php")).toBe(
      "model",
    );
    expect(indexFileKindForPath(rootPath, "/app/app/Policies/PostPolicy.php")).toBe("model");
    expect(indexFileKindForPath(rootPath, "/app/app/Facades/Reports.php")).toBe("model");
    expect(indexFileKindForPath(rootPath, "/app/app/Events/OrderShipped.php")).toBe("model");
    expect(indexFileKindForPath(rootPath, "/app/app/Http/Resources/UserResource.php")).toBe(
      "model",
    );
    expect(indexFileKindForPath(rootPath, "/app/storage/logs/laravel.log")).toBeNull();
  });
});

async function createLaravelFixture(): Promise<string> {
  const rootPath = await mkdtemp(path.join(os.tmpdir(), "laravel-assist-"));
  await Promise.all([
    mkdir(path.join(rootPath, "routes"), { recursive: true }),
    mkdir(path.join(rootPath, "resources", "views"), { recursive: true }),
    mkdir(path.join(rootPath, "config"), { recursive: true }),
    mkdir(path.join(rootPath, "bootstrap"), { recursive: true }),
    mkdir(path.join(rootPath, "app", "Models"), { recursive: true }),
    mkdir(path.join(rootPath, "app", "Http", "Requests"), { recursive: true }),
    mkdir(path.join(rootPath, "app", "Http", "Controllers"), { recursive: true }),
    mkdir(path.join(rootPath, "app", "Events"), { recursive: true }),
    mkdir(path.join(rootPath, "app", "Console", "Commands"), { recursive: true }),
    mkdir(path.join(rootPath, "app", "View", "Components", "Forms"), { recursive: true }),
    mkdir(path.join(rootPath, "app", "Facades"), { recursive: true }),
    mkdir(path.join(rootPath, "app", "Http", "Resources"), { recursive: true }),
    mkdir(path.join(rootPath, "app", "Jobs"), { recursive: true }),
    mkdir(path.join(rootPath, "app", "Listeners"), { recursive: true }),
    mkdir(path.join(rootPath, "app", "Mail"), { recursive: true }),
    mkdir(path.join(rootPath, "app", "Notifications"), { recursive: true }),
    mkdir(path.join(rootPath, "app", "Policies"), { recursive: true }),
    mkdir(path.join(rootPath, "app", "Providers"), { recursive: true }),
    mkdir(path.join(rootPath, "database", "migrations"), { recursive: true }),
    mkdir(path.join(rootPath, "database", "factories"), { recursive: true }),
    mkdir(path.join(rootPath, "database", "seeders"), { recursive: true }),
    mkdir(path.join(rootPath, "lang", "en"), { recursive: true }),
    writeFile(path.join(rootPath, "artisan"), ""),
  ]);

  return rootPath;
}

async function waitForFileTimestamp(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 10));
}
