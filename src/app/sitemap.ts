import { NextResponse } from 'next/server'

// Define your base URL - change this to your production domain
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ethiopiantoday.com'

// All routes in your website
const routes = [
  {
    path: '/',
    changefreq: 'hourly',
    priority: 1.0,
    lastmod: new Date().toISOString().split('T')[0],
  },
  {
    path: '/about',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: new Date().toISOString().split('T')[0],
  },
  {
    path: '/blog',
    changefreq: 'daily',
    priority: 0.9,
    lastmod: new Date().toISOString().split('T')[0],
  },
  {
    path: '/contact',
    changefreq: 'monthly',
    priority: 0.5,
    lastmod: new Date().toISOString().split('T')[0],
  },
  {
    path: '/privacy',
    changefreq: 'yearly',
    priority: 0.3,
    lastmod: new Date().toISOString().split('T')[0],
  },
  {
    path: '/terms',
    changefreq: 'yearly',
    priority: 0.3,
    lastmod: new Date().toISOString().split('T')[0],
  },
]

export async function GET() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">
${routes
  .map(
    (route) => `  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
