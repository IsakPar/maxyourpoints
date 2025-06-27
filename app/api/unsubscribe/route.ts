import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const token = searchParams.get('token')

    if (!email || !token) {
      return NextResponse.json({
        error: 'Missing email or token'
      }, { status: 400 })
    }

    // Update newsletter subscriber status in Supabase
    const { data, error } = await supabaseAdmin
      .from('newsletter_subscribers')
      .update({ 
        status: 'unsubscribed',
        unsubscribed_at: new Date().toISOString()
      })
      .eq('email', email)
      .select()

    if (error) {
      console.error('Unsubscribe error:', error)
      return NextResponse.json({
        error: 'Failed to unsubscribe'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed'
    })

  } catch (error: any) {
    console.error('Unsubscribe API error:', error)
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 })
  }
} 