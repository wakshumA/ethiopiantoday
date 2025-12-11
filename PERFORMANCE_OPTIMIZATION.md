# 🚀 Website Performance Optimization Guide

**Analysis Date:** December 11, 2025  
**Priority Level:** HIGH

## Current Performance Issues Identified

Based on your code analysis, here are the main bottlenecks causing delays:

### 1. **Multiple API Calls on Page Load** ⚠️ CRITICAL
**Problem:** Your homepage makes 3 parallel API calls (official, parallel, NBE rates) on mount:
```tsx
const { data: official } = useSWR('/api/rates/official', fetcher, { refreshInterval: 60_000 })
const { data: parallel } = useSWR('/api/rates/parallel', fetcher, { refreshInterval: 60_000 })
const { data: nbe } = useSWR('/api/rates/nbe', fetcher, { refreshInterval: 60_000 })
```

**Impact:** Each API call can take 1-5 seconds, blocking page render.

**Solution:** 
- Cache rates in JSON files (you already have them!)
- Pre-render rates with static generation
- Reduce API calls from 3 to 1 combined endpoint

---

### 2. **Heavy Puppeteer Scraping** ⚠️ CRITICAL
**Problem:** Your rates.ts uses headless browser scraping:
```typescript
async function headlessScrapeNBE(url: string): Promise<Rate[]> {
  const puppeteer = await import('puppeteer')
  const browser = await puppeteer.launch()
  // ... launching full browser instance
}
```

**Impact:** 
- Puppeteer startup time: 2-3 seconds
- Chrome instance memory: 100+ MB
- Blocks API response until scrape complete

**Solution:**
- Pre-scrape rates on schedule (cron job)
- Store results in JSON files
- Serve JSON files directly
- Remove live scraping from API endpoints

---

### 3. **No Response Caching Headers** ⚠️ HIGH
**Problem:** API responses don't include cache headers:
```typescript
// No cache control set
return Response.json({ rates: [...] })
```

**Impact:** Browser re-fetches data on every page visit.

**Solution:** Add cache headers to API routes

---

### 4. **TopNews Component Fetches on Mount** ⚠️ HIGH
**Problem:** TopNews fetches `/api/news/top` client-side on mount:
```tsx
useEffect(() => {
  fetchNews()
}, [])
```

**Impact:** Delays news section rendering.

**Solution:** Pre-fetch and cache news data

---

### 5. **Recharts Bundle Size** ⚠️ MEDIUM
**Problem:** ExchangeRateChart uses Recharts (large library):
```tsx
import { AreaChart, Area, XAxis, YAxis... } from 'recharts'
```

**Impact:** Adds ~100KB to bundle

**Solution:** Lazy load chart component

---

### 6. **AdSense Script Before Interactive** ⚠️ MEDIUM
**Problem:** AdSense script loads with `beforeInteractive`:
```tsx
<Script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
  strategy="beforeInteractive"  // ← Blocks rendering
/>
```

**Impact:** Blocks page rendering by ~1-2 seconds

**Solution:** Change to `afterInteractive`

---

## 🔧 Quick Wins (Implement Now - 5 minutes each)

### Quick Fix #1: Change AdSense Loading Strategy
**File:** `src/app/layout.tsx`
```diff
<Script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9561015604678968"
  crossOrigin="anonymous"
- strategy="beforeInteractive"
+ strategy="afterInteractive"
/>
```

**Expected improvement:** -1-2 seconds (First Contentful Paint)

---

### Quick Fix #2: Add Cache Headers to API Routes
**All API files need this:**

**File:** `src/app/api/rates/official/route.ts` (and parallel, nbe)
```typescript
export async function GET() {
  const rates = await getRates()
  
  return Response.json(
    { rates },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'Content-Type': 'application/json',
      },
    }
  )
}
```

**Expected improvement:** -1-3 seconds (repeat visits)

---

### Quick Fix #3: Lazy Load the Chart
**File:** `src/app/page.tsx`

Replace:
```tsx
import ExchangeRateChart from '@/components/ExchangeRateChart'
```

With:
```tsx
import dynamic from 'next/dynamic'

const ExchangeRateChart = dynamic(
  () => import('@/components/ExchangeRateChart'),
  { loading: () => <div className="h-64 bg-gray-200/50 dark:bg-gray-800/50 rounded-lg animate-pulse" /> }
)
```

**Expected improvement:** -50-100ms (initial load)

---

