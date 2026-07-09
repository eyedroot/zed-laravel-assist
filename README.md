# Laravel Assist for Zed

Laravel Assist is an experimental Zed extension that aims to bring Laravel-aware IDE support to Zed.

The long-term goal is a development experience closer to dedicated Laravel IDE tooling: routes, config keys, views, Eloquent models, relationships, factories, requests, policies, and service container bindings should be discoverable through completions, navigation, hovers, diagnostics, and code actions.

## Status

This repository is in the foundation phase.

Current scope:

- Zed extension manifest and Rust entrypoint
- Node-based Laravel-aware Language Server
- Workspace detection for Laravel projects
- Early completions for `route()`, `to_route()`, redirect route helpers, route parameter arrays, `view()`, Blade sections/stacks, `config()`, `env()`, controllers, models, model properties, Eloquent query columns/scopes/custom builders/builder methods, validation Rule schema tables/columns, validation rule names inside rule strings (including `exists:`/`unique:` schema parameters), `DB::table(...)` tables and chained columns, `Storage::disk(...)` filesystem disks, PHPUnit mock method strings, Inertia pages, Livewire components/tag parameters/wire bindings, service providers, facade aliases, application artifacts, and common Laravel helpers
- Early go-to-definition support for named routes, route parameters, controller actions, Blade views/components/component props/sections/stacks, config/env keys, translations, authorization abilities, container bindings, Artisan commands, middleware aliases, service providers, Eloquent relations/scopes/custom builders, validated request fields, validation Rule schema tables/columns, `DB::table(...)` tables/columns, PHPUnit mock method strings, Inertia pages, Livewire components, and Livewire wire bindings
- Early references support for named routes, route parameters, controller actions, Blade views/components/component props/sections/stacks, config/env keys, translations, authorization abilities, container bindings, Artisan commands, middleware aliases, service providers, Eloquent relations/scopes/custom builders, and validated request fields
- Go-to-implementation support that lists every subclass and interface implementer of an indexed PHP class, interface, trait, or enum, resolved transitively across the inheritance graph (toggleable, on by default)
- Usage CodeLens support for indexed PHP classes and public methods, with counts that open the matching reference locations when Zed's `code_lens` setting is enabled
- Early document/workspace symbols for indexed Laravel routes, controllers/actions, views, components, config/env keys, models, schema, translations, commands, middleware, bindings, authorization, service providers, factories, seeders, Eloquent custom builders, and application artifacts
- Early hover support for named routes, route parameters, controller actions, Blade views/components/component props/sections/stacks, config/env keys, translations, authorization abilities, container bindings, Artisan commands, middleware aliases, service providers, facade aliases, application artifacts, model properties, Eloquent relations/scopes/custom builders, validated request fields, validation Rule schema tables/columns, `DB::table(...)` tables/columns, and PHPUnit mock method strings
- Early diagnostics for unresolved route, route parameter, controller action, view, component, component prop, Blade section/stack, config, env, translation, authorization, container, command, middleware, service provider, Eloquent relation/scope, factory state, seeder, validated request field, validation Rule schema, Inertia page, and Livewire component references
- Early quick-fix and generation code actions for unresolved route, view, component, component prop, Blade section/stack, config, env, translation, authorization, container, command, middleware, factory state, seeder, validated request field, validation Rule schema, Inertia page, and Livewire component references, missing Blade view/component creation, and model-based factory/resource/policy/seeder/FormRequest creation
- Project indexing for routes, controllers/actions, Blade views/components, Inertia pages, Livewire components, Artisan commands, middleware aliases, service providers, config files, env keys, translations, service bindings, authorization, facades, macros, factories, seeders, Laravel application artifacts, model classes, migration schema, validation rules, and the PHP class/interface/trait/enum inheritance graph
- File-level memory and disk cache for incremental project indexing

## Current Parsing and Indexing

The current language server includes a conservative, regex-based Laravel indexer. It is intentionally small and easy to replace with a real PHP AST parser later.

### Laravel Workspace Detection

The server treats a workspace as a Laravel project when either of these signals is present:

