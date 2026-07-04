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
- future diagnostics and navigation

The server is written in TypeScript because the LSP ecosystem and Zed Node runtime make iteration fast. The implementation should remain parser-friendly and testable so PHP parsing can evolve from conservative regex scanning to a proper PHP AST when needed.

## Indexing Strategy

Initial indexes are intentionally conservative:

- route names from `routes/**/*.php`
- view names from `resources/views/**/*.blade.php`
- config keys from `config/*.php`
- env keys from `.env` and `.env.example`
- model classes from `app/Models/**/*.php`

Future indexes should include:

- service container bindings
- facades and macros
- Eloquent relationships and local scopes
- factories, seeders, policies, requests, resources, events, listeners, jobs, mailables, and notifications
- Pest/PHPUnit test helpers

