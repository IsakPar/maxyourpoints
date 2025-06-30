import { NextRequest, NextResponse } from 'next/server'
import { verifyAuthUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { MailjetService } from '@/lib/email/resend'

interface Subscriber {
  email: string
}

interface Article {
  id: string
  title: string
  slug: string
  summary?: string
  content?: string
  hero_image_url?: string
  categories?: {
    slug: string
  }
}

interface CampaignArticle {
  position: number
  articles: Article
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin access
    const user = await verifyAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const campaignId = (await params).id
    const supabase = await createClient()

    console.log('📧 Starting newsletter campaign send process:', campaignId)

    // Get campaign details (temporarily without articles until table is created)
    const { data: campaign, error: campaignError } = await supabase
      .from('newsletter_campaigns')
      .select('*')
      .eq('id', campaignId)
      .single()

    if (campaignError || !campaign) {
      console.error('❌ Campaign not found:', campaignError)
      return NextResponse.json({ 
        error: 'Campaign not found' 
      }, { status: 404 })
    }

    // Check if campaign is in a valid state to send
    if (campaign.status === 'sent') {
      return NextResponse.json({ 
        error: 'Campaign has already been sent' 
      }, { status: 400 })
    }

    if (campaign.status === 'sending') {
      return NextResponse.json({ 
        error: 'Campaign is currently being sent' 
      }, { status: 400 })
    }

    // Update campaign status to 'sending'
    await supabase
      .from('newsletter_campaigns')
      .update({ 
        status: 'sending',
        updated_at: new Date().toISOString()
      })
      .eq('id', campaignId)

    // Get subscribers based on campaign targeting
    let subscribersData: any[] = []
    let subscribersError: any = null

    if (campaign.target_all_subscribers || !campaign.target_list_id) {
      // Get all confirmed subscribers
      const result = await supabase
        .from('newsletter_subscribers')
        .select('email')
        .eq('status', 'confirmed')
      subscribersData = result.data || []
      subscribersError = result.error
    } else {
      // Get subscribers from specific list
      const result = await supabase
        .from('newsletter_subscriber_list_members')
        .select(`
          newsletter_subscribers!inner(email)
        `)
        .eq('list_id', campaign.target_list_id)
        .eq('newsletter_subscribers.status', 'confirmed')
      subscribersData = result.data || []
      subscribersError = result.error
    }

    if (subscribersError) {
      console.error('❌ Error fetching subscribers:', subscribersError)
      return NextResponse.json({ 
        error: 'Failed to fetch subscribers' 
      }, { status: 500 })
    }

    // Transform the data based on query type
    let subscriberList: Subscriber[] = []
    if (campaign.target_all_subscribers || !campaign.target_list_id) {
      // Direct subscriber data
      subscriberList = (subscribersData as any[])?.map((s: any) => ({ email: s.email })) || []
    } else {
      // List member data - extract nested subscriber emails
      subscriberList = (subscribersData as any[])?.map((item: any) => ({ 
        email: item.newsletter_subscribers.email 
      })) || []
    }

    if (subscriberList.length === 0) {
      console.log('⚠️ No confirmed subscribers found')
      await supabase
        .from('newsletter_campaigns')
        .update({ 
          status: 'draft',
          updated_at: new Date().toISOString()
        })
        .eq('id', campaignId)
      
      return NextResponse.json({ 
        message: 'No confirmed subscribers to send to',
        sent_count: 0
      })
    }

    console.log(`📧 Found ${subscriberList.length} confirmed subscribers`)

    // Use the campaign's pre-generated HTML content which already includes styled articles
    console.log(`📄 Using campaign's pre-generated HTML content`)

    // The campaign.html_content already contains the properly formatted articles with correct links
    // Just need to replace dynamic placeholders
    let enhancedHtmlContent = campaign.html_content || campaign.content || ''
    
    // Replace dynamic placeholders
    const today = new Date()
    const formattedDate = today.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })
    
    enhancedHtmlContent = enhancedHtmlContent.replace(/{{date}}/g, formattedDate)
    enhancedHtmlContent = enhancedHtmlContent.replace(/{{campaign_name}}/g, campaign.name)
    
    // Add campaign-specific data for airfare deals
    if (campaign.campaign_type === 'airfare_daily') {
      enhancedHtmlContent = enhancedHtmlContent.replace(/{{destination}}/g, 'Amazing Destinations')
      enhancedHtmlContent = enhancedHtmlContent.replace(/{{price}}/g, '299')
      enhancedHtmlContent = enhancedHtmlContent.replace(/{{origin}}/g, 'Major US Cities')
      enhancedHtmlContent = enhancedHtmlContent.replace(/{{dates}}/g, 'Various dates available')
      enhancedHtmlContent = enhancedHtmlContent.replace(/{{discount}}/g, '40')
      enhancedHtmlContent = enhancedHtmlContent.replace(/{{booking_link}}/g, 'https://maxyourpoints.com/blog')
    }

    const mailjetService = new MailjetService()
    let successCount = 0
    let failedCount = 0
    const errors: string[] = []

    console.log('🚀 Starting bulk email send process')

    // Send emails in batches to avoid rate limits
    const batchSize = 10
    const batches: Subscriber[][] = []
    for (let i = 0; i < subscriberList.length; i += batchSize) {
      batches.push(subscriberList.slice(i, i + batchSize))
    }

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex]
      console.log(`📨 Processing batch ${batchIndex + 1}/${batches.length} (${batch.length} emails)`)

      const batchPromises = batch.map(async (subscriber) => {
        try {
          // Generate personalized unsubscribe URL
          const unsubscribeUrl = `https://maxyourpoints.com/unsubscribe?email=${encodeURIComponent(subscriber.email)}`
          
          // Personalize email content
          const personalizedHtml = enhancedHtmlContent
            .replace(/{{unsubscribe_url}}/g, unsubscribeUrl)
            .replace(/{{subscriber_email}}/g, subscriber.email)

          const result = await mailjetService.sendEmail({
            to: subscriber.email,
            from: process.env.MAILJET_FROM_EMAIL || 'newsletter@maxyourpoints.com',
            subject: campaign.subject,
            html: personalizedHtml,
            text: generateTextVersion(campaign.subject, [])
          })

          // Track analytics
          await supabase
            .from('newsletter_campaign_analytics')
            .insert({
              campaign_id: campaignId,
              subscriber_email: subscriber.email,
              sent_at: new Date().toISOString(),
              status: 'sent'
            })

          return { success: true, email: subscriber.email, messageId: result.messageId }
        } catch (error) {
          console.error(`❌ Failed to send to ${subscriber.email}:`, error)
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          return { success: false, email: subscriber.email, error: errorMessage }
        }
      })

      const batchResults = await Promise.all(batchPromises)
      
      // Count results
      const batchSuccess = batchResults.filter(r => r.success).length
      const batchFailed = batchResults.filter(r => !r.success).length
      
      successCount += batchSuccess
      failedCount += batchFailed
      
      // Collect errors
      batchResults
        .filter(r => !r.success)
        .forEach(r => errors.push(`${r.email}: ${r.error}`))

      console.log(`✅ Batch ${batchIndex + 1} complete: ${batchSuccess} sent, ${batchFailed} failed`)

      // Add delay between batches to respect rate limits
      if (batchIndex < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }

    // Calculate delivery rate
    const totalEmails = subscriberList.length
    const deliveryRate = totalEmails > 0 ? Math.round((successCount / totalEmails) * 100) : 0

    // Update campaign with final status and metrics
    const finalStatus = failedCount === 0 ? 'sent' : 'sent'
    const updateData = {
      status: finalStatus,
      sent_at: new Date().toISOString(),
      recipient_count: totalEmails,
      delivered_count: successCount,
      failed_count: failedCount,
      delivery_rate: deliveryRate,
      updated_at: new Date().toISOString()
    }

    await supabase
      .from('newsletter_campaigns')
      .update(updateData)
      .eq('id', campaignId)

    console.log(`🎉 Campaign send complete!`)
    console.log(`📊 Results: ${successCount} sent, ${failedCount} failed, ${deliveryRate}% delivery rate`)

    if (errors.length > 0) {
      console.log('❌ Errors:', errors.slice(0, 5)) // Log first 5 errors
    }

    return NextResponse.json({
      message: 'Campaign sent successfully',
      campaign_id: campaignId,
      stats: {
        total_emails: totalEmails,
        sent_count: successCount,
        failed_count: failedCount,
        delivery_rate: deliveryRate
      },
      errors: errors.length > 0 ? errors.slice(0, 10) : [] // Return first 10 errors
    })

  } catch (error) {
    console.error('❌ Error in campaign send process:', error)
    
    // Try to reset campaign status if something went wrong
    try {
      const supabase = await createClient()
      const resolvedParams = await params
      await supabase
        .from('newsletter_campaigns')
        .update({ 
          status: 'draft',
          updated_at: new Date().toISOString()
        })
        .eq('id', resolvedParams.id)
    } catch (resetError) {
      console.error('❌ Failed to reset campaign status:', resetError)
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ 
      error: 'Failed to send campaign', 
      details: errorMessage 
    }, { status: 500 })
  }
}

