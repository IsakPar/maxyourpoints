import { NextRequest, NextResponse } from 'next/server'
import { verifyAuthUser } from '@/lib/auth'
import { cache, getCacheStats } from '@/lib/cache'

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const user = await verifyAuthUser(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 })
    }

    console.log('📊 Admin requesting cache statistics')

    const stats = getCacheStats()

    return NextResponse.json({
      success: true,
      cache: {
        size: stats.size,
        totalKeys: stats.totalKeys,
        sampleKeys: stats.keys,
        status: stats.size > 0 ? 'active' : 'empty'
      }
    })

  } catch (error: any) {
    console.error('Cache stats API error:', error)
    return NextResponse.json({
      error: 'Failed to get cache statistics',
      message: error.message
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify admin access
    const user = await verifyAuthUser(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const pattern = searchParams.get('pattern')

    console.log('🧹 Admin clearing cache:', pattern || 'all')

    let clearedCount: number
    if (pattern) {
      const beforeSize = cache.size()
      cache.deletePattern(pattern)
      clearedCount = beforeSize - cache.size()
    } else {
      clearedCount = cache.size()
      cache.clear()
    }

    return NextResponse.json({
      success: true,
      message: `Cleared ${clearedCount} cache entries`,
      clearedCount,
      pattern: pattern || 'all'
    })

  } catch (error: any) {
    console.error('Cache clear API error:', error)
    return NextResponse.json({
      error: 'Failed to clear cache',
      message: error.message
    }, { status: 500 })
  }
} 