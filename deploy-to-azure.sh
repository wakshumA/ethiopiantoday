#!/bin/bash

# Deploy to Azure App Service using ZIP deployment
# This bypasses GitHub Actions and deploys directly

echo "🔨 Building Next.js for production..."
npm run build

echo "📦 Preparing deployment package..."
# Create deployment directory
rm -rf deploy-package
mkdir -p deploy-package

# Copy standalone build
cp -r .next/standalone/* deploy-package/
cp -r .next/static deploy-package/.next/static
cp -r public deploy-package/public
cp package.json deploy-package/

# Create zip file
cd deploy-package
zip -r ../deployment.zip . > /dev/null
cd ..

echo "☁️  Deploying to Azure App Service..."
echo "App name: thioexchangerate"
echo ""

# Deploy using az webapp deployment
az webapp deploy \
  --resource-group ethioexchange-rg \
  --name thioexchangerate \
  --src-path deployment.zip \
  --type zip \
  --async true

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Deployment started successfully!"
  echo "🌐 Your app: https://thioexchangerate-d6frf6emebdpb7bw.canadacentral-01.azurewebsites.net"
  echo "🔍 Check deployment status: az webapp log tail --name thioexchangerate --resource-group thioexchangerate_group"
else
  echo ""
  echo "❌ Deployment failed. Make sure you're logged in to Azure CLI:"
  echo "   Run: az login"
fi

# Cleanup
rm -rf deploy-package deployment.zip
