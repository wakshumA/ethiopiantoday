import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0]
    const url = `https://api.nbe.gov.et/api/filter-exchange-rates?date=${today}`
    
    console.log('[NBE API] Fetching rates from:', url)
    
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; EthiopianTodayBot/1.0)'
      },
      timeout: 10000
    })

    if (!response.ok) {
      console.error(`[NBE API] Status ${response.status}:`, response.statusText)
      throw new Error(`NBE API returned status ${response.status}`)
    }

    const data = await response.json()
    console.log('[NBE API] Response received, processing data...')
    
    // Validate that we have data
    if (!data.data || data.data.length === 0) {
      console.warn('[NBE API] Empty data array received')
      throw new Error('Empty data from NBE API')
    }
    
    // Extract major currencies in the same order as CBE
    const rates = []
    const majorCurrencies = ['USD', 'EUR', 'GBP', 'AED', 'SAR', 'KWD']
    
    // Create a map for quick lookup
    const ratesMap = new Map()
    for (const item of data.data || []) {
      const code = item.currency?.code
      if (majorCurrencies.includes(code)) {
        const buyingRate = parseFloat(item.buying)
        const sellingRate = parseFloat(item.selling)
        
        // Validate rates are valid numbers
        if (!isNaN(buyingRate) && !isNaN(sellingRate)) {
          ratesMap.set(code, {
            code,
            buying: buyingRate,
            selling: sellingRate,
            rate: parseFloat(item.weighted_average) || (buyingRate + sellingRate) / 2
          })
          console.log(`[NBE API] ${code}: Buy=${buyingRate}, Sell=${sellingRate}`)
        } else {
          console.warn(`[NBE API] Invalid rates for ${code}: buy=${item.buying}, sell=${item.selling}`)
        }
      }
    }
    
    // Add rates in the specified order
    for (const code of majorCurrencies) {
      if (ratesMap.has(code)) {
        rates.push(ratesMap.get(code))
      } else {
        console.warn(`[NBE API] Missing currency: ${code}`)
      }
    }

    if (rates.length === 0) {
      console.error('[NBE API] No valid rates extracted from response')
      throw new Error('No valid rates extracted')
    }

    console.log(`[NBE API] Successfully extracted ${rates.length} rates`)
    const res = NextResponse.json({ 
      rates,
      source: 'nbe',
      date: today
    })
    res.headers.set('Cache-Control', 'public, s-maxage=3600, max-age=1800')
    return res
  } catch (error) {
    console.error('[NBE API Error]:', error instanceof Error ? error.message : error)
    
    // Fallback to JSON file
    try {
      console.log('[NBE] Attempting fallback to nbe-rates.json...')
      const jsonPath = path.join(process.cwd(), 'public', 'nbe-rates.json')
      const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
      
      // Convert fallback format to API format if needed
      const rates = Object.entries(jsonData).map(([code, data]: [string, any]) => ({
        code,
        buying: data.buying,
        selling: data.selling,
        rate: (data.buying + data.selling) / 2
      }))
      
      console.log(`[NBE Fallback] Using cached rates for ${rates.length} currencies`)
      const res = NextResponse.json({ 
        rates,
        source: 'nbe-fallback',
        date: new Date().toISOString().split('T')[0],
        cached: true
      })
      res.headers.set('Cache-Control', 'public, s-maxage=1800, max-age=900')
      return res
    } catch (fallbackError) {
      console.error('[NBE Fallback Error]:', fallbackError instanceof Error ? fallbackError.message : fallbackError)
      
      // Return empty array with error message instead of 500
      return NextResponse.json(
        { 
          error: 'Failed to fetch NBE rates - NBE API and fallback both unavailable',
          rates: [],
          source: 'error'
        },
        { status: 503 }
      )
    }
  }
}
