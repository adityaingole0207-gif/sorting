#!/usr/bin/env bash
# ===========================================================================
# SortLab: Compile C++ to WebAssembly via Emscripten (Linux / macOS / WSL)
# ===========================================================================
set -e

echo "[SortLab] Building WebAssembly module using Emscripten (emcc)..."

if ! command -v emcc &> /dev/null; then
    echo "[ERROR] Emscripten compiler 'emcc' was not found in PATH."
    echo "Please activate emsdk:"
    echo "  source ./emsdk_env.sh"
    exit 1
fi

emcc sorting.cpp -O3 \
    -s WASM=1 \
    -s NO_EXIT_RUNTIME=1 \
    -s "EXPORTED_FUNCTIONS=['_runSortWasm', '_getSortLabVersion', '_malloc', '_free']" \
    -s "EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap', 'UTF8ToString']" \
    -s ALLOW_MEMORY_GROWTH=1 \
    -o ../web/sorting_wasm.js

echo "[SUCCESS] Generated ../web/sorting_wasm.js and ../web/sorting_wasm.wasm"
