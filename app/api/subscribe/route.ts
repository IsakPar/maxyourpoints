import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { MailjetService } from '@/lib/email/resend'
import { newsletterLimiter } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const { success, reset } = await newsletterLimiter.check(request)
    if (!success) {
      return NextResponse.json(
        { 
          error: 'Too many subscription attempts. Please try again later.',
          resetTime: reset
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Reset': reset?.toString() || '',
            'Retry-After': Math.ceil(((reset || Date.now()) - Date.now()) / 1000).toString()
          }
        }
      )
    }

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    console.log('📧 Newsletter subscription for:', email)

    const supabase = await createClient()

    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', email)
      .single()

    if (existingSubscriber) {
      if (existingSubscriber.status === 'confirmed') {
        return NextResponse.json({ 
          message: 'You are already subscribed to our newsletter!' 
        })
      }
      
      // Reactivate if unsubscribed
      if (existingSubscriber.status === 'unsubscribed') {
        await supabase
          .from('newsletter_subscribers')
          .update({ 
            status: 'confirmed', 
            subscribed_at: new Date().toISOString(),
            unsubscribed_at: null
          })
          .eq('email', email)
        
        console.log('✅ Reactivated existing subscriber:', email)
      }
    } else {
      // Create new subscriber
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email,
          status: 'confirmed',
          source: 'website',
          subscribed_at: new Date().toISOString()
        })

      if (error) {
        console.error('Database error:', error)
        return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
      }

      console.log('✅ New subscriber added:', email)
    }

    // Get the subscription confirmation template
    const { data: template } = await supabase
      .from('newsletter_templates')
      .select('*')
      .eq('name', 'Subscription Confirmation')
      .single()

    // Send welcome email with beautiful template
    try {
      const mailjetService = new MailjetService()
      
      // Generate personalized unsubscribe URL
      const unsubscribeUrl = `https://maxyourpoints.com/unsubscribe?email=${encodeURIComponent(email)}`
      
      let emailHtml: string
      let emailSubject: string
      
      if (template) {
        // Use the beautiful custom template
        emailHtml = template.html_content
          .replace(/{{subscriber_name}}/g, email.split('@')[0]) // Use email prefix as name
          .replace(/{{subscriber_email}}/g, email)
          .replace(/{{unsubscribe_url}}/g, unsubscribeUrl)
        emailSubject = template.subject
      } else {
        // Fallback to simple template
        emailSubject = '🎉 Welcome to Max Your Points! Your travel journey starts now ✈️'
        emailHtml = generateFallbackWelcomeEmail(email, unsubscribeUrl)
      }

      console.log('📧 Sending email via Mailjet to:', email)
      
      const result = await mailjetService.sendEmail({
        to: email,
        from: process.env.MAILJET_FROM_EMAIL || 'newsletter@maxyourpoints.com',
        subject: emailSubject,
        html: emailHtml,
        text: `Welcome to Max Your Points!\n\nThanks for subscribing to our newsletter. You'll receive weekly travel tips, deals, and credit card strategies.\n\nUnsubscribe: ${unsubscribeUrl}`
      })

      console.log('✅ Welcome email sent successfully:', result.messageId)

      return NextResponse.json({ 
        message: 'Successfully subscribed! Check your email for a welcome message.',
        messageId: result.messageId
      })

    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // Don't fail the subscription if email fails
      return NextResponse.json({ 
        message: 'Successfully subscribed, but welcome email could not be sent.'
      })
    }

  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

function generateFallbackWelcomeEmail(email: string, unsubscribeUrl: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Max Your Points!</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f0fdf4; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 50px 20px; text-align: center; }
            .header h1 { color: white; font-size: 36px; margin-bottom: 15px; font-weight: 700; }
            .header p { color: rgba(255,255,255,0.95); font-size: 20px; }
            .content { padding: 40px 30px; text-align: center; }
            .intro { font-size: 18px; color: #374151; margin-bottom: 30px; }
            .footer { background: #1f2937; color: white; padding: 30px 20px; text-align: center; }
            .unsubscribe { font-size: 12px; color: #9ca3af; margin-top: 20px; }
            .unsubscribe a { color: #10b981; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Welcome aboard! 🚀</h1>
                <p>Your travel rewards journey starts now</p>
            </div>
            
            <div class="content">
                <div class="intro">
                    Hey ${email.split('@')[0]}! 👋<br><br>
                    Welcome to the Max Your Points community! You've just joined thousands of smart travelers 
                    who are maximizing their points, miles, and travel experiences.
                </div>
                
                <p style="color: #047857; font-size: 16px; margin: 30px 0;">
                    Get ready for weekly travel tips, exclusive deals, and credit card strategies delivered straight to your inbox!
                </p>
            </div>
            
            <div class="footer">
                <h3 style="color: #10b981; margin-bottom: 15px;">Max Your Points</h3>
                <p style="color: #9ca3af; margin: 15px 0;">
                    Making travel dreams affordable, one point at a time.
                </p>
                <div class="unsubscribe">
                    <p>Change your preferences or <a href="${unsubscribeUrl}">unsubscribe here</a></p>
                    <p>Max Your Points | Built with love by Isak Parild</p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `
} 