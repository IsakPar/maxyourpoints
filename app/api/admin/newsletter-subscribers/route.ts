import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { verifyAuthUser } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    // Verify admin access
    const user = await verifyAuthUser(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('📧 Admin fetching newsletter subscribers from database')
    
    // Fetch subscribers from database
    const { data: subscribers, error } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Newsletter subscribers fetch error:', error)
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to fetch subscribers'
        },
        { status: 500 }
      )
    }

    // Map database fields to expected UI format and normalize status values
    const formattedSubscribers = subscribers?.map(sub => ({
      id: sub.id,
      email: sub.email,
      status: sub.status === 'active' ? 'confirmed' : sub.status, // Handle legacy 'active' status
      subscribed_at: sub.subscribed_at,
      unsubscribed_at: sub.unsubscribed_at,
      source: sub.source || 'website',
      created_at: sub.created_at
    })) || []

    console.log(`✅ Successfully fetched ${formattedSubscribers.length} subscribers`)
    
    return NextResponse.json({ 
      success: true,
      subscribers: formattedSubscribers
    })

  } catch (error) {
    console.error('❌ Newsletter subscribers API error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
} 