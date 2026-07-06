# Laravel Assist for Zed

Laravel Assist is an experimental Zed extension that aims to bring Laravel-aware IDE support to Zed.

The long-term goal is a development experience closer to dedicated Laravel IDE tooling: routes, config keys, views, Eloquent models, relationships, factories, requests, policies, and service container bindings should be discoverable through completions, navigation, hovers, diagnostics, and code actions.

## Status

This repository is in the foundation phase.

Current scope:

- Zed extension manifest and Rust entrypoint
- Node-based Laravel-aware Language Server
- Workspace detection for Laravel projects
- Early completions for `route()`, `to_route()`, redirect route helpers, route parameter arrays, `view()`, Blade sections/stacks, `config()`, `env()`, controllers, models, model properties, Eloquent query columns/scopes/custom builders/builder methods, validation Rule schema tables/columns, service providers, facade aliases, application artifacts, and common Laravel helpers
- Early go-to-definition support for named routes, route parameters, controller actions, Blade views/components/component props/sections/stacks, config/env keys, translations, authorization abilities, container bindings, Artisan commands, middleware aliases, service providers, Eloquent relations/scopes/custom builders, validated request fields, and validation Rule schema tables/columns
- Early references support for named routes, route parameters, controller actions, Blade views/components/component props/sections/stacks, config/env keys, translations, authorization abilities, container bindings, Artisan commands, middleware aliases, service providers, Eloquent relations/scopes/custom builders, and validated request fields
- Early document/workspace symbols for indexed Laravel routes, controllers/actions, views, components, config/env keys, models, schema, translations, commands, middleware, bindings, authorization, service providers, factories, seeders, Eloquent custom builders, and application artifacts
- Early hover support for named routes, route parameters, controller actions, Blade views/components/component props/sections/stacks, config/env keys, translations, authorization abilities, container bindings, Artisan commands, middleware aliases, service providers, facade aliases, application artifacts, model properties, Eloquent relations/scopes/custom builders, validated request fields, and validation Rule schema tables/columns
- Early diagnostics for unresolved route, route parameter, controller action, view, component, component prop, Blade section/stack, config, env, translation, authorization, container, command, middleware, service provider, Eloquent relation/scope, factory state, seeder, validated request field, and validation Rule schema references
- Early quick-fix and generation code actions for unresolved route, view, component, component prop, Blade section/stack, config, env, translation, authorization, container, command, middleware, factory state, seeder, validated request field, and validation Rule schema references, missing Blade view/component creation, and model-based factory/resource/policy/seeder/FormRequest creation
- Project indexing for routes, controllers/actions, Blade views/components, Artisan commands, middleware aliases, service providers, config files, env keys, translations, service bindings, authorization, facades, macros, factories, seeders, Laravel application artifacts, model classes, migration schema, and validation rules
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

Container bindings are exposed inside `app('...')`, `resolve('...')`, and `App::make('...')`, with hovers, go-to-definition, references, diagnostics, and replacement quick fixes resolving back to indexed provider entries. Authorization abilities are exposed inside `can('...')`, `authorize('...')`, `Gate::allows('...')`, `@can('...')`, and related calls, with hovers, go-to-definition, references, diagnostics, and replacement quick fixes resolving to indexed gate or policy sources.

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

This produces a single-file bundle at `server/dist/index.cjs`. Published Zed builds do not embed this bundle into `extension.wasm`; the Rust extension downloads the matching GitHub release asset at runtime through `zed_extension_api::download_file`.

At runtime the extension stores the downloaded bundle in its Zed work directory and launches it through Zed's bundled Node runtime:

```text
<zed-work-dir>/laravel-assist-server-v0.0.1.cjs --stdio
```

This is required because Zed extensions run in a WASI sandbox that can only access their own work directory, never the extension source checkout. After changing server code, rebuild the bundle and publish a matching release asset before expecting the registry extension to use it.

For the repeatable local update flow, run:

```sh
./scripts/rebuild-dev-extension.sh
```

Release and registry-readiness checks are documented in [docs/DISTRIBUTION.md](docs/DISTRIBUTION.md).

## Zed Settings

After installing the extension locally in Zed, enable the language server for PHP:

```json
{
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

Blade support will depend on the active Zed language name exposed by the Blade extension installed in the editor.

## Roadmap

See [docs/ROADMAP.md](docs/ROADMAP.md).

## License

MIT
