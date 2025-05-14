import { NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Create a new ratelimiter that allows 3 requests per 24 hours
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, '24 h'),
  analytics: true,
  prefix: '@upstash/ratelimit',
})

// Buttondown API configuration
const BUTTONDOWN_API_KEY = process.env.BUTTONDOWN_API_KEY
const BUTTONDOWN_API_URL = 'https://api.buttondown.email/v1/subscribers'

export async function POST(request: Request) {
  try {
    // Get the IP address from the request headers
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'
    
    // Check rate limit
    const { success, limit, reset, remaining } = await ratelimit.limit(ip)
    
    if (!success) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Rate limit exceeded',
          message: `Please try again in ${Math.ceil((reset - Date.now()) / 1000 / 60)} minutes`,
          remaining,
          limit
        },
        { status: 429 }
      )
    }

    const { email } = await request.json()

    // Validate email
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid email'
        },
        { status: 400 }
      )
    }

    // Subscribe to Buttondown
    const response = await fetch(BUTTONDOWN_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${BUTTONDOWN_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        tags: ['website-subscriber'],
        referrer_url: request.headers.get('referer') || 'https://maxyourpoints.com',
        metadata: {
          source: 'website-footer',
          ip_address: ip,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Buttondown API error:', error)
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to subscribe to newsletter'
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'Successfully subscribed to newsletter',
      remaining,
      limit
    })
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
} 