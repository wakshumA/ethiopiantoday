# Twitter Bot Setup Guide

This guide will help you set up the Twitter bot integration for Ethiopian Today.

## Prerequisites

1. A Twitter Developer Account
2. Twitter API v2 access (Elevated or higher)
3. Vercel account (for automated cron jobs) or alternative cron service

## Step 1: Get Twitter API Credentials

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new App or use an existing one
3. Navigate to the "Keys and tokens" tab
4. Generate the following credentials:
   - API Key (Consumer Key)
   - API Secret (Consumer Secret)
   - Access Token
   - Access Token Secret

## Step 2: Configure Environment Variables

Add the following variables to your `.env.local` file:

```env
# Twitter API Credentials
TWITTER_API_KEY=your_api_key_here
TWITTER_API_SECRET=your_api_secret_here
TWITTER_ACCESS_TOKEN=your_access_token_here
TWITTER_ACCESS_SECRET=your_access_token_secret_here

# Security tokens
TWITTER_BOT_SECRET=your_random_secret_token_here
CRON_SECRET=your_cron_secret_token_here
```

For production (Vercel), add these same variables in your project settings.

## Step 3: Install Dependencies

```bash
npm install twitter-api-v2
```

## Step 4: Test the Integration

### Manual Testing

Test posting exchange rates:
```bash
curl -X POST http://localhost:3000/api/twitter/post-rates \
  -H "Authorization: Bearer your_twitter_bot_secret"
```

Test posting news:
```bash
curl -X POST http://localhost:3000/api/twitter/post-news \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_twitter_bot_secret" \
  -d '{
    "title": "Ethiopian Economy Shows Strong Growth",
    "summary": "The Ethiopian economy has demonstrated resilient growth in key sectors including agriculture and manufacturing.",
    "url": "https://ethiopiantoday.com/news/economy-growth"
  }'
```

## Step 5: Set Up Automated Posting

### Option 1: Vercel Cron (Recommended)

The `vercel.json` file is already configured to run the Twitter update daily at 9:00 AM UTC.

1. Deploy to Vercel
2. Set environment variables in Vercel project settings
3. The cron job will automatically run

### Option 2: GitHub Actions

Create `.github/workflows/twitter-bot.yml`:

```yaml
name: Twitter Bot - Daily Update

on:
  schedule:
    - cron: '0 9 * * *'  # 9:00 AM UTC daily
  workflow_dispatch:  # Allow manual trigger

jobs:
  post-to-twitter:
    runs-on: ubuntu-latest
    steps:
      - name: Post Exchange Rates
        run: |
          curl -X GET ${{ secrets.VERCEL_URL }}/api/cron/twitter-update \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

### Option 3: External Cron Service

Use services like:
- [cron-job.org](https://cron-job.org)
- [EasyCron](https://www.easycron.com)
- [Uptime Robot](https://uptimerobot.com) (monitoring + cron)

Configure them to make a GET request to:
```
https://your-domain.com/api/cron/twitter-update
```

With header:
```
Authorization: Bearer your_cron_secret
```

## Available API Endpoints

### POST /api/twitter/post-rates
Posts current exchange rates to Twitter.

**Headers:**
- `Authorization: Bearer {TWITTER_BOT_SECRET}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "tweet_id",
    "text": "tweet_content"
  }
}
```

### POST /api/twitter/post-news
Posts economic news to Twitter.

**Headers:**
- `Authorization: Bearer {TWITTER_BOT_SECRET}`
- `Content-Type: application/json`

**Body:**
```json
{
  "title": "News Title",
  "summary": "Brief summary of the news",
  "url": "https://ethiopiantoday.com/news/article"
}
```

### GET /api/cron/twitter-update
Automated endpoint for cron jobs to post daily exchange rate updates.

**Headers:**
- `Authorization: Bearer {CRON_SECRET}`

## Tweet Format

### Exchange Rate Updates
```
📊 Ethiopian Birr Exchange Rates Update (Dec 1, 2025)

💵 USD: 57.50 ETB
💶 EUR: 62.30 ETB
💷 GBP: 73.45 ETB

Stay updated at EthiopianToday.com
#Ethiopia #ExchangeRate #ETB #Finance
```

### Economic News
```
📰 Ethiopian Economy Shows Strong Growth

The Ethiopian economy has demonstrated resilient growth in key sectors...

Read more at EthiopianToday.com

#Ethiopia #Economy #News
```

## Security Best Practices

1. **Never commit credentials** to version control
2. **Use different secrets** for TWITTER_BOT_SECRET and CRON_SECRET
3. **Rotate tokens regularly** (every 90 days recommended)
4. **Monitor API usage** in Twitter Developer Portal
5. **Set up rate limiting** if needed
6. **Use HTTPS** for all API calls in production

## Monitoring

- Check Twitter Developer Portal for API usage
- Monitor Vercel logs for cron job execution
- Set up alerts for failed posts
- Track engagement metrics on posted tweets

## Troubleshooting

### "Unauthorized" Error
- Verify environment variables are set correctly
- Check that tokens haven't expired
- Ensure Bearer token is included in Authorization header

### "Rate Limit Exceeded"
- Twitter has rate limits (300 tweets per 3 hours)
- Reduce posting frequency
- Consider Twitter API v2 Elevated access

### Tweets Not Posting
- Check Vercel function logs
- Verify cron job is running (check Vercel dashboard)
- Test endpoints manually with curl
- Ensure Twitter API credentials are valid

## Future Enhancements

Consider adding:
- Tweet threading for longer content
- Image attachments (charts, graphs)
- Response handling for mentions
- Analytics tracking
- Multi-language support (Amharic tweets)
- Hashtag optimization based on trending topics
