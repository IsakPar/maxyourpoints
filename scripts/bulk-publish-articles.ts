import { supabaseAdmin } from '../lib/supabase/server'

async function bulkPublishArticles() {
  console.log('🚀 Bulk Publishing Draft Articles...\n')

  try {
    // Get all draft articles
    const { data: draftArticles, error: fetchError } = await supabaseAdmin
      .from('articles')
      .select('id, title, slug, status')
      .eq('status', 'draft')

    if (fetchError) {
      console.error('❌ Error fetching draft articles:', fetchError)
      return
    }

    if (!draftArticles || draftArticles.length === 0) {
      console.log('✅ No draft articles found')
      return
    }

    console.log(`📄 Found ${draftArticles.length} draft articles:\n`)
    draftArticles.forEach((article, index) => {
      console.log(`${index + 1}. "${article.title}" (${article.slug})`)
    })

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
      return
    }

    console.log(`\n🎉 Successfully published ${updatedArticles?.length || 0} articles!`)
    console.log('\n✅ Your articles are now live at:')
    updatedArticles?.forEach((article) => {
      console.log(`   • http://localhost:3001/blog/${article.slug}`)
    })

    console.log('\n🌐 Try visiting one of these URLs to see your content!')

  } catch (error: any) {
    console.error('❌ Script failed:', error.message)
  }
}

bulkPublishArticles() 