- an `artisan` file at the workspace root
- `composer.json` requiring `laravel/framework`, `illuminate/support`, or `orchestra/testbench`

If the workspace does not look like Laravel, the language server stays idle and returns no Laravel completions.

### Incremental Index Cache

The server stores a file-level index cache in the user's cache directory. Each entry records the file path, index kind, file signature, and extracted Laravel entries. On refresh, unchanged files are reused, changed files are reindexed, and deleted files are removed from the in-memory index.

Cache entries are keyed by both index kind and file path, so one PHP file can contribute to multiple shards such as model metadata and validation rules.

File save and watched file change events are debounced before refreshing. If another change arrives while indexing is already running, the server performs one more refresh after the active build completes.

### Route Name Parsing

Files scanned:

- `routes/**/*.php`

Patterns currently extracted:

- chained route names such as `Route::get(...)->name('dashboard')`
- route group prefixes such as `Route::prefix('admin')->name('admin.')`
- controller route groups such as `Route::controller(UserController::class)->group(...)`
- resource route names from `Route::resource(...)` and `Route::apiResource(...)`

The index stores:

- route name
- URI
- HTTP methods
- controller/action expression
- middleware
- domain
- group name and URI prefixes
- source file path
- source range

Named routes are exposed as completions inside route-name contexts such as `route('...')`, `to_route('...')`, `redirect()->route('...')`, `Route::is('...')`, `Route::has('...')`, and `request()->routeIs('...')`, with method and URI detail when available. URI parameters such as `{user}` and optional `{team?}` are exposed as key completions inside `route('name', ['...'])`, `to_route('name', ['...'])`, and `redirect()->route('name', ['...'])` parameter arrays. Hover shows route methods, URI, action, middleware, and file path for route names, and route/URI metadata for parameter keys. Go to definition from a known route name or route parameter key resolves to the indexed route declaration range, and references finds matching route names or parameter keys across indexed files. Unknown route names and known-route parameter keys are reported as diagnostics in open documents, with replacement quick fixes for indexed names and parameters.

### Controller Action Parsing

Files scanned:

- `app/Http/Controllers/**/*.php`

Patterns currently extracted:

- controller class name
- namespace
- public action methods, excluding constructor and common framework helper methods

The controller index stores:

- class name
- namespace
- action method names
- action method source ranges when available
- source file path

Controller classes are exposed in route action contexts such as `Route::get('/users', [UserController::class, 'index'])`, `Route::resource('users', UserController::class)`, and `Route::controller(UserController::class)->group(...)`. Route action method strings are completed from indexed controller actions, including string actions inside active controller groups. Known route controller classes and action strings expose hovers, go-to-definition, references, diagnostics, replacement quick fixes, and workspace symbols resolving back to the controller file, with action definitions and symbols landing on the public method name when its range is indexed.

Simple PHP class imports are resolved in these Laravel class-reference contexts, including aliases such as `use App\Http\Controllers\UserController as Users;` and grouped aliases such as `use App\Http\Controllers\{UserController as Users};` before `[Users::class, 'index']`.

### Blade View Name Parsing

Files scanned:

- `resources/views/**/*.blade.php`
- `app/View/Components/**/*.php`

The index converts Blade file paths into Laravel view names:

- `resources/views/dashboard.blade.php` -> `dashboard`
- `resources/views/admin/users/index.blade.php` -> `admin.users.index`
- `resources/views/components/alert.blade.php` -> `components.alert`

Patterns currently extracted:

- parent layouts from `@extends('...')`
- included views from `@include(...)`, `@includeIf(...)`, `@includeWhen(...)`, `@includeUnless(...)`, `@includeFirst(...)`, and `@each(...)`
- sections from `@section('...')`
- yields from `@yield('...')`
- pushes from `@push('...')` and `@prepend('...')`
- stacks from `@stack('...')`
- component usages from `<x-alert>` and `@component('...')`
- component props from `@props([...])`
- component aware props from `@aware([...])`
- class-based component names from `app/View/Components`
- class-based component props from constructor parameters and public properties

