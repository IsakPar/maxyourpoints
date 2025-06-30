import { NextRequest, NextResponse } from 'next/server'
import { MailjetService } from '@/lib/email/resend'
import { contactFormLimiter } from '@/lib/rate-limit'
import { getSiteUrl } from '@/lib/utils'

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const { success, reset } = await contactFormLimiter.check(request)
    if (!success) {
      return NextResponse.json(
        { 
          error: 'Too many contact form submissions. Please try again later.',
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

    const body: ContactFormData = await request.json()
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const mailjetService = new MailjetService()

    // Create email content for the team
    const teamEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Contact Form Submission</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">📧 New Contact Form Submission</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0;">
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #0f766e; margin-top: 0; font-size: 18px;">Contact Details</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #0f766e;">${email}</a></p>
              <p><strong>Subject:</strong> ${subject}</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <h3 style="color: #0f766e; margin-top: 0; font-size: 16px;">Message</h3>
              <div style="background: #f8fafc; padding: 15px; border-radius: 6px; border-left: 4px solid #14b8a6;">
                <p style="margin: 0; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #ecfdf5; border-radius: 8px; border: 1px solid #d1fae5;">
              <p style="margin: 0; font-size: 14px; color: #059669;">
                💡 <strong>Quick Response Tip:</strong> Reply directly to this email to respond to ${name}
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #718096;">
            <p>This message was sent via the Max Your Points contact form at ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `

    const teamEmailText = `
New Contact Form Submission - Max Your Points

Contact Details:
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This message was sent via the Max Your Points contact form at ${new Date().toLocaleString()}
Reply directly to this email to respond to ${name}.
    `

    // Send email to the team
    const teamEmailResult = await mailjetService.sendEmail({
      to: 'hello@maxyourpoints.com',
      from: process.env.MAILJET_FROM_EMAIL || 'noreply@maxyourpoints.com',
      subject: `Contact Form: ${subject}`,
      html: teamEmailHtml,
      text: teamEmailText
    })

    if (!teamEmailResult.success) {
      console.error('Failed to send contact email to team:', teamEmailResult.error)
      return NextResponse.json(
        { error: 'Failed to send message. Please try again.' },
        { status: 500 }
      )
    }

    // Send confirmation email to the user
    const siteUrl = getSiteUrl()
    const userConfirmationHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Thanks for contacting Max Your Points!</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Thanks for reaching out! 📧</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0;">
            <h2 style="color: #0f766e; margin-top: 0;">Hi ${name},</h2>
            
            <p>Thank you for contacting Max Your Points! We've received your message and will get back to you as soon as we can!</p>
            
            <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #14b8a6;">
              <p style="margin: 0; font-weight: bold; color: #0f766e;">Your message summary:</p>
              <p style="margin: 5px 0 0 0;"><strong>Subject:</strong> ${subject}</p>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #64748b;">Submitted on ${new Date().toLocaleDateString()}</p>
            </div>
            
            <p>While you're waiting for our response, feel free to:</p>
            <ul style="color: #4a5568;">
              <li>🔗 <a href="${siteUrl}/blog" style="color: #0f766e; text-decoration: none;">Browse our latest travel tips</a></li>
              <li>🐦 <a href="https://twitter.com/maxyourpoints" style="color: #0f766e; text-decoration: none;">Follow us on X for real-time deals</a></li>
              <li>💳 <a href="${siteUrl}/blog/categories/credit-cards-and-points" style="color: #0f766e; text-decoration: none;">Check out our credit card guides</a></li>
            </ul>
            
            <p>Thanks again for being part of the Max Your Points community!</p>
            
            <p>Best regards,<br>
            <strong>The Max Your Points Team</strong></p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #718096;">
            <p>Need immediate help? Email us directly at <a href="mailto:hello@maxyourpoints.com" style="color: #718096;">hello@maxyourpoints.com</a></p>
          </div>
        </body>
      </html>
    `

    const userConfirmationText = `
Thanks for reaching out! 📧

Hi ${name},

Thank you for contacting Max Your Points! We've received your message and will get back to you as soon as we can!

Your message summary:
Subject: ${subject}
Submitted on: ${new Date().toLocaleDateString()}

While you're waiting for our response, feel free to:
• Browse our latest travel tips: ${siteUrl}/blog
• Follow us on X for real-time deals: https://twitter.com/maxyourpoints  
• Check out our credit card guides: ${siteUrl}/blog/categories/credit-cards-and-points

Thanks again for being part of the Max Your Points community!

Best regards,
The Max Your Points Team

---
Need immediate help? Email us directly at hello@maxyourpoints.com
    `

    // Send confirmation email to user (don't fail if this fails)
    try {
      await mailjetService.sendEmail({
        to: email,
        from: process.env.MAILJET_FROM_EMAIL || 'noreply@maxyourpoints.com',
        subject: '🎉 Thanks for reaching out! We\'ll be in touch soon',
        html: userConfirmationHtml,
        text: userConfirmationText
      })
    } catch (error) {
      console.warn('Failed to send confirmation email to user (non-critical):', error)
    }

    console.log(`✅ Contact form submission processed successfully from ${email}`)

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully! We\'ll get back to you within 24 hours.'
    })

  } catch (error) {
    console.error('Contact form submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
} 