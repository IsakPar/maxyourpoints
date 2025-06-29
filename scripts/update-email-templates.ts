import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Template data from your HTML file
const templates = {
  'Subscription Confirmation': {
    subject: 'Welcome to Max Your Points! ✈️',
    html_content: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Welcome to Max Your Points!</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Welcome Aboard! ✈️</h1>
      <p style="color: #a7f3d0; margin: 10px 0 0 0; font-size: 18px;">You're now part of the Max Your Points family!</p>
    </div>
    
    <div style="background: white; padding: 40px 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #0f766e; margin: 0 0 15px 0;">Hey {{subscriber_name}}! 👋</h2>
        <p style="font-size: 16px; color: #374151;">
          Welcome to our exclusive community of savvy travelers! You've just unlocked the secrets to maximizing your travel rewards and experiencing the world for less.
        </p>
      </div>

      <div style="background: #f0fdf4; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #10b981;">
        <h3 style="color: #0f766e; margin: 0 0 15px 0;">🎯 What you can expect:</h3>
        <ul style="margin: 0; padding-left: 20px;">
          <li style="margin: 8px 0; color: #374151;">💳 Expert credit card strategies and reviews</li>
          <li style="margin: 8px 0; color: #374151;">✈️ Insider airline industry news and tips</li>
          <li style="margin: 8px 0; color: #374151;">🏨 Honest hotel reviews and luxury experiences</li>
          <li style="margin: 8px 0; color: #374151;">🎫 Flash deals and mistake fares</li>
          <li style="margin: 8px 0; color: #374151;">📈 Weekly updates on the best travel offers</li>
        </ul>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://maxyourpoints.com/blog" style="display: inline-block; background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%); color: white; padding: 15px 30px; border-radius: 25px; text-decoration: none; font-weight: bold; font-size: 16px;">
          Start Exploring 🚀
        </a>
      </div>

      <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
        <p style="margin: 0; color: #7f1d1d; font-size: 14px;">
          <strong>Pro Tip:</strong> Add newsletter@maxyourpoints.com to your contacts to ensure you never miss our latest travel hacks! 📧
        </p>
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #6b7280; font-size: 14px;">
          Safe travels and happy point earning!<br>
          <strong style="color: #0f766e;">The Max Your Points Team</strong> ✈️
        </p>
      </div>
    </div>
    
    <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #9ca3af;">
      <p>Built with ❤️ by <a href="mailto:isak@maxyourpoints.com" style="color: #0f766e;">Isak Parild</a></p>
      <p><a href="{{unsubscribe_url}}" style="color: #9ca3af;">Unsubscribe</a> | <a href="https://maxyourpoints.com" style="color: #9ca3af;">Visit Website</a></p>
    </div>
  </body>
</html>`,
    type: 'welcome'
  },

  'Unsubscribe Confirmation': {
    subject: 'We\'ll miss you! Safe travels ✈️',
    html_content: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Until we meet again...</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 28px;">👋 Until we meet again...</h1>
      <p style="color: #d1d5db; margin: 10px 0 0 0; font-size: 18px;">You've been successfully unsubscribed</p>
    </div>
    
    <div style="background: white; padding: 40px 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #4b5563; margin: 0 0 15px 0;">Hey {{subscriber_name}} 😢</h2>
        <p style="font-size: 16px; color: #374151;">
          We're sad to see you go! You've been successfully unsubscribed from our newsletter.
        </p>
      </div>

      <div style="background: #fef3c7; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
        <h3 style="color: #92400e; margin: 0 0 15px 0;">🤔 Was it something we said?</h3>
        <p style="margin: 0; color: #78350f;">
          We're always looking to improve! If you have a moment, we'd love to hear why you're leaving. 
          Your feedback helps us create better content for fellow travelers.
        </p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="mailto:isak@maxyourpoints.com?subject=Feedback%20on%20Newsletter" style="display: inline-block; background: #f59e0b; color: white; padding: 12px 25px; border-radius: 20px; text-decoration: none; font-weight: bold; margin: 0 10px;">
          💬 Send Feedback
        </a>
        <a href="{{resubscribe_url}}" style="display: inline-block; background: #10b981; color: white; padding: 12px 25px; border-radius: 20px; text-decoration: none; font-weight: bold; margin: 0 10px;">
          ↩️ Resubscribe
        </a>
      </div>

      <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
        <p style="margin: 0; color: #1e40af; font-size: 14px;">
          <strong>One last tip:</strong> Don't forget to check out our blog at maxyourpoints.com for the latest travel deals - no subscription required! 🌟
        </p>
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #6b7280; font-size: 14px;">
          Wishing you amazing adventures ahead!<br>
          <strong style="color: #4b5563;">The Max Your Points Team</strong> ✈️
        </p>
      </div>
    </div>
    
    <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #9ca3af;">
      <p>Built with ❤️ by <a href="mailto:isak@maxyourpoints.com" style="color: #4b5563;">Isak Parild</a></p>
      <p><a href="https://maxyourpoints.com" style="color: #9ca3af;">Visit Website</a> | <a href="https://x.com/max_your_points" style="color: #9ca3af;">Follow on X</a></p>
    </div>
  </body>
</html>`,
    type: 'custom'
  },

  'Weekly Newsletter': {
    subject: 'Weekly Travel Roundup - {{week_date}}',
    html_content: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Weekly Travel Roundup</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 28px;">📅 Weekly Travel Roundup</h1>
      <p style="color: #a7f3d0; margin: 10px 0 0 0; font-size: 18px;">Your weekly dose of travel wisdom</p>
    </div>
    
    <div style="background: white; padding: 40px 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #0f766e; margin: 0 0 15px 0;">This Week's Must-Reads ✨</h2>
        <p style="font-size: 16px; color: #374151;">
          Hand-picked articles to maximize your travel rewards and experiences
        </p>
      </div>

      <div style="margin: 30px 0;">
        {{articles}}
      </div>

      <div style="background: #fef3c7; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
        <h3 style="color: #92400e; margin: 0 0 15px 0;">💡 Weekly Travel Tip</h3>
        <p style="margin: 0; color: #78350f;">
          <strong>Book flights on Tuesday afternoons</strong> for potential savings of 10-15%. Airlines often release deals on Monday evenings, and competitors match prices by Tuesday afternoon!
        </p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://maxyourpoints.com/blog" style="display: inline-block; background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%); color: white; padding: 15px 30px; border-radius: 25px; text-decoration: none; font-weight: bold; font-size: 16px;">
          Read More Articles 📚
        </a>
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #6b7280; font-size: 14px;">
          Keep exploring and earning those points!<br>
          <strong style="color: #0f766e;">The Max Your Points Team</strong> ✈️
        </p>
      </div>
    </div>
    
    <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #9ca3af;">
      <p>Built with ❤️ by <a href="mailto:isak@maxyourpoints.com" style="color: #0f766e;">Isak Parild</a></p>
      <p><a href="{{unsubscribe_url}}" style="color: #9ca3af;">Unsubscribe</a> | <a href="https://maxyourpoints.com" style="color: #9ca3af;">Visit Website</a></p>
    </div>
  </body>
</html>`,
    type: 'weekly'
  },

  'Airfare Deal of the Day': {
    subject: '🔥 Daily Airfare Alert: {{destination}} from ${{price}}!',
    html_content: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Daily Airfare Alert</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 28px;">🔥 DEAL ALERT!</h1>
      <p style="color: #fed7aa; margin: 10px 0 0 0; font-size: 18px;">Amazing airfare spotted!</p>
    </div>
    
    <div style="background: white; padding: 40px 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #dc2626; margin: 0 0 15px 0;">Today's Featured Deal ✈️</h2>
        <p style="font-size: 16px; color: #374151;">
          Don't miss out on this incredible airfare opportunity!
        </p>
      </div>

      <div style="margin: 30px 0;">
        {{articles}}
      </div>

      <div style="background: #fef2f2; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #dc2626;">
        <h3 style="color: #991b1b; margin: 0 0 15px 0;">⚡ Pro Booking Tips</h3>
        <ul style="margin: 0; padding-left: 20px;">
          <li style="margin: 8px 0; color: #7f1d1d;">Book within 24 hours for best availability</li>
          <li style="margin: 8px 0; color: #7f1d1d;">Clear cookies or use incognito mode</li>
          <li style="margin: 8px 0; color: #7f1d1d;">Check multiple booking sites for comparison</li>
          <li style="margin: 8px 0; color: #7f1d1d;">Be flexible with exact dates (+/- 2 days)</li>
        </ul>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://maxyourpoints.com/blog" style="display: inline-block; background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 15px 30px; border-radius: 25px; text-decoration: none; font-weight: bold; font-size: 16px;">
          Find More Deals 🎯
        </a>
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #6b7280; font-size: 14px;">
          Happy deal hunting!<br>
          <strong style="color: #dc2626;">The Max Your Points Team</strong> ✈️
        </p>
      </div>
    </div>
    
    <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #9ca3af;">
      <p>Built with ❤️ by <a href="mailto:isak@maxyourpoints.com" style="color: #dc2626;">Isak Parild</a></p>
      <p><a href="{{unsubscribe_url}}" style="color: #9ca3af;">Unsubscribe</a> | <a href="https://maxyourpoints.com" style="color: #9ca3af;">Visit Website</a></p>
    </div>
  </body>
</html>`,
    type: 'custom'
  }
}

