# Codex Working Guidelines

This repository aims to bring the Laravel development experience in Zed closer to the quality of dedicated Laravel IDE tooling.

## Core Principles

- Check the relevant files, git status, and existing patterns before making changes.
- Do not revert user changes unless explicitly asked.
- Keep changes small, clear, and scoped to the requested work.
- Avoid unrelated refactors and formatting churn.
- Do not guess about current Zed extension APIs, LSP behavior, or Laravel behavior. Verify with official documentation, source code, or local execution.

## Technical Direction

- The Zed extension is written in Rust and compiled to WebAssembly.
- Laravel-specific intelligence lives in a separate Language Server.
- The Zed extension should focus on launching the language server, passing settings, and managing distribution paths.
- The Language Server should progressively own Laravel project indexing, completions, hovers, diagnostics, navigation, and code actions.
- Current route intelligence includes named routes, route parameter keys, route controller groups, and controller class/action metadata for common route array and resource declarations.
- Current route-name providers cover `route(...)`, `to_route(...)`, `redirect()->route(...)`, `Route::is(...)`, `Route::has(...)`, and `routeIs(...)` contexts.
- Current route controller group actions are surfaced through completion, hover, definition, references, diagnostics, and quick fixes when the active group controller can be inferred.
- Current route parameter keys are surfaced through completion, hover, definition, references, diagnostics, and quick fixes inside named route parameter arrays.
- Current controller action metadata includes public action method ranges when available, so definitions and symbols can land on the method name.
- Current Blade section and stack names are surfaced through completion, hover, definition, references, diagnostics, and quick fixes from parent layout `@yield(...)` and `@stack(...)` names when `@extends(...)` is indexed.
- Current Blade component prop names are surfaced through completion, hover, definition, references, and conservative typo diagnostics/quick fixes for indexed `@props(...)`, `@aware(...)`, class constructor props, and class public properties.
- Current Eloquent indexing includes model metadata, relationships, scopes, schema-backed attributes, and custom builder methods returned by `newEloquentBuilder(...)`.
- Current validation Rule schema support surfaces indexed migration tables and columns inside `Rule::exists(...)` and `Rule::unique(...)` through completion, hover, definition, diagnostics, and quick fixes.
- Current provider indexing includes application provider classes, `bootstrap/providers.php`, legacy `config/app.php` providers, and composer package provider declarations.
- Current facade metadata links simple `getFacadeAccessor()` values to matching indexed service container bindings when available.
- Current class-reference providers use a conservative PHP import resolver for simple `use ...;`, `use ... as ...;`, and grouped `use Foo\{Bar as Baz};` aliases.
- Prefer complementing existing PHP language servers instead of replacing general PHP analysis.

## Verification

- After TypeScript server changes, run `npm run typecheck`, `npm test`, and `npm run build` when possible.
- After Rust extension changes, run `cargo check` when a Rust toolchain is available.
- When changes should be tested in Zed, rebuild the extension wasm, copy it to `extension.wasm`, and restart Zed so the updated bundled server is loaded. Preferred commands:
  - `cargo build --release --target wasm32-wasip2`
  - `cp target/wasm32-wasip2/release/laravel_assist_zed_extension.wasm extension.wasm`
  - `osascript -e 'tell application id "dev.zed.Zed" to quit'`
  - `open -a Zed`
- Only perform external publishing, GitHub pushes, releases, or npm publishing when explicitly requested.