function generateEnhancedEmailContent(
  baseHtml: string, 
  articles: Article[], 
  campaign: any
): string {
  if (!articles || articles.length === 0) {
    return baseHtml.replace(/{{articles}}/g, '<p>No articles selected for this campaign.</p>')
  }

  // Generate article HTML based on campaign type
  const articlesHtml = articles.map(article => {
    const excerpt = article.summary || article.content?.substring(0, 150) + '...' || 'No excerpt available'
    const readMoreUrl = `https://maxyourpoints.com/blog/${article.slug}`
    
    if (campaign.campaign_type === 'weekly') {
      return `
        <div class="article-item">
          <h3 class="article-title">${article.title}</h3>
          <p class="article-excerpt">${excerpt}</p>
          <a href="${readMoreUrl}" class="article-link">Read More →</a>
        </div>
      `
    } else if (campaign.campaign_type === 'airfare_daily') {
      return `
        <div class="article-item">
          <h4 class="article-title">${article.title}</h4>
          <p class="article-excerpt">${excerpt}</p>
          <a href="${readMoreUrl}" class="article-link">Learn More →</a>
        </div>
      `
    } else {
      return `
        <div class="article-item">
          <h3 class="article-title">${article.title}</h3>
          <p class="article-excerpt">${excerpt}</p>
          <a href="${readMoreUrl}" class="article-link">Read More →</a>
        </div>
      `
    }
  }).join('')

  // Replace placeholders in the HTML
  let enhancedHtml = baseHtml.replace(/{{articles}}/g, articlesHtml)
  
  // Replace other dynamic content
  const today = new Date()
  const formattedDate = today.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  })
  
  enhancedHtml = enhancedHtml.replace(/{{date}}/g, formattedDate)
  enhancedHtml = enhancedHtml.replace(/{{campaign_name}}/g, campaign.name)
  
  // Add campaign-specific data for airfare deals
  if (campaign.campaign_type === 'airfare_daily') {
    enhancedHtml = enhancedHtml.replace(/{{destination}}/g, 'Amazing Destinations')
    enhancedHtml = enhancedHtml.replace(/{{price}}/g, '299')
    enhancedHtml = enhancedHtml.replace(/{{origin}}/g, 'Major US Cities')
    enhancedHtml = enhancedHtml.replace(/{{dates}}/g, 'Various dates available')
    enhancedHtml = enhancedHtml.replace(/{{discount}}/g, '40')
    enhancedHtml = enhancedHtml.replace(/{{booking_link}}/g, 'https://maxyourpoints.com/blog')
  }

  return enhancedHtml
}

function generateTextVersion(subject: string, articles: Article[]): string {
  let textContent = `${subject}\n\n`
  
  textContent += 'Max Your Points Newsletter\n'
  textContent += '=========================\n\n'
  
  if (articles && articles.length > 0) {
    textContent += 'Featured Articles:\n\n'
    articles.forEach((article, index) => {
      textContent += `${index + 1}. ${article.title}\n`
      const excerpt = article.summary || article.content?.substring(0, 100) + '...' || ''
      textContent += `   ${excerpt}\n`
      textContent += `   Read more: https://maxyourpoints.com/blog/${article.slug}\n\n`
    })
  }
  
  textContent += '\n---\n'
  textContent += 'Max Your Points\n'
  textContent += 'Making travel dreams affordable, one point at a time.\n'
  textContent += 'Visit: https://maxyourpoints.com\n'
  textContent += 'Unsubscribe: {{unsubscribe_url}}\n'
  
  return textContent
} 