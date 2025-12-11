export type Rate = { code: string; rate: number; buying?: number; selling?: number }

let officialCache: { ts: number; data: Rate[] } | null = null
let parallelCache: { ts: number; data: Rate[] } | null = null

// Parse static HTML into rates
async function parseRatesFromHtml(html: string): Promise<Rate[]> {
  const { load } = await import('cheerio')
  const $ = load(html)

  const nameToCode: Record<string, string> = {
    'us dollar': 'USD', 'u.s. dollar': 'USD', 'dollar(usa)': 'USD',
    euro: 'EUR',
    'pound sterling': 'GBP', 'british pound': 'GBP',
    'japanese yen': 'JPY', 'yen': 'JPY',
    'chinese yuan': 'CNY', 'yuan renminbi': 'CNY',
    'saudi riyal': 'SAR', 'saudi arabian riyal': 'SAR',
    'uae dirham': 'AED', 'emirati dirham': 'AED',
    'kenyan shilling': 'KES', 'sudanese pound': 'SDG',
    'canadian dollar': 'CAD', 'australian dollar': 'AUD', 'swiss franc': 'CHF',
    'swedish krona': 'SEK', 'norwegian krone': 'NOK', 'danish krone': 'DKK',
    'south african rand': 'ZAR', 'indian rupee': 'INR'
  }

  function toCode(raw: string): string | null {
    const m = raw.toUpperCase().match(/\b([A-Z]{3})\b/)
    if (m) return m[1]
    const key = raw.trim().toLowerCase().replace(/\s+/g, ' ')
    return nameToCode[key] || null
  }

  const rates: Rate[] = []
  $('table').each((_idx: number, tbl: any) => {
    const headers = $(tbl)
      .find('thead th, tr:first-child th')
      .map((_i: number, th: any) => $(th).text().trim().toLowerCase())
      .get()
    const hasCurrency = headers.some((h: string) => /curr|code|currency|name/.test(h))
    const hasRate = headers.some((h: string) => /rate|buy|sell|average|avg|mid/i.test(h))
    if (!hasCurrency || !hasRate) return

    const idxCurrency = headers.findIndex((h: string) => /curr|code|currency|name/.test(h))
    const idxAvg = headers.findIndex((h: string) => /average|avg|mid/.test(h))
    const idxBuy = headers.findIndex((h: string) => /buy|buying/.test(h))
    const idxSell = headers.findIndex((h: string) => /sell|selling/.test(h))

    $(tbl)
      .find('tbody tr, tr')
      .each((_j: number, tr: any) => {
        const tds = $(tr)
          .find('td')
          .map((_k: number, td: any) => $(td).text().trim())
          .get()
        if (tds.length < 2) return
        const currencyCell = idxCurrency >= 0 ? tds[idxCurrency] : tds[0]
        const code = toCode(currencyCell)
        if (!code) return
        const nums = (tds as string[]).map((s: string) => Number(String(s).replace(/[^0-9.]+/g, '')))
        
        let buying: number | undefined
        let selling: number | undefined
        let rate: number | undefined
        
        // Extract buying and selling rates if available
        if (idxBuy >= 0 && Number.isFinite(nums[idxBuy])) buying = nums[idxBuy]
        if (idxSell >= 0 && Number.isFinite(nums[idxSell])) selling = nums[idxSell]
        
        // Calculate average rate
        if (idxAvg >= 0 && Number.isFinite(nums[idxAvg])) rate = nums[idxAvg]
        else if (buying && selling) rate = (buying + selling) / 2
        else rate = nums.find((n) => Number.isFinite(n))
        
        if (rate && rate > 0) rates.push({ code, rate, buying, selling })
      })
  })

  // Deduplicate by code
  const map = new Map<string, Rate>()
  for (const r of rates) if (!map.has(r.code)) map.set(r.code, r)
  return Array.from(map.values())
}

