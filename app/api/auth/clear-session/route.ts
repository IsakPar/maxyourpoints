import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Sign out the user globally
    await supabase.auth.signOut()
    
    console.log('🧹 Server-side session cleared')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Session cleared successfully' 
    })
  } catch (error) {
    console.error('❌ Error clearing server session:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to clear session' 
      },
      { status: 500 }
    )
  }
} 