'use client'

import { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle, Trash2 } from 'lucide-react'

// Function to forcefully clear all authentication state
const clearAllAuthState = async () => {
  try {
    // Clear server-side session first
    try {
      await fetch('/api/auth/clear-session', { 
        method: 'POST',
        cache: 'no-cache'
      })
    } catch (err) {
      console.warn('Server session clear failed:', err)
    }
    
    // Clear Supabase session
    await supabase.auth.signOut({ scope: 'global' })
    
    // Clear all localStorage items
    if (typeof window !== 'undefined') {
      // Clear specific auth items
      localStorage.removeItem('auth_token')
      localStorage.removeItem('supabase.auth.token')
      localStorage.removeItem('sb-' + process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1] + '-auth-token')
      
      // Clear all Supabase-related items
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-') || key.includes('supabase') || key.includes('auth')) {
          localStorage.removeItem(key)
        }
      })
      
      // Clear sessionStorage
      sessionStorage.clear()
      
      // Clear all cookies manually
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      })
    }
    
    console.log('✅ All authentication state cleared (client + server)')
  } catch (error) {
    console.error('❌ Error clearing auth state:', error)
  }
}

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const errorParam = searchParams?.get('error')

  // Clear auth state when component mounts if there's a session_expired error
  useEffect(() => {
    if (errorParam === 'session_expired') {
      clearAllAuthState()
    }
  }, [errorParam])

  const handleClearSession = async () => {
    setIsClearing(true)
    setError('')
    
    try {
      await clearAllAuthState()
      // Force page reload to clear any cached state
      window.location.reload()
    } catch (err) {
      setError('Failed to clear session')
    } finally {
      setIsClearing(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Clear any existing auth state before new login
      await clearAllAuthState()
      
      console.log('🔑 Attempting Supabase login...')
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('❌ Login error:', error)
        setError(error.message)
        return
      }

      if (data.user) {
        console.log('✅ Login successful:', data.user.email)
        
        // Update last activity to prevent immediate timeout
        await supabase.auth.updateUser({
          data: {
            last_activity: new Date().toISOString()
          }
        })
        
        // Redirect will happen automatically via auth state change and middleware
        router.push('/admin')
        router.refresh()
      }
    } catch (err: any) {
      console.error('💥 Login error:', err)
      setError(err.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access the CMS
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(error || errorParam) && (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error || 
                   (errorParam === 'session_expired' ? 'Your session has expired due to inactivity. Please log in again.' :
                    errorParam === 'authentication_required' ? 'You need to be logged in to access this page.' :
                    errorParam === 'unauthorized' ? 'You need to be logged in to access this page.' :
                    'Please log in to continue.')}
                </AlertDescription>
              </Alert>
            )}

            {/* Session clearing button for troubleshooting */}
            {(errorParam === 'session_expired' || error) && (
              <div className="mb-4">
                <Button 
                  variant="outline" 
                  onClick={handleClearSession}
                  disabled={isClearing}
                  className="w-full"
                >
                  {isClearing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Clearing Session...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear Session & Reload
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-500 mt-1 text-center">
                  If you're still having login issues, click this button
                </p>
              </div>
            )}

            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-4 text-xs text-gray-500 text-center">
              <p>For demo purposes:</p>
              <p>Email: isak@maxyourpoints.com</p>
              <p>Password: admin123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
} 