import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { verifyAuthUser } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
  try {
    // Check authentication - use same pattern as articles API
    const authUser = await verifyAuthUser(request)
    
    if (!authUser) {
      return NextResponse.json({
        error: 'Unauthorized',
        message: 'Authentication required to access users'
      }, { status: 401 })
    }

    // Check if user has admin privileges
    if (!['admin', 'super_admin'].includes(authUser.role)) {
      return NextResponse.json({
        error: 'Forbidden',
        message: 'Admin access required'
      }, { status: 403 })
    }

    try {
      // Get users from Supabase
      const { data: users, error } = await supabaseAdmin
        .from('users')
        .select('id, email, name, full_name, role, verified, created_at, updated_at, last_login')
        .order('created_at', { ascending: false })

      if (error) throw error

      console.log(`✅ Found ${users.length} users`)
      
      return NextResponse.json({
        success: true,
        users
      })

    } catch (dbError: any) {
      console.error('Database error fetching users:', dbError)
      return NextResponse.json({
        error: 'Database error',
        message: dbError.message
      }, { status: 500 })
    }

  } catch (error: any) {
    console.error('Users GET error:', error)
    return NextResponse.json({
      error: 'Failed to fetch users',
      message: error.message
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authUser = await verifyAuthUser(request)
    
    if (!authUser) {
      return NextResponse.json({
        error: 'Unauthorized',
        message: 'Authentication required to create users'
      }, { status: 401 })
    }

    // Check if user has admin privileges
    if (!['admin', 'super_admin'].includes(authUser.role)) {
      return NextResponse.json({
        error: 'Forbidden',
        message: 'Admin access required'
      }, { status: 403 })
    }

    const { email, password, name, fullName, role } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({
        error: 'Missing required fields',
        message: 'Email, password, and name are required'
      }, { status: 400 })
    }

    try {
      // Check if user already exists
      const { data: existingUser } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', email)
        .single()

      if (existingUser) {
        return NextResponse.json({
          error: 'User already exists',
          message: 'An account with this email already exists'
        }, { status: 400 })
      }

      // Hash password
      const saltRounds = 12
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      // Create user in Supabase
      const { data: newUser, error } = await supabaseAdmin
        .from('users')
        .insert({
          email,
          password_hash: hashedPassword,
          name,
          full_name: fullName || name,
          role: role || 'USER',
          verified: true
        })
        .select()
        .single()

      if (error) throw error

      console.log(`✅ User created successfully: ${email}`)

      return NextResponse.json({
        success: true,
        message: 'User created successfully',
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role
        }
      })

    } catch (dbError) {
      console.error('Database error creating user:', dbError)
      return NextResponse.json({
        error: 'Database unavailable',
        message: 'User creation disabled - database connection issue'
      }, { status: 503 })
    }

  } catch (error: any) {
    console.error('User creation error:', error)
    return NextResponse.json({
      error: 'Failed to create user',
      message: error.message
    }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Check authentication
    const authUser = await verifyAuthUser(request)
    
    if (!authUser) {
      return NextResponse.json({
        error: 'Unauthorized',
        message: 'Authentication required to update users'
      }, { status: 401 })
    }

    // Check if user has admin privileges
    if (!['admin', 'super_admin'].includes(authUser.role)) {
      return NextResponse.json({
        error: 'Forbidden',
        message: 'Admin access required'
      }, { status: 403 })
    }

    const { userId, ...updateData } = await request.json()

    if (!userId) {
      return NextResponse.json({
        error: 'Missing user ID',
        message: 'User ID is required for updates'
      }, { status: 400 })
    }

    try {
      // Update user in Supabase
      const { data: updatedUser, error } = await supabaseAdmin
        .from('users')
        .update({
          name: updateData.name,
          full_name: updateData.fullName,
          role: updateData.role,
          verified: updateData.verified,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error

      console.log(`✅ User updated successfully: ${userId}`)

      return NextResponse.json({
        success: true,
        message: 'User updated successfully',
        user: updatedUser
      })

    } catch (dbError) {
      console.error('Database error updating user:', dbError)
      return NextResponse.json({
        error: 'Database unavailable',
        message: 'User update disabled - database connection issue'
      }, { status: 503 })
    }

  } catch (error: any) {
    console.error('User update error:', error)
    return NextResponse.json({
      error: 'Failed to update user',
      message: error.message
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const authUser = await verifyAuthUser(request)
    
    if (!authUser) {
      return NextResponse.json({
        error: 'Unauthorized',
        message: 'Authentication required to delete users'
      }, { status: 401 })
    }

    // Check if user has admin privileges
    if (!['admin', 'super_admin'].includes(authUser.role)) {
      return NextResponse.json({
        error: 'Forbidden',
        message: 'Admin access required for user deletion'
      }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({
        error: 'Missing user ID',
        message: 'User ID is required for deletion'
      }, { status: 400 })
    }

    // Prevent self-deletion
    if (authUser.id === userId) {
      return NextResponse.json({
        error: 'Cannot delete yourself',
        message: 'You cannot delete your own account'
      }, { status: 400 })
    }

    try {
      // Delete user from Supabase
      const { error } = await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', userId)

      if (error) throw error

      console.log(`✅ User deleted successfully: ${userId}`)

      return NextResponse.json({
        success: true,
        message: 'User deleted successfully'
      })

    } catch (dbError) {
      console.error('Database error deleting user:', dbError)
      return NextResponse.json({
        error: 'Database unavailable',
        message: 'User deletion disabled - database connection issue'
      }, { status: 503 })
    }

  } catch (error: any) {
    console.error('User deletion error:', error)
    return NextResponse.json({
      error: 'Failed to delete user',
      message: error.message
    }, { status: 500 })
  }
} 