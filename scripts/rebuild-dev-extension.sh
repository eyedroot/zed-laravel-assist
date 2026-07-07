#!/usr/bin/env sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"

cd "$ROOT_DIR/server"
npm run build

ZED_EXTENSION_WORK_DIR="${ZED_EXTENSION_WORK_DIR:-$HOME/Library/Application Support/Zed/extensions/work/laravel-assist}"
SERVER_FILE_NAME="laravel-assist-server-v0.0.1.cjs"

mkdir -p "$ZED_EXTENSION_WORK_DIR"
cp "$ROOT_DIR/server/dist/index.cjs" "$ZED_EXTENSION_WORK_DIR/$SERVER_FILE_NAME"

cd "$ROOT_DIR"
cargo build --release --target wasm32-wasip2
cp target/wasm32-wasip2/release/laravel_assist_zed_extension.wasm extension.wasm

printf '%s\n' "Rebuilt extension.wasm with the latest bundled language server."
printf '%s\n' "Copied $SERVER_FILE_NAME to $ZED_EXTENSION_WORK_DIR."
