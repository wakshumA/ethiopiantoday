import { NextRequest, NextResponse } from 'next/server'
import { validateBearerToken } from '@/lib/security'
import { securityLogger } from '@/lib/security-logger'

/**
 * Security Dashboard API
 * Provides insights into security events and blocked requests
 * 
 * Requires RATES_ADMIN_KEY for access
 */
export async function GET(request: NextRequest) {
  // Validate admin authentication
  const authHeader = request.headers.get('authorization')
  const adminKey = process.env.RATES_ADMIN_KEY
  
  if (!validateBearerToken(authHeader, adminKey)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(request.url)
  const type = url.searchParams.get('type')
  const ip = url.searchParams.get('ip')
  const limit = parseInt(url.searchParams.get('limit') || '100')

  let events
  
  if (ip) {
    events = securityLogger.getEventsByIP(ip)
  } else if (type) {
    events = securityLogger.getEventsByType(type as any)
  } else {
    events = securityLogger.getRecentEvents(limit)
  }

  // Aggregate statistics
  const stats = {
    total: events.length,
    byType: events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    topIPs: Object.entries(
      events.reduce((acc, event) => {
        acc[event.ip] = (acc[event.ip] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([ip, count]) => ({ ip, count })),
    recentPaths: events
      .slice(-20)
      .map(e => ({ path: e.path, timestamp: e.timestamp, type: e.type }))
  }

  return NextResponse.json({
    stats,
    events: events.slice(-limit),
  })
}

export async function DELETE(request: NextRequest) {
  // Validate admin authentication
  const authHeader = request.headers.get('authorization')
  const adminKey = process.env.RATES_ADMIN_KEY
  
  if (!validateBearerToken(authHeader, adminKey)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  securityLogger.clear()
  
  return NextResponse.json({ message: 'Security logs cleared' })
}
