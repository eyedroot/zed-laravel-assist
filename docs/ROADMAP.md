# Roadmap

## Phase 0: Foundation

- Zed extension manifest and Rust entrypoint
- TypeScript LSP server over stdio
- Laravel project detection
- Basic project indexing
- Basic completion tests

## Phase 1: Daily Laravel Completions

- `route()` name completions
- `view()` name completions
- `config()` key completions
- `env()` key completions
- model class completions
- common helper completions
- relationship method completions

## Phase 2: Navigation

- go to route declaration
- go to view file
- go to config key
- go to model class
- find route usages
- find view usages

## Phase 3: Eloquent Intelligence

- relationship return type discovery
- local scopes
- casts and attributes
- fillable/guarded hints
- factories and states
- query builder macro support

## Phase 4: Laravel Diagnostics

- unknown route names
- missing views
- missing config keys
- stale env key usage
- controller action mismatch
- policy/request/resource naming mismatch

## Phase 5: Distribution

- publish language server package
- robust Zed extension install/update flow
- extension registry readiness
- fixture projects for regression tests