View names are exposed as completions inside `view('...')` and common Blade view directives. Child `@section('...')` names are completed, hovered, resolved, diagnosed, referenced, and quick-fixed from the parent layout's indexed `@yield('...')` names when `@extends(...)` can be matched. Child `@push('...')` and `@prepend('...')` names get the same treatment from parent layout `@stack('...')` names. Hover shows Blade file metadata. Go to definition from `view('name')` and common Blade include/component directives resolves to the Blade file, and references finds helper/directive usages across indexed files. Unknown view names are reported as diagnostics in open documents, with replacement quick fixes for close indexed names and a creation quick fix for missing Blade files under `resources/views`.

Anonymous Blade components under `resources/views/components` and class-based components under `app/View/Components` are exposed as completions, hovers, diagnostics, quick fixes, go-to-definition, and references for `<x-...>` tags. Missing anonymous component tags can be created through a quick fix under `resources/views/components`. Their `@props` and `@aware` entries, constructor parameters, or public properties are exposed as prop completions, hovers, go-to-definition, and references inside component tags, and close prop-name typos are diagnosed with replacement quick fixes while common HTML, Alpine, Livewire, ARIA, and data attributes are ignored.

### Livewire Component Indexing

Files scanned: `app/Livewire/**/*.php` (Livewire v3) and `app/Http/Livewire/**/*.php` (v2) for classes extending `Livewire\Component`. Each component stores its kebab-case dot-notation tag name (`App\Livewire\Users\ShowPost` becomes `users.show-post`), public properties, and public action methods (framework lifecycle hooks such as `mount`, `render`, and `updated*` are excluded).

Component names are exposed as completions inside `<livewire:...>` tags and `@livewire('...')` directives, with hover metadata (class, properties, actions), go-to-definition to the component class, unknown-name diagnostics, and replacement quick fixes. Diagnostics stay silent when no Livewire components are indexed so non-Livewire projects are never flagged. Tag attributes after `<livewire:name` complete the component's public properties as kebab-case parameters. Inside a component's own Blade view under `resources/views/livewire/**`, `wire:model` attribute values complete public properties, other `wire:*` handler values complete public action methods, and both navigate to the component class.

### Inertia Page Indexing

Files scanned: `resources/js/Pages/**` (or lowercase `resources/js/pages/**`) with `.vue`, `.jsx`, `.tsx`, `.svelte`, `.js`, and `.ts` extensions, excluding `.d.ts` declarations. The page directory is resolved by its exact on-disk name so case-insensitive filesystems do not index the same tree twice.

Page names such as `Users/Index` are exposed as completions inside `Inertia::render('...')`, the `inertia('...')` helper, and the page argument of `Route::inertia('uri', '...')`. Go to definition resolves the page string to the component file. Unknown page names are reported as diagnostics with replacement quick fixes, and the diagnostic stays silent when the project has no indexed page directory so non-Inertia projects are never flagged.

### Config Key Parsing

Files scanned:

- `config/*.php`

Patterns currently extracted:

- top-level and nested array keys that match `'key' =>` or `"key" =>`
- composed deep paths through nested config arrays

The index prefixes each discovered key with the config file name:

- `config/app.php` key `'name' =>` -> `app.name`
- `config/database.php` key `'connections' =>` -> `database.connections`
- `config/services.php` nested key `'mailgun' => ['domain' => ...]` -> `services.mailgun.domain`

These keys are exposed as completions, hovers, go-to-definition, references, unresolved-key diagnostics, and replacement quick fixes inside `config('...')`.

### Environment Key Parsing

Files scanned:

- `.env`
- `.env.example`

Patterns currently extracted:

- uppercase environment assignments such as `APP_NAME=Laravel` and `DB_HOST=127.0.0.1`

Comments and blank lines are ignored. These keys are exposed as completions, hovers, go-to-definition, references, unresolved-key diagnostics, and replacement quick fixes inside `env('...')`.

### Translation Key Parsing

Files scanned:

- `lang/**/*.php`
- `lang/*.json`
- `resources/lang/**/*.php`
- `resources/lang/*.json`

