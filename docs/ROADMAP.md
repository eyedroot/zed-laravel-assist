# Roadmap

## Phase 0: Foundation

- Zed extension manifest and Rust entrypoint
- TypeScript LSP server over stdio
- Laravel project detection
- Basic project indexing
- Basic completion tests

## Phase 1: Daily Laravel Completions

- [x] `route()` / `to_route()` / redirect route-name completions
- [x] route parameter array key completions
- [x] `view()` and Blade directive view-name completions
- [x] Blade section, stack, component, and component prop completions
- [x] `config()` and `env()` key completions
- [x] model class and model property completions
- [x] Eloquent relation, scope, custom builder, query column, builder method, macro, and SoftDeletes completions
- [x] validation Rule schema table/column completions
- [x] service provider, facade alias, artifact, factory state, seeder, command, middleware, authorization, and container completions
- [x] common helper completions

## Phase 2: Navigation

- [x] go to route declarations and route parameter declarations
- [x] go to view, Blade component, section, stack, and component prop sources
- [x] go to config, env, translation, validation field, and schema sources
- [x] go to controller classes/actions and `Controller@action` string targets
- [x] go to Eloquent relation, scope, custom builder, and model property sources
- [x] go to service provider, facade alias, artifact, command, middleware, authorization, container, factory, and seeder sources
- [x] find references for the same indexed Laravel concepts where source ranges are available

## Phase 3: Eloquent Intelligence

- [x] relationship name/type/related model discovery
- [x] local scopes and Laravel attribute scopes
- [x] casts, fillable/guarded, schema-backed attributes, and virtual accessors
- [x] `$model->...` and `$this->...` model property completion/hover
- [x] custom Eloquent builders from `newEloquentBuilder(...)`
- [x] query column completions in common builder methods
- [x] builder method, macro, and SoftDeletes helper completions
- [x] factories and states

## Phase 4: Laravel Diagnostics

- [x] unknown route names and route parameter keys
- [x] missing views, Blade components, component props, sections, and stacks
- [x] missing config, env, translation, validation field, and validation Rule schema references
- [x] controller action mismatch
- [x] unresolved middleware, command, authorization, container, service provider, factory, and seeder references
- [x] unresolved Eloquent relations and scopes
- [x] policy/request/resource naming mismatch

## Phase 5: Distribution

- [x] bundle the TypeScript language server into the Zed extension wasm
- [x] local install flow documentation
- [x] publish-ready language server package metadata and dry-run packaging
- [x] robust Zed extension install/update flow
- [x] extension registry readiness checklist
- [x] fixture projects for regression tests

## Phase 6: Editor Surface (shipped, previously undocumented)

- [x] hover documentation for indexed Laravel concepts (routes, views, config/env, translations, models, validation, artifacts, facades, middleware, container, authorization)
- [x] quick fixes for diagnostics: typo replacement across indexed concepts and `Auth::user()` type narrowing
- [x] document and workspace symbols for indexed Laravel concepts
- [x] route inlay hints (method, URI, and route name at declaration lines)
- [x] Eloquent builder chain completions, dispatch constructor signatures, and root facade aliases (Laravel Idea parity P1-P3)

## Phase 7: Laravel Idea Parity — Remaining Absorption

- [x] validation rule name completions inside rule strings (`required|string|exists:table,column`)
- [x] `DB::table(...)` table name and chained column completions, hover, and definitions
- [x] `Storage::disk(...)` disk name completions from filesystems config
- [x] Inertia page completions, navigation, missing-page diagnostics, and typo quick fixes
- [ ] Livewire component intelligence (deferred: needs a Livewire fixture project)
- [ ] code generation commands (deferred: LSP quick fixes only, no file scaffolding yet)
