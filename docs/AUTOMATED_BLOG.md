# Automated Blog Generation System

This system automatically generates blog posts daily based on NBE exchange rate updates, parallel market data, and Ethiopian economic news.

## How It Works

The automated blog generation system:

1. **Fetches Real-Time Data**:
   - NBE official exchange rates
   - Parallel market rates from ethioblackmarket.com
   - Top Ethiopian economic news
   - 24-hour historical rate trends

2. **AI-Powered Content Generation**:
   - Uses Groq AI (Llama 3.3 70B) to analyze data
   - Writes comprehensive 800-1200 word blog posts
   - Automatically categorizes content
   - Generates SEO-friendly titles and excerpts

3. **Automatic Publishing**:
   - Saves posts to `public/blog-posts.json`
   - Displays on `/blog` page
   - Full article pages at `/blog/[id]`
   - Category filtering and pagination

## API Endpoints

### 1. Manual Blog Generation
```bash
POST /api/blog/generate
Authorization: Bearer your_secret_token

# Example:
curl -X POST http://localhost:3000/api/blog/generate \
  -H "Authorization: Bearer your_secret_token"
```

### 2. Automated Daily Generation
```bash
POST /api/blog/auto-generate
Authorization: Bearer your_secret_token

# Example:
curl -X POST http://localhost:3000/api/blog/auto-generate \
  -H "Authorization: Bearer your_secret_token"
```

### 3. Fetch Blog Posts
```bash
GET /api/blog/posts?category=Exchange%20Rates&limit=10&offset=0

# Parameters:
# - category: Filter by category (optional)
# - limit: Number of posts to return (default: 10)
# - offset: Pagination offset (default: 0)
```

## Scheduling Options

### Option 1: GitHub Actions (Recommended for Production)

Create `.github/workflows/generate-blog.yml`:

```yaml
name: Generate Daily Blog Post

on:
  schedule:
    # Runs every day at 6 AM UTC (9 AM Ethiopian Time)
    - cron: '0 6 * * *'
  workflow_dispatch:  # Allows manual trigger

jobs:
  generate-blog:
    runs-on: ubuntu-latest
    steps:
      - name: Generate Blog Post
        run: |
          curl -X POST https://your-domain.com/api/blog/auto-generate \
            -H "Authorization: Bearer ${{ secrets.BLOG_GENERATION_SECRET }}"
```

**Setup**:
1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Add secret: `BLOG_GENERATION_SECRET` with your token value
4. Commit the workflow file
5. Blog posts will generate automatically every day

### Option 2: Vercel Cron Jobs

Add to `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/blog/auto-generate",
    "schedule": "0 6 * * *"
  }]
}
```

**Requirements**:
- Vercel Pro plan or higher
- Deploy to Vercel
- Set `BLOG_GENERATION_SECRET` in Vercel environment variables

### Option 3: Local Development (macOS/Linux)

Add to crontab:

```bash
# Edit crontab
crontab -e

# Add this line (runs daily at 6 AM)
0 6 * * * curl -X POST http://localhost:3000/api/blog/auto-generate -H "Authorization: Bearer your_secret_token"
```

### Option 4: External Cron Services

Use services like:
- **cron-job.org** (free, reliable)
- **EasyCron** (feature-rich)
- **AWS EventBridge** (enterprise)

Setup:
1. Create account on cron service
2. Add job with URL: `https://your-domain.com/api/blog/auto-generate`
3. Set schedule: `0 6 * * *` (daily at 6 AM)
4. Add header: `Authorization: Bearer your_secret_token`

## Environment Variables

Add these to your `.env.local` file:

```bash
# Required: Groq AI API Key
GROQ_API_KEY=your_groq_api_key_here

# Required: Blog Generation Secret (for security)
BLOG_GENERATION_SECRET=your_random_secret_token_here

# Optional: Base URL for production
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

## Testing the System

### 1. Generate First Blog Post

```bash
# Start the dev server
npm run dev

# In another terminal, generate a blog post
curl -X POST http://localhost:3000/api/blog/generate \
  -H "Authorization: Bearer your_secret_token"
```

### 2. View Blog Posts

Visit:
- Blog listing: http://localhost:3000/blog
- Individual post: http://localhost:3000/blog/blog-1234567890

### 3. Test Automation

```bash
curl -X POST http://localhost:3000/api/blog/auto-generate \
  -H "Authorization: Bearer your_secret_token"
```

## Blog Post Structure

Each generated blog post includes:

```typescript
{
  id: "blog-1234567890",           // Unique timestamp-based ID
  title: "Article Title",          // SEO-friendly title
  excerpt: "Brief summary...",     // 160 character summary
  content: "Full article...",      // 800-1200 words in markdown
  category: "Exchange Rates",      // Auto-categorized
  author: "Ethiopian Today",       // Default author
  date: "2024-12-02T10:30:00Z",   // ISO timestamp
  readTime: "5 min read",         // Auto-calculated
  tags: ["NBE", "USD", "ETB"],    // Relevant tags
  featured: false                  // Featured flag
}
```

## Categories

Blog posts are automatically categorized into:

- **Exchange Rates**: Currency market analysis, rate trends
- **Finance Tips**: Practical financial advice
- **Remittance**: Money transfer guides, CBE bonus info
- **Economy**: Ethiopian economic analysis
- **Technology**: Fintech, digital banking updates

## Best Practices

1. **Run Daily**: Schedule for early morning (6-7 AM) to have fresh content
2. **Monitor Quality**: Review generated posts periodically
3. **Backup Data**: `public/blog-posts.json` stores last 100 posts
4. **API Limits**: Groq free tier has rate limits - consider Pro for production
5. **Security**: Keep `BLOG_GENERATION_SECRET` private and rotate periodically

## Troubleshooting

### No posts appearing?
- Check `public/blog-posts.json` exists and has data
- Verify API call returns success
- Check browser console for errors

### AI generation fails?
- Verify `GROQ_API_KEY` is set correctly
- Check Groq API rate limits
- Review API logs for errors

### Cron job not running?
- Verify authorization header is correct
- Check cron service logs
- Test endpoint manually first

## Future Enhancements

- Email notifications when new posts are published
- Social media auto-posting (Twitter, LinkedIn)
- RSS feed generation
- Multi-language support (Amharic)
- Admin dashboard for post management
- SEO meta tags and structured data
- Comments and engagement features
