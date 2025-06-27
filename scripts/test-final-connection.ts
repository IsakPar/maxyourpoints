#!/usr/bin/env tsx

/**
 * Final Database Connection Test
 * Run this after creating the schema in Supabase
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

async function testFinalConnection() {
  console.log('🎯 Final Database Connection Test\n')

  try {
    const { supabaseAdmin } = await import('../lib/supabase/server')

    // Test 1: Check if tables exist and have data
    console.log('1️⃣ Testing articles table...')
    const { data: articles, error: articlesError } = await supabaseAdmin
      .from('articles')
      .select('id, title, status')
      .limit(5)

    if (articlesError) {
      console.log(`   ❌ Articles error: ${articlesError.message}`)
    } else {
      console.log(`   ✅ Articles table working! Found ${articles.length} articles`)
      if (articles.length > 0) {
        console.log(`   📄 Sample: "${articles[0].title}" (${articles[0].status})`)
      }
    }

    // Test 2: Check categories
    console.log('\n2️⃣ Testing categories table...')
    const { data: categories, error: categoriesError } = await supabaseAdmin
      .from('categories')
      .select('id, name, slug')
      .limit(5)

    if (categoriesError) {
      console.log(`   ❌ Categories error: ${categoriesError.message}`)
    } else {
      console.log(`   ✅ Categories table working! Found ${categories.length} categories`)
      if (categories.length > 0) {
        console.log(`   📂 Sample: "${categories[0].name}" (${categories[0].slug})`)
      }
    }

    // Test 3: Check users
    console.log('\n3️⃣ Testing users table...')
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id, email, role')
      .limit(5)

    if (usersError) {
      console.log(`   ❌ Users error: ${usersError.message}`)
    } else {
      console.log(`   ✅ Users table working! Found ${users.length} users`)
      if (users.length > 0) {
        console.log(`   👤 Sample: "${users[0].email}" (${users[0].role})`)
      }
    }

    // Test 4: Try creating a test article
    console.log('\n4️⃣ Testing create operation...')
    try {
      const { data: newArticle, error: createError } = await supabaseAdmin
        .from('articles')
        .insert({
          title: 'Test Article from Connection Script',
          slug: 'test-article-' + Date.now(),
          content: 'This is a test article created by the connection test script.',
          summary: 'Test article summary',
          status: 'draft'
        })
        .select()
        .single()

      if (createError) {
        console.log(`   ❌ Create error: ${createError.message}`)
      } else {
        console.log(`   ✅ Create operation successful!`)
        console.log(`   📝 Created article: "${newArticle.title}"`)

        // Clean up - delete the test article
        await supabaseAdmin
          .from('articles')
          .delete()
          .eq('id', newArticle.id)
        
        console.log(`   🧹 Test article cleaned up`)
      }
    } catch (err: any) {
      console.log(`   ❌ Create test failed: ${err.message}`)
    }

    console.log('\n🎉 Database test completed successfully!')
    console.log('\n🚀 Your Supabase database is ready to use!')
    console.log('\nNext steps:')
    console.log('   - Visit your frontend: http://localhost:3000')
    console.log('   - Visit admin panel: http://localhost:3000/admin')
    console.log('   - Start creating content!')

  } catch (error: any) {
    console.log(`❌ Test failed: ${error.message}`)
    console.log('\nTroubleshooting:')
    console.log('   - Make sure you ran the SQL schema in Supabase')
    console.log('   - Check your environment variables')
    console.log('   - Verify your Supabase project is active')
  }
}

if (require.main === module) {
  testFinalConnection().catch(console.error)
} 