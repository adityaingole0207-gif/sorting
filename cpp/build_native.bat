@echo off
REM ===========================================================================
REM SortLab: Compile Native C++ Command-Line Benchmark
REM ===========================================================================
echo [SortLab] Compiling native C++ benchmark executable...

where g++ >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo Compiling with GCC (g++)...
    g++ -O3 -std=c++17 sorting.cpp -o sorting_benchmark.exe
    goto DONE
)

where clang++ >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo Compiling with Clang (clang++)...
    clang++ -O3 -std=c++17 sorting.cpp -o sorting_benchmark.exe
    goto DONE
)

where cl >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo Compiling with Microsoft Visual C++ (cl.exe)...
    cl /EHsc /O2 /std:c++17 sorting.cpp /Fe:sorting_benchmark.exe
    goto DONE
)

echo [ERROR] No C++ compiler found (g++, clang++, or cl).
echo Please install MinGW-w64, Visual Studio C++, or LLVM.
exit /b 1

:DONE
if %ERRORLEVEL% equ 0 (
    echo [SUCCESS] Built sorting_benchmark.exe!
    echo Run it with: sorting_benchmark.exe
) else (
    echo [ERROR] Native build failed.
)