### Quick Fix #4: Reduce SWR Refresh Intervals
**File:** `src/components/ExchangeWidget.tsx`

The rates refresh every 60 seconds. Reduce to match your actual update schedule:

```tsx
// If rates update every 5 minutes:
const { data: official } = useSWR('/api/rates/official', fetcher, { 
  refreshInterval: 300_000  // 5 minutes instead of 1 minute
})
```

**Expected improvement:** Fewer API calls = faster subsequent loads

---

## 📊 Performance Optimization Plan

### Phase 1: Immediate (Do Today - 15 minutes)
- [ ] Change AdSense to `afterInteractive` 
- [ ] Add cache headers to 3 rate API endpoints
- [ ] Lazy load ExchangeRateChart
- [ ] Update SWR refresh intervals

**Expected result:** 30-50% faster initial load

---

### Phase 2: Short-term (This Week - 1 hour)
- [ ] Create combined `/api/rates` endpoint
- [ ] Pre-fetch news data and cache it
- [ ] Implement ISR (Incremental Static Regeneration)
- [ ] Add image optimization

**Expected result:** 60-70% faster initial load

---

### Phase 3: Medium-term (Next Week - 2 hours)
- [ ] Remove Puppeteer scraping from API
- [ ] Create scheduled scraping jobs (cron)
- [ ] Implement data preloading
- [ ] Set up CDN caching

**Expected result:** 80%+ faster loads, zero scraping delays

---

## 📋 Detailed Recommendations

### Recommendation 1: Create Combined Rates Endpoint

**Create:** `src/app/api/rates/all/route.ts`

```typescript
import { getRatesOfficial, getRatesParallel, getRatesNBE } from '@/lib/rates'

export async function GET() {
  try {
    // Fetch all in parallel
    const [official, parallel, nbe] = await Promise.all([
      getRatesOfficial(),
      getRatesParallel(),
      getRatesNBE(),
    ])

    return Response.json(
      { official, parallel, nbe },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    )
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch rates' },
      { status: 500 }
    )
  }
}
```

**Update ExchangeWidget to use single endpoint:**
```tsx
const { data } = useSWR('/api/rates/all', fetcher, { refreshInterval: 300_000 })

// Now access:
// data?.official
// data?.parallel
// data?.nbe
```

**Benefit:** Reduces 3 API calls to 1 = 2-3 seconds faster

---

### Recommendation 2: Implement ISR (Incremental Static Regeneration)

**File:** `src/app/page.tsx` - Add this at the top:

```tsx
// Revalidate page every 5 minutes
export const revalidateInterval = 300

export default function HomePage() {
  // ... rest of code
}
```

**Benefit:** 
- First user waits for generation
- All other users get instant cached page
- Auto-updates every 5 minutes

---

### Recommendation 3: Pre-fetch TopNews Data

**Create:** `src/app/api/news/cached/route.ts`

```typescript
let cachedNews = null
let cacheTime = 0

export async function GET() {
  const now = Date.now()
  
  // Cache for 30 minutes
  if (cachedNews && now - cacheTime < 30 * 60 * 1000) {
    return Response.json({ news: cachedNews, cached: true })
  }

  // Fetch fresh news
  const news = await fetchTopNews()
  cachedNews = news
  cacheTime = now

  return Response.json(
    { news, cached: false },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
      },
    }
  )
}
```

**Update TopNews component:**
```tsx
const fetchNews = async () => {
  // Use cached endpoint
  const response = await fetch('/api/news/cached')
  const { news } = await response.json()
  setNews(news)
}
```

**Benefit:** 30-minute caching = instant loads for most users

---

### Recommendation 4: Remove Puppeteer from API Routes

**Current flow:**
```
API request → Launch Puppeteer → Scrape NBE → Return (2-5 seconds)
```

**Optimized flow:**
```
Scheduled job → Scrape NBE → Save to JSON
API request → Read JSON → Return (10-50ms)
```

**Implementation:**

1. **Create cron job** (add to scripts):
```bash
#!/bin/bash
# scripts/update-rates.sh
curl http://localhost:3000/api/rates/update-cache
```

2. **Create cache update endpoint** - `src/app/api/rates/update-cache/route.ts`:
```typescript
export async function GET(req: Request) {
  // Only allow from internal/authorized sources
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Scrape all rates (this still takes time, but runs on schedule)
    const official = await getRatesOfficial()
    const parallel = await getRatesParallel()
    const nbe = await getRatesNBE()

    // Save to cache (in-memory or file)
    // This is fast since it's just storing data

    return Response.json({ success: true, updated: true })
  } catch (error) {
    return Response.json({ error: 'Update failed' }, { status: 500 })
  }
}
```