async function updateEmailTemplates() {
  console.log('🚀 Starting email template updates...')

  for (const [templateName, templateData] of Object.entries(templates)) {
    try {
      console.log(`📧 Updating template: ${templateName}`)

      // Try to update existing template first
      const { data: updateData, error: updateError } = await supabase
        .from('newsletter_templates')
        .update({
          subject: templateData.subject,
          content: templateData.html_content.substring(0, 500) + '...',
          html_content: templateData.html_content,
          type: templateData.type,
          updated_at: new Date().toISOString()
        })
        .eq('name', templateName)
        .select()

      if (updateError) {
        console.log(`ℹ️  Template "${templateName}" doesn't exist, creating new one...`)
        
        // Create new template
        const { data: insertData, error: insertError } = await supabase
          .from('newsletter_templates')
          .insert({
            name: templateName,
            subject: templateData.subject,
            content: templateData.html_content.substring(0, 500) + '...',
            html_content: templateData.html_content,
            type: templateData.type
          })
          .select()

        if (insertError) {
          console.error(`❌ Failed to create template "${templateName}":`, insertError)
        } else {
          console.log(`✅ Created template: ${templateName}`)
        }
      } else if (updateData && updateData.length > 0) {
        console.log(`✅ Updated template: ${templateName}`)
      } else {
        console.log(`ℹ️  No changes needed for template: ${templateName}`)
      }

    } catch (error) {
      console.error(`❌ Error processing template "${templateName}":`, error)
    }
  }

  console.log('🎉 Email template update complete!')
}

// Run the script
if (require.main === module) {
  updateEmailTemplates()
    .then(() => {
      console.log('✨ All done!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Script failed:', error)
      process.exit(1)
    })
}

export { updateEmailTemplates } 