'use client'

import { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertTriangle, Eye, EyeOff, Shield } from 'lucide-react'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const errorParam = searchParams?.get('error')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      console.log('🔑 Attempting Supabase login...')
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('❌ Login error:', error)
        setError('Invalid credentials. Access denied.')
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
        
        router.push('/admin')
        router.refresh()
      }
    } catch (err: any) {
      console.error('💥 Login error:', err)
      setError('Authentication failed. Try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getErrorMessage = () => {
    if (error) return error
    
    switch (errorParam) {
      case 'session_expired':
        return 'Your session expired. Please authenticate again.'
      case 'authentication_required':
      case 'unauthorized':
        return 'Authentication required to proceed.'
      default:
        return null
    }
  }

  const errorMessage = getErrorMessage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      {/* Fun Security Banner - Cookie Banner Style */}
      <div className="w-full max-w-md">
        {/* Main Security Warning Banner */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 rounded-t-2xl shadow-2xl border-4 border-red-600">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-8 h-8 text-yellow-300" />
            <div>
              <h1 className="text-xl font-bold">🚨 Hold Up There!</h1>
              <p className="text-sm opacity-90">Not that fast - are you allowed to be here?</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed">
            This is a <strong>restricted area</strong> for authorized personnel only. 
            If you're not supposed to be here, this is your friendly reminder to 
            <strong> turn around and walk away slowly</strong> 🚪
          </p>
        </div>

        {/* Login Form - Connected to Banner */}
        <div className="bg-white p-6 rounded-b-2xl shadow-2xl border-4 border-t-0 border-red-600">
          {errorMessage && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 font-medium">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@domain.com"
                required
                disabled={isLoading}
                className="border-2 border-gray-300 focus:border-red-500 focus:ring-red-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  className="border-2 border-gray-300 focus:border-red-500 focus:ring-red-500 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verifying Access...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-5 w-5" />
                  Authenticate & Enter
                </>
              )}
            </Button>
          </form>

          {/* Friendly Warning Footer */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🔒</div>
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-800 mb-1">Security Notice:</p>
                <p>
                  This system is monitored and protected. All access attempts are logged. 
                  If you don't have valid credentials, please contact your administrator.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading security checkpoint...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
} 