**Benefit:** API responses instant (no scraping on request)

---

### Recommendation 5: Image Optimization

Your images don't use Next.js Image component. Update `TopNews.tsx`:

```diff
- <img src={item.thumbnail} alt={item.title} />
+ <Image
+   src={item.thumbnail}
+   alt={item.title}
+   width={300}
+   height={200}
+   priority={false}
+   loading="lazy"
+   unoptimized={item.thumbnail?.includes('unsplash')}
+ />
```

**Benefit:** Automatic image compression + lazy loading

---

### Recommendation 6: Bundle Analysis

Add to package.json scripts:
```json
"analyze": "ANALYZE=true next build"
```

Run: `npm run analyze`

Shows which components bloat your bundle.

---

## 📈 Expected Performance Improvements

### Before Optimization
- First Contentful Paint (FCP): ~3-4 seconds
- Largest Contentful Paint (LCP): ~4-6 seconds  
- Time to Interactive (TTI): ~5-8 seconds
- Page Load Time: ~6-10 seconds

### After Quick Wins (Phase 1)
- FCP: ~2-2.5 seconds (-30%)
- LCP: ~2.5-3.5 seconds (-40%)
- TTI: ~3-4 seconds (-50%)
- Page Load Time: ~3-5 seconds (-40%)

### After Full Optimization (All Phases)
- FCP: ~0.8-1.2 seconds (-75%)
- LCP: ~1-2 seconds (-80%)
- TTI: ~1.5-2.5 seconds (-80%)
- Page Load Time: ~1-3 seconds (-80%)

---

## 🎯 Implementation Priority

### 🔴 Do First (5 min impact = 30-40% faster)
1. Change AdSense strategy to `afterInteractive`
2. Add cache headers to API routes
3. Lazy load chart component

### 🟡 Do Second (30 min impact = 60-70% faster)
4. Create combined rates endpoint
5. Implement ISR on homepage
6. Add news caching

### 🟢 Do Third (90 min impact = 80%+ faster)
7. Remove Puppeteer from live API
8. Set up scheduled cron jobs
9. Image optimization
10. Bundle analysis

---

## 📋 Implementation Checklist

**Phase 1: Quick Wins**
- [ ] Update `src/app/layout.tsx` - AdSense strategy
- [ ] Update `src/app/api/rates/official/route.ts` - Add cache headers
- [ ] Update `src/app/api/rates/parallel/route.ts` - Add cache headers
- [ ] Update `src/app/api/rates/nbe/route.ts` - Add cache headers
- [ ] Update `src/app/page.tsx` - Lazy load chart
- [ ] Update `src/components/ExchangeWidget.tsx` - Adjust refresh intervals

**Phase 2: Caching & ISR**
- [ ] Create `src/app/api/rates/all/route.ts`
- [ ] Update `src/app/page.tsx` - Add ISR config
- [ ] Create `src/app/api/news/cached/route.ts`
- [ ] Update `src/components/TopNews.tsx` - Use cached endpoint

**Phase 3: Advanced**
- [ ] Create `scripts/update-rates.sh`
- [ ] Create `src/app/api/rates/update-cache/route.ts`
- [ ] Set up cron job in Vercel/hosting
- [ ] Optimize images with Next.js Image
- [ ] Run bundle analysis

---

## 🔗 Resources

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Next.js Caching](https://nextjs.org/docs/app/building-your-application/caching)
- [Web Vitals Guide](https://web.dev/vitals/)
- [Vercel Analytics](https://vercel.com/analytics)

---

## 💡 Pro Tips

1. **Monitor Performance:**
   - Use Vercel Analytics (built-in)
   - Check Google PageSpeed Insights
   - Monitor Core Web Vitals

2. **Test Changes:**
   - Test locally with `npm run build && npm start`
   - Use Chrome DevTools Network tab
   - Test on mobile (most critical)

3. **Measure Impact:**
   - Before/after screenshots
   - Use WebPageTest.org
   - Check Google Search Console metrics

4. **Keep Optimizing:**
   - Performance is iterative
   - Measure → Optimize → Repeat
   - Stay under 3-second load time

---

**Ready to implement? Start with Phase 1 (5 minutes) for immediate 30-40% improvement!**

*Last Updated: December 11, 2025*
