import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyAuthUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    
    console.log('📧 Admin fetching newsletter templates from database')

    const { data: templates, error } = await supabase
      .from('newsletter_templates')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 })
    }

    console.log(`✅ Successfully fetched ${templates?.length || 0} templates`)

    return NextResponse.json({ 
      templates: templates || [],
      count: templates?.length || 0
    })

  } catch (error) {
    console.error('❌ Error in newsletter templates API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, subject, content, html_content, type } = body

    if (!name || !subject || !content) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, subject, content' 
      }, { status: 400 })
    }

    const supabase = await createClient()

    console.log('📧 Creating new newsletter template:', name)

    const templateData = {
      name,
      subject,
      content,
      html_content: html_content || content,
      type: type || 'custom',
      created_by: user.id
    }

    const { data: template, error } = await supabase
      .from('newsletter_templates')
      .insert([templateData])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to create template' }, { status: 500 })
    }

    console.log(`✅ Template created successfully: ${template.id}`)

    return NextResponse.json({ 
      template,
      message: 'Template created successfully'
    })

  } catch (error) {
    console.error('❌ Error creating template:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await verifyAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, subject, content, html_content, type, description } = body

    if (!id) {
      return NextResponse.json({ 
        error: 'Template ID is required for updates' 
      }, { status: 400 })
    }

    if (!name || !html_content) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, html_content' 
      }, { status: 400 })
    }

    // Validate template type - only allow valid database types
    const validTypes = ['weekly', 'airfare_daily', 'custom', 'welcome']
    const templateType = type && validTypes.includes(type) ? type : 'custom'

    const supabase = await createClient()

    console.log('📧 Updating newsletter template:', id)

    const templateData = {
      name,
      subject: subject || name,
      content: content || html_content.substring(0, 500) + '...', // Extract text preview
      html_content,
      type: templateType
    }

    const { data: template, error } = await supabase
      .from('newsletter_templates')
      .update(templateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to update template' }, { status: 500 })
    }

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    console.log(`✅ Template updated successfully: ${template.id}`)

    return NextResponse.json({ 
      template,
      message: 'Template updated successfully'
    })

  } catch (error) {
    console.error('❌ Error updating template:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ 
        error: 'Template ID is required for deletion' 
      }, { status: 400 })
    }

    const supabase = await createClient()

    console.log('📧 Deleting newsletter template:', id)

    const { error } = await supabase
      .from('newsletter_templates')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 })
    }

    console.log(`✅ Template deleted successfully: ${id}`)

    return NextResponse.json({ 
      message: 'Template deleted successfully'
    })

  } catch (error) {
    console.error('❌ Error deleting template:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 