Patterns currently extracted:

- PHP translation array keys, including nested keys
- JSON translation keys
- locale from the language directory or JSON filename
- group name from PHP translation filenames

The translation index stores:

- translation key
- locale
- source kind (`php` or `json`)
- source file path

Translation keys are exposed as completions, hovers, go-to-definition, references, unresolved diagnostics, and replacement quick fixes inside `__('...')`, `trans('...')`, `trans_choice('...')`, `@lang('...')`, and `@choice('...')`.

### Eloquent Model Parsing

Files scanned:

- `app/Models/**/*.php`
- `app/**/*.php`

Patterns currently extracted:

- PHP class name from `class User`
- namespace from `namespace App\Models;`
- explicit table name from `protected $table`
- inferred table name from the model class name
- `$fillable`, `$guarded`, and `$casts` entries
- local scopes from `scopePopular(...)`
- Laravel 12+ attribute scopes from `#[Scope] protected function popular(...)`
- custom Eloquent builder classes returned by `newEloquentBuilder(...)`
- public methods on custom builder classes that extend `Builder`
- classic `getXxxAttribute()` and Laravel `xxx(): Attribute` virtual accessors
- `SoftDeletes` trait usage
- relationship method names when a public method body calls one of:
  - `hasOne`
  - `hasMany`
  - `belongsTo`
  - `belongsToMany`
  - `morphOne`
  - `morphMany`
  - `morphTo`
  - `morphToMany`
- relationship type and first related model class argument, such as `hasMany(Post::class)`

The model index stores:

- class name
- namespace
- file path
- table name
- fillable fields
- guarded fields
- cast fields
- relationship method names
- relationship type and related model class when available
- virtual accessor names
- SoftDeletes usage
- local scope names
- custom builder class, source file, and public method names when available

Model classes are exposed as completions after simple class-like contexts such as `new`, `extends`, and `implements`. Model instance property access such as `$user->...` and `$this->...` inside model files can complete and hover schema-backed columns, relationship properties, `<relation>_count` values, and virtual accessors when the model can be inferred from local type hints or assignments. Local scopes are exposed on model query calls such as `User::active()` and `User::query()->active()`, with hovers, go-to-definition, references, diagnostics, and replacement quick fixes resolving back to the model source. Custom builder methods returned from `newEloquentBuilder(...)` are exposed on the same query chains, with hovers, go-to-definition, references, diagnostics, and workspace symbols resolving to the builder source file. Eloquent query chains such as `User::query()->...` also complete common builder methods, indexed builder macros, and SoftDeletes helpers when applicable, while column-string arguments such as `User::where('...')` and `User::query()->orderBy('...')` complete migration-derived columns. Relationship names are exposed in relation string calls such as `User::with('...')`, `User::query()->whereHas('...')`, `load('...')`, and `withCount('...')` when the model can be inferred from the call chain, with hovers, go-to-definition, references, diagnostics, and replacement quick fixes showing relation type and related model metadata. Model files also expose generation code actions for missing factories, JSON resources, policies, seeders, and Store/Update FormRequests, using indexed fillable/cast/schema fields to seed factory, resource, and validation rule stubs.

Models, relationships, scopes, and custom builder methods are also exposed as document and workspace symbols so large applications can be navigated through Laravel concepts instead of only PHP filenames.

### Database Schema Parsing

Files scanned:

- `database/migrations/**/*.php`

Patterns currently extracted:

- `Schema::create('table', function (...) { ... })`
- `Schema::table('table', function (...) { ... })`
- common `$table->...('column')` column declarations
- implicit columns from helpers such as `id()`, `timestamps()`, `softDeletes()`, and `rememberToken()`
- column modifiers such as `nullable()`, `unique()`, and `constrained()`

The schema index stores:

- table name
- column name
- column type
- modifiers
- source file path

Inside model `$fillable`, `$guarded`, and `$casts` arrays, the server offers schema column completions for the model's table. Hovers, go-to-definition, references, diagnostics, and replacement quick fixes connect indexed model attributes back to migration-derived schema columns.

### Validation Rule Parsing

