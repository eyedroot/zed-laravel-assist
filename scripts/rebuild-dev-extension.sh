#!/usr/bin/env sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"

cd "$ROOT_DIR/server"
npm run build

cd "$ROOT_DIR"
cargo build --release --target wasm32-wasip2
cp target/wasm32-wasip2/release/laravel_assist_zed_extension.wasm extension.wasm

printf '%s\n' "Rebuilt extension.wasm with the latest bundled language server."
