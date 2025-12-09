import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface CurrencyRate {
  buying: number
  selling: number
}

interface RateUpdate {
  USD?: CurrencyRate
  EUR?: CurrencyRate
  GBP?: CurrencyRate
  AED?: CurrencyRate
  SAR?: CurrencyRate
  KWD?: CurrencyRate
  CAD?: CurrencyRate
}

interface ParallelRate {
  rate: number
}

interface ParallelRateUpdate {
  USD?: ParallelRate
  EUR?: ParallelRate
  GBP?: ParallelRate
  AED?: ParallelRate
  SAR?: ParallelRate
  KWD?: ParallelRate
  CAD?: ParallelRate
}

interface UpdateRequest {
  official?: RateUpdate
  parallel?: ParallelRateUpdate
  nbe?: RateUpdate
}

export async function POST(request: NextRequest) {
  try {
    // 1. Check authorization
    const authHeader = request.headers.get('authorization')
    const apiKey = process.env.RATES_ADMIN_KEY

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error: RATES_ADMIN_KEY not set' },
        { status: 500 }
      )
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    if (token !== apiKey) {
      return NextResponse.json(
        { success: false, error: 'Invalid API key' },
        { status: 403 }
      )
    }

    // 2. Parse and validate request body
    const body: UpdateRequest = await request.json()

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Empty request body' },
        { status: 400 }
      )
    }

    if (!body.official && !body.parallel && !body.nbe) {
      return NextResponse.json(
        { success: false, error: 'Request must include at least one of: official, parallel, nbe' },
        { status: 400 }
      )
    }

    const validCurrencies = ['USD', 'EUR', 'GBP', 'AED', 'SAR', 'KWD', 'CAD']
    const updatedTypes: string[] = []
    const results: any = {}

    // 3. Validate and update official rates
    if (body.official) {
      for (const [currency, rates] of Object.entries(body.official)) {
        if (!validCurrencies.includes(currency)) {
          return NextResponse.json(
            { success: false, error: `Invalid currency in official: ${currency}` },
            { status: 400 }
          )
        }

        if (!rates || typeof rates !== 'object') {
          return NextResponse.json(
            { success: false, error: `Invalid rates for official ${currency}` },
            { status: 400 }
          )
        }

        if (typeof rates.buying !== 'number' || typeof rates.selling !== 'number') {
          return NextResponse.json(
            { success: false, error: `Official ${currency} must have buying and selling as numbers` },
            { status: 400 }
          )
        }

        if (rates.buying <= 0 || rates.selling <= 0) {
          return NextResponse.json(
            { success: false, error: `Official ${currency} rates must be positive numbers` },
            { status: 400 }
          )
        }
      }

      const officialPath = join(process.cwd(), 'public', 'official-rates.json')
      let existingOfficial: RateUpdate = {}

      try {
        const { readFile } = await import('fs/promises')
        const content = await readFile(officialPath, 'utf8')
        existingOfficial = JSON.parse(content)
      } catch (err) {
        console.log('[Update Rates] No existing official-rates.json, creating new one')
      }

      const updatedOfficial = { ...existingOfficial, ...body.official }
      await writeFile(officialPath, JSON.stringify(updatedOfficial, null, 2), 'utf8')
      
      updatedTypes.push('official')
      results.official = updatedOfficial
      console.log('[Update Rates] Updated official rates:', Object.keys(body.official))
    }

    // 4. Validate and update parallel rates
    if (body.parallel) {
      for (const [currency, rateObj] of Object.entries(body.parallel)) {
        if (!validCurrencies.includes(currency)) {
          return NextResponse.json(
            { success: false, error: `Invalid currency in parallel: ${currency}` },
            { status: 400 }
          )
        }

        if (!rateObj || typeof rateObj !== 'object' || typeof rateObj.rate !== 'number') {
          return NextResponse.json(
            { success: false, error: `Parallel ${currency} must have rate as a number` },
            { status: 400 }
          )
        }

        if (rateObj.rate <= 0) {
          return NextResponse.json(
            { success: false, error: `Parallel ${currency} rate must be a positive number` },
            { status: 400 }
          )
        }
      }

      const parallelPath = join(process.cwd(), 'public', 'parallel-rates.json')
      let existingParallel: ParallelRateUpdate = {}

      try {
        const { readFile } = await import('fs/promises')
        const content = await readFile(parallelPath, 'utf8')
        existingParallel = JSON.parse(content)
      } catch (err) {
        console.log('[Update Rates] No existing parallel-rates.json, creating new one')
      }

      const updatedParallel = { ...existingParallel, ...body.parallel }
      await writeFile(parallelPath, JSON.stringify(updatedParallel, null, 2), 'utf8')
      
      updatedTypes.push('parallel')
      results.parallel = updatedParallel
      console.log('[Update Rates] Updated parallel rates:', Object.keys(body.parallel))
    }

    // 5. Validate and update NBE rates
    if (body.nbe) {
      for (const [currency, rates] of Object.entries(body.nbe)) {
        if (!validCurrencies.includes(currency)) {
          return NextResponse.json(
            { success: false, error: `Invalid currency in nbe: ${currency}` },
            { status: 400 }
          )
        }

        if (!rates || typeof rates !== 'object') {
          return NextResponse.json(
            { success: false, error: `Invalid rates for NBE ${currency}` },
            { status: 400 }
          )
        }

        if (typeof rates.buying !== 'number' || typeof rates.selling !== 'number') {
          return NextResponse.json(
            { success: false, error: `NBE ${currency} must have buying and selling as numbers` },
            { status: 400 }
          )
        }

        if (rates.buying <= 0 || rates.selling <= 0) {
          return NextResponse.json(
            { success: false, error: `NBE ${currency} rates must be positive numbers` },
            { status: 400 }
          )
        }
      }

      const nbePath = join(process.cwd(), 'public', 'nbe-rates.json')
      let existingNbe: RateUpdate = {}

      try {
        const { readFile } = await import('fs/promises')
        const content = await readFile(nbePath, 'utf8')
        existingNbe = JSON.parse(content)
      } catch (err) {
        console.log('[Update Rates] No existing nbe-rates.json, creating new one')
      }

      const updatedNbe = { ...existingNbe, ...body.nbe }
      await writeFile(nbePath, JSON.stringify(updatedNbe, null, 2), 'utf8')
      
      updatedTypes.push('nbe')
      results.nbe = updatedNbe
      console.log('[Update Rates] Updated NBE rates:', Object.keys(body.nbe))
    }

    // 6. Return success response
    return NextResponse.json({
      success: true,
      message: 'Exchange rates updated successfully',
      updated: updatedTypes,
      timestamp: new Date().toISOString(),
      rates: results
    })

  } catch (error: any) {
    console.error('[Update Rates API Error]:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update exchange rates',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

// GET method to view current rates (for testing)
export async function GET(request: NextRequest) {
  try {
    const { readFile } = await import('fs/promises')
    const results: any = {}

    // Read official rates
    try {
      const officialPath = join(process.cwd(), 'public', 'official-rates.json')
      const officialContent = await readFile(officialPath, 'utf8')
      results.official = JSON.parse(officialContent)
    } catch (err) {
      results.official = null
    }

    // Read parallel rates
    try {
      const parallelPath = join(process.cwd(), 'public', 'parallel-rates.json')
      const parallelContent = await readFile(parallelPath, 'utf8')
      results.parallel = JSON.parse(parallelContent)
    } catch (err) {
      results.parallel = null
    }

    // Read NBE rates
    try {
      const nbePath = join(process.cwd(), 'public', 'nbe-rates.json')
      const nbeContent = await readFile(nbePath, 'utf8')
      results.nbe = JSON.parse(nbeContent)
    } catch (err) {
      results.nbe = null
    }

    return NextResponse.json({
      success: true,
      rates: results,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
