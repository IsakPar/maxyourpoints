import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { verifyAuthUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)
    const category = searchParams.get('category')
    const published = searchParams.get('published')

    console.log(`📄 Fetching articles: limit=${limit}, published=${published}`)

    // Build query with category join
    let query = supabaseAdmin
      .from('articles')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Add filters
    if (published === 'true') {
      query = query.eq('status', 'published')
    } else if (published === 'false') {
      query = query.neq('status', 'published')
    }

    if (category) {
      // Get category ID from slug
      const { data: categoryData } = await supabaseAdmin
        .from('categories')
        .select('id')
        .eq('slug', category)
        .single()
      
      if (categoryData) {
        query = query.eq('category_id', categoryData.id)
      }
    }

    const { data: articles, error } = await query

    if (error) {
      console.error('❌ Supabase error:', error)
      return NextResponse.json({
        error: 'Database error',
        message: error.message,
        articles: [],
        total: 0,
        hasMore: false
      }, { status: 500 })
    }

    console.log(`✅ Found ${(articles || []).length} articles`)

    return NextResponse.json({
      articles: articles || [],
      total: (articles || []).length,
      hasMore: (articles || []).length === limit
    })

  } catch (error: any) {
    console.error('❌ Articles API error:', error)
    return NextResponse.json({
      error: 'Failed to fetch articles',
      message: error.message,
      articles: [],
      total: 0,
      hasMore: false
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication and admin role
    const user = await verifyAuthUser(request)
    
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return NextResponse.json({
        error: 'Unauthorized',
        message: 'Admin access required to create articles'
      }, { status: 401 })
    }

    const articleData = await request.json()

    console.log('📝 Creating new article:', articleData.title, 'by user:', user.email)

    // Validate required fields
    if (!articleData.title || !articleData.slug || !articleData.summary || !articleData.content || !articleData.category_id) {
      return NextResponse.json({
        error: 'Missing required fields',
        message: 'Title, slug, summary, content, and category_id are required'
      }, { status: 400 })
    }

    // Insert article into Supabase with author information
    const { data: newArticle, error } = await supabaseAdmin
      .from('articles')
      .insert({
        title: articleData.title,
        slug: articleData.slug,
        summary: articleData.summary,
        content: articleData.content,
        hero_image_url: articleData.hero_image_url || null,
        hero_image_alt: articleData.hero_image_alt || null,
        category_id: articleData.category_id,
        status: articleData.status || 'draft',
        published_at: articleData.status === 'published' ? new Date().toISOString() : null,
        featured_main: articleData.featured_main || false,
        featured_category: articleData.featured_category || false,
        meta_description: articleData.meta_description || null,
        focus_keyword: articleData.focus_keyword || null,
        tags: articleData.tags || [],
        author_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Create article error:', error)
      return NextResponse.json({
        error: 'Failed to create article',
        message: error.message
      }, { status: 500 })
    }

    console.log('✅ Article created successfully:', newArticle.id)

    return NextResponse.json({
      success: true,
      article: newArticle
    })

  } catch (error: any) {
    console.error('❌ Create article API error:', error)
    return NextResponse.json({
      error: 'Failed to create article',
      message: error.message
    }, { status: 500 })
  }
} 