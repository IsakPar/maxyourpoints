import { NextRequest } from 'next/server'

interface RateLimitOptions {
  interval: number // Time window in milliseconds
  uniqueTokenPerInterval: number // Max requests per interval
}

interface RateLimitInfo {
  count: number
  resetTime: number
}

// Simple in-memory store (in production, use Redis)
const requests = new Map<string, RateLimitInfo>()

export function rateLimit(options: RateLimitOptions) {
  return {
    check: (request: NextRequest, limit: number = options.uniqueTokenPerInterval): Promise<{ success: boolean; reset?: number; remaining?: number }> => {
      return new Promise((resolve) => {
        // Get identifier (IP + User-Agent for better uniqueness)
        const identifier = getIdentifier(request)
        const now = Date.now()
        const windowStart = now - options.interval

        // Clean old entries
        cleanupOldEntries(windowStart)

        // Get current request info
        const requestInfo = requests.get(identifier)

        if (!requestInfo || requestInfo.resetTime <= now) {
          // First request in window or window expired
          requests.set(identifier, {
            count: 1,
            resetTime: now + options.interval
          })
          
          resolve({
            success: true,
            remaining: limit - 1,
            reset: now + options.interval
          })
        } else if (requestInfo.count < limit) {
          // Within limit
          requestInfo.count++
          requests.set(identifier, requestInfo)
          
          resolve({
            success: true,
            remaining: limit - requestInfo.count,
            reset: requestInfo.resetTime
          })
        } else {
          // Rate limit exceeded
          resolve({
            success: false,
            reset: requestInfo.resetTime
          })
        }
      })
    }
  }
}

function getIdentifier(request: NextRequest): string {
  // Use IP + User-Agent for better uniqueness
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
    request.headers.get('x-real-ip') || 
    request.headers.get('cf-connecting-ip') || // Cloudflare
    'unknown'
  
  const userAgent = request.headers.get('user-agent') || 'unknown'
  return `${ip}:${userAgent.slice(0, 50)}` // Limit UA length
}

function cleanupOldEntries(cutoff: number) {
  for (const [key, info] of requests.entries()) {
    if (info.resetTime <= cutoff) {
      requests.delete(key)
    }
  }
}

// Pre-configured rate limiters
export const contactFormLimiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 3 // 3 submissions per 15 minutes
})

export const newsletterLimiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour  
  uniqueTokenPerInterval: 5 // 5 signups per hour
})

export const apiLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 60 // 60 requests per minute
}) 