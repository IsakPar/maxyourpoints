import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const SESSION_TIMEOUT_MS = 15 * 60 * 1000 // 15 minutes

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Skip authentication completely for login page and public routes
  const publicPaths = [
    '/login',
    '/api/auth',
    '/api/articles',
    '/api/categories',
    '/api/subscribe',
    '/api/unsubscribe',
    '/api/health',
    '/api/test',
    '/_next',
    '/favicon',
    '/robots.txt',
    '/sitemap.xml',
    '/'  // Allow homepage without auth
  ]
  
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname === path || 
    request.nextUrl.pathname.startsWith(path + '/')
  )
  
  if (isPublicPath) {
    console.log('🌍 Public route accessed:', request.nextUrl.pathname)
    return response
  }

  // Only protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    try {
      // Create a Supabase client configured to use cookies
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return request.cookies.get(name)?.value
            },
            set(name: string, value: string, options: CookieOptions) {
              request.cookies.set({
                name,
                value,
                ...options,
              })
              response = NextResponse.next({
                request: {
                  headers: request.headers,
                },
              })
              response.cookies.set({
                name,
                value,
                ...options,
              })
            },
            remove(name: string, options: CookieOptions) {
              request.cookies.set({
                name,
                value: '',
                ...options,
              })
              response = NextResponse.next({
                request: {
                  headers: request.headers,
                },
              })
              response.cookies.set({
                name,
                value: '',
                ...options,
              })
            },
          },
        }
      )

      // PHASE 1: Enhanced authentication with session timeout
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        console.log('❌ No authenticated user found, redirecting to login')
        return NextResponse.redirect(new URL('/login?error=authentication_required', request.url))
      }

      // Check session timeout (15-minute inactivity)
      const lastActivity = user.user_metadata?.last_activity
      if (lastActivity) {
        const timeSinceActivity = Date.now() - new Date(lastActivity).getTime()
        const minutesSinceActivity = Math.floor(timeSinceActivity / (1000 * 60))
        
        if (timeSinceActivity > SESSION_TIMEOUT_MS) {
          console.log(`⏰ Session expired for ${user.email} (${minutesSinceActivity} minutes of inactivity)`)
          // Session expired - sign out and redirect
          await supabase.auth.signOut()
          return NextResponse.redirect(new URL('/login?error=session_expired', request.url))
        }
      }

      // Update last activity timestamp (silently fail if it doesn't work)
      try {
        await supabase.auth.updateUser({
          data: {
            ...user.user_metadata,
            last_activity: new Date().toISOString()
          }
        })
      } catch (updateError) {
        // Don't log this as it's not critical and can be noisy
      }

      console.log('🔐 Authenticated admin route access:', request.nextUrl.pathname, 'User:', user.email)
    } catch (e) {
      console.error('❌ Middleware authentication error:', e)
      // SECURITY: Redirect to login on any authentication error
      return NextResponse.redirect(new URL('/login?error=auth_failure', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 