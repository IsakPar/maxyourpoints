import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/admin/newsletter-campaigns/[id] - Get single campaign
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await context.params
    const { id } = params

    console.log('📧 Admin fetching single campaign:', id)

    const { data: campaign, error } = await supabase
      .from('newsletter_campaigns')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('❌ Error fetching campaign:', error)
      return NextResponse.json({ error: 'Failed to fetch campaign' }, { status: 500 })
    }

    console.log('✅ Successfully fetched campaign')
    return NextResponse.json(campaign)

  } catch (error) {
    console.error('💥 Unexpected error in GET campaign:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/newsletter-campaigns/[id] - Update campaign
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await context.params
    const { id } = params
    const body = await request.json()

    console.log('📧 Admin updating campaign:', id, body)

    // Extract data from request body
    const {
      name,
      subject,
      content,
      description,
      campaign_type,
      template_type,
      scheduled_at,
      target_date,
      html_content,
      selected_articles,
      target_list_id,
      target_all_subscribers
    } = body

    // Update campaign in database
    const { data: campaign, error } = await supabase
      .from('newsletter_campaigns')
      .update({
        name,
        subject,
        content: content || '',
        description: description || '',
        campaign_type,
        template_type,
        scheduled_at: scheduled_at || null,
        target_date: target_date || null,
        html_content,
        target_list_id: target_all_subscribers ? null : target_list_id,
        target_all_subscribers,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('❌ Error updating campaign:', error)
      return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 })
    }

    console.log('✅ Successfully updated campaign')
    return NextResponse.json(campaign)

  } catch (error) {
    console.error('💥 Unexpected error in PUT campaign:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 