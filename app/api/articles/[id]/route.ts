import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    console.log(`📄 Fetching article: ${id}`)

    // Try to find by slug first, then by ID  
    let { data: article, error } = await supabaseAdmin
      .from('articles')
      .select(`
        id,
        title,
        slug,
        summary,
        content,
        hero_image_url,
        hero_image_alt,
        category_id,
        status,
        published_at,
        featured_main,
        featured_category,
        meta_description,
        focus_keyword,
        tags,
        created_at,
        updated_at,
        categories (
          id,
          name,
          slug,
          description
        )
      `)
      .eq('slug', id)
      .single()

    // If not found by slug, try by ID
    if (error && error.code === 'PGRST116') {
      const result = await supabaseAdmin
        .from('articles')
        .select(`
          id,
          title,
          slug,
          summary,
          content,
          hero_image_url,
          hero_image_alt,
          category_id,
          status,
          published_at,
          featured_main,
          featured_category,
          meta_description,
          focus_keyword,
          tags,
          created_at,
          updated_at,
          categories (
            id,
            name,
            slug,
            description
          )
        `)
        .eq('id', id)
        .single()
        
      article = result.data
      error = result.error
    }

    if (error || !article) {
      console.log(`❌ Article not found: ${id}`)
      return NextResponse.json({
        error: 'Article not found'
      }, { status: 404 })
    }

    // Transform data to match expected format
    const transformedArticle = {
      id: article.id,
      title: article.title,
      slug: article.slug,
      summary: article.summary,
      excerpt: article.summary,
      content: article.content,
      featuredImage: article.hero_image_url,
      hero_image_url: article.hero_image_url,
      categoryId: article.category_id,
      category: article.categories,
      published: article.status === 'published',
      featured: article.featured_main || false,
      createdAt: article.created_at,
      updatedAt: article.updated_at,
      publishedAt: article.published_at,
      metaDescription: article.meta_description,
      tags: article.tags || [],
      authorName: 'Max Your Points'
    }

    console.log(`✅ Found article: ${article.title}`)

    return NextResponse.json(transformedArticle)

  } catch (error: any) {
    console.error('Get article API error:', error)
    return NextResponse.json({
      error: 'Failed to fetch article',
      message: error.message
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const articleData = await request.json()

    console.log(`📝 Updating article: ${id}`)

    // Update article in Supabase
    const { data: updatedArticle, error } = await supabaseAdmin
      .from('articles')
      .update({
        title: articleData.title,
        slug: articleData.slug,
        summary: articleData.summary,
        content: articleData.content,
        hero_image_url: articleData.hero_image_url || null,
        hero_image_alt: articleData.hero_image_alt || null,
        category_id: articleData.category_id,
        status: articleData.status,
        published_at: articleData.status === 'published' ? new Date().toISOString() : null,
        featured_main: articleData.featured_main || false,
        featured_category: articleData.featured_category || false,
        meta_description: articleData.meta_description || null,
        focus_keyword: articleData.focus_keyword || null,
        tags: articleData.tags || [],
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update article error:', error)
      throw error
    }

    console.log(`✅ Article updated successfully: ${id}`)

    return NextResponse.json({
      success: true,
      article: updatedArticle
    })

  } catch (error: any) {
    console.error('Update article API error:', error)
    return NextResponse.json({
      error: 'Failed to update article',
      message: error.message
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    console.log(`🗑️ Deleting article: ${id}`)

    const { error } = await supabaseAdmin
      .from('articles')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Delete article error:', error)
      throw error
    }

    console.log(`✅ Article deleted successfully: ${id}`)

    return NextResponse.json({
      success: true,
      message: 'Article deleted successfully'
    })

  } catch (error: any) {
    console.error('Delete article API error:', error)
    return NextResponse.json({
      error: 'Failed to delete article',
      message: error.message
    }, { status: 500 })
  }
} 