async function headlessScrapeNBE(url: string): Promise<Rate[]> {
  const puppeteer = await import('puppeteer')
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
  try {
    const page = await browser.newPage()
    await page.setUserAgent('Mozilla/5.0 (compatible; EthiopianTodayBot/1.0; +https://example.com)')
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 20000 })
    await page.waitForSelector('table', { timeout: 8000 })
    const html = await page.content()
    return await parseRatesFromHtml(html)
  } finally {
    await browser.close()
  }
}

// Attempt to fetch USD→ETB from Western Union converter page
export async function fetchWU_USD_ETB(): Promise<number | null> {
  const url = 'https://www.westernunion.com/us/en/currency-converter/usd-to-etb-rate.html'
  try {
    // Skip robots.txt check since we removed the file

    // Try static HTML first
    const res = await fetch(url, {
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; EthiopianTodayBot/1.0; +https://example.com)',
        'accept-language': 'en-US,en;q=0.9'
      },
      cache: 'no-store'
    })
    if (res.ok) {
      const html = await res.text()
      // Try multiple patterns
      const patterns = [
        /\b1\s*USD\s*=\s*([0-9,.]+)\s*(?:ETB|Ethiopian\s+Birr)\b/i,
        /\bUSD\s*1\s*=\s*([0-9,.]+)\s*(?:ETB|Ethiopian\s+Birr)\b/i,
        /\b([0-9,.]+)\s*(?:ETB|Ethiopian\s+Birr)\s*=\s*1\s*(?:USD|United\s+States\s+Dollar)\b/i,
        /USD\s*to\s*ETB[^\d]{0,20}([0-9]{2,4}(?:[.,]\d{1,2})?)/i,
      ]
      for (const re of patterns) {
        const m = re.exec(html)
        if (m) {
          const n = Number(m[1].replace(/,/g, ''))
          if (Number.isFinite(n) && n > 0) return n
        }
      }
    }

    // Headless fallback for dynamic rendering
    try {
      const puppeteer = await import('puppeteer')
      const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
      const page = await browser.newPage()
      await page.setUserAgent('Mozilla/5.0 (compatible; EthiopianTodayBot/1.0; +https://example.com)')
      await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' })
      await page.setViewport({ width: 1280, height: 800 })
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 25000 })
      // Try to locate amount input and ensure value is 1
      try {
        await page.waitForSelector('input', { timeout: 8000 })
        await page.evaluate(() => {
          const inputs = Array.from(document.querySelectorAll('input')) as HTMLInputElement[]
          for (const el of inputs) {
            const ph = (el.getAttribute('placeholder') || '').toLowerCase()
            const name = (el.getAttribute('name') || '').toLowerCase()
            if (el.type === 'number' || /amount|send|you send|enter/.test(ph + ' ' + name)) {
              el.value = '1'
              el.dispatchEvent(new Event('input', { bubbles: true }))
              el.dispatchEvent(new Event('change', { bubbles: true }))
              break
            }
          }
        })
      } catch {}
      // Wait for text to include ETB + a plausible number
      try {
        await page.waitForFunction(
          () => /ETB|Ethiopian\s+Birr/i.test(document.body.innerText) && /\b([0-9]{2,4}(?:[.,]\d{1,2})?)\b/.test(document.body.innerText),
          { timeout: 8000 }
        )
      } catch {}
      // Small settle delay
      await new Promise((r) => setTimeout(r, 1000))
      const text = await page.evaluate(() => document.body.innerText)
      await browser.close()
      const patterns2 = [
        /\b1\s*USD\s*=\s*([0-9,.]+)\s*(?:ETB|Ethiopian\s+Birr)\b/i,
        /\bUSD\s*1\s*=\s*([0-9,.]+)\s*(?:ETB|Ethiopian\s+Birr)\b/i,
        /\b([0-9,.]+)\s*(?:ETB|Ethiopian\s+Birr)\s*=\s*1\s*(?:USD|United\s+States\s+Dollar)\b/i,
        /USD\s*to\s*ETB[^\d]{0,20}([0-9]{2,4}(?:[.,]\d{1,2})?)/i,
      ]
      for (const re of patterns2) {
        const m2 = re.exec(text)
        if (m2) {
          const n = Number(m2[1].replace(/,/g, ''))
          if (Number.isFinite(n) && n > 0) return n
        }
      }
    } catch {}
  } catch {}
  return null
}

