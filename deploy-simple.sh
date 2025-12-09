#!/bin/bash

# Simple Azure deployment - deploy entire built app

echo "🔨 Building Next.js for production..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed!"
  exit 1
fi

echo "📦 Creating deployment package..."
# Create zip with essential files only
zip -r deployment.zip \
  .next \
  public \
  package.json \
  package-lock.json \
  next.config.mjs \
  > /dev/null

echo "☁️  Deploying to Azure App Service..."
az webapp deploy \
  --resource-group ethioexchange-rg \
  --name thioexchangerate \
  --src-path deployment.zip \
  --type zip \
  --async true

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Deployment started successfully!"
  echo "🌐 URL: https://thioexchangerate-d6frf6emebdpb7bw.canadacentral-01.azurewebsites.net"
  echo ""
  echo "⚙️  Important: Set Azure startup command to:"
  echo "   npm install && npm start"
else
  echo "❌ Deployment failed"
fi

# Cleanup
rm deployment.zip
