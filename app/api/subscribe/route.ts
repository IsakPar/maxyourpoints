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

    // Use the proper database function to avoid column ambiguity
    const { data: subscriptionResult, error } = await supabase
      .rpc('create_subscriber_with_confirmation', {
        p_email: email,
        p_source: 'website'
      })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
    }

    if (!subscriptionResult || subscriptionResult.length === 0) {
      return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 })
    }

    const result = subscriptionResult[0]
    console.log('✅ Subscription result:', result)

    // Handle different subscription states
    if (result.status === 'confirmed') {
      return NextResponse.json({ 
        success: true,
        alreadySubscribed: true,
        message: "Great news! You're already part of our Max Your Points community! 🎉",
        details: "You're all set to receive our latest travel tips, deals, and point strategies."
      })
    }

    // For pending status, send confirmation email
    if (result.status === 'pending' && result.confirmation_token) {
      try {
        const mailjetService = new MailjetService()
        
        // Generate confirmation URL
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maxyourpoints.com'
        const confirmationUrl = `${baseUrl}/api/confirm-email?token=${result.confirmation_token}`
        
        const emailSubject = '✉️ Please confirm your subscription to Max Your Points'
        const emailHtml = generateConfirmationEmail(email, confirmationUrl)

        console.log('📧 Sending confirmation email via Mailjet to:', email)
        
        const emailResult = await mailjetService.sendEmail({
          to: email,
          from: process.env.MAILJET_FROM_EMAIL || 'newsletter@maxyourpoints.com',
          subject: emailSubject,
          html: emailHtml,
          text: `Please confirm your subscription to Max Your Points!\n\nClick this link to confirm: ${confirmationUrl}\n\nThis link will expire in 7 days.`
        })

        console.log('✅ Confirmation email sent successfully:', emailResult.messageId)

        return NextResponse.json({ 
          success: true,
          requiresConfirmation: true,
          message: 'Please check your email and click the confirmation link to complete your subscription.',
          details: 'We\'ve sent you a confirmation email with a link to activate your subscription.',
          messageId: emailResult.messageId
        })

      } catch (emailError) {
        console.error('Email sending failed:', emailError)
        return NextResponse.json({ 
          success: true,
          requiresConfirmation: true,
          message: 'Subscription created but confirmation email could not be sent. Please contact support.',
          details: 'Your subscription is pending email confirmation.'
        })
      }
    }

    // Default response for other cases
    return NextResponse.json({ 
      success: true,
      requiresConfirmation: true,
      message: 'Please check your email and confirm your subscription.',
      details: "We've sent you a confirmation link. Click it to start receiving our newsletter!"
    })

  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

function generateConfirmationEmail(email: string, confirmationUrl: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirm your subscription to Max Your Points</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f0fdf4; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 50px 20px; text-align: center; }
            .header h1 { color: white; font-size: 36px; margin-bottom: 15px; font-weight: 700; }
            .header p { color: rgba(255,255,255,0.95); font-size: 20px; }
            .content { padding: 40px 30px; text-align: center; }
            .intro { font-size: 18px; color: #374151; margin-bottom: 30px; }
            .confirm-btn { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 18px; margin: 30px 0; }
            .footer { background: #1f2937; color: white; padding: 30px 20px; text-align: center; }
            .expire-notice { font-size: 14px; color: #6b7280; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Almost there! ✉️</h1>
                <p>Just one click to confirm your subscription</p>
            </div>
            
            <div class="content">
                <div class="intro">
                    Hey ${email.split('@')[0]}! 👋<br><br>
                    Welcome to Max Your Points! We're excited to have you join our community of smart travelers.
                    <br><br>
                    Please confirm your email address to start receiving our weekly travel tips, exclusive deals, and credit card strategies.
                </div>
                
                <a href="${confirmationUrl}" class="confirm-btn">
                    ✅ Confirm My Subscription
                </a>
                
                <div class="expire-notice">
                    This confirmation link will expire in 7 days. If you didn't sign up for our newsletter, you can safely ignore this email.
                </div>
            </div>
            
            <div class="footer">
                <h3 style="color: #3b82f6; margin-bottom: 15px;">Max Your Points</h3>
                <p style="color: #9ca3af; margin: 15px 0;">
                    Making travel dreams affordable, one point at a time.
                </p>
                <div style="font-size: 12px; color: #6b7280; margin-top: 20px;">
                    <p>Max Your Points | Built with love by Isak Parild</p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `
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