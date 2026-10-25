@echo off
REM ===========================================================================
REM SortLab: Compile C++ to WebAssembly via Emscripten
REM ===========================================================================
echo [SortLab] Building WebAssembly module using Emscripten (emcc)...

where emcc >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Emscripten compiler 'emcc' was not found in PATH.
    echo Please install or activate the Emscripten SDK (emsdk):
    echo   git clone https://github.com/emscripten-core/emsdk.git
    echo   cd emsdk
    echo   emsdk install latest
    echo   emsdk activate latest
    echo   emsdk_env.bat
    echo.
    echo Note: SortLab includes an instant, pure-engine Web Worker fallback
    echo so the web interface works out-of-the-box in any standard browser!
    exit /b 1
)

emcc sorting.cpp -O3 ^
    -s WASM=1 ^
    -s NO_EXIT_RUNTIME=1 ^
    -s "EXPORTED_FUNCTIONS=['_runSortWasm', '_getSortLabVersion', '_malloc', '_free']" ^
    -s "EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap', 'UTF8ToString']" ^
    -s ALLOW_MEMORY_GROWTH=1 ^
    -o ../web/sorting_wasm.js

if %ERRORLEVEL% equ 0 (
    echo [SUCCESS] WebAssembly module successfully generated in ../web/sorting_wasm.js and ../web/sorting_wasm.wasm
) else (
    echo [ERROR] Emscripten compilation failed.
    exit /b 1
)
