import { NextResponse } from 'next/server'
import { fetchParallelRates } from '@/lib/rates'

export async function GET() {
  const rates = await fetchParallelRates()
  const res = NextResponse.json({ rates })
  res.headers.set('Cache-Control', 'public, s-maxage=900, max-age=300')
  return res
}
