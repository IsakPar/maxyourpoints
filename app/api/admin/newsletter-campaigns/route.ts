import { NextRequest, NextResponse } from 'next/server'
import { verifyAuthUser } from '@/lib/auth'
import { supabaseAdmin as supabase } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const user = await verifyAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('📧 Admin fetching newsletter campaigns from database')

    // Temporarily fetch campaigns without article relationships to fix the 500 error
    const { data: campaigns, error } = await supabase
      .from('newsletter_campaigns')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Error fetching campaigns:', error)
      return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 })
    }

    console.log(`✅ Successfully fetched ${campaigns?.length || 0} campaigns`)
    return NextResponse.json({ campaigns: campaigns || [] })

  } catch (error) {
    console.error('❌ Error in newsletter campaigns GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const user = await verifyAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      name, 
      subject, 
      content, 
      html_content, 
      description,
      campaign_type = 'custom',
      template_type = 'custom',
      scheduled_at,
      target_date,
      selected_articles = [],
      send_immediately = false
    } = body

    // Validate required fields
    if (!name || !subject) {
      return NextResponse.json({ 
        error: 'Name and subject are required' 
      }, { status: 400 })
    }

    if (selected_articles.length === 0) {
      return NextResponse.json({ 
        error: 'At least one article must be selected' 
      }, { status: 400 })
    }

    console.log('📝 Creating new campaign:', name, 'with', selected_articles.length, 'articles')

    // Start a transaction to create campaign and associate articles
    const { data: campaign, error: campaignError } = await supabase
      .from('newsletter_campaigns')
      .insert({
        name,
        subject,
        content: content || '',
        html_content,
        description,
        campaign_type,
        template_type,
        scheduled_at: scheduled_at || null,
        target_date: target_date || null,
        status: send_immediately ? 'sending' : 'draft',
        created_by: user.id
      })
      .select()
      .single()

    if (campaignError) {
      console.error('❌ Error creating campaign:', campaignError)
      return NextResponse.json({ 
        error: 'Failed to create campaign' 
      }, { status: 500 })
    }

    // TODO: Associate selected articles with the campaign
    // Note: newsletter_campaign_articles table needs to be created first
    if (selected_articles.length > 0) {
      console.log(`📝 Selected ${selected_articles.length} articles for campaign (table creation pending)`)
      // const articleAssociations = selected_articles.map((articleId: string, index: number) => ({
      //   campaign_id: campaign.id,
      //   article_id: articleId,
      //   position: index
      // }))

      // const { error: articlesError } = await supabase
      //   .from('newsletter_campaign_articles')
      //   .insert(articleAssociations)

      // if (articlesError) {
      //   console.error('❌ Error associating articles:', articlesError)
      //   return NextResponse.json({ 
      //     error: 'Failed to associate articles with campaign' 
      //   }, { status: 500 })
      // }
    }

    console.log('✅ Campaign created successfully:', campaign.id)

    // If send immediately is true, trigger the sending process
    if (send_immediately) {
      // You could trigger the sending process here
      console.log('🚀 Campaign marked for immediate sending')
    }

    return NextResponse.json({ 
      campaign,
      message: 'Campaign created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('❌ Error in newsletter campaigns POST:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify admin access
    const user = await verifyAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      id,
      name, 
      subject, 
      content, 
      html_content, 
      description,
      campaign_type,
      template_type,
      scheduled_at,
      target_date,
      selected_articles = [],
      status
    } = body

    if (!id) {
      return NextResponse.json({ 
        error: 'Campaign ID is required' 
      }, { status: 400 })
    }

    console.log('📝 Updating campaign:', id)

    // Update the campaign
    const { data: campaign, error: campaignError } = await supabase
      .from('newsletter_campaigns')
      .update({
        name,
        subject,
        content,
        html_content,
        description,
        campaign_type,
        template_type,
        scheduled_at,
        target_date,
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (campaignError) {
      console.error('❌ Error updating campaign:', campaignError)
      return NextResponse.json({ 
        error: 'Failed to update campaign' 
      }, { status: 500 })
    }

    // TODO: Update article associations if provided
    // Note: newsletter_campaign_articles table needs to be created first
    if (selected_articles.length > 0) {
      console.log(`📝 Updating campaign with ${selected_articles.length} articles (table creation pending)`)
      // First, remove existing associations
      // await supabase
      //   .from('newsletter_campaign_articles')
      //   .delete()
      //   .eq('campaign_id', id)

      // Then add new associations
      // const articleAssociations = selected_articles.map((articleId: string, index: number) => ({
      //   campaign_id: id,
      //   article_id: articleId,
      //   position: index
      // }))

      // const { error: articlesError } = await supabase
      //   .from('newsletter_campaign_articles')
      //   .insert(articleAssociations)

      // if (articlesError) {
      //   console.error('❌ Error updating article associations:', articlesError)
      //   return NextResponse.json({ 
      //     error: 'Failed to update article associations' 
      //   }, { status: 500 })
      // }
    }

    console.log('✅ Campaign updated successfully:', id)

    return NextResponse.json({ 
      campaign,
      message: 'Campaign updated successfully'
    })

  } catch (error) {
    console.error('❌ Error in newsletter campaigns PUT:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify admin access
    const user = await verifyAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get('id')

    if (!campaignId) {
      return NextResponse.json({ 
        error: 'Campaign ID is required' 
      }, { status: 400 })
    }

    console.log('🗑️ Deleting campaign:', campaignId)

    // The cascade delete should handle article associations
    const { error } = await supabase
      .from('newsletter_campaigns')
      .delete()
      .eq('id', campaignId)

    if (error) {
      console.error('❌ Error deleting campaign:', error)
      return NextResponse.json({ 
        error: 'Failed to delete campaign' 
      }, { status: 500 })
    }

    console.log('✅ Campaign deleted successfully:', campaignId)

    return NextResponse.json({ 
      message: 'Campaign deleted successfully'
    })

  } catch (error) {
    console.error('❌ Error in newsletter campaigns DELETE:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
} 