Files scanned:

- `app/Http/Requests/**/*.php`
- `app/Http/Controllers/**/*.php`

Patterns currently extracted:

- FormRequest `rules()` methods
- inline `$request->validate([...])` calls
- inline `Validator::make(..., [...])` calls
- string rules such as `'required|email'`
- array rules such as `['nullable', 'integer']`

The validation index stores:

- class name
- namespace
- source file path
- source kind (`formRequest` or `inline`)
- validated field names
- rule names

When a controller action injects a FormRequest as `$request`, the server offers that request's fields inside calls such as `$request->validated('...')`, `$request->input('...')`, and `$request->safe()->only(['...'])`. Inline validation rules are also used for completions in the same file. Known validated request fields expose hovers with rule metadata, go-to-definition back to the FormRequest or inline validation source, and references across indexed request-field usage sites. Unknown validated request fields are reported as diagnostics when a document-specific validation rule set can be inferred, with replacement quick fixes for close indexed field names.

Validation `Rule::exists('table', 'column')` and `Rule::unique('table', 'column')` calls use the migration schema index for table and column completions, hovers, go-to-definition, unresolved table/column diagnostics, and replacement quick fixes.

Rule strings inside `rules()` methods, `$request->validate([...])`, `Validator::make(...)`, and `->sometimes(...)` containers complete built-in Laravel validation rule names in both pipe-separated strings (`'required|string'`) and array elements (`['required', 'string']`). Inline `exists:` and `unique:` rule parameters complete migration-derived table names after the colon and column names after the comma.

Query builder chains starting from `DB::table('...')` (including `DB::connection('...')->table('...')`) complete migration-derived table names in the table argument and column names in common column-string arguments such as `where('...')` and `orderBy('...')`, with schema hovers and go-to-definition to the defining migration. `Storage::disk('...')`, `Storage::drive('...')`, and `Storage::fake('...')` complete disk names derived from the indexed `filesystems.disks.*` config keys.

### Service Container and Authorization Parsing

Files scanned:

- `app/Providers/**/*.php`
- `app/Policies/**/*.php`

Patterns currently extracted:

- `$this->app->bind(...)`
- `$this->app->singleton(...)`
- `$this->app->scoped(...)`
- `$this->app->instance(...)`
- `Gate::define('ability', ...)`
- `Gate::policy(Model::class, Policy::class)`
- provider `$policies = [Model::class => Policy::class]`
- public policy methods such as `viewAny`, `view`, `create`, `update`, and `delete`

The service container index stores:

- abstract binding key
- concrete implementation when available
- binding lifetime
- source file path

The authorization index stores:

- ability name
- source kind (`gate`, `policy`, or `policyMap`)
- model and policy class when available
- source file path

Container bindings are exposed as binding-name completions inside the string argument of every container resolution entry point — the `app('...')` and `resolve('...')` helpers, plus the `make`, `makeWith`, `get`, `factory`, `bound`, and `has` methods called on the `App` facade, the `app()` helper, a service provider's `$this->app`, or `Container::getInstance()` — with hovers, go-to-definition, references, diagnostics, and replacement quick fixes resolving back to indexed provider entries.

When the argument is a class or interface name (`app(Foo::class)`, `App::make(Foo::class)`, `$this->app->makeWith(Bar::class, ...)`, and the `build`/`get`/`factory` forms), the server completes indexed PHP class, interface, trait, and enum names. Chaining off a resolution call, or off a variable it was assigned to (`App::make(Foo::class)->`, or `$service->` after `$service = app(Foo::class)` or a matching `@var` docblock), completes and navigates the members of the resolved type and its bound concrete. Constructor interface type hints continue to resolve to the bound concrete class. The full set of entry points lives in one place (`server/src/containerResolution.ts`) so completion, type inference, definition, hover, and references stay in sync. The `resolve()` container method is intentionally excluded because it is protected, and `call`/`wrap`/`tagged`/`bind`/`singleton` are excluded because their first argument is not a resolvable class name.

