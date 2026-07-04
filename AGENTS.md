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
- Prefer complementing existing PHP language servers instead of replacing general PHP analysis.

## Verification

- After TypeScript server changes, run `npm run typecheck`, `npm test`, and `npm run build` when possible.
- After Rust extension changes, run `cargo check` when a Rust toolchain is available.
- Only perform external publishing, GitHub pushes, releases, or npm publishing when explicitly requested.