export async function fetchOfficialRates(): Promise<Rate[]> {
  const now = Date.now()
  console.log('[fetchOfficialRates] Cache check - now:', now, 'cache:', officialCache)
  if (officialCache && now - officialCache.ts < 30 * 60 * 1000) {
    console.log('[fetchOfficialRates] Returning cached data:', officialCache.data)
    return officialCache.data
  }

  // 0) Try ethioxchange.com first (most reliable for Ethiopian bank rates)
  try {
    const { scrapeEthioxchangeRates } = await import('./scrape-ethioxchange')
    console.log('[fetchOfficialRates] Attempting to scrape ethioxchange.com')
    const ethioxRates = await scrapeEthioxchangeRates('awash-bank')
    if (ethioxRates && ethioxRates.length > 0) {
      console.log('[fetchOfficialRates] Successfully got rates from ethioxchange:', ethioxRates)
      officialCache = { ts: now, data: ethioxRates }
      return ethioxRates
    }
  } catch (error) {
    console.error('[fetchOfficialRates] Ethioxchange scraping failed:', error)
  }

  // 1) Try loading from JSON file (env var or default path)
  try {
    const api = process.env.OFFICIAL_RATES_JSON_URL || '/official-rates.json'
    console.log('[fetchOfficialRates] Checking OFFICIAL_RATES_JSON_URL:', api)
    if (api) {
      let data: any
      if (api.startsWith('/')) {
        const { readFile } = await import('fs/promises')
        const { join } = await import('path')
        // Remove leading slashes to ensure we resolve within the project's public directory
        const rel = api.replace(/^\/+/, '')
        const fp = join(process.cwd(), 'public', rel)
        const txt = await readFile(fp, 'utf8')
        data = JSON.parse(txt)
      } else {
        const resApi = await fetch(api, { cache: 'no-store' })
        if (!resApi.ok) throw new Error(`api status ${resApi.status}`)
        data = await resApi.json()
      }
      const pickRate = (k: string): { rate?: number; buying?: number; selling?: number } => {
        if (!data) return {}
        if (typeof data === 'object' && !Array.isArray(data)) {
          const top = (data as any)[k] ?? (data as any)?.rates?.[k]
          if (typeof top === 'number') return { rate: top }
          if (top && typeof top === 'object') {
            const result: { rate?: number; buying?: number; selling?: number } = {}
            
            // Check for buying/selling first
            if (typeof top.buying === 'number') result.buying = top.buying
            if (typeof top.selling === 'number') result.selling = top.selling
            
            // Calculate average if both buying and selling exist
            if (result.buying && result.selling) {
              result.rate = (result.buying + result.selling) / 2
            }
            
            // Otherwise look for rate/price/value
            if (!result.rate) {
              for (const cand of ['rate', 'price', 'value']) {
                const v = (top as any)[cand]
                if (typeof v === 'number') {
                  result.rate = v
                  break
                }
                if (typeof v === 'string') {
                  const n = Number(String(v).replace(/,/g, ''))
                  if (Number.isFinite(n)) {
                    result.rate = n
                    break
                  }
                }
              }
            }
            
            return result
          }
        }
        if (Array.isArray(data)) {
          const row = (data as any[]).find((r) => r?.code === k || r?.currency === k)
          if (row) {
            const result: { rate?: number; buying?: number; selling?: number } = {}
            
            if (typeof row.buying === 'number') result.buying = row.buying
            if (typeof row.selling === 'number') result.selling = row.selling
            
            if (result.buying && result.selling) {
              result.rate = (result.buying + result.selling) / 2
            }
            
            if (!result.rate) {
              for (const cand of ['rate', 'price', 'value']) {
                const v = (row as any)[cand]
                if (typeof v === 'number') {
                  result.rate = v
                  break
                }
                if (typeof v === 'string') {
                  const n = Number(String(v).replace(/,/g, ''))
                  if (Number.isFinite(n)) {
                    result.rate = n
                    break
                  }
                }
              }
            }
            
            return result
          }
        }
        return {}
      }
      
      // Extract all currencies from the JSON data
      const envRates: Rate[] = []
      if (typeof data === 'object' && !Array.isArray(data)) {
        // Parse all currency codes from the JSON object
        for (const [key, value] of Object.entries(data)) {
          if (typeof value === 'number' && value > 0) {
            envRates.push({ code: key, rate: value })
          } else if (value && typeof value === 'object') {
            const rateData = pickRate(key)
            if (rateData.rate && rateData.rate > 0) {
              envRates.push({ code: key, rate: rateData.rate, buying: rateData.buying, selling: rateData.selling })
            }
          }
        }
      } else {
        // Fallback to specific currencies if needed
        const currencies = ['USD', 'EUR', 'GBP', 'AED', 'SAR', 'KWD', 'CAD']
        for (const curr of currencies) {
          const rateData = pickRate(curr)
          if (rateData.rate) {
            envRates.push({ code: curr, rate: rateData.rate, buying: rateData.buying, selling: rateData.selling })
          }
        }
      }
      
      console.log('[fetchOfficialRates] Parsed rates from JSON:', envRates)
      if (envRates.length) {
        officialCache = { ts: now, data: envRates }
        console.log('[fetchOfficialRates] Returning envRates:', envRates)
        return envRates
      }
    }
  } catch {}

  // Skip API providers - they don't support ETB reliably

  const candidates = [
    'https://awashbank.com/exchange-historical/',
    'https://nbe.gov.et/exchange/indicatives-rates/',
    'https://nbe.gov.et/exchange/',
  ]

  try {
    // Optionally try Western Union USD→ETB first (gated by env)
  let wuUsd: number | null = null
  const useWU = process.env.OFFICIAL_USE_WU !== 'false'
  if (useWU) {
      wuUsd = await fetchWU_USD_ETB()
      if (wuUsd && wuUsd > 0) {
        // Cache immediately if no other sources succeed later
      }
    }

    // Skip robots.txt check since we removed the file
    for (const target of candidates) {
      const res = await fetch(target, {
        headers: { 'user-agent': 'Mozilla/5.0 (compatible; EthiopianTodayBot/1.0; +https://example.com)' },
        cache: 'no-store'
      })
      if (!res.ok) continue
      const html = await res.text()
      const parsed = await parseRatesFromHtml(html)
      if (parsed.length) {
        if (wuUsd && wuUsd > 0) {
          // Overlay USD with WU rate for higher reliability
          const others = parsed.filter((r) => r.code !== 'USD')
          const combined = [{ code: 'USD', rate: wuUsd }, ...others]
          officialCache = { ts: now, data: combined }
          return combined
        }
        officialCache = { ts: now, data: parsed }
        return parsed
      }
    }
    // If static failed, try headless
    for (const target of candidates) {
      const parsed = await headlessScrapeNBE(target)
      if (parsed.length) {
        if (wuUsd && wuUsd > 0) {
          const others = parsed.filter((r) => r.code !== 'USD')
          const combined = [{ code: 'USD', rate: wuUsd }, ...others]
          officialCache = { ts: now, data: combined }
          return combined
        }
        officialCache = { ts: now, data: parsed }
        return parsed
      }
    }
  } catch {}

  // Fallbacks
  if (officialCache) return officialCache.data
  // If WU alone succeeded, return USD only
  if ((process.env.OFFICIAL_USE_WU ?? 'true') !== 'false') {
    const wu = await fetchWU_USD_ETB()
    if (wu && wu > 0) {
      const only: Rate[] = [{ code: 'USD', rate: wu }]
      officialCache = { ts: now, data: only }
      return only
    }
  }
  // Skip fallback API - doesn't support ETB
  return [
    { code: 'USD', rate: 150.93 },
    { code: 'EUR', rate: 159.2 },
    { code: 'GBP', rate: 191.5 },
    { code: 'AED', rate: 41.09 },
    { code: 'SAR', rate: 40.4 },
    { code: 'KWD', rate: 484.6 },
  ]
}

