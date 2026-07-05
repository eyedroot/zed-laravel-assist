# Architecture

Laravel Assist has two layers.

## Zed Extension

The Zed extension is intentionally small. It owns:

- `extension.toml` metadata
- language server registration
- launching the language server with Zed's Node runtime
- passing user settings and initialization options later

Zed extensions do not provide arbitrary IDE UI surfaces. Advanced behavior should flow through LSP capabilities such as completion, hover, definition, references, diagnostics, code actions, semantic tokens, and workspace commands.

## Language Server

The language server owns Laravel knowledge:

- project detection
- source indexing
- completion generation
- document and workspace symbol generation from cached Laravel metadata
- hover generation for indexed route, route parameter, Blade view, Blade component, Blade component prop, Blade section, Blade stack, config, env, translation, authorization, container, command, middleware, validated request field, and validation Rule schema references
- go-to-definition generation for indexed route, route parameter, Blade view, Blade component, Blade component prop, Blade section, Blade stack, config, env, translation, authorization, container, command, middleware, validated request field, and validation Rule schema references
- references generation for indexed route, route parameter, Blade view, Blade component, Blade component prop, Blade section, Blade stack, config, env, translation, authorization, container, command, middleware, and validated request field references
- diagnostics for unresolved route, route parameter, Blade view, Blade component, Blade component prop, Blade section, Blade stack, config, env, translation, authorization, container, command, middleware, factory state, seeder, validated request field, and validation Rule schema references
- quick-fix code actions for unresolved route, route parameter, Blade view, Blade component, Blade component prop, Blade section, Blade stack, config, env, translation, authorization, container, command, middleware, factory state, seeder, validated request field, and validation Rule schema diagnostics, including safe missing Blade file creation
- future broader code actions

The server is written in TypeScript because the LSP ecosystem and Zed Node runtime make iteration fast. The implementation should remain parser-friendly and testable so PHP parsing can evolve from conservative regex scanning to a proper PHP AST when needed.

## Indexing Strategy

Initial indexes are intentionally conservative:

- route graph entries from `routes/**/*.php`
- controller classes and actions from `app/Http/Controllers`
- Blade view graph from `resources/views/**/*.blade.php`, anonymous components, and class-based components from `app/View/Components`
- Artisan commands from `app/Console/Commands` and `routes/console.php`
- middleware aliases from `bootstrap/app.php` and `app/Http/Kernel.php`
- config keys and deep config paths from `config/*.php`
- env keys from `.env` and `.env.example`
- translation keys from `lang` and `resources/lang`
- service container bindings and authorization abilities from providers and policies
- service provider classes and registrations from app providers, bootstrap providers, config, and composer metadata
- custom facades and macros from application PHP files
- factories and seeders from `database/factories` and `database/seeders`
- application artifacts from `app/Events`, `app/Listeners`, `app/Jobs`, `app/Mail`, `app/Notifications`, and `app/Http/Resources`
- model classes from `app/Models/**/*.php`
- database schema from `database/migrations/**/*.php`
- validation rules from FormRequests and controller validation calls

Route entries store route name, URI, HTTP methods, action expression, middleware, domain, group prefixes, controller group context, source file, and source range. Route-name providers cover `route(...)`, `to_route(...)`, `redirect()->route(...)`, `Route::is(...)`, `Route::has(...)`, and `routeIs(...)` contexts. URI parameter completions, hovers, definitions, references, diagnostics, and quick fixes derive keys from indexed segments such as `{user}` and `{team?}` in `route(...)`, `to_route(...)`, and `redirect()->route(...)` parameter arrays. Controller entries store class, namespace, action method names, optional public method ranges, and source file. Together they let route declarations expose controller class/action completions, hovers, definitions, references, diagnostics, quick fixes, and workspace symbols while keeping route parsing independent from controller file parsing. Route action providers also infer active `Route::controller(...)->group(...)` context for string action references inside the group body.

Model entries store class, namespace, table name, fillable fields, guarded fields, casts, relationships, relationship targets, local scopes, and custom builder metadata when `newEloquentBuilder(...)` can be resolved. Schema entries store migration-derived tables and columns. Together they provide the first Eloquent field-completion, relationship-completion, scope-completion, and custom-builder-completion paths while keeping database-derived knowledge in its own cache shard.

Blade view entries store view name, source file, parent layout, includes, sections, yields, pushes, stacks, component usages, and `@props`/`@aware` declarations. Child view section-name providers derive completions, hovers, definitions, references, diagnostics, and quick fixes by matching the child's indexed parent layout to the layout's indexed yield names. Child view stack-name providers do the same for `@push(...)` and `@prepend(...)` against parent layout `@stack(...)` names. Anonymous components are derived from `resources/views/components/**/*.blade.php`; class-based components are indexed from `app/View/Components/**/*.php` with constructor parameters and public properties as props. Both feed the same component completion surface. Component prop providers expose hovers, definitions, and references from tag attributes back to the indexed component file, and prop diagnostics only report close matches to indexed props while ignoring common HTML, Alpine, Livewire, ARIA, and data attributes.

Command entries store command name, full signature, optional description, source kind, class, namespace, and source file. They are separate from route and model shards so console-heavy applications can refresh command metadata without touching HTTP route or Eloquent indexes.

Middleware entries store alias, target class, source kind, and source file. They are intentionally separate from route entries because routes consume middleware aliases while middleware configuration lives in framework bootstrap files.

