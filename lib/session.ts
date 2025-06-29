import { createClient } from '@/lib/supabase/server'

export const SESSION_TIMEOUT_MINUTES = 15
export const SESSION_TIMEOUT_MS = SESSION_TIMEOUT_MINUTES * 60 * 1000

export interface SessionInfo {
  isValid: boolean
  timeRemaining?: number
  lastActivity?: string
}

/**
 * Check if the current session is valid and not expired
 */
export async function validateSession(): Promise<SessionInfo> {
  try {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session) {
      return { isValid: false }
    }

    // Check if session is expired based on our custom timeout
    const lastActivity = session.user.user_metadata?.last_activity
    const now = Date.now()
    
    if (lastActivity) {
      const timeSinceActivity = now - new Date(lastActivity).getTime()
      
      if (timeSinceActivity > SESSION_TIMEOUT_MS) {
        // Session expired due to inactivity - sign out
        await supabase.auth.signOut()
        return { 
          isValid: false,
          timeRemaining: 0,
          lastActivity 
        }
      }
      
      return {
        isValid: true,
        timeRemaining: SESSION_TIMEOUT_MS - timeSinceActivity,
        lastActivity
      }
    }

    // No last activity recorded, treat as valid but update activity
    await updateLastActivity()
    
    return { 
      isValid: true,
      timeRemaining: SESSION_TIMEOUT_MS,
      lastActivity: new Date().toISOString()
    }
    
  } catch (error) {
    console.error('Session validation error:', error)
    return { isValid: false }
  }
}

/**
 * Update the last activity timestamp for session timeout tracking
 */
export async function updateLastActivity(): Promise<void> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          last_activity: new Date().toISOString()
        }
      })
    }
  } catch (error) {
    console.error('Error updating last activity:', error)
  }
}

/**
 * Force sign out and clear all session data
 */
export async function forceSignOut(): Promise<void> {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch (error) {
    console.error('Error during forced sign out:', error)
  }
} 