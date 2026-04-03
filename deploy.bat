@echo off
REM FinanceNews Daily - One-click Deploy Script
REM Prerequisites: Must be logged in to Cloudflare via 'wrangler login'

echo ============================================
echo FinanceNews Daily - Cloudflare Deploy
echo ============================================
echo.

echo Step 1: Building static files...
call npm run build:static
if errorlevel 1 (
    echo Build failed!
    exit /b 1
)
echo.

echo Step 2: Checking Cloudflare login...
wrangler whoami >nul 2>&1
if errorlevel 1 (
    echo.
    echo Not logged in to Cloudflare.
    echo Please run: wrangler login
    echo.
    pause
    wrangler login
    if errorlevel 1 (
        echo Login failed!
        exit /b 1
    )
)
echo.

echo Step 3: Deploying to Cloudflare Workers...
wrangler deploy
if errorlevel 1 (
    echo Deploy failed!
    exit /b 1
)

echo.
echo ============================================
echo Deploy successful!
echo Check your Cloudflare dashboard for the URL
echo ============================================
pause
