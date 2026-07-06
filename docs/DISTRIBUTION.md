# Distribution

This document keeps release, local update, and registry-readiness checks in one place.

## Language Server Runtime

The language server lives in `server/` and builds to a single CommonJS bundle at `server/dist/index.cjs`.
The Zed extension does not embed this bundle in `extension.wasm`. At runtime it downloads the versioned server asset from GitHub:

```text
https://raw.githubusercontent.com/eyedroot/zed-laravel-assist/laravel-assist-server-v0.0.1/laravel-assist-server.cjs
```

This keeps the extension source aligned with Zed registry guidance for language-server extensions: the wasm adapter is built by Zed, while the language server is downloaded through the Zed extension API.

Before publishing a server asset:

```sh
cd server
npm ci
npm run typecheck
npm test
npm run build
npm run pack:dry-run
```

`npm run pack:dry-run` remains useful as a packaging sanity check. The expected package contents are intentionally small:

- `dist/index.cjs`
- `package.json`

Publish the generated server asset only after the source commit has been pushed. The current registry-compatible URL uses a dedicated branch that contains only the downloadable server bundle:

```sh
tmpdir=$(mktemp -d)
cd "$tmpdir"
git init
cp /path/to/zed-laravel-assist/server/dist/index.cjs laravel-assist-server.cjs
git add laravel-assist-server.cjs
git commit -m "Publish Laravel Assist server bundle v0.0.1"
git remote add origin git@github.com-eyedroot:eyedroot/zed-laravel-assist.git
git push origin HEAD:laravel-assist-server-v0.0.1
```

Only run `npm publish` from `server/` if the project later decides to distribute the language server through npm as well.

## Dev Extension Update Flow

For local Zed testing after any TypeScript language server change:

```sh
./scripts/rebuild-dev-extension.sh
```

The script performs the required sequence:

1. Build `server/dist/index.cjs`.
2. Build the Zed extension for `wasm32-wasip2`.
3. Copy the built wasm to `extension.wasm`.

For local dev extension testing, the runtime server is still downloaded from the GitHub URL baked into `src/lib.rs`. If you need to test unpublished language server changes in Zed, publish a temporary server-bundle branch or temporarily point the URL at a test asset.

Then reload the development extension from Zed:

1. Run `zed: reload extensions`.
2. Reopen the Laravel project window if the old server remains active.
3. Restart Zed if the extension work directory still has an older server bundle.

## Zed Extension Registry Readiness

Before submitting to the Zed extension registry:

- `extension.toml` has stable `id`, `name`, `version`, `authors`, `description`, and `repository` fields.
- `server/dist/index.cjs` is published as the matching downloadable server asset.
- `cargo build --release --target wasm32-wasip2` succeeds.
- `extension.wasm` is built from the same commit as `extension.toml`.
- `README.md` includes install, settings, inlay hint, and local development instructions.
- CI runs language server typecheck/tests/build and wasm build.
- Fixture-project regression tests pass.

Do not submit to the registry or publish packages from automation unless the release owner explicitly requests that external action.
