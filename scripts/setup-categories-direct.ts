#!/usr/bin/env tsx

// Load environment variables FIRST
import { config } from 'dotenv'
config({ path: '.env.local' })

// Import Supabase directly to avoid module-level env var checks
import { createClient } from '@supabase/supabase-js'

const DEFAULT_CATEGORIES = [
  {
    name: 'Airlines & Aviation',
    slug: 'airlines-and-aviation',
    description: 'Everything about airlines, routes, aircraft, and aviation industry insights',
    color: '#0f766e'
  },
  {
    name: 'Credit Cards & Points',
    slug: 'credit-cards-and-points',
    description: 'Credit card reviews, points strategies, and maximizing rewards',
    color: '#dc2626'
  },
  {
    name: 'Hotels & Trip Reports',
    slug: 'hotels-and-trip-reports',
    description: 'Hotel reviews, trip reports, and accommodation insights',
    color: '#7c3aed'
  },
  {
    name: 'Travel Hacks & Deals',
    slug: 'travel-hacks-and-deals',
    description: 'Travel tips, deals, hacks, and money-saving strategies',
    color: '#ea580c'
  }
]

async function setupCategories() {
  console.log('🏗️  Setting up initial categories...')
  
  try {
    // Create Supabase client with service role for admin operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required environment variables')
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
    console.log('✅ Connected to Supabase')
    
    // Check if categories already exist
    const { data: existingCategories, error: fetchError } = await supabase
      .from('categories')
      .select('name')
    
    if (fetchError) {
      console.error('❌ Error fetching categories:', fetchError)
      return
    }
    
    const existingNames = existingCategories?.map(c => c.name) || []
    console.log(`📋 Found ${existingNames.length} existing categories:`, existingNames)
    
    // Insert only categories that don't exist
    const newCategories = DEFAULT_CATEGORIES.filter(
      cat => !existingNames.includes(cat.name)
    )
    
    if (newCategories.length === 0) {
      console.log('✅ All categories already exist!')
      return
    }
    
    console.log(`➕ Adding ${newCategories.length} new categories:`, newCategories.map(c => c.name))
    
    const { data: insertedCategories, error: insertError } = await supabase
      .from('categories')
      .insert(newCategories)
      .select()
    
    if (insertError) {
      console.error('❌ Error inserting categories:', insertError)
      return
    }
    
    console.log('✅ Categories successfully created!')
    console.log('📝 Categories summary:')
    
    // Fetch all categories to show final state
    const { data: allCategories } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    
    allCategories?.forEach(cat => {
      console.log(`   • ${cat.name} (${cat.slug})`)
    })
    
    console.log('\n🎉 Category setup complete!')
    
  } catch (error) {
    console.error('💥 Setup failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  setupCategories()
} 