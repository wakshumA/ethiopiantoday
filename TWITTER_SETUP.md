# Twitter Bot Quick Start

## Quick Setup

1. **Get Twitter API Credentials**
   - Visit [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
   - Create a new app or use existing one
   - Go to "Keys and tokens" tab
   - Copy your credentials

2. **Update `.env.local`**
   ```env
   TWITTER_API_KEY=your_api_key_here
   TWITTER_API_SECRET=your_api_secret_here
   TWITTER_ACCESS_TOKEN=your_access_token_here
   TWITTER_ACCESS_SECRET=your_access_token_secret_here
   TWITTER_BOT_SECRET=your_random_secret_here
   CRON_SECRET=your_cron_secret_here
   ```

3. **Test Manually**
   ```bash
   # Post exchange rates
   curl -X POST http://localhost:3000/api/twitter/post-rates \
     -H "Authorization: Bearer your_twitter_bot_secret"

   # Post economic news
   curl -X POST http://localhost:3000/api/twitter/post-news \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer your_twitter_bot_secret" \
     -d '{
       "title": "Ethiopian Economy Shows Growth",
       "summary": "The Ethiopian economy demonstrated strong performance in key sectors.",
       "url": "https://ethiopiantoday.com"
     }'
   ```

4. **Deploy to Vercel**
   - Push code to GitHub
   - Connect to Vercel
   - Add environment variables in Vercel dashboard
   - The cron job will run automatically at 9:00 AM UTC daily

## Available Endpoints

- `POST /api/twitter/post-rates` - Post exchange rates
- `POST /api/twitter/post-news` - Post economic news
- `GET /api/cron/twitter-update` - Daily auto-update (used by cron)

## Tweet Examples

**Exchange Rates:**
```
📊 Ethiopian Birr Exchange Rates Update (Dec 1, 2025)

💵 USD: 150.93 ETB
💶 EUR: 159.20 ETB
💷 GBP: 191.50 ETB

Stay updated at EthiopianToday.com
#Ethiopia #ExchangeRate #ETB #Finance
```

**Economic News:**
```
📰 Ethiopian Economy Shows Strong Growth

The Ethiopian economy has demonstrated resilient growth...

Read more at EthiopianToday.com

#Ethiopia #Economy #News
```

## Automated Posting

The `vercel.json` file is configured to run daily at 9:00 AM UTC:
```json
{
  "crons": [
    {
      "path": "/api/cron/twitter-update",
      "schedule": "0 9 * * *"
    }
  ]
}
```

See `docs/TWITTER_BOT_SETUP.md` for detailed documentation.