Authorization abilities are exposed inside `can('...')`, `authorize('...')`, `Gate::allows('...')`, `@can('...')`, and related calls, with hovers, go-to-definition, references, diagnostics, and replacement quick fixes resolving to indexed gate or policy sources.

### Service Provider Discovery

Files scanned:

- `app/Providers/**/*.php`
- `bootstrap/providers.php`
- `config/app.php`
- `composer.json`

Patterns currently extracted:

- provider classes that extend `ServiceProvider`
- static provider registrations in `bootstrap/providers.php`
- legacy provider registrations under `config/app.php` `providers`
- package providers from `composer.json` `extra.laravel.providers`

The provider index stores:

- provider class name
- namespace
- source kind (`class`, `bootstrap`, `config`, or `composer`)
- registration/source file path
- provider class file path when it can be matched to an indexed application provider

Service provider classes are exposed in provider arrays with completions. Known provider registrations expose hovers, go-to-definition, references, diagnostics, and replacement quick fixes back to indexed provider classes when available.

### Facade and Macro Parsing

Files scanned:

- `app/Facades/**/*.php`
- `config/app.php`
- `app/**/*.php`

Patterns currently extracted:

- custom facade classes that extend `Facade`
- `getFacadeAccessor()` return values
- framework default root aliases such as `Auth`, `DB`, `Route`, `Schema`, and `View`
- legacy `config/app.php` aliases
- macro declarations such as `Str::macro('headlineSlug', ...)`
- macro declarations on namespaced classes such as `App\Support\Money::macro('formatted', ...)`

The facade index stores:

- class name
- namespace
- facade accessor
- alias target class when available
- matching service container binding when the accessor matches an indexed abstract key
- source file path

The macro index stores:

- target class
- macro method name
- source file path

Custom facades and root aliases such as `\Auth::...` are exposed in class-like completion contexts and known static calls such as `Reports::...`, with hovers, go-to-definition, and references resolving back to the indexed facade file, config alias, or framework facade class path. When the facade accessor matches an indexed container binding, completions, hovers, and document symbols also show the binding lifetime, concrete implementation, and binding source. Macro methods are exposed on static calls such as `Str::...` when the macro target is known, with hovers, go-to-definition, and references resolving back to the indexed macro declaration file.

### Factory and Seeder Parsing

Files scanned:

- `database/factories/**/*.php`
- `database/seeders/**/*.php`

Patterns currently extracted:

- factory class name and namespace
- factory `$model` target
- fields returned from `definition()`
- public factory state methods
- seeder class name and namespace
- seeder `$this->call(...)` class references

The factory index stores:

- factory class
- target model
- definition fields
- state method names
- source file path

The seeder index stores:

- seeder class
- called seeders
- source file path

Factory state methods are exposed on calls like `User::factory()->...`, with hovers, go-to-definition, references, diagnostics, and replacement quick fixes resolving to indexed factory files. Seeder classes are exposed inside seeder `call([...])` arrays, with completions, hovers, go-to-definition, references, diagnostics, and replacement quick fixes resolving to indexed seeder files.

### Artisan Command Parsing

Files scanned:

- `app/Console/Commands/**/*.php`
- `routes/console.php`

Patterns currently extracted:

- class command signatures from `protected $signature`
- class command descriptions from `protected $description`
- closure command signatures from `Artisan::command(...)`
- scheduled command strings from `Schedule::command(...)`

The command index stores:

- command name
- full signature
- description when available
- class name and namespace when available
- source kind (`class` or `closure`)
- source file path

Command names are exposed inside `Artisan::call('...')`, `Artisan::queue('...')`, command `$this->call('...')`, `Schedule::command('...')`, and scheduler `->command('...')` calls, with hovers, go-to-definition, references, diagnostics, and replacement quick fixes resolving to indexed class or closure command sources.

### Middleware Alias Parsing

Files scanned:

- `bootstrap/app.php`
- `app/Http/Kernel.php`

Patterns currently extracted:

- Laravel 11+ aliases from `$middleware->alias([...])`
- legacy aliases from `$middlewareAliases`
- legacy aliases from `$routeMiddleware`

The middleware index stores:

