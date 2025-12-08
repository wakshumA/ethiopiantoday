import type { Rate } from './rates'

export async function scrapeEthioxchangeRates(bankSlug: string = 'awash-bank'): Promise<Rate[]> {
  try {
    const url = `https://www.ethioxchange.com/bank/${bankSlug}`
    
    // First try with puppeteer for dynamic content
    const puppeteer = await import('puppeteer')
    const browser = await puppeteer.launch({ 
      headless: true, 
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    })
    
    try {
      const page = await browser.newPage()
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
      
      console.log('[scrapeEthioxchange] Navigating to:', url)
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
      
      // Wait for the rates to load (they're in a table or div with rate data)
      await page.waitForSelector('table, .rate, [class*="exchange"]', { timeout: 10000 })
      
      // Extract the page content
      const content = await page.content()
      
      // Look for Livewire snapshot data
      const livewireMatch = content.match(/wire:snapshot="({[^"]*?rates[^"]*?})"/s)
      
      if (livewireMatch) {
        try {
          // Decode HTML entities
          const decodedData = livewireMatch[1]
            .replace(/&quot;/g, '"')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/\\"/g, '"')
          
          const snapshot = JSON.parse(decodedData)
          console.log('[scrapeEthioxchange] Found Livewire snapshot')
          
          if (snapshot.data && snapshot.data.rates) {
            const rates: Rate[] = []
            
            // Parse the rates array from Livewire
            for (const rateData of snapshot.data.rates) {
              // Extract currency code and rate from the data structure
              // Format might be like: "today":"2 days ago 151.526<sub> birr</sub>"
              if (rateData.today) {
                const todayMatch = rateData.today.match(/([\d.]+)/)
                if (todayMatch) {
                  const rate = parseFloat(todayMatch[1])
                  
                  // Try to determine currency from flag path
                  let code = 'USD'
                  if (rateData.flag && typeof rateData.flag === 'string') {
                    if (rateData.flag.includes('01J52SWRRX')) code = 'USD'
                    else if (rateData.flag.includes('01J52SZ9PB')) code = 'EUR'
                    else if (rateData.flag.includes('01J52SYBWP')) code = 'GBP'
                    else if (rateData.flag.includes('01J56JMQHJ')) code = 'AED'
                    else if (rateData.flag.includes('01J57DQCF9')) code = 'SAR'
                    else if (rateData.flag.includes('KWD')) code = 'KWD'
                  }
                  
                  if (rate > 0) {
                    rates.push({ code, rate, buying: rate, selling: rate })
                  }
                }
              }
            }
            
            if (rates.length > 0) {
              console.log('[scrapeEthioxchange] Extracted rates from Livewire:', rates)
              return rates
            }
          }
        } catch (parseError) {
          console.error('[scrapeEthioxchange] Failed to parse Livewire data:', parseError)
        }
      }
      
      // Fallback: try to extract from table or text
      const rates: Rate[] = []
      const text = await page.evaluate(() => document.body.innerText)
      
      // Look for currency patterns like "USD 151.31" or "151.31 birr"
      const currencyPatterns = [
        { code: 'USD', regex: /USD[^\d]*([\d.]+)/i },
        { code: 'EUR', regex: /EUR[^\d]*([\d.]+)/i },
        { code: 'GBP', regex: /GBP[^\d]*([\d.]+)/i },
        { code: 'AED', regex: /AED[^\d]*([\d.]+)/i },
        { code: 'SAR', regex: /SAR[^\d]*([\d.]+)/i },
        { code: 'KWD', regex: /KWD[^\d]*([\d.]+)/i },
      ]
      
      for (const { code, regex } of currencyPatterns) {
        const match = text.match(regex)
        if (match) {
          const rate = parseFloat(match[1])
          if (rate > 0 && rate < 1000) {
            rates.push({ code, rate, buying: rate, selling: rate })
          }
        }
      }
      
      if (rates.length > 0) {
        console.log('[scrapeEthioxchange] Extracted rates from text:', rates)
        return rates
      }
      
      console.log('[scrapeEthioxchange] No rates found')
      return []
      
    } finally {
      await browser.close()
    }
    
  } catch (error) {
    console.error('[scrapeEthioxchange] Error:', error)
    return []
  }
}
