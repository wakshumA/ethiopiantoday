import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0]
    const url = `https://api.nbe.gov.et/api/filter-exchange-rates?date=${today}`
    
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; EthiopianTodayBot/1.0)'
      }
    })

    if (!response.ok) {
      throw new Error(`NBE API returned status ${response.status}`)
    }

    const data = await response.json()
    
    // Extract major currencies in the same order as CBE
    const rates = []
    const majorCurrencies = ['USD', 'EUR', 'GBP', 'AED', 'SAR', 'KWD']
    
    // Create a map for quick lookup
    const ratesMap = new Map()
    for (const item of data.data || []) {
      const code = item.currency?.code
      if (majorCurrencies.includes(code)) {
        ratesMap.set(code, {
          code,
          buying: parseFloat(item.buying),
          selling: parseFloat(item.selling),
          rate: parseFloat(item.weighted_average)
        })
      }
    }
    
    // Add rates in the specified order
    for (const code of majorCurrencies) {
      if (ratesMap.has(code)) {
        rates.push(ratesMap.get(code))
      }
    }

    const res = NextResponse.json({ 
      rates,
      source: 'nbe',
      date: today
    })
    res.headers.set('Cache-Control', 'public, s-maxage=3600, max-age=1800')
    return res
  } catch (error) {
    console.error('[NBE API Error]:', error)
    
    // Fallback to JSON file
    try {
      const jsonPath = path.join(process.cwd(), 'public', 'nbe-rates.json')
      const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
      
      const res = NextResponse.json({ 
        rates: jsonData,
        source: 'nbe-fallback',
        date: new Date().toISOString().split('T')[0]
      })
      res.headers.set('Cache-Control', 'public, s-maxage=1800, max-age=900')
      return res
    } catch (fallbackError) {
      console.error('[NBE Fallback Error]:', fallbackError)
      return NextResponse.json(
        { error: 'Failed to fetch NBE rates', rates: [] },
        { status: 500 }
      )
    }
  }
}
