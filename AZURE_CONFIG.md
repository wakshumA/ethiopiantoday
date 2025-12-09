# Azure App Service Configuration

## Application Settings (Configuration → Application settings)

Add each of these as a new application setting in Azure Portal:

```
AI_PROVIDER=groq
GROQ_API_KEY=<your-groq-api-key>
TWITTER_API_KEY=<your-twitter-api-key>
TWITTER_API_SECRET=<your-twitter-api-secret>
TWITTER_ACCESS_TOKEN=<your-twitter-access-token>
TWITTER_ACCESS_SECRET=<your-twitter-access-secret>
TWITTER_BOT_SECRET=<your-twitter-bot-secret>
CRON_SECRET=<your-cron-secret>
RATES_ADMIN_KEY=<your-rates-admin-key>
BLOG_GENERATION_SECRET=<your-blog-generation-secret>
NEXT_PUBLIC_ADSENSE_ID=ca-pub-9561015604678968
PARALLEL_RATES_JSON_URL=/parallel-rates.json
OFFICIAL_RATES_JSON_URL=/official-rates.json
SCM_DO_BUILD_DURING_DEPLOYMENT=true
WEBSITE_NODE_DEFAULT_VERSION=20-lts
```

## General Settings (Configuration → General settings)

**Stack Settings:**
- Stack: Node
- Major version: 20 LTS
- Minor version: 20-lts

**Startup Command:**
```
npm install --production && npm start
```

## After Saving Configuration

1. Click **Save** at the top of the Configuration page
2. Click **Restart** at the top of the App Service page
3. Wait 2-3 minutes for the app to restart
4. Check the site: https://thioexchangerate-d6frf6emebdpb7bw.canadacentral-01.azurewebsites.net

## Troubleshooting

If still getting errors after restart, check logs:
- Go to **Log stream** in Azure Portal
- Or use Azure CLI: `az webapp log tail --name thioexchangerate --resource-group ethioexchange-rg`
