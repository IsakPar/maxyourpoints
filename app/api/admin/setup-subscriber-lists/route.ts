import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { verifyAuthUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const user = await verifyAuthUser(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔧 Setting up newsletter subscriber lists...')

    // Create subscriber lists table
    const { error: listsTableError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS newsletter_subscriber_lists (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(255) NOT NULL,
          description TEXT,
          list_type VARCHAR(50) NOT NULL,
          is_active BOOLEAN DEFAULT true,
          subscriber_count INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (listsTableError) {
      console.error('❌ Error creating lists table:', listsTableError)
    }

    // Create junction table
    const { error: membersTableError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS newsletter_subscriber_list_members (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          subscriber_id UUID REFERENCES newsletter_subscribers(id) ON DELETE CASCADE,
          list_id UUID REFERENCES newsletter_subscriber_lists(id) ON DELETE CASCADE,
          subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(subscriber_id, list_id)
        );
      `
    })

    if (membersTableError) {
      console.error('❌ Error creating members table:', membersTableError)
    }

    // Add columns to campaigns table
    const { error: campaignColumnsError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        ALTER TABLE newsletter_campaigns 
        ADD COLUMN IF NOT EXISTS target_list_id UUID,
        ADD COLUMN IF NOT EXISTS target_all_subscribers BOOLEAN DEFAULT true;
      `
    })

    if (campaignColumnsError) {
      console.error('❌ Error adding campaign columns:', campaignColumnsError)
    }

    // Insert default lists directly using Supabase client
    const { data: existingLists } = await supabaseAdmin
      .from('newsletter_subscriber_lists')
      .select('list_type')

    const existingTypes = new Set(existingLists?.map(l => l.list_type) || [])

    const defaultLists = [
      {
        name: 'Airfare Daily Alerts',
        description: 'Daily alerts for flight deals and airfare promotions',
        list_type: 'airfare_daily'
      },
      {
        name: 'Weekly Newsletter',
        description: 'Weekly roundup of the best travel content and tips',
        list_type: 'weekly_newsletter'
      },
      {
        name: 'Monthly Travel Roundup',
        description: 'Monthly digest of travel insights, reviews, and strategies',
        list_type: 'monthly_roundup'
      }
    ]

    const listsToInsert = defaultLists.filter(list => !existingTypes.has(list.list_type))

    if (listsToInsert.length > 0) {
      const { error: insertListsError } = await supabaseAdmin
        .from('newsletter_subscriber_lists')
        .insert(listsToInsert)

      if (insertListsError) {
        console.error('❌ Error inserting default lists:', insertListsError)
      } else {
        console.log(`✅ Inserted ${listsToInsert.length} default lists`)
      }
    }

    // Get all confirmed subscribers and weekly newsletter list
    const { data: subscribers } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('id')
      .eq('status', 'confirmed')

    const { data: weeklyList } = await supabaseAdmin
      .from('newsletter_subscriber_lists')
      .select('id')
      .eq('list_type', 'weekly_newsletter')
      .single()

    // Subscribe all confirmed subscribers to weekly newsletter by default
    if (subscribers && weeklyList && subscribers.length > 0) {
      const memberships = subscribers.map(sub => ({
        subscriber_id: sub.id,
        list_id: weeklyList.id
      }))

      const { error: membershipError } = await supabaseAdmin
        .from('newsletter_subscriber_list_members')
        .upsert(memberships, { onConflict: 'subscriber_id,list_id', ignoreDuplicates: true })

      if (membershipError) {
        console.error('❌ Error creating memberships:', membershipError)
      } else {
        console.log(`✅ Added ${subscribers.length} subscribers to weekly newsletter`)
      }
    }

    // Update subscriber counts
    const { data: lists } = await supabaseAdmin
      .from('newsletter_subscriber_lists')
      .select('id')

    if (lists) {
      for (const list of lists) {
        const { count } = await supabaseAdmin
          .from('newsletter_subscriber_list_members')
          .select('*', { count: 'exact', head: true })
          .eq('list_id', list.id)

        await supabaseAdmin
          .from('newsletter_subscriber_lists')
          .update({ subscriber_count: count || 0 })
          .eq('id', list.id)
      }
    }

    console.log('✅ Newsletter subscriber lists setup complete!')

    return NextResponse.json({
      success: true,
      message: 'Newsletter subscriber lists setup complete!',
      listsCreated: listsToInsert.length,
      subscribersAdded: subscribers?.length || 0
    })

  } catch (error: any) {
    console.error('❌ Setup error:', error)
    return NextResponse.json({
      error: 'Failed to setup subscriber lists',
      message: error.message
    }, { status: 500 })
  }
} 