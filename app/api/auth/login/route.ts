import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Temporary admin for fallback (same as your backend)
const TEMP_ADMIN = {
  id: 'temp-admin-001',
  email: 'isak@maxyourpoints.com',
  password: '$2a$12$qXuA3.QFdVIow5scaKSFCe7pUfwPGhhD6vZLJCbzHo7pAqvjK3uJS', // admin123
  name: 'Isak Parild',
  role: 'SUPER_ADMIN'
}

function generateToken(userId: string, email: string, role: string): string {
  const secret = process.env.JWT_SECRET || 'your-jwt-secret'
  return jwt.sign(
    { userId, email, role },
    secret,
    { expiresIn: '7d' }
  )
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log('🔍 Login attempt for:', email)

    if (!email || !password) {
      return NextResponse.json({
        error: 'Email and password are required'
      }, { status: 400 })
    }

    // Try database first
    try {
      console.log('🔍 Checking Supabase for user...')
      
      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('id, email, name, full_name, password_hash, role, verified')
        .eq('email', email)
        .single()

      if (user && user.password_hash) {
        console.log('👤 Database user found, checking password...')
        
        const isValidPassword = await bcrypt.compare(password, user.password_hash)
        
        if (isValidPassword) {
          console.log('✅ Database login successful')
          
          const token = generateToken(user.id, user.email, user.role)
          
          return NextResponse.json({
            message: 'Login successful',
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role
            },
            token
          })
        } else {
          console.log('❌ Invalid password for database user')
        }
      }
    } catch (dbError) {
      console.log('💥 Database login failed, trying temp admin:', dbError)
    }

    // Fallback to temp admin
    console.log('🔄 Checking temp admin credentials...')
    
    if (email === TEMP_ADMIN.email) {
      const isValidPassword = await bcrypt.compare(password, TEMP_ADMIN.password)
      
      if (isValidPassword) {
        console.log('✅ Temp admin login successful')
        
        const token = generateToken(TEMP_ADMIN.id, TEMP_ADMIN.email, TEMP_ADMIN.role)
        
        return NextResponse.json({
          message: 'Login successful (development mode)',
          user: {
            id: TEMP_ADMIN.id,
            email: TEMP_ADMIN.email,
            name: TEMP_ADMIN.name,
            role: TEMP_ADMIN.role
          },
          token,
          devMode: true
        })
      }
    }

    console.log('❌ Invalid credentials')
    
    return NextResponse.json({
      error: 'Invalid credentials',
      message: 'Email or password is incorrect'
    }, { status: 401 })

  } catch (error: any) {
    console.error('Login API error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      message: 'Failed to login'
    }, { status: 500 })
  }
} 