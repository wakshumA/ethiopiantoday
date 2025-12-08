# NBE Integration Summary

## ✅ What's Been Set Up

### 1. NBE Data Scraper (`/api/nbe`)
- Scrapes the National Bank of Ethiopia website for:
  - Daily exchange rates (when available)
  - Latest news and announcements
- **URL**: `https://nbe.gov.et/`
- **Updates**: Real-time scraping on each request

### 2. NBE News to Twitter (`/api/twitter/post-nbe-news`)
- Automatically posts latest NBE news to Twitter
- Fetches news from NBE website and formats it for Twitter
- Includes:
  - News title
  - Excerpt (if available)
  - Link to full article on nbe.gov.et

### 3. Automated Daily Posts
The following cron jobs run automatically on Vercel:

| Time (UTC) | Job | Description |
|------------|-----|-------------|
| 9:00 AM | Exchange Rates | Posts daily ETB exchange rates (USD, EUR, GBP) |
| 10:00 AM | NBE News | Posts latest news from National Bank of Ethiopia |

## 📊 API Endpoints

### GET /api/nbe
Fetch NBE exchange rates and news.

**Response:**
```json
{
  "success": true,
  "source": "National Bank of Ethiopia",
  "lastUpdated": "2025-12-02T14:16:57.868Z",
  "rates": null,
  "news": [
    {
      "title": "National Bank of Ethiopia Launches...",
      "date": "2025-12-02T14:16:57.868Z",
      "url": "https://nbe.gov.et/nbe_news/...",
      "excerpt": "..."
    }
  ]
}
```

### POST /api/twitter/post-nbe-news
Manually post latest NBE news to Twitter.

**Headers:**
- `Authorization: Bearer {TWITTER_BOT_SECRET}`

**Example:**
```bash
curl -X POST http://localhost:3000/api/twitter/post-nbe-news \
  -H "Authorization: Bearer your_random_secret_token_here"
```

## 🐦 Tweet Format

```
📰 {News Title}

{News Excerpt/Summary}

{NBE Article URL}

#Ethiopia #Economy #News
```

## ⚙️ Configuration

All settings are in `.env.local`:
```env
TWITTER_BOT_SECRET=your_random_secret_token_here
CRON_SECRET=your_cron_secret_token_here
```

## 📝 Notes

- **NBE Exchange Rates**: The NBE website loads exchange rate data dynamically via JavaScript, so the scraper currently only fetches news reliably. The rates table may require a headless browser solution (like Puppeteer) for accurate scraping.

- **News Availability**: The scraper fetches the latest 5 news items from the NBE news page and posts the most recent one.

- **Rate Limiting**: Twitter has posting limits (300 tweets per 3 hours). The current setup posts twice daily, well within limits.

## 🚀 Deployment

When you deploy to Vercel:
1. The cron jobs will run automatically
2. Exchange rates posted at 9:00 AM UTC daily
3. NBE news posted at 10:00 AM UTC daily

## 🔧 Future Enhancements

Consider adding:
- [ ] Puppeteer/Playwright for accurate NBE rate scraping
- [ ] Cache NBE data to reduce scraping frequency
- [ ] Tweet threading for longer news articles
- [ ] Image attachments (NBE logos, charts)
- [ ] Amharic language support