- alias name
- middleware class when available
- source kind (`bootstrap` or `kernel`)
- source file path

Middleware aliases are exposed inside `Route::middleware('...')`, route chain `->middleware('...')`, `withoutMiddleware('...')`, and array forms such as `Route::middleware(['...'])`, with hovers, go-to-definition, references, diagnostics, and replacement quick fixes resolving to indexed middleware configuration sources.

### Application Artifact Parsing

Files scanned:

- `app/Events/**/*.php`
- `app/Http/Resources/**/*.php`
- `app/Jobs/**/*.php`
- `app/Listeners/**/*.php`
- `app/Mail/**/*.php`
- `app/Notifications/**/*.php`

Patterns currently extracted:

- event, resource, job, listener, mailable, and notification class names
- namespaces
- constructor parameter signatures
- listener `handle(Event $event)` parameter classes
- related classes referenced through `new ClassName(...)`
- dispatched classes referenced through `ClassName::dispatch(...)`

The artifact index stores:

- class name
- namespace
- artifact kind
- constructor signature when available
- related classes
- source file path

Artifacts are exposed in class-like completion contexts. Event completions are also exposed in `event(new ...)`, events and jobs in static `::dispatch(...)` contexts, and mailables/notifications in `send(new ...)`, `queue(new ...)`, and `later(new ...)` contexts. Known artifact class references in those contexts expose hovers, go-to-definition, and references back to indexed artifact files, with constructor signatures shown in completion detail and hover when available.

### Class Implementation Navigation

The server indexes every declared `class`, `interface`, `trait`, and `enum` under `app/` and any `modules/` roots, together with the fully-qualified names each one extends and implements.

Files scanned:

- `app/**/*.php`
- `<modules>/**/*.php`

Patterns currently extracted:

- class, interface, trait, and enum declarations, including `abstract`, `final`, and `readonly` modifiers
- resolved `extends` parents (one for a class or enum, several for an interface)
- resolved `implements` interfaces, including enum backing types such as `enum Status: string implements HasColor`
- public method declarations, excluding PHP magic methods
- multi-line `extends` and `implements` clauses

The class index stores:

- fully-qualified name
- short name and namespace
- declaration kind and modifiers
- resolved extends and implements targets
- the source range of the type name for navigation
- public method names and source ranges for usage CodeLens and member navigation

This backs the LSP implementation provider (`textDocument/implementation`). Invoking "Go to Implementation" (bound to `shift-f12` by default in Zed) on an abstract class, interface, or any reference to one — its declaration, an `extends`/`implements` clause, a `use` import, or a `Foo::class` reference — lists every type that extends or implements it, transitively. This mirrors the subclass and implementer navigation offered by dedicated PHP IDEs and works without an Intelephense premium license.

