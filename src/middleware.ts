import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rate limiting storage (in-memory, use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Security configuration
const RATE_LIMIT_WINDOW = 60000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100 // max requests per window
const SENSITIVE_API_LIMIT = 10 // stricter limit for sensitive endpoints

// Sensitive endpoints that need extra protection
const SENSITIVE_ENDPOINTS = [
  '/api/blog/generate',
  '/api/blog/auto-generate',
  '/api/twitter/post',
  '/api/rates/override',
  '/api/cron',
]

// Public endpoints that should be accessible
const PUBLIC_ENDPOINTS = [
  '/api/rates/cbe',
  '/api/rates/nbe',
  '/api/rates/official',
  '/api/rates/parallel',
  '/api/rates/historical',
  '/api/news/top',
  '/api/blog/posts',
]

function getClientIdentifier(request: NextRequest): string {
  // Use multiple identifiers for better accuracy
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || realIp || 'unknown'
  return ip
}

function checkRateLimit(identifier: string, maxRequests: number): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}

function cleanupRateLimitMap() {
  const now = Date.now()
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}

// Cleanup every 5 minutes
setInterval(cleanupRateLimitMap, 300000)

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') && !pathname.startsWith('/api')
  ) {
    return NextResponse.next()
  }

  // Create response with security headers
  const response = NextResponse.next()

  // Security Headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Strict Transport Security (HSTS) - only enable in production with HTTPS
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }

  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js needs unsafe-eval in dev
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.nbe.gov.et https://ethioblackmarket.com https://www.ethioxchange.com",
      "frame-ancestors 'none'",
    ].join('; ')
  )

  // API route protection
  if (pathname.startsWith('/api')) {
    const clientId = getClientIdentifier(request)

    // Check if it's a sensitive endpoint
    const isSensitive = SENSITIVE_ENDPOINTS.some(endpoint => 
      pathname.startsWith(endpoint)
    )

    // Apply rate limiting
    const maxRequests = isSensitive ? SENSITIVE_API_LIMIT : RATE_LIMIT_MAX_REQUESTS
    
    if (!checkRateLimit(clientId, maxRequests)) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Too many requests. Please try again later.',
          retryAfter: 60 
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
          },
        }
      )
    }

    // Block requests with suspicious patterns
    const userAgent = request.headers.get('user-agent') || ''
    const suspiciousPatterns = [
      /sqlmap/i,
      /nikto/i,
      /nmap/i,
      /masscan/i,
      /zgrab/i,
      /(\.\.\/|\.\.\\)/,  // Path traversal
      /(union.*select|select.*from)/i,  // SQL injection
      /<script/i,  // XSS attempts
    ]

    if (suspiciousPatterns.some(pattern => pattern.test(userAgent) || pattern.test(pathname))) {
      console.warn(`Blocked suspicious request from ${clientId}: ${pathname}`)
      return new NextResponse(
        JSON.stringify({ error: 'Forbidden' }),
        { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate sensitive endpoint authentication
    if (isSensitive && !PUBLIC_ENDPOINTS.some(ep => pathname.startsWith(ep))) {
      const authHeader = request.headers.get('authorization')
      
      // Check if authorization header exists for sensitive endpoints
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new NextResponse(
          JSON.stringify({ error: 'Unauthorized. Bearer token required.' }),
          {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      }
    }

    // Add CORS headers for API routes
    response.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
