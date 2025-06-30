const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

async function setupAnalytics() {
  try {
    console.log('🗄️ Setting up Max Your Points Analytics System...')
    console.log('📊 This will create analytics tables in your Supabase database')
    
    // Check if tables already exist by trying to select from them
    console.log('🔍 Checking for existing analytics tables...')
    
    const { data: existingAnalytics, error: analyticsError } = await supabase
      .from('article_analytics')
      .select('id')
      .limit(1)
    
    if (!analyticsError) {
      console.log('✅ Analytics tables already exist!')
      console.log('📈 You can access the analytics dashboard at /admin/analytics')
      return
    }
    
    console.log('📋 Analytics tables not found. Creating them now...')
    console.log('')
    console.log('🚨 IMPORTANT: Please run the following SQL in your Supabase dashboard:')
    console.log('   1. Go to your Supabase project dashboard')
    console.log('   2. Navigate to SQL Editor')
    console.log('   3. Copy and paste the SQL from database/analytics-system.sql')
    console.log('   4. Click "Run" to execute the SQL')
    console.log('')
    console.log('📄 SQL file location: database/analytics-system.sql')
    console.log('')
    console.log('🔗 Quick link: https://supabase.com/dashboard/project/[YOUR_PROJECT_ID]/sql')
    console.log('')
    
    // Show the user their project URL
    const projectId = supabaseUrl.split('//')[1].split('.')[0]
    console.log(`🔗 Your specific SQL Editor: https://supabase.com/dashboard/project/${projectId}/sql`)
    console.log('')
    
    console.log('⚡ Once you\'ve run the SQL, your analytics dashboard will be available at:')
    console.log('   /admin/analytics')
    console.log('')
    console.log('🎯 What you\'ll get:')
    console.log('   • Real-time visitor tracking')
    console.log('   • Article performance analytics')
    console.log('   • Newsletter conversion tracking')
    console.log('   • Traffic source analysis')
    console.log('   • Reading behavior insights')
    
  } catch (error) {
    console.error('❌ Setup check failed:', error.message)
  }
}

setupAnalytics() 