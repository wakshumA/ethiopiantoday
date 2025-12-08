# Quick Start Guide - Automated Blog Generation

## Setup (5 minutes)

### 1. Install Dependencies
Already done ✅ (groq-sdk is installed)

### 2. Configure Environment Variables

Edit `.env.local` and set:

```bash
# Required: Groq AI API Key (get from https://console.groq.com/keys)
GROQ_API_KEY=your_groq_api_key_here

# Required: Blog Generation Secret (change this!)
BLOG_GENERATION_SECRET=my_secure_blog_token_12345

# Optional: For production deployment
# NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### 3. Generate Your First Blog Post

```bash
# Method 1: Direct generation
curl -X POST http://localhost:3000/api/blog/generate \
  -H "Authorization: Bearer my_secure_blog_token_12345"

# Method 2: Auto-generate (calls generate internally)
curl -X POST http://localhost:3000/api/blog/auto-generate \
  -H "Authorization: Bearer my_secure_blog_token_12345"
```

### 4. View Blog Posts

Visit: http://localhost:3000/blog

## Scheduling for Daily Automation

### Option 1: GitHub Actions (Recommended)

1. **Already created**: `.github/workflows/generate-blog.yml`
2. **Add GitHub Secrets**:
   - Go to repository Settings → Secrets → Actions
   - Add `BLOG_GENERATION_SECRET`: `my_secure_blog_token_12345`
   - Add `APP_URL`: `https://your-domain.com`
3. **Deploy to Vercel/Netlify**
4. **Done!** Blog posts generate daily at 6 AM UTC

### Option 2: Vercel Cron (Easiest for Vercel users)

Create `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/blog/auto-generate",
    "schedule": "0 6 * * *"
  }]
}
```

Set environment variable in Vercel dashboard:
- `BLOG_GENERATION_SECRET`: `my_secure_blog_token_12345`

### Option 3: Local Testing with cron

```bash
# Add to crontab (crontab -e)
0 6 * * * curl -X POST http://localhost:3000/api/blog/auto-generate -H "Authorization: Bearer my_secure_blog_token_12345"
```

## How It Works

1. **Fetches Data**:
   - NBE official rates
   - Parallel market rates
   - Top news headlines
   - Historical trends

2. **AI Analysis**:
   - Groq AI (Llama 3.3 70B) analyzes data
   - Writes 800-1200 word article
   - Auto-categorizes content
   - Generates title, excerpt, tags

3. **Automatic Publishing**:
   - Saves to `public/blog-posts.json`
   - Displays on `/blog` page
   - Individual pages at `/blog/[id]`

## Testing

### Test Blog Generation

```bash
# Start server
npm run dev

# Generate test post
curl -X POST http://localhost:3000/api/blog/generate \
  -H "Authorization: Bearer my_secure_blog_token_12345"

# Check if it worked
curl http://localhost:3000/api/blog/posts | python3 -m json.tool
```

### View Results

- Blog listing: http://localhost:3000/blog
- Check data: `cat public/blog-posts.json`

## Troubleshooting

### "Unauthorized" error
- Check `BLOG_GENERATION_SECRET` matches in `.env.local` and curl command

### "Failed to generate blog post"
- Verify `GROQ_API_KEY` is valid
- Check server logs for detailed error
- Ensure data endpoints are working (NBE, parallel, news)

### No posts showing
- Check `public/blog-posts.json` exists and has content
- Refresh browser or clear cache
- Check browser console for errors

## API Reference

### Generate Blog Post
```bash
POST /api/blog/generate
Authorization: Bearer <your_token>

Response:
{
  "success": true,
  "message": "Blog post generated successfully",
  "post": { ... }
}
```

### Auto-Generate (for cron jobs)
```bash
POST /api/blog/auto-generate
Authorization: Bearer <your_token>

Response:
{
  "success": true,
  "message": "Automated blog post generated successfully",
  "timestamp": "2024-12-02T10:30:00Z",
  "data": { ... }
}
```

### Fetch Posts
```bash
GET /api/blog/posts?category=Exchange%20Rates&limit=10&offset=0

Response:
{
  "posts": [...],
  "total": 25,
  "hasMore": true
}
```

## Next Steps

1. ✅ System is ready to use
2. 📝 Generate first blog post (see commands above)
3. 🌐 Deploy to production (Vercel/Netlify)
4. ⏰ Set up GitHub Actions or Vercel cron
5. 📊 Monitor and enjoy automated content!

## Documentation

Full documentation: `docs/AUTOMATED_BLOG.md`
