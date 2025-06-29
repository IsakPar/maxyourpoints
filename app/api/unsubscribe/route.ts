import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { mailjetService } from '@/lib/email/resend'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const token = searchParams.get('token')

    if (!email) {
      return NextResponse.json({
        error: 'Missing email parameter'
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

    if (!data || data.length === 0) {
      return NextResponse.json({
        error: 'Email not found in subscribers list'
      }, { status: 404 })
    }

    console.log('✅ Unsubscribed user:', email)

    // Get the unsubscribe confirmation template from database
    const { data: template } = await supabaseAdmin
      .from('newsletter_templates')
      .select('*')
      .eq('name', 'Unsubscribe Confirmation')
      .single()

    // Send unsubscribe confirmation email via Mailjet
    let emailResult
    if (template) {
      // Use the beautiful custom template
      const emailHtml = template.html_content
        .replace(/{{subscriber_name}}/g, email.split('@')[0])
        .replace(/{{subscriber_email}}/g, email)
        .replace(/{{resubscribe_url}}/g, 'https://maxyourpoints.com')
      
      emailResult = await mailjetService.sendEmail({
        to: email,
        from: process.env.MAILJET_FROM_EMAIL || 'newsletter@maxyourpoints.com',
        subject: template.subject || 'Goodbye from Max Your Points',
        html: emailHtml,
        text: `You've been unsubscribed from Max Your Points newsletter.\n\nIf this was a mistake, you can resubscribe at: https://maxyourpoints.com`
      })
    } else {
      // Fallback to original method
      emailResult = await mailjetService.sendUnsubscribeConfirmation(email)
    }
    
    if (!emailResult.success) {
      console.error('Failed to send unsubscribe confirmation:', emailResult.error)
      // Don't fail the unsubscribe if email fails - just log it
      console.log('⚠️ Unsubscribe successful but confirmation email failed to send')
    } else {
      console.log('✅ Unsubscribe confirmation email sent:', emailResult.messageId)
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

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    console.log('📧 Form-based unsubscribe for:', email)

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

    if (!data || data.length === 0) {
      return NextResponse.json({
        error: 'Email not found in subscribers list'
      }, { status: 404 })
    }

    console.log('✅ Unsubscribed user via form:', email)

    // Get the unsubscribe confirmation template from database
    const { data: template } = await supabaseAdmin
      .from('newsletter_templates')
      .select('*')
      .eq('name', 'Unsubscribe Confirmation')
      .single()

    // Send unsubscribe confirmation email via Mailjet
    let emailResult
    if (template) {
      // Use the beautiful custom template
      const emailHtml = template.html_content
        .replace(/{{subscriber_name}}/g, email.split('@')[0])
        .replace(/{{subscriber_email}}/g, email)
        .replace(/{{resubscribe_url}}/g, 'https://maxyourpoints.com')
      
      emailResult = await mailjetService.sendEmail({
        to: email,
        from: process.env.MAILJET_FROM_EMAIL || 'newsletter@maxyourpoints.com',
        subject: template.subject || 'Goodbye from Max Your Points',
        html: emailHtml,
        text: `You've been unsubscribed from Max Your Points newsletter.\n\nIf this was a mistake, you can resubscribe at: https://maxyourpoints.com`
      })
    } else {
      // Fallback to original method
      emailResult = await mailjetService.sendUnsubscribeConfirmation(email)
    }
    
    if (!emailResult.success) {
      console.error('Failed to send unsubscribe confirmation:', emailResult.error)
      // Don't fail the unsubscribe if email fails - just log it
      console.log('⚠️ Unsubscribe successful but confirmation email failed to send')
    } else {
      console.log('✅ Unsubscribe confirmation email sent:', emailResult.messageId)
    }

    return NextResponse.json({
      success: true,
      message: 'You have been successfully unsubscribed'
    })

  } catch (error: any) {
    console.error('Unsubscribe POST API error:', error)
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 })
  }
} 