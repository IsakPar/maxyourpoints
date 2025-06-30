#!/usr/bin/env tsx

import { supabaseAdmin } from '../lib/supabase/server'

async function markArticlesFeatured() {
  try {
    console.log('🌟 Marking published articles as featured...')

    // Get all published articles
    const { data: articles, error } = await supabaseAdmin
      .from('articles')
      .select('id, title, status')
      .eq('status', 'published')

    if (error) {
      throw error
    }

    console.log(`📄 Found ${articles?.length || 0} published articles`)

    if (!articles || articles.length === 0) {
      console.log('❌ No published articles found to mark as featured')
      return
    }

    // Mark the first 6 articles as featured on main page
    const mainFeaturedIds = articles.slice(0, 6).map(a => a.id)
    
    // Mark the first 3 articles as featured on category pages too
    const categoryFeaturedIds = articles.slice(0, 3).map(a => a.id)

    // Update main featured articles
    if (mainFeaturedIds.length > 0) {
      const { error: mainError } = await supabaseAdmin
        .from('articles')
        .update({ featured_main: true })
        .in('id', mainFeaturedIds)

      if (mainError) {
        console.error('❌ Error marking articles as main featured:', mainError)
      } else {
        console.log(`✅ Marked ${mainFeaturedIds.length} articles as featured on main page`)
      }
    }

    // Update category featured articles
    if (categoryFeaturedIds.length > 0) {
      const { error: categoryError } = await supabaseAdmin
        .from('articles')
        .update({ featured_category: true })
        .in('id', categoryFeaturedIds)

      if (categoryError) {
        console.error('❌ Error marking articles as category featured:', categoryError)
      } else {
        console.log(`✅ Marked ${categoryFeaturedIds.length} articles as featured on category pages`)
      }
    }

    // Show which articles were marked
    console.log('\n🎯 Featured articles:')
    articles.slice(0, 6).forEach((article, index) => {
      const mainFeatured = index < 6 ? '🏠 Main' : ''
      const categoryFeatured = index < 3 ? '📑 Category' : ''
      console.log(`   - ${article.title} ${mainFeatured} ${categoryFeatured}`)
    })

    console.log('\n🎉 Articles marked as featured successfully!')
    
  } catch (error) {
    console.error('❌ Error marking articles as featured:', error)
    process.exit(1)
  }
}

// Run the script
markArticlesFeatured()
  .then(() => {
    console.log('✅ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  }) 