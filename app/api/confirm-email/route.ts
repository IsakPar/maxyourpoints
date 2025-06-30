import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Confirmation token is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    console.log('✉️ Confirming email subscription with token:', token.substring(0, 8) + '...')

    // TEMPORARY: Use direct SQL instead of the broken function
    // Find subscriber by token
    const { data: subscriber, error: findError } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('confirmation_token', token)
      .eq('status', 'pending')
      .gte('confirmation_sent_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Within 7 days
      .single()

    if (findError || !subscriber) {
      console.log('❌ Invalid or expired token')
      return NextResponse.json(
        { error: 'Invalid or expired confirmation token' },
        { status: 400 }
      )
    }

    // Update subscriber to confirmed
    const { error: updateError } = await supabase
      .from('newsletter_subscribers')
      .update({
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
        confirmation_token: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', subscriber.id)

    if (updateError) {
      console.error('❌ Error confirming subscription:', updateError)
      return NextResponse.json(
        { error: 'Failed to confirm subscription' },
        { status: 500 }
      )
    }

    console.log('✅ Email confirmed successfully for:', subscriber.email)

    // Redirect to a success page or return success response
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || request.headers.get('origin')
    return NextResponse.redirect(`${baseUrl}/?confirmed=true&email=${encodeURIComponent(subscriber.email)}`)

  } catch (error) {
    console.error('💥 Unexpected error confirming email:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Confirmation token is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    console.log('✉️ Confirming email subscription via POST with token:', token.substring(0, 8) + '...')

    // TEMPORARY: Use direct SQL instead of the broken function
    // Find subscriber by token
    const { data: subscriber, error: findError } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('confirmation_token', token)
      .eq('status', 'pending')
      .gte('confirmation_sent_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Within 7 days
      .single()

    if (findError || !subscriber) {
      console.log('❌ Invalid or expired token')
      return NextResponse.json(
        { error: 'Invalid or expired confirmation token', success: false },
        { status: 400 }
      )
    }

    // Update subscriber to confirmed
    const { error: updateError } = await supabase
      .from('newsletter_subscribers')
      .update({
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
        confirmation_token: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', subscriber.id)

    if (updateError) {
      console.error('❌ Error confirming subscription:', updateError)
      return NextResponse.json(
        { error: 'Failed to confirm subscription' },
        { status: 500 }
      )
    }

    console.log('✅ Email confirmed successfully for:', subscriber.email)

    return NextResponse.json({
      success: true,
      email: subscriber.email,
      message: 'Email confirmed successfully'
    })

  } catch (error) {
    console.error('💥 Unexpected error confirming email:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 