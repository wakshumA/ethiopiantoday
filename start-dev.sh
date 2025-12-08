#!/bin/bash

# Kill any existing Next.js processes
echo "🔄 Cleaning up existing processes..."
pkill -f "next dev" 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Wait a moment
sleep 2

# Clear Next.js cache to avoid stale builds
echo "🧹 Clearing Next.js cache..."
rm -rf .next

# Ensure we have the right Node.js path
export PATH="/usr/local/Cellar/node/24.7.0/bin:$PATH"

# Verify Node.js version
echo "📋 Node.js version: $(node --version)"
echo "📋 npm version: $(npm --version)"

# Install/update dependencies if needed
echo "📦 Checking dependencies..."
npm install

# Start the development server
echo "🚀 Starting development server..."
npm run dev
