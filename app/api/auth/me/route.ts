import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import jwt from 'jsonwebtoken'

const TEMP_ADMIN = {
  id: 'temp-admin-001',
  email: 'isak@maxyourpoints.com',
  name: 'Isak Parild',
  role: 'SUPER_ADMIN'
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({
        error: 'Unauthorized',
        message: 'No token provided'
      }, { status: 401 })
    }

    try {
      const secret = process.env.JWT_SECRET || 'your-jwt-secret'
      const decoded = jwt.verify(token, secret) as any

      console.log('🔍 Token decoded for user:', decoded.email)

      // Try to get user from database first
      try {
        const { data: user, error } = await supabaseAdmin
          .from('users')
          .select('id, email, name, full_name, role, verified, created_at')
          .eq('id', decoded.userId)
          .single()

        if (user) {
          console.log('✅ Database user found')
          return NextResponse.json({ 
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              verified: user.verified,
              createdAt: user.created_at
            }
          })
        }
      } catch (dbError) {
        console.log('Database user lookup failed, checking temp admin')
      }

      // Fallback to temp admin
      if (decoded.userId === TEMP_ADMIN.id) {
        console.log('✅ Temp admin verified')
        return NextResponse.json({
          user: {
            id: TEMP_ADMIN.id,
            email: TEMP_ADMIN.email,
            name: TEMP_ADMIN.name,
            role: TEMP_ADMIN.role,
            createdAt: new Date().toISOString(),
            devMode: true
          }
        })
      }

      return NextResponse.json({
        error: 'Unauthorized',
        message: 'Invalid token'
      }, { status: 401 })

    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError)
      return NextResponse.json({
        error: 'Unauthorized',
        message: 'Invalid or expired token'
      }, { status: 401 })
    }

  } catch (error: any) {
    console.error('Auth me API error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      message: 'Failed to verify authentication'
    }, { status: 500 })
  }
} 