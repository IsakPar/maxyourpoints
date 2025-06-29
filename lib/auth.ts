import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export interface AuthUser {
  id: string
  email: string
  name?: string
  role: string
  verified?: boolean
  created_at?: string
}

// Get the current authenticated user (server-side)
export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    // Get additional user data from our users table
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, email, name, full_name, role, verified, created_at')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      // If user doesn't exist in our users table, create a proper record
      console.log('User not found in users table, creating record for:', user.email)
      
      try {
        // Determine role based on email (for admin users)
        const isAdminEmail = user.email === 'isak.parild@gmail.com' || user.email === 'isak@maxyourpoints.com'
        const role = isAdminEmail ? 'admin' : 'subscriber'
        
        const { data: newUser, error: insertError } = await supabaseAdmin
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || user.email?.split('@')[0],
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
            role: role,
            verified: true,
            created_at: user.created_at,
            updated_at: new Date().toISOString()
          })
          .select()
          .single()

        if (insertError) {
          console.error('Error creating user record:', insertError)
          // Return basic profile if DB insert fails
          return {
            id: user.id,
            email: user.email!,
            name: user.user_metadata?.name || user.email?.split('@')[0],
            role: role,
            verified: true,
            created_at: user.created_at
          }
        }

        console.log('✅ Created user record successfully')
        return {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name || newUser.full_name,
          role: newUser.role,
          verified: newUser.verified,
          created_at: newUser.created_at
        }
        
      } catch (createError) {
        console.error('Error creating user:', createError)
        // Fallback to basic profile
        const isAdminEmail = user.email === 'isak.parild@gmail.com' || user.email === 'isak@maxyourpoints.com'
        return {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || user.email?.split('@')[0],
          role: isAdminEmail ? 'admin' : 'subscriber',
          verified: true,
          created_at: user.created_at
        }
      }
    }

    return {
      id: userData.id,
      email: userData.email,
      name: userData.name || userData.full_name,
      role: userData.role,
      verified: userData.verified,
      created_at: userData.created_at
    }
  } catch (error) {
    console.error('Error getting auth user:', error)
    return null
  }
}

// Check if user is admin
export async function requireAdmin(): Promise<AuthUser> {
  const user = await getAuthUser()
  
  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    redirect('/login?error=unauthorized')
  }

  return user
}

// Check if user can access admin panel (any CMS access)
export async function requireCMSAccess(): Promise<AuthUser> {
  const user = await getAuthUser()
  
  if (!user || !['admin', 'super_admin', 'editor', 'viewer', 'author'].includes(user.role)) {
    redirect('/login?error=unauthorized')
  }

  return user
}

// Check if user is authenticated
export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthUser()
  
  if (!user) {
    redirect('/login?error=unauthorized')
  }

  return user
}

// Verify token for API routes
export async function verifyAuthUser(request: Request): Promise<AuthUser | null> {
  try {
    // Get cookies from the request
    const cookieHeader = request.headers.get('cookie')
    if (!cookieHeader) {
      console.log('No cookies found in API request')
      return null
    }

    // Create supabase client with the request cookies
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      console.log('No authenticated user found in API request:', error?.message)
      return null
    }

    console.log('✅ Authenticated user found in API request:', user.email)

    // Get user role from our users table
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('role, verified, name, full_name')
      .eq('id', user.id)
      .single()

    if (userError) {
      console.log('User not found in users table, using basic profile')
      // Return basic user info if not in our users table
      const isAdminEmail = user.email === 'isak.parild@gmail.com' || user.email === 'isak@maxyourpoints.com'
      return {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.name || user.email?.split('@')[0],
        role: isAdminEmail ? 'admin' : 'subscriber',
        verified: true,
        created_at: user.created_at
      }
    }

    return {
      id: user.id,
      email: user.email!,
      name: userData?.name || userData?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
      role: userData?.role || 'subscriber',
      verified: userData?.verified || false,
      created_at: user.created_at
    }
  } catch (error) {
    console.error('Error verifying auth user:', error)
    return null
  }
} 