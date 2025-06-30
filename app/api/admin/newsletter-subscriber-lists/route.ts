import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { verifyAuthUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('📧 Admin fetching newsletter subscriber lists from database')

    const { data: lists, error } = await supabaseAdmin
      .from('newsletter_subscriber_lists')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Error fetching subscriber lists:', error)
      return NextResponse.json({
        error: 'Failed to fetch subscriber lists',
        lists: []
      }, { status: 500 })
    }

    console.log(`✅ Successfully fetched ${lists?.length || 0} subscriber lists`)

    return NextResponse.json({
      success: true,
      lists: lists || []
    })

  } catch (error: any) {
    console.error('❌ Subscriber lists API error:', error)
    return NextResponse.json({
      error: 'Failed to fetch subscriber lists',
      message: error.message,
      lists: []
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuthUser(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, list_type } = body

    if (!name || !list_type) {
      return NextResponse.json({
        error: 'Name and list_type are required'
      }, { status: 400 })
    }

    console.log('📧 Creating new subscriber list:', name)

    const { data: newList, error } = await supabaseAdmin
      .from('newsletter_subscriber_lists')
      .insert({
        name,
        description,
        list_type,
        is_active: true,
        subscriber_count: 0
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Error creating subscriber list:', error)
      return NextResponse.json({
        error: 'Failed to create subscriber list',
        message: error.message
      }, { status: 500 })
    }

    console.log('✅ Successfully created subscriber list:', newList.id)

    return NextResponse.json({
      success: true,
      list: newList
    })

  } catch (error: any) {
    console.error('❌ Create subscriber list API error:', error)
    return NextResponse.json({
      error: 'Failed to create subscriber list',
      message: error.message
    }, { status: 500 })
  }
} 