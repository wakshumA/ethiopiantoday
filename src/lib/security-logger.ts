/**
 * Security Utilities - Logger for suspicious activity
 */

interface SecurityEvent {
  timestamp: string
  type: 'rate_limit' | 'suspicious_pattern' | 'auth_failure' | 'blocked_ip'
  ip: string
  path: string
  userAgent?: string
  details?: string
}

class SecurityLogger {
  private events: SecurityEvent[] = []
  private maxEvents = 1000

  log(event: Omit<SecurityEvent, 'timestamp'>) {
    const logEvent: SecurityEvent = {
      ...event,
      timestamp: new Date().toISOString(),
    }

    this.events.push(logEvent)

    // Keep only last 1000 events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents)
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[SECURITY] ${logEvent.type}:`, logEvent)
    }

    // In production, you should send this to a logging service
    // Example: Sentry, DataDog, CloudWatch, etc.
  }

  getRecentEvents(limit = 100): SecurityEvent[] {
    return this.events.slice(-limit)
  }

  getEventsByIP(ip: string): SecurityEvent[] {
    return this.events.filter(event => event.ip === ip)
  }

  getEventsByType(type: SecurityEvent['type']): SecurityEvent[] {
    return this.events.filter(event => event.type === type)
  }

  clear() {
    this.events = []
  }
}

export const securityLogger = new SecurityLogger()

/**
 * Check if IP should be blocked based on recent activity
 */
export function shouldBlockIP(ip: string): boolean {
  const recentEvents = securityLogger.getEventsByIP(ip)
  const last5Minutes = Date.now() - 5 * 60 * 1000
  
  const recentFailures = recentEvents.filter(
    event => new Date(event.timestamp).getTime() > last5Minutes
  )

  // Block if more than 10 security events in last 5 minutes
  return recentFailures.length > 10
}

/**
 * Hash sensitive data for logging (one-way hash)
 */
export function hashForLogging(data: string): string {
  // Simple hash for logging purposes only
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return `***${Math.abs(hash).toString(16)}***`
}
