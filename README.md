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

