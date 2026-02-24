#!/usr/bin/env bash
# ============================================================================
# Build WASM module from Rust source
# ============================================================================
# Usage: bash scripts/build_wasm.sh

set -e

echo "Building WASM..."
cd wasm
wasm-pack build --target web --out-dir ../wasm/pkg
cp wasm/pkg/wasm_bg.wasm static/wasm_bg.wasm 2>/dev/null || true
echo "✅ WASM build complete → static/wasm_bg.wasm"
