# Ethiopian Today

Modern magazine-style news website built with Next.js (App Router), TypeScript, and Tailwind CSS.

## Features
- Sections: Top News, Economy (with live exchange rates), Technology, Politics
- Magazine grid with featured images
- Blog-style posts (title, summary, image)
- Responsive, dark/light mode, modern fonts, card layouts
- Search bar and social share (placeholder)
- Ad spaces ready for Google AdSense
- API routes for exchange rates (official + parallel placeholder) and blog posts

## Getting Started

1. Install dependencies

```bash
npm install
```

2. Run the dev server

```bash
npm run dev
```

3. Open http://localhost:3000

## Exchange Rates
- Official: mocked; replace `fetchOfficialRates` in `src/lib/rates.ts` with a real provider.
- Parallel: integrate a server-side fetch/scraper for https://www.ethioblackmarket.com/ in `fetchParallelRates`.

## Blog Posting API
- POST /api/posts with JSON: { title, content, slug, summary?, image?, category? }
- Stores in-memory; replace with a DB (e.g., Prisma + PostgreSQL) for persistence.

## Theming
- Uses `next-themes` class-based dark mode.

## Notes
- Images use remote patterns; ensure domains are whitelisted in `next.config.mjs` for production.
- Replace placeholder ads with AdSense snippet.