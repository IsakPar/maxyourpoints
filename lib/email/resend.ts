import Mailjet from 'node-mailjet'

// Initialize Mailjet with API keys from environment
const mailjet = process.env.MAILJET_API_KEY && process.env.MAILJET_SECRET_KEY 
  ? new Mailjet({
      apiKey: process.env.MAILJET_API_KEY,
      apiSecret: process.env.MAILJET_SECRET_KEY
    })
  : null

export interface EmailOptions {
  to: string | string[]
  from: string
  subject: string
  html: string
  text?: string
}

export class MailjetService {
  private fromEmail: string
  private fromName: string

  constructor() {
    if (!process.env.MAILJET_API_KEY || !process.env.MAILJET_SECRET_KEY) {
      console.warn('⚠️ MAILJET_API_KEY or MAILJET_SECRET_KEY not found in environment variables - email sending will be simulated')
    }
    
    // Use your verified domain email
    this.fromEmail = process.env.MAILJET_FROM_EMAIL || 'noreply@maxyourpoints.com'
    this.fromName = process.env.MAILJET_FROM_NAME || 'Max Your Points'
  }

  async sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      if (!mailjet) {
        console.log('📧 Mailjet not configured - simulating email send')
        console.log(`📧 Would send email:`)
        console.log(`   To: ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`)
        console.log(`   From: ${options.from}`)
        console.log(`   Subject: ${options.subject}`)
        console.log(`   Text: ${options.text?.substring(0, 100)}...`)
        
        return { 
          success: true, 
          messageId: `sim_${Date.now()}`,
          error: undefined 
        }
      }

      // Prepare recipients
      const recipients = Array.isArray(options.to) 
        ? options.to.map(email => ({ Email: email }))
        : [{ Email: options.to }]

      console.log(`📧 Sending email via Mailjet to: ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`)

      // Send email using Mailjet
      const result = await mailjet
        .post('send', { version: 'v3.1' })
        .request({
          Messages: [
            {
              From: {
                Email: this.fromEmail,
                Name: this.fromName
              },
              To: recipients,
              Subject: options.subject,
              TextPart: options.text || '',
              HTMLPart: options.html
            }
          ]
        } as any)

      const messageId = result.body?.Messages?.[0]?.To?.[0]?.MessageID

      console.log(`✅ Email sent successfully via Mailjet. Message ID: ${messageId}`)
      
