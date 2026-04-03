#!/bin/bash
# FinanceNews Daily - One-click Deploy Script

set -e

echo "============================================"
echo "FinanceNews Daily - Cloudflare Deploy"
echo "============================================"
echo ""

echo "Step 1: Building static files..."
npm run build:static
echo ""

echo "Step 2: Checking Cloudflare login..."
if ! wrangler whoami > /dev/null 2>&1; then
    echo "Not logged in to Cloudflare."
    echo "Opening browser for login..."
    wrangler login
fi
echo ""

echo "Step 3: Deploying to Cloudflare Workers..."
wrangler deploy

echo ""
echo "============================================"
echo "Deploy successful!"
echo "============================================"