// Utilities for API handlers
export function resetRatesCache() {
  officialCache = null
  parallelCache = null
}

export async function fetchParallelRates(): Promise<Rate[]> {
  const now = Date.now()
  // Cache for 10 minutes
  if (parallelCache && now - parallelCache.ts < 10 * 60 * 1000) return parallelCache.data

  // 1) If an env JSON is provided or default path, use it
  try {
    const api = process.env.PARALLEL_RATES_JSON_URL || '/parallel-rates.json'
    console.log('[fetchParallelRates] Checking PARALLEL_RATES_JSON_URL:', api)
    if (api) {
      let data: any
      if (api.startsWith('/')) {
        const { readFile } = await import('fs/promises')
        const { join } = await import('path')
        const rel = api.replace(/^\/+/, '')
        const fp = join(process.cwd(), 'public', rel)
        console.log('[fetchParallelRates] Reading from file:', fp)
        const txt = await readFile(fp, 'utf8')
        data = JSON.parse(txt)
      } else {
        const resApi = await fetch(api, { cache: 'no-store' })
        if (!resApi.ok) throw new Error(`api status ${resApi.status}`)
        data = await resApi.json()
      }
      const pickRate = (k: string): { rate?: number; buying?: number; selling?: number } => {
        if (!data) return {}
        if (typeof data === 'object' && !Array.isArray(data)) {
          const top = (data as any)[k] ?? (data as any)?.rates?.[k]
          if (typeof top === 'number') return { rate: top }
          if (top && typeof top === 'object') {
            const result: { rate?: number; buying?: number; selling?: number } = {}
            
            if (typeof top.buying === 'number') result.buying = top.buying
            if (typeof top.selling === 'number') result.selling = top.selling
            
            if (result.buying && result.selling) {
              result.rate = (result.buying + result.selling) / 2
            }
            
            if (!result.rate) {
              for (const cand of ['rate', 'price', 'value']) {
                const v = (top as any)[cand]
                if (typeof v === 'number') {
                  result.rate = v
                  break
                }
                if (typeof v === 'string') {
                  const n = Number(String(v).replace(/,/g, ''))
                  if (Number.isFinite(n)) {
                    result.rate = n
                    break
                  }
                }
              }
            }
            
            return result
          }
        }
        if (Array.isArray(data)) {
          const row = (data as any[]).find((r) => r?.code === k || r?.currency === k)
          if (row) {
            const result: { rate?: number; buying?: number; selling?: number } = {}
            
            if (typeof row.buying === 'number') result.buying = row.buying
            if (typeof row.selling === 'number') result.selling = row.selling
            
            if (result.buying && result.selling) {
              result.rate = (result.buying + result.selling) / 2
            }
            
            if (!result.rate) {
              for (const cand of ['rate', 'price', 'value']) {
                const v = (row as any)[cand]
                if (typeof v === 'number') {
                  result.rate = v
                  break
                }
                if (typeof v === 'string') {
                  const n = Number(String(v).replace(/,/g, ''))
                  if (Number.isFinite(n)) {
                    result.rate = n
                    break
                  }
                }
              }
            }
            
            return result
          }
        }
        return {}
      }
      
      // Extract all currencies from the JSON data
      const fromEnv: Rate[] = []
      if (typeof data === 'object' && !Array.isArray(data)) {
        // Parse all currency codes from the JSON object
        for (const [key, value] of Object.entries(data)) {
          if (typeof value === 'number' && value > 0) {
            fromEnv.push({ code: key, rate: value })
          } else if (value && typeof value === 'object') {
            const rateData = pickRate(key)
            if (rateData.rate && rateData.rate > 0) {
              fromEnv.push({ code: key, rate: rateData.rate, buying: rateData.buying, selling: rateData.selling })
            }
          }
        }
      } else {
        // Fallback to specific currencies if needed
        const currencies = ['USD', 'EUR', 'GBP', 'AED', 'SAR', 'KWD', 'CAD']
        for (const curr of currencies) {
          const rateData = pickRate(curr)
          if (rateData.rate) {
            fromEnv.push({ code: curr, rate: rateData.rate, buying: rateData.buying, selling: rateData.selling })
          }
        }
      }
      
      console.log('[fetchParallelRates] Parsed rates from JSON:', fromEnv)
      if (fromEnv.length) {
        parallelCache = { ts: now, data: fromEnv }
        console.log('[fetchParallelRates] Returning fromEnv:', fromEnv)
        return fromEnv
      }
    }
  } catch (err) {
    console.error('[fetchParallelRates] Error reading JSON:', err)
  }

  // 2) Try to fetch current rates from ethioblackmarket.com API (same source as chart)
  try {
    const apiUrl = 'https://ethioblackmarket.com/api/current-price'
    console.log('[fetchParallelRates] Fetching from ethioblackmarket API:', apiUrl)
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('[fetchParallelRates] API response:', data)
      
      // API returns { currentPrice: { USD: number, EUR: number, GBP: number } }
      if (data.currentPrice && typeof data.currentPrice === 'object') {
        const rates: Rate[] = []
        const currencies = ['USD', 'EUR', 'GBP', 'AED', 'SAR', 'KWD']
        
        for (const code of currencies) {
          const value = data.currentPrice[code]
          if (typeof value === 'number' && value > 0) {
            rates.push({ code, rate: value })
          }
        }
        
        if (rates.length > 0) {
          console.log('[fetchParallelRates] Using ethioblackmarket rates:', rates)
          parallelCache = { ts: now, data: rates }
          return rates
        }
      }
    }
  } catch (err) {
    console.error('[fetchParallelRates] Error fetching from ethioblackmarket API:', err)
  }

  // 3) Compute parallel from official: USD_parallel = USD_official + 20; others scaled by same factor
  try {
    const official = await fetchOfficialRates()
    const usd = official.find((r) => r.code === 'USD')?.rate
    if (usd && usd > 0) {
      const premiumUsd = usd + 20
      const factor = premiumUsd / usd
      const wanted = ['USD', 'EUR', 'GBP', 'AED', 'SAR', 'KWD']
      const computed: Rate[] = []
      for (const code of wanted) {
        if (code === 'USD') {
          computed.push({ code, rate: Number(premiumUsd.toFixed(2)) })
        } else {
          const base = official.find((r) => r.code === code)?.rate
          if (base && base > 0) computed.push({ code, rate: Number((base * factor).toFixed(2)) })
        }
      }
      if (computed.length) {
        parallelCache = { ts: now, data: computed }
        return computed
      }
    }
  } catch {}

  // 4) Fallback conservative placeholders
  const fallback: Rate[] = [
    { code: 'USD', rate: 135.5 },
    { code: 'EUR', rate: 144.7 },
    { code: 'GBP', rate: 168.0 },
  ]
  parallelCache = { ts: now, data: fallback }
  return fallback
}

// Admin override helpers (in-memory)
export function overrideRates(kind: 'official' | 'parallel', data: Rate[]) {
  const now = Date.now()
  if (kind === 'official') officialCache = { ts: now, data }
  else parallelCache = { ts: now, data }
}
