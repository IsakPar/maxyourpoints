import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    // Check database connectivity
    const supabase = await createClient()
    const { error: dbError } = await supabase.from('categories').select('count').limit(1)
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      checks: {
        database: dbError ? 'unhealthy' : 'healthy',
        api: 'healthy'
      }
    }

    // If database is down, return 503
    if (dbError) {
      return NextResponse.json({
        ...health,
        status: 'unhealthy',
        error: 'Database connection failed'
      }, { status: 503 })
    }

    return NextResponse.json(health)
  } catch {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      checks: {
        database: 'unknown',
        api: 'unhealthy'
      }
    }, { status: 503 })
  }
} 