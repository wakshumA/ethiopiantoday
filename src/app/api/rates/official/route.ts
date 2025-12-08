import { NextResponse } from 'next/server'
import { fetchOfficialRates, resetRatesCache, fetchWU_USD_ETB } from '@/lib/rates'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('fresh') === '1') resetRatesCache()
  if (searchParams.get('source') === 'wu') {
    const n = await fetchWU_USD_ETB()
    const rates = n ? [{ code: 'USD', rate: n }] : []
    const res = NextResponse.json({ rates, source: 'wu' })
    res.headers.set('Cache-Control', 'no-store')
    return res
  }

  const rates = await fetchOfficialRates()
  const res = NextResponse.json({ rates, source: 'auto' })
  res.headers.set('Cache-Control', 'public, s-maxage=900, max-age=300')
  return res
}
