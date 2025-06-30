import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
config({ path: '.env.local' })

async function fixDuplicateCategories() {
  console.log('🔧 Starting duplicate category cleanup...')
  
  try {
    // Create Supabase client with service role for admin operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing environment variables:')
      console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
      console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey)
      throw new Error('Missing required environment variables')
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
    console.log('✅ Connected to Supabase')
    
    // Step 1: Get all categories and identify duplicates
    const { data: allCategories, error: fetchError } = await supabase
      .from('categories')
      .select('*')
      .order('created_at')
    
    if (fetchError) {
      console.error('❌ Error fetching categories:', fetchError)
      return
    }
    
    console.log(`📋 Found ${allCategories?.length || 0} categories:`)
    allCategories?.forEach(cat => {
      console.log(`   • ${cat.name} (${cat.slug}) - ID: ${cat.id}`)
    })
    
    // Step 2: Find categories with similar names
    const travelHacksCategories = allCategories?.filter(cat => 
      cat.name.toLowerCase().includes('travel hack') && 
      cat.name.toLowerCase().includes('deal')
    ) || []
    
    console.log(`\n🔍 Found ${travelHacksCategories.length} Travel Hacks categories:`)
    travelHacksCategories.forEach(cat => {
      console.log(`   • "${cat.name}" (${cat.slug}) - ID: ${cat.id}`)
    })
    
    if (travelHacksCategories.length <= 1) {
      console.log('✅ No duplicate Travel Hacks categories found!')
      return
    }
    
    // Step 3: Determine which is the correct category
    // The correct one should be "Travel Hacks and Deals" (with "and")
    const correctCategory = travelHacksCategories.find(cat => 
      cat.name === 'Travel Hacks and Deals'
    )
    
    const duplicateCategories = travelHacksCategories.filter(cat => 
      cat.id !== correctCategory?.id
    )
    
    if (!correctCategory) {
      console.log('❌ Could not find the correct "Travel Hacks and Deals" category!')
      return
    }
    
    console.log(`\n✅ Correct category: "${correctCategory.name}" (ID: ${correctCategory.id})`)
    console.log(`🗑️  Duplicate categories to remove: ${duplicateCategories.length}`)
    duplicateCategories.forEach(cat => {
      console.log(`   • "${cat.name}" (ID: ${cat.id})`)
    })
    
    // Step 4: Check for articles assigned to duplicate categories
    for (const dupCategory of duplicateCategories) {
      const { data: articles, error: articlesError } = await supabase
        .from('articles')
        .select('id, title, slug')
        .eq('category_id', dupCategory.id)
      
      if (articlesError) {
        console.error(`❌ Error fetching articles for category ${dupCategory.name}:`, articlesError)
        continue
      }
      
      console.log(`\n📄 Articles in "${dupCategory.name}": ${articles?.length || 0}`)
      articles?.forEach(article => {
        console.log(`   • ${article.title} (${article.slug})`)
      })
      
      // Step 5: Update articles to use the correct category
      if (articles && articles.length > 0) {
        console.log(`🔄 Moving ${articles.length} articles to correct category...`)
        
        const { error: updateError } = await supabase
          .from('articles')
          .update({ category_id: correctCategory.id })
          .eq('category_id', dupCategory.id)
        
        if (updateError) {
          console.error(`❌ Error updating articles:`, updateError)
          continue
        }
        
        console.log(`✅ Successfully moved ${articles.length} articles`)
      }
    }
    
    // Step 6: Delete duplicate categories
    for (const dupCategory of duplicateCategories) {
      console.log(`🗑️  Deleting duplicate category: "${dupCategory.name}"`)
      
      const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .eq('id', dupCategory.id)
      
      if (deleteError) {
        console.error(`❌ Error deleting category:`, deleteError)
        continue
      }
      
      console.log(`✅ Successfully deleted "${dupCategory.name}"`)
    }
    
    // Step 7: Verify final state
    const { data: finalCategories, error: finalFetchError } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    
    if (finalFetchError) {
      console.error('❌ Error fetching final categories:', finalFetchError)
      return
    }
    
    console.log(`\n🎉 Cleanup complete! Final categories (${finalCategories?.length || 0}):`)
    finalCategories?.forEach(cat => {
      console.log(`   • ${cat.name} (${cat.slug})`)
    })
    
    // Step 8: Verify articles are properly assigned
    const { data: articlesWithCategory, error: articlesVerifyError } = await supabase
      .from('articles')
      .select(`
        id,
        title,
        category:categories(name, slug)
      `)
      .not('category_id', 'is', null)
    
    if (articlesVerifyError) {
      console.error('❌ Error verifying articles:', articlesVerifyError)
      return
    }
    
    console.log(`\n✅ Verified: ${articlesWithCategory?.length || 0} articles have valid categories`)
    
    // Check for any orphaned articles
    const { data: orphanedArticles, error: orphanError } = await supabase
      .from('articles')
      .select('id, title, slug')
      .is('category_id', null)
    
    if (orphanError) {
      console.error('❌ Error checking orphaned articles:', orphanError)
      return
    }
    
    if (orphanedArticles && orphanedArticles.length > 0) {
      console.log(`⚠️  Found ${orphanedArticles.length} articles without categories:`)
      orphanedArticles.forEach(article => {
        console.log(`   • ${article.title} (${article.slug})`)
      })
    } else {
      console.log('✅ No orphaned articles found')
    }
    
    console.log('\n🎉 Category cleanup complete!')
    
  } catch (error) {
    console.error('💥 Cleanup failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  fixDuplicateCategories()
}

export default fixDuplicateCategories 