import { z } from 'zod'

/**
 * Input validation schemas for API endpoints
 */

// Rate validation
export const RateSchema = z.object({
  code: z.string().regex(/^[A-Z]{3}$/, 'Must be 3-letter currency code'),
  rate: z.number().positive('Rate must be positive'),
  buying: z.number().positive('Buying rate must be positive').optional(),
  selling: z.number().positive('Selling rate must be positive').optional(),
})

export const RatesArraySchema = z.array(RateSchema).max(20, 'Too many rates')

// Blog post validation
export const BlogCategorySchema = z.enum(['Exchange Rates', 'Finance Tips', 'Economic News'])

export const BlogPostInputSchema = z.object({
  category: BlogCategorySchema.optional(),
})

// Override rates validation
export const OverrideRatesSchema = z.object({
  kind: z.enum(['official', 'parallel']),
  rates: RatesArraySchema,
  key: z.string().min(20, 'Admin key too short').optional(),
})

// Query parameter validation
export const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
})

// Date range validation
export const DateRangeSchema = z.object({
  start: z.string().datetime().optional(),
  end: z.string().datetime().optional(),
})

/**
 * Sanitize user input to prevent XSS and injection attacks
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}

/**
 * Validate and sanitize API request body
 */
export function validateRequestBody<T>(
  schema: z.ZodSchema<T>,
  body: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const validated = schema.parse(body)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
      }
    }
    return { success: false, error: 'Invalid input' }
  }
}

/**
 * Validate bearer token
 */
export function validateBearerToken(
  authHeader: string | null,
  expectedToken: string | undefined
): boolean {
  if (!expectedToken || !authHeader) return false
  
  const token = authHeader.replace(/^Bearer\s+/i, '')
  
  // Constant-time comparison to prevent timing attacks
  if (token.length !== expectedToken.length) return false
  
  let result = 0
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ expectedToken.charCodeAt(i)
  }
  
  return result === 0
}

/**
 * Validate IP address format
 */
export function isValidIP(ip: string): boolean {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip)
}

/**
 * Check if request is from localhost
 */
export function isLocalhost(ip: string): boolean {
  return ip === '127.0.0.1' || ip === '::1' || ip === 'localhost'
}
