import { NextRequest, NextResponse } from 'next/server'
import { verifyAuthUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Checking current user authentication...')
    
    // Use the same authentication method as other admin APIs
    const user = await verifyAuthUser(request)
    
    if (!user) {
      console.log('❌ No authenticated user found')
      return NextResponse.json({
        error: 'Unauthorized',
        message: 'Authentication required'
      }, { status: 401 })
    }

    console.log('✅ Authenticated user found:', user.email, '- Role:', user.role)
    
    return NextResponse.json({ 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        verified: user.verified,
        created_at: user.created_at
      }
    })

  } catch (error: any) {
    console.error('Auth me API error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      message: 'Failed to verify authentication'
    }, { status: 500 })
  }
} 