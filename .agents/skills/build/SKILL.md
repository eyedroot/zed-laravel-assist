---
name: build
description: Build and distribution procedure for the Laravel Assist Zed extension. Covers building the TypeScript language server bundle (server/dist/index.cjs) and the Rust WebAssembly adapter (extension.wasm), deploying to a local Zed for development, and updating the laravel-assist submodule commit pointer in the zed-industries/extensions PR (#6734). Use for requests like "build", "빌드", "build the wasm", "build the extension", "rebuild", "deploy", "update the submodule", "bump the PR submodule pointer", or "release".
---

# Laravel Assist Build & Distribution

This skill collects the steps to build the zed-laravel-assist extension and get changes to their distribution targets. For deeper publishing details see `docs/DISTRIBUTION.md`. On top of that, this document lays out the **build steps** and the **PR #6734 submodule-pointer update flow** as concrete commands.

## Distribution has two halves (read this first)

The extension does not reach users as a single artifact. It ships as two pieces:

- **Rust → WebAssembly**: `src/lib.rs` → `extension.wasm`. Zed loads this as the extension adapter. It only launches the language server and passes settings.
- **TypeScript language server**: `server/` → `server/dist/index.cjs`. This is where the actual Laravel intelligence lives. The published extension does not embed this bundle; it downloads it **at runtime** from a GitHub branch:

  ```text
  https://raw.githubusercontent.com/eyedroot/zed-laravel-assist/laravel-assist-server-v0.0.1/laravel-assist-server.cjs
  ```

**Key point**: when the server (TypeScript) logic changes, that branch must be re-published for the change to reach real users. Moving the submodule pointer alone only updates the `extension.toml`/wasm source, not the server code. Conversely, if only the Rust side changed, no server-bundle re-publish is needed.

## Prerequisites

- Node 20+ (`cd server && npm ci` once, or whenever dependencies change)
- Rust wasm target: `rustup target add wasm32-wasip2`
- Default paths: extension source `~/Github/zed-laravel-assist`, zed-industries registry clone `~/Github/extensions`

## 1. Verify + build (local, no push)

Server:

```sh
cd server
npm run typecheck
npm test
npm run build   # typecheck + esbuild → dist/index.cjs
```

Extension wasm:

```sh
cargo build --release --target wasm32-wasip2
cp target/wasm32-wasip2/release/laravel_assist_zed_extension.wasm extension.wasm
```

## 2. Local Zed dev deploy

A single script does the whole sequence:

```sh
./scripts/rebuild-dev-extension.sh
```

It (1) builds the server bundle, (2) copies the server `.cjs` into the Zed work dir (`~/Library/Application Support/Zed/extensions/work/laravel-assist/laravel-assist-server-v0.0.1.cjs`), (3) builds the release wasm, and (4) copies it to `extension.wasm`. When a local bundle exists in the work dir, `src/lib.rs` uses that file instead of downloading from GitHub, so unpublished server changes are testable locally right away.

To pick up the changes:

- Run `zed: reload extensions` from the command palette, or
- Fully quit and relaunch Zed (a restart is the reliable option when an older server bundle is still loaded from the work dir):

  ```sh
  osascript -e 'tell application id "dev.zed.Zed" to quit'
  # only after the process is fully gone
  open -a Zed
  ```

  Caution: running `open` immediately after `quit` is a no-op while Zed is still shutting down, so you end up quit-but-not-reopened. Confirm the process is gone with `pgrep -f "Zed.app/Contents/MacOS/zed"` before running `open`.

## 3. Update the zed-industries/extensions PR (#6734) submodule pointer

While 0.0.1 is not yet merged into the registry, every new commit in laravel-assist requires manually moving the PR's submodule commit pointer to that new commit. (Registry clone: `~/Github/extensions`, PR branch: `codex/add-laravel-assist`, submodule url: `https://github.com/eyedroot/zed-laravel-assist.git`.)

Steps:

1. Commit the change in the extension source and push it to the fork. The commit must exist on the branch the submodule tracks (currently `main`) before the pointer can reference it.

   ```sh
   cd ~/Github/zed-laravel-assist
   git add -A && git commit -m "<message>"
   git push origin main
   NEW_SHA=$(git rev-parse HEAD)
   ```

2. Move the pointer in the registry clone. There is a justfile helper:

   ```sh
   cd ~/Github/extensions
   just update-submodule extensions/laravel-assist "$NEW_SHA"
   # what the helper does (manual equivalent):
   #   git submodule update --init --recursive extensions/laravel-assist
   #   git -C extensions/laravel-assist fetch origin
   #   git -C extensions/laravel-assist checkout "$NEW_SHA"
   ```

3. Commit and push the pointer change to update the PR:

   ```sh
   git add extensions/laravel-assist
   git commit -m "laravel-assist: bump submodule to ${NEW_SHA:0:7}"
   git push
   ```

4. **Version rule**: while 0.0.1 is unpublished, keep both `extensions/laravel-assist/extension.toml`'s `version` and the registry `extensions.toml`'s `[laravel-assist] version` at **0.0.1**, and only move the pointer. When bumping to a new version later, raise the `version` in both files together and point the submodule at a commit that carries that version. Mismatched values fail registry validation.

## 4. Re-publish the language server bundle (external publish — only on explicit request)

If the server (TypeScript) changed and the change must reach published-extension users, re-publish the runtime download branch. Follow the exact commands in the "Language Server Runtime" section of `docs/DISTRIBUTION.md` (gist):

```sh
cd ~/Github/zed-laravel-assist/server && npm run build
tmpdir=$(mktemp -d) && cd "$tmpdir" && git init
cp ~/Github/zed-laravel-assist/server/dist/index.cjs laravel-assist-server.cjs
git add laravel-assist-server.cjs
git commit -m "Publish Laravel Assist server bundle v0.0.1"
git remote add origin git@github.com-eyedroot:eyedroot/zed-laravel-assist.git
git push -f origin HEAD:laravel-assist-server-v0.0.1
```

## Checklist before updating the PR

- [ ] `npm run typecheck` / `npm test` / `npm run build` pass
- [ ] `cargo build --release --target wasm32-wasip2` passes
- [ ] `extension.toml` version == registry `extensions.toml` `[laravel-assist]` version
- [ ] If server logic changed, the language server bundle branch was re-published (step 4)
- [ ] The commit being pointed at is pushed to the fork's tracked branch (main)

## Guardrails

- **Anything that leaves the machine** — `git push`, updating the PR (pushing the registry clone), publishing the server bundle branch, `npm publish` — is done **only on explicit user request** (AGENTS.md).
- Get user confirmation before pushing directly to a shared branch such as `main`.
- Local build/verify (step 1) and local Zed deploy (step 2) are fine to run freely.
