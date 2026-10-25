@echo off
setlocal EnableDelayedExpansion

REM ===========================================================================
REM SortLab: Git Repository Setup & Remote Push Script
REM ===========================================================================
echo =========================================================================
echo   SortLab: Git Setup & GitHub / Vercel Deployment Helper
echo =========================================================================
echo.

where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Git is not currently installed or not in PATH.
    echo.
    echo Please install Git for Windows from:
    echo   https://git-scm.com/download/win
    echo.
    echo (Once installed, reopen this script or your terminal to continue).
    echo.
    pause
    exit /b 1
)

echo [1/4] Initializing Git repository...
if not exist ".git" (
    git init
    git branch -M main
) else (
    echo Git repository already initialized.
)

echo [2/4] Staging project files...
git add .

echo [3/4] Creating commit...
git commit -m "feat: SortLab Adaptive Sorting Algorithm Benchmarking Tool complete implementation"

echo.
echo =========================================================================
echo   PUSH TO GITHUB / GIT REMOTE
echo =========================================================================
echo.
echo If you haven't created a GitHub repository yet:
echo   1. Go to https://github.com/new
echo   2. Create a new repository named "sortlab" (Public or Private)
echo   3. Leave "Initialize with README" UNCHECKED
echo   4. Copy the repository URL (e.g., https://github.com/YOUR_USERNAME/sortlab.git)
echo.
set /p REPO_URL="Enter your GitHub Repository URL (or press Enter to skip push): "

if "%REPO_URL%"=="" (
    echo.
    echo [INFO] Local Git repository is initialized and committed!
    echo When you are ready to push later, run:
    echo   git remote add origin YOUR_REPO_URL
    echo   git push -u origin main
    echo.
    pause
    exit /b 0
)

echo.
echo Setting remote origin to %REPO_URL% ...
git remote remove origin >nul 2>nul
git remote add origin %REPO_URL%

echo Pushing to main branch...
git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo =========================================================================
    echo   SUCCESS! PUSH COMPLETED TO GITHUB
    echo =========================================================================
    echo.
    echo NEXT STEP: Deploy to Vercel (Takes 30 seconds):
    echo   1. Visit: https://vercel.com/new
    echo   2. Select and import your "sortlab" repository
    echo   3. Leave all default settings (vercel.json handles everything automatically!)
    echo   4. Click "Deploy"
    echo.
    echo Your site will be live instantly on https://your-project.vercel.app/
) else (
    echo.
    echo [NOTE] Push failed. Make sure:
    echo   1. The repository URL is correct.
    echo   2. You are authenticated with GitHub.
)

echo.
pause
