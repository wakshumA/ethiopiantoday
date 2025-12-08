import { NextResponse } from 'next/server'
import { overrideRates } from '@/lib/rates'
import { validateBearerToken, validateRequestBody, OverrideRatesSchema } from '@/lib/security'
import { securityLogger } from '@/lib/security-logger'

export async function POST(req: Request) {
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  
  // Validate authentication
  const authHeader = req.headers.get('authorization')
  const adminKey = process.env.RATES_ADMIN_KEY
  
  if (!validateBearerToken(authHeader, adminKey)) {
    securityLogger.log({
      type: 'auth_failure',
      ip: clientIp,
      path: '/api/rates/override',
      details: 'Invalid or missing admin key'
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Validate and sanitize input
  const rawBody = await req.json().catch(() => null)
  const validation = validateRequestBody(OverrideRatesSchema, rawBody)
  
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid payload', details: validation.error },
      { status: 400 }
    )
  }
  
  const { kind, rates } = validation.data
  overrideRates(kind, rates)
  
  console.log(`[ADMIN] Rates overridden: ${kind} with ${rates.length} rates from ${clientIp}`)
  
  return NextResponse.json({ ok: true, updated: rates.length })
}