The feature is enabled by default and can be turned off; see [Zed Settings](#zed-settings).

### Usage CodeLens

Laravel Assist advertises LSP CodeLens entries for indexed PHP class names and public method names. When Zed's `code_lens` setting is `on` or `menu`, each lens resolves to a usage count such as `1 usage` or `3 usages`. Clicking the lens opens Zed's reference locations for the counted usages.

Zed's `code_lens` setting only controls whether the editor requests and renders CodeLens UI. Laravel Assist still has to advertise `textDocument/codeLens` and return the usage data. If `code_lens` is off, these lenses are hidden; if another PHP language server provides its own CodeLens entries, Zed can render those separately too.

Class usage counts include conservative PHP class-reference sites such as `new Foo`, `Foo::class`, `Foo::bar()`, type hints, `extends`, `implements`, `instanceof`, and `catch` clauses. Import-only `use Foo;` lines and the class declaration itself are not counted.

Method usage counts currently cover typed variable calls, `$this->typedProperty->method(...)`, container-resolved calls such as `app(Foo::class)->method(...)`, direct static calls, `self::method(...)` inside the declaring class, and indexed Laravel route actions such as `[UserController::class, 'show']`.

### Helper Completions

When the cursor is not inside one of the indexed string contexts, the server currently offers snippets for common Laravel helpers:

- `route('$1')`
- `view('$1')`
- `config('$1')`
- `env('$1')`
- `app($1)`
- `resolve($1)`

### Known Parser Limits

This first parser is not yet a full PHP parser. It does not currently understand:

- dynamically generated route names
- complex multi-line route declarations and advanced route group composition
- dynamic controller references and route actions outside common route array/resource patterns
- complex migration expressions and database state outside migration files
- dynamic validation rule arrays and complex request variable flow
- dynamic container bindings and complex policy discovery
- dynamically composed middleware aliases and package-provided middleware aliases
- runtime macros registered through package bootstrapping
- complex factory model inference and dynamic seeder calls
- dynamically registered commands outside `app/Console/Commands` and `routes/console.php`
- dynamic artifact discovery outside conventional Laravel directories
- vendor/package translation namespaces
- dynamic Blade view/component names and class-based component discovery
- dynamic imports and complex class aliasing outside the conservative PHP import resolver
- PHP attributes
- anonymous classes
- dynamic package-provided Laravel conventions beyond composer provider discovery

Those are planned areas for the language server as the project moves from foundation work toward Laravel Idea-like quality.

## Architecture

The project is split into two parts:

- `src/lib.rs`: Zed extension code compiled to WebAssembly.
- `server/`: TypeScript Language Server that speaks LSP over stdio.

Zed already supports PHP through PHP language servers such as Phpactor, Intelephense, and PHP Tools. Laravel Assist is designed to complement those tools with Laravel-specific intelligence instead of replacing general PHP analysis.

## Local Development

Install and build the language server bundle first:

```sh
cd server
npm install
npm run build
```

This produces a single-file bundle at `server/dist/index.cjs`. Published Zed builds do not embed this bundle into `extension.wasm`; the Rust extension downloads the matching GitHub-hosted server asset at runtime through `zed_extension_api::download_file`.

At runtime the extension stores the downloaded bundle in its Zed work directory and launches it through Zed's bundled Node runtime:

```text
<zed-work-dir>/laravel-assist-server-v0.0.1.cjs --stdio
```

This is required because Zed extensions run in a WASI sandbox that can only access their own work directory, never the extension source checkout. After changing server code, rebuild the bundle and publish a matching downloadable server asset before expecting the registry extension to use it.

For the repeatable local update flow, run:

```sh
./scripts/rebuild-dev-extension.sh
```

Release and registry-readiness checks are documented in [docs/DISTRIBUTION.md](docs/DISTRIBUTION.md).

## Zed Settings

After installing the extension locally in Zed, enable the language server for PHP:

```json
{
  "code_lens": "on",
  "inlay_hints": {
    "enabled": true,
    "show_type_hints": true
  },
  "languages": {
    "PHP": {
      "language_servers": ["laravel-assist", "..."]
    }
  }
}
```

Route URL inlay hints for `router.php` files are controlled by Zed's type inlay hint setting. If route URL hints do not appear next to `Route::get(...)`, `Route::post(...)`, or similar calls, make sure `show_type_hints` is set to `true`.

Usage CodeLens entries for PHP classes and public methods are controlled by Zed's `code_lens` setting. The setting enables the editor surface; Laravel Assist supplies the actual `textDocument/codeLens` results and resolves them to usage counts.

Blade support will depend on the active Zed language name exposed by the Blade extension installed in the editor.

### Turning Off Go to Implementation

[Class implementation navigation](#class-implementation-navigation) is on by default. If a licensed PHP language server already provides "Go to Implementation" and you would rather that server own it, turn the Laravel Assist provider off through the language server's initialization options:

```json
{
  "lsp": {
    "laravel-assist": {
      "initialization_options": {
        "implementations": { "enabled": false }
      }
    }
  }
}
```

Zed forwards `initialization_options` to the language server only when it starts, so restart the language server (or Zed) after changing this. With the provider off, Laravel Assist no longer advertises the implementation capability and Zed falls back to any other PHP language server for `shift-f12`.

## Roadmap

See [docs/ROADMAP.md](docs/ROADMAP.md).

## License

MIT
