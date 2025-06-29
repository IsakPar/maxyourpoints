import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { verifyAuthUser } from '@/lib/auth'
import { withCache, cacheKeys, cacheTTL, invalidateArticleCache } from '@/lib/cache'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam, 10) : null
    const offset = parseInt(searchParams.get('offset') || '0', 10)
    const category = searchParams.get('category')
    const published = searchParams.get('published')

    console.log(`📄 Fetching articles: limit=${limit || 'ALL'}, published=${published}`)

    // Generate cache key based on parameters
    let cacheKey: string
    if (category) {
      cacheKey = cacheKeys.articles.byCategory(category, limit || undefined)
    } else {
      cacheKey = cacheKeys.articles.all(limit || undefined, published === 'true' ? true : published === 'false' ? false : undefined)
    }

    // Use cache for article fetching
    const result = await withCache(
      cacheKey,
      async () => {
        console.log('🔄 Cache miss - fetching from database')
        
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

        // Only apply range if limit is specified (for pagination)
        if (limit !== null) {
          query = query.range(offset, offset + limit - 1)
        }

        // Add filters
        if (published === 'true') {
          query = query.eq('status', 'published')
        } else if (published === 'false') {
          query = query.neq('status', 'published')
        }

        if (category) {
          // Get category ID from slug (also cached)
          const categoryData = await withCache(
            cacheKeys.categories.byId(category),
            async () => {
              const { data } = await supabaseAdmin
                .from('categories')
                .select('id')
                .eq('slug', category)
                .single()
              return data
            },
            cacheTTL.categories
          )
          
          if (categoryData) {
            query = query.eq('category_id', categoryData.id)
          }
        }

        const { data: articles, error } = await query

        if (error) {
          throw new Error(`Database error: ${error.message}`)
        }

        return {
          articles: articles || [],
          total: (articles || []).length,
          hasMore: limit !== null ? (articles || []).length === limit : false
        }
      },
      cacheTTL.articles
    )

    console.log(`✅ Found ${result.articles.length} articles (${result.articles.length > 0 ? 'cached' : 'fresh'})`)

    return NextResponse.json(result)

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
    // PHASE 1: Re-enabled authentication for article creation
    const authUser = await verifyAuthUser(request)
    
    // For development, allow fallback if auth fails
    let user
    if (!authUser && process.env.NODE_ENV === 'development') {
      console.warn('⚠️ No authenticated user, using fallback for development')
      // Get any admin user from database as fallback
      const { data: fallbackUser } = await supabaseAdmin
        .from('users')
        .select('id, email, role')
        .eq('role', 'admin')
        .limit(1)
        .single()
      
      user = fallbackUser || { id: null, email: 'system@example.com', role: 'admin' }
    } else if (!authUser) {
      return NextResponse.json({
        error: 'Unauthorized',
        message: 'Authentication required to create articles'
      }, { status: 401 })
    } else {
      // Check if user has permission to create articles
      if (!['admin', 'editor', 'author'].includes(authUser.role)) {
        return NextResponse.json({
          error: 'Forbidden',
          message: 'Insufficient permissions to create articles'
        }, { status: 403 })
      }
      user = authUser
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
        author_id: user.id, // Use real user ID if available
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

    // Invalidate article cache
    invalidateArticleCache(newArticle.id, newArticle.category_id)

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