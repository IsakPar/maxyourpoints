import { supabaseAdmin } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    console.log('🚀 Bulk Publishing Draft Articles...\n')

    // Get all draft articles
    const { data: draftArticles, error: fetchError } = await supabaseAdmin
      .from('articles')
      .select('id, title, slug, status')
      .eq('status', 'draft')

    if (fetchError) {
      console.error('❌ Error fetching draft articles:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch draft articles' }, { status: 500 })
    }

    if (!draftArticles || draftArticles.length === 0) {
      return NextResponse.json({ 
        message: 'No draft articles found',
        count: 0,
        articles: []
      })
    }

    console.log(`📄 Found ${draftArticles.length} draft articles`)

    // Update all drafts to published
    const { data: updatedArticles, error: updateError } = await supabaseAdmin
      .from('articles')
      .update({ 
        status: 'published',
        published_at: new Date().toISOString()
      })
      .eq('status', 'draft')
      .select('id, title, slug')

    if (updateError) {
      console.error('❌ Error updating articles:', updateError)
      return NextResponse.json({ error: 'Failed to update articles' }, { status: 500 })
    }

    console.log(`🎉 Successfully published ${updatedArticles?.length || 0} articles!`)

    return NextResponse.json({
      message: `Successfully published ${updatedArticles?.length || 0} articles!`,
      count: updatedArticles?.length || 0,
      articles: updatedArticles?.map(article => ({
        title: article.title,
        slug: article.slug,
        url: `http://localhost:3001/blog/${article.slug}`
      })) || []
    })

  } catch (error: any) {
    console.error('❌ Bulk publish failed:', error.message)
    return NextResponse.json({ 
      error: 'Bulk publish failed', 
      details: error.message 
    }, { status: 500 })
  }
} 