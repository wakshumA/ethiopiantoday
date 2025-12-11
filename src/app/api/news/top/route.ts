import { NextResponse } from 'next/server'
import { join } from 'path'
import { stat, readFile } from 'fs/promises'
import { getReliableImageUrl, getRandomFallbackImage } from '@/lib/imageUtils'

type NewsItem = {
  id: string
  title: string
  link: string
  publishedAt?: string
  source: string
  thumbnail?: string
}

// Simple in-memory cache to avoid rate limits
let cache: { ts: number; data: NewsItem[] } | null = null

function firstImgFromHtml(html: string | undefined): string | undefined {
  if (!html) return undefined
  const m = html.match(/<img[^>]*src=["']([^"']+)["'][^>]*>/i)
  return m?.[1]
}

async function fetchRSS(url: string, source: string): Promise<NewsItem[]> {
  const Parser = (await import('rss-parser')).default
  const parser = new Parser()
  let feed: any
  try {
    feed = await parser.parseURL(url)
    console.log(`[RSS] Successfully fetched from ${source}: ${feed.items?.length || 0} items`)
  } catch (e) {
    console.error(`[RSS] Failed to fetch from ${source}:`, e instanceof Error ? e.message : String(e))
    return []
  }
  const items: NewsItem[] = []
  for (const it of feed.items ?? []) {
    const link = (it.link || it.guid || '').toString()
    if (!link) continue
    // Try to find a thumbnail: enclosure, media tags, image, or the first <img> in HTML
    const enclosureUrl = (it as any)?.enclosure?.url || ((it as any)?.enclosures?.[0]?.url)
    const mediaContent = (it as any)['media:content']?.url || (Array.isArray((it as any)['media:content']) ? (it as any)['media:content']?.[0]?.url : undefined)
    const mediaThumbNode = (it as any)['media:thumbnail']
    const mediaThumb = Array.isArray(mediaThumbNode)
      ? (mediaThumbNode[0]?.url || mediaThumbNode[0]?.$?.url)
      : (mediaThumbNode?.url || mediaThumbNode?.$?.url)
    const imageField = (it as any)?.image?.url || (it as any)?.image
    const originalThumb = enclosureUrl || mediaContent || mediaThumb || imageField || firstImgFromHtml((it as any)?.content || (it as any)['content:encoded'])
    
    // Use reliable image URL or fallback
    const thumb = getReliableImageUrl(originalThumb) || getRandomFallbackImage()

    items.push({
      id: link,
      title: (it.title || '').toString(),
      link,
      publishedAt: (it.isoDate || it.pubDate || '').toString(),
      source,
      thumbnail: thumb,
    })
  }
  return items
}

export async function GET(req: Request) {
  try {
    console.log('[News API] Request received')
    const url = new URL(req.url)
    const fresh = url.searchParams.get('fresh') === '1'
    
    // If a pre-fetched file exists and isn't stale (24h), serve it first
    if (!fresh) {
      try {
        const fp = join(process.cwd(), 'public', 'news-top.json')
        const s = await stat(fp)
        const ageMs = Date.now() - s.mtimeMs
        console.log('[News API] Found cached file, age:', ageMs / 1000 / 60, 'minutes')
        if (ageMs < 24 * 60 * 60 * 1000) {
          const txt = await readFile(fp, 'utf8')
          const json = JSON.parse(txt)
          const items = Array.isArray(json?.items) ? json.items as any[] : []
          console.log('[News API] Serving cached file with', items.length, 'items')
          return NextResponse.json({ items, cached: true }, { headers: { 'Cache-Control': 's-maxage=600, stale-while-revalidate=300' } })
        }
      } catch (e) {
        console.log('[News API] No cached file or error reading it')
      }
    }
    const now = Date.now()
    if (cache && now - cache.ts < 5 * 60 * 1000) {
      console.log('[News API] Serving in-memory cache with', cache.data.length, 'items')
      return NextResponse.json({ items: cache.data, cached: true }, { headers: { 'Cache-Control': 's-maxage=240, stale-while-revalidate=60' } })
    }

    console.log('[News API] Fetching fresh RSS feeds')
    const feeds = [
      // Ethiopian news sources (priority)
      { url: 'https://www.bbc.com/news/world/africa?format=feeds_rss_v2', source: 'BBC Africa' },
      { url: 'https://feeds.bloomberg.com/markets/news.rss', source: 'Bloomberg Markets' },
      { url: 'https://feeds.aljazeera.com/aljazeera/channel/africa.xml', source: 'Al Jazeera Africa' },
      { url: 'https://www.reuters.com/finance', source: 'Reuters' },
      // Fallback: Generic Africa/World news
      { url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html', source: 'CNBC Africa' },
      { url: 'https://feeds.france24.com/en/africa', source: 'France 24' },
    ]

  const results = await Promise.allSettled(feeds.map(f => fetchRSS(f.url, f.source)))
    const all: NewsItem[] = []
    for (let i = 0; i < results.length; i++) {
      const r = results[i]
      if (r.status === 'fulfilled') all.push(...r.value)
    }
  
  console.log('[News API] Total items fetched:', all.length)
  // Sort by time desc if available
  all.sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime())
  const top = all.slice(0, 50)
    cache = { ts: now, data: top }
  console.log('[News API] Returning', top.length, 'items')
  return NextResponse.json({ items: top, cached: false }, { headers: { 'Cache-Control': 's-maxage=240, stale-while-revalidate=60' } })
  } catch (e) {
    console.error('[News API] Error:', e)
    return NextResponse.json({ items: [], error: (e as Error).message }, { status: 200 })
  }
}
