# Laravel Assist for Zed

Laravel Assist is an experimental Zed extension that aims to bring Laravel-aware IDE support to Zed.

The long-term goal is a development experience closer to dedicated Laravel IDE tooling: routes, config keys, views, Eloquent models, relationships, factories, requests, policies, and service container bindings should be discoverable through completions, navigation, hovers, diagnostics, and code actions.

## Status

This repository is in the foundation phase.

Current scope:

- Zed extension manifest and Rust entrypoint
- Node-based Laravel-aware Language Server
- Workspace detection for Laravel projects
- Early completions for `route()`, `view()`, `config()`, `env()`, models, and common Laravel helpers
- Project indexing for routes, views, config files, env keys, and model classes

## Current Parsing and Indexing

The current language server includes a conservative, regex-based Laravel indexer. It is intentionally small and easy to replace with a real PHP AST parser later.

### Laravel Workspace Detection

The server treats a workspace as a Laravel project when either of these signals is present:

- an `artisan` file at the workspace root
- `composer.json` requiring `laravel/framework`, `illuminate/support`, or `orchestra/testbench`

If the workspace does not look like Laravel, the language server stays idle and returns no Laravel completions.

### Route Name Parsing

Files scanned:

- `routes/**/*.php`

Patterns currently extracted:

- chained route names such as `Route::get(...)->name('dashboard')`
- route group name prefixes such as `Route::name('admin.')`

The index stores:

- route name
- source file path

These names are exposed as completions inside `route('...')`.

### Blade View Name Parsing

Files scanned:

- `resources/views/**/*.blade.php`

The index converts Blade file paths into Laravel view names:

- `resources/views/dashboard.blade.php` -> `dashboard`
- `resources/views/admin/users/index.blade.php` -> `admin.users.index`

These names are exposed as completions inside `view('...')`.

### Config Key Parsing

Files scanned:

- `config/*.php`

Patterns currently extracted:

- top-level and nested array keys that match `'key' =>` or `"key" =>`

The index prefixes each discovered key with the config file name:

- `config/app.php` key `'name' =>` -> `app.name`
- `config/database.php` key `'connections' =>` -> `database.connections`

These keys are exposed as completions inside `config('...')`.

Current limitation: nested keys are detected as individual keys but are not yet composed into full deep paths such as `database.connections.mysql.host`.

### Environment Key Parsing

Files scanned:

- `.env`
- `.env.example`

Patterns currently extracted:

- uppercase environment assignments such as `APP_NAME=Laravel` and `DB_HOST=127.0.0.1`

Comments and blank lines are ignored. These keys are exposed as completions inside `env('...')`.

### Eloquent Model Parsing

Files scanned:

- `app/Models/**/*.php`
- `app/**/*.php`

Patterns currently extracted:

- PHP class name from `class User`
- namespace from `namespace App\Models;`
- relationship method names when a public method body calls one of:
  - `hasOne`
  - `hasMany`
  - `belongsTo`
  - `belongsToMany`
  - `morphOne`
  - `morphMany`
  - `morphTo`
  - `morphToMany`

The model index stores:

- class name
- namespace
- file path
- relationship method names

Model classes are exposed as completions after simple class-like contexts such as `new`, `extends`, and `implements`.

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
- nested route group name composition
- deep config path composition
- imported class aliases
- PHP attributes
- anonymous classes
- service container bindings
- facades, macros, custom builders, or package-provided Laravel conventions

Those are planned areas for the language server as the project moves from foundation work toward Laravel Idea-like quality.

## Architecture

The project is split into two parts:

- `src/lib.rs`: Zed extension code compiled to WebAssembly.
- `server/`: TypeScript Language Server that speaks LSP over stdio.

Zed already supports PHP through PHP language servers such as Phpactor, Intelephense, and PHP Tools. Laravel Assist is designed to complement those tools with Laravel-specific intelligence instead of replacing general PHP analysis.

## Local Development

Install and build the language server:

```sh
cd server
npm install
npm run build
```

When developing the Zed extension locally, the Rust extension currently launches:

```text
server/dist/index.js --stdio
```

through Zed's bundled Node runtime.

## Zed Settings

After installing the extension locally in Zed, enable the language server for PHP:

```json
{
  "languages": {
    "PHP": {
      "language_servers": ["laravel-assist", "..."]
    }
  }
}
```

Blade support will depend on the active Zed language name exposed by the Blade extension installed in the editor.

## Roadmap

See [docs/ROADMAP.md](docs/ROADMAP.md).

## License

MIT