Config and env entries store keys, source files, and source ranges. Config entries include composed nested paths such as `services.mailgun.domain`, while env entries map uppercase assignments from `.env`-style files. Both retain simple string key lists for completion and diagnostics while exposing richer metadata for hover, go-to-definition, and references.

Validation entries store FormRequest and inline validation fields with rule names. They support request-field completions, hovers, go-to-definition, references, diagnostics, and replacement quick fixes, and are kept as their own shard because the same PHP file may also contribute model or controller metadata later.

Translation entries store key, locale, source file, and source kind for PHP array and JSON language files. They are isolated from config and env shards so package namespaces and loader-specific behavior can be added later without changing completion consumers.

Container entries store abstract key, concrete implementation, lifetime, and source file. Authorization entries store gate abilities, policy maps, and policy method abilities. They are separate shards because providers often mix unrelated Laravel bootstrapping concerns in the same file.

Provider entries store provider class name, namespace, source kind, registration/source file, and matched class file when available. This lets `bootstrap/providers.php`, legacy `config/app.php`, and package `composer.json` provider declarations participate in completions, hovers, definitions, references, diagnostics, quick fixes, and workspace symbols without forcing the container-binding shard to understand package discovery.

Facade entries store class, namespace, accessor, and source file. During index aggregation, simple facade accessors are linked to matching service container bindings so completions, hovers, and document symbols can show binding lifetime, concrete implementation, and binding source without merging the cache shards. Known facade static calls use this shard for completions, hovers, go-to-definition, and references. Macro entries store target class, method name, and source file. Known macro calls use this shard for completions, hovers, go-to-definition, and references. They intentionally share the same file-level cache architecture because macros are often registered in providers while facade classes live under separate application paths.

Factory entries store target model, definition fields, state methods, and source file. Factory state calls use this shard for completions, hovers, go-to-definition, references, diagnostics, and replacement quick fixes. Seeder entries store seeder class, called seeders, and source file. Seeder `call([...])` class references use this shard for completions, hovers, go-to-definition, references, diagnostics, and replacement quick fixes. They are separate shards from model/schema data so factory-heavy projects can refresh test-data helpers independently.

Artifact entries store class, namespace, artifact kind, related classes, and source file for events, listeners, jobs, mailables, notifications, and API resources. Known artifact class references use this shard for completions, hovers, go-to-definition, and references in common Laravel contexts such as `event(new ...)`, `dispatch(new ...)`, `Job::dispatch()`, and mail/notification send calls. They live in their own shard so large app-layer directories can refresh independently from model, macro, and validation metadata.

Document and workspace symbols are generated from the cached index instead of reparsing files on demand. This keeps global Laravel navigation fast in large projects while covering routes, controllers/actions, views, Blade components, config keys, env keys, models, relationships, scopes, custom builder methods, schema tables and columns, translations, commands, middleware aliases, container bindings, authorization abilities, service providers, factories, seeders, macros, facades, and application artifacts.

Code actions consume diagnostics and cached index data. Replacement quick fixes suggest close existing route, route parameter, controller action, view, component, component prop, Blade section, Blade stack, config, and env names. Missing Blade view and anonymous component diagnostics can also produce `WorkspaceEdit` file-creation actions, with Laravel names constrained to safe path segments before mapping them into `resources/views` or `resources/views/components`. Model files can produce factory, JSON resource, policy, seeder, and Store/Update FormRequest generation actions when those related files are not already present in the index.

Definition, hover, diagnostics, quick-fix, and reference providers share the same string-context recognition strategy as completions. When indexed entries carry source paths, such as translations, authorization abilities, service container bindings, Artisan commands, and middleware aliases, the language server resolves from Laravel string references back to the cached source file without reparsing the project. Laravel class-reference contexts also pass through a conservative PHP import resolver for simple `use ...;`, `use ... as ...;`, and grouped `use Foo\{Bar as Baz};` aliases before matching indexed controllers, providers, facades, macros, seeders, artifacts, and Eloquent metadata.

Eloquent providers use the model and schema shards together. Relation string references and local scope method calls resolve to the owning model file, while custom builder method calls resolve to the indexed builder file when the model's `newEloquentBuilder(...)` return type can be matched. Hovers show relation type, related model, table, builder class, return type, and source file where available. Diagnostics and replacement quick fixes use the same model metadata to catch unknown relations and scopes while allowing known custom builder methods. Model `$fillable`, `$guarded`, and `$casts` array strings use the model table name to resolve, reference, diagnose, fix, and describe migration-derived schema columns. Validation `Rule::exists(...)` and `Rule::unique(...)` string arguments also use the schema shard for table/column completion, hover, definition, diagnostics, and replacement quick fixes.

## Cache and Incremental Indexing

The language server keeps a project index in memory and persists a file-level cache to the user's cache directory. Cache entries are keyed by absolute file path and include:

- index kind
- file signature (`mtimeMs` and size)
- extracted entries

The persistent cache key includes both index kind and file path, allowing multiple independent shards for the same source file.

On refresh, the indexer discovers candidate files, reuses unchanged cache entries, reindexes changed files, and drops removed files. This keeps large Laravel projects from paying a full parsing cost after every save.

File saves and watched file changes are debounced before refreshing. If another change arrives during an active index build, the server queues one more refresh after the current build finishes.

This cache layer is intentionally generic so future Laravel Idea-like indexes can reuse it for migrations, database columns, translations, form requests, Blade components, factories, policies, routes, and package metadata.

Future indexes should include:

- package-provided relation metadata
- Pest/PHPUnit test helpers