      return {
        success: true,
        messageId: messageId || `mj_${Date.now()}`,
        error: undefined
      }

    } catch (error) {
      console.error('❌ Mailjet email send failed:', error)
      
      return {
        success: false,
        messageId: undefined,
        error: error instanceof Error ? error.message : 'Unknown email error'
      }
    }
  }

  // Welcome email template
  async sendWelcomeEmail(email: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const welcomeHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>🛬 You Have Landed at Max Your Points!</title>
          <style>
            @media only screen and (max-width: 600px) {
              .container { width: 100% !important; padding: 10px !important; }
              .header { padding: 20px !important; font-size: 24px !important; }
              .content { padding: 20px !important; }
              .benefit-item { margin-bottom: 15px !important; }
            }
          </style>
        </head>
        <body style="font-family: 'Comic Sans MS', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f0f9ff;">
          <div class="container" style="max-width: 600px; margin: 0 auto; padding: 20px;">
            
            <!-- Header with Landing Animation Feel -->
            <div class="header" style="background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #6366f1 100%); padding: 30px; text-align: center; border-radius: 15px 15px 0 0; position: relative; overflow: hidden;">
              <div style="position: absolute; top: -50px; left: -50px; width: 100px; height: 100px; background: rgba(255,255,255,0.1); border-radius: 50%; animation: float 3s ease-in-out infinite;"></div>
              <div style="position: absolute; bottom: -30px; right: -30px; width: 60px; height: 60px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
              
              <h1 class="header" style="color: white; margin: 0; font-size: 28px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                🛬 YOU HAVE LANDED! ✈️
              </h1>
              <p style="color: #e0f2fe; margin: 10px 0 0 0; font-size: 18px; font-weight: bold;">
                Welcome aboard Max Your Points!
              </p>
            </div>
            
            <!-- Main Content -->
            <div class="content" style="background: white; padding: 30px; border-radius: 0 0 15px 15px; box-shadow: 0 8px 25px rgba(0,0,0,0.1);">
              
              <!-- Funny Welcome Message -->
              <div style="text-align: center; margin-bottom: 25px; padding: 20px; background: linear-gradient(45deg, #fef3c7, #fde68a); border-radius: 12px; border: 2px dashed #f59e0b;">
                <h2 style="color: #92400e; margin: 0 0 10px 0; font-size: 24px;">
                  🎉 CONGRATS, YOU MAGNIFICENT HUMAN! 🎉
                </h2>
                <p style="margin: 0; color: #78350f; font-size: 16px; font-weight: bold;">
                  You've successfully infiltrated our exclusive club of travel ninjas!
                </p>
              </div>

              <p style="font-size: 16px; margin-bottom: 20px;">
                Holy guacamole! 🥑 You just made the smartest decision since someone invented airplane WiFi (okay, maybe smarter). 
                Welcome to the Max Your Points family - where we turn ordinary humans into points-collecting, mile-hoarding, 
                first-class-flying legends! 
              </p>

              <p style="font-size: 16px; margin-bottom: 25px; color: #1f2937;">
                Here's what's about to happen to your inbox (spoiler alert: it's going to be AWESOME):
              </p>

              <!-- Benefits with Funny Icons -->
              <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin: 25px 0;">
                <div class="benefit-item" style="display: flex; align-items: flex-start; margin-bottom: 20px; padding: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                  <div style="font-size: 24px; margin-right: 15px; min-width: 40px;">🎯</div>
                  <div>
                    <strong style="color: #0f766e; font-size: 16px;">Epic Travel Hacking Secrets</strong><br>
                    <span style="color: #4a5568; font-size: 14px;">We'll teach you to hack the system so hard, airlines will start paying YOU to fly!</span>
                  </div>
                </div>
                
                <div class="benefit-item" style="display: flex; align-items: flex-start; margin-bottom: 20px; padding: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                  <div style="font-size: 24px; margin-right: 15px; min-width: 40px;">🕵️</div>
                  <div>
                    <strong style="color: #0f766e; font-size: 16px;">Airline Industry Insider Tea ☕</strong><br>
                    <span style="color: #4a5568; font-size: 14px;">All the gossip, drama, and secrets that make airline executives nervous!</span>
                  </div>
                </div>
                
                <div class="benefit-item" style="display: flex; align-items: flex-start; margin-bottom: 20px; padding: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                  <div style="font-size: 24px; margin-right: 15px; min-width: 40px;">🏨</div>
                  <div>
                    <strong style="color: #0f766e; font-size: 16px;">Hotel Reviews That Don't Lie</strong><br>
                    <span style="color: #4a5568; font-size: 14px;">Brutally honest reviews - because someone needs to tell you about that "charming vintage elevator"!</span>
                  </div>
                </div>
                
                <div class="benefit-item" style="display: flex; align-items: flex-start; margin-bottom: 0; padding: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                  <div style="font-size: 24px; margin-right: 15px; min-width: 40px;">💳</div>
                  <div>
                    <strong style="color: #0f766e; font-size: 16px;">Credit Card Wizardry</strong><br>
                    <span style="color: #4a5568; font-size: 14px;">Turn plastic into plane tickets faster than you can say "annual fee waived"!</span>
                  </div>
                </div>
              </div>

              <!-- Call to Action -->
              <div style="text-align: center; margin: 30px 0; padding: 25px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 12px;">
                <h3 style="color: white; margin: 0 0 15px 0; font-size: 20px;">
                  🚀 READY FOR TAKEOFF?
                </h3>
                <p style="color: #d1fae5; margin: 0 0 20px 0; font-size: 16px;">
                  Your first mission: Check out our latest travel hacks that could save you THOUSANDS!
                </p>
                <a href="https://maxyourpoints.com/blog" style="display: inline-block; background: white; color: #059669; padding: 12px 30px; border-radius: 25px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                  Let's Go! 🎯
                </a>
              </div>

              <!-- Funny Sign-off -->
              <div style="text-align: center; margin-top: 30px; padding: 20px; background: #fef2f2; border-radius: 8px; border-left: 4px solid #ef4444;">
                <p style="margin: 0; font-style: italic; color: #7f1d1d; font-size: 14px;">
                  P.S. - We promise our emails are more entertaining than airline safety videos and more useful than airport WiFi! 📶
                </p>
              </div>

              <p style="margin-top: 25px; text-align: center; color: #4b5563;">
                Ready to become a travel legend?<br>
                <strong style="color: #0f766e;">The Max Your Points Crew</strong> 🛩️
              </p>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #6b7280; padding: 15px;">
              <p style="margin: 0 0 5px 0;">You're receiving this because you just joined the coolest travel community on Earth! 🌍</p>
              <p style="margin: 0;">
                <a href="{{unsubscribe_url}}" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a> | 
                <a href="https://maxyourpoints.com" style="color: #6b7280; text-decoration: underline;">Visit Website</a> | 
                <a href="https://x.com/max_your_points" style="color: #6b7280; text-decoration: underline;">Follow on X</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `

    const welcomeText = `
🛬 YOU HAVE LANDED! ✈️
Welcome aboard Max Your Points!

CONGRATS, YOU MAGNIFICENT HUMAN! 🎉
You've successfully infiltrated our exclusive club of travel ninjas!

Holy guacamole! 🥑 You just made the smartest decision since someone invented airplane WiFi (okay, maybe smarter). 
Welcome to the Max Your Points family - where we turn ordinary humans into points-collecting, mile-hoarding, first-class-flying legends!

Here's what's about to happen to your inbox (spoiler alert: it's going to be AWESOME):

🎯 Epic Travel Hacking Secrets
We'll teach you to hack the system so hard, airlines will start paying YOU to fly!

🕵️ Airline Industry Insider Tea ☕
All the gossip, drama, and secrets that make airline executives nervous!

🏨 Hotel Reviews That Don't Lie
Brutally honest reviews - because someone needs to tell you about that "charming vintage elevator"!

💳 Credit Card Wizardry
Turn plastic into plane tickets faster than you can say "annual fee waived"!

🚀 READY FOR TAKEOFF?
Your first mission: Check out our latest travel hacks that could save you THOUSANDS!
Visit: https://maxyourpoints.com/blog

P.S. - We promise our emails are more entertaining than airline safety videos and more useful than airport WiFi! 📶

Ready to become a travel legend?
The Max Your Points Crew 🛩️

---
You're receiving this because you just joined the coolest travel community on Earth! 🌍
Unsubscribe: {{unsubscribe_url}}
Website: https://maxyourpoints.com
    `

    return this.sendEmail({
      to: email,
      from: this.fromEmail,
      subject: '🛬 YOU HAVE LANDED! Welcome to Max Your Points (This is going to be fun!) ✈️',
      html: welcomeHtml,
      text: welcomeText
    })
  }

  // Unsubscribe confirmation email
  async sendUnsubscribeConfirmation(email: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const unsubscribeHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Unsubscribed from Max Your Points</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f1f5f9; padding: 30px; text-align: center; border-radius: 10px; border: 1px solid #e2e8f0;">
            <h1 style="color: #475569; margin: 0 0 20px 0; font-size: 24px;">You've been unsubscribed</h1>
            
            <p>We're sorry to see you go! You have been successfully unsubscribed from the Max Your Points newsletter.</p>
            
            <p>If you change your mind, you can always <a href="https://maxyourpoints.com" style="color: #0f766e; text-decoration: none; font-weight: bold;">visit our website</a> to subscribe again.</p>
            
            <div style="margin: 30px 0; padding: 20px; background: white; border-radius: 8px;">
              <p style="margin: 0; font-size: 14px; color: #64748b;">
                If this was a mistake or you have any questions, please contact us at support@maxyourpoints.com
              </p>
            </div>
            
            <p style="color: #64748b;">Safe travels,<br>
            <strong>The Max Your Points Team</strong></p>
          </div>
        </body>
      </html>
    `

    const unsubscribeText = `
You've been unsubscribed from Max Your Points

We're sorry to see you go! You have been successfully unsubscribed from the Max Your Points newsletter.

If you change your mind, you can always visit our website to subscribe again: https://maxyourpoints.com

If this was a mistake or you have any questions, please contact us at support@maxyourpoints.com

Safe travels,
The Max Your Points Team
    `

    return this.sendEmail({
      to: email,
      from: this.fromEmail,
      subject: 'Unsubscribed from Max Your Points',
      html: unsubscribeHtml,
      text: unsubscribeText
    })
  }
}

// Export singleton instance
export const mailjetService = new MailjetService()

// For backward compatibility, also export as resendService
export const resendService = mailjetService 