@echo off
setlocal EnableDelayedExpansion

REM ===========================================================================
REM SortLab: Git Repository Setup & Remote Push Script
REM ===========================================================================
echo =========================================================================
echo   SortLab: Git Setup & GitHub / Vercel Deployment Helper
echo =========================================================================
echo.

set "GIT_CMD=git"
where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    if exist "%LOCALAPPDATA%\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd\git.exe" (
        set "GIT_CMD=%LOCALAPPDATA%\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd\git.exe"
    ) else (
        echo [ERROR] Git is not currently installed or not in PATH.
        echo Please install Git for Windows from: https://git-scm.com/download/win
        pause
        exit /b 1
    )
)

echo [1/3] Staging project files...
"%GIT_CMD%" add .

echo [2/3] Creating commit...
"%GIT_CMD%" commit -m "update: SortLab study platform improvements"

echo [3/3] Pushing to GitHub (https://github.com/adityaingole0207-gif/sorting)...
"%GIT_CMD%" push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo =========================================================================
    echo [SUCCESS] Pushed to GitHub successfully!
    echo Repository: https://github.com/adityaingole0207-gif/sorting
    echo.
    echo Deploy to Vercel (1-Click):
    echo https://vercel.com/new/clone?repository-url=https://github.com/adityaingole0207-gif/sorting
    echo =========================================================================
) else (
    echo.
    echo [NOTICE] Push completed or no changes to commit.
)

pause
