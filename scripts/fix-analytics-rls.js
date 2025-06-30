const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixAnalyticsRLS() {
  console.log('🔧 Fixing Analytics RLS Policies...')
  console.log('📊 This will allow analytics tracking to work properly')
  
  try {
    // Test if we can insert into page_views first
    console.log('\n🧪 Testing current analytics table access...')
    
    const testData = {
      page_path: '/test',
      page_title: 'Test Page',
      session_id: 'test-session-' + Date.now(),
      timestamp: new Date().toISOString(),
      device_type: 'desktop',
      browser: 'test',
      os: 'test'
    }
    
    const { data: testInsert, error: testError } = await supabase
      .from('page_views')
      .insert(testData)
      .select()
    
    if (testError) {
      console.log('❌ Current issue with page_views table:', testError.message)
      console.log('📝 This confirms RLS is blocking inserts')
    } else {
      console.log('✅ Analytics tables are already accessible!')
      console.log('🎯 The issue might be elsewhere. Let me check...')
      
      // Clean up test data
      if (testInsert && testInsert[0]) {
        await supabase.from('page_views').delete().eq('id', testInsert[0].id)
      }
      return
    }

    console.log('\n🔑 Creating analytics access policies...')
    
    // Create a comprehensive SQL script to fix analytics
    const sqlScript = `
      -- Disable RLS for analytics tables (they don't contain sensitive data)
      ALTER TABLE IF EXISTS page_views DISABLE ROW LEVEL SECURITY;
      ALTER TABLE IF EXISTS performance_metrics DISABLE ROW LEVEL SECURITY;
      ALTER TABLE IF EXISTS error_logs DISABLE ROW LEVEL SECURITY;
      ALTER TABLE IF EXISTS user_sessions DISABLE ROW LEVEL SECURITY;
      ALTER TABLE IF EXISTS analytics_events DISABLE ROW LEVEL SECURITY;
      ALTER TABLE IF EXISTS article_analytics DISABLE ROW LEVEL SECURITY;
      
      -- Enable RLS and create permissive policies as backup
      ALTER TABLE IF EXISTS page_views ENABLE ROW LEVEL SECURITY;
      ALTER TABLE IF EXISTS performance_metrics ENABLE ROW LEVEL SECURITY;
      ALTER TABLE IF EXISTS error_logs ENABLE ROW LEVEL SECURITY;
      ALTER TABLE IF EXISTS user_sessions ENABLE ROW LEVEL SECURITY;
      ALTER TABLE IF EXISTS analytics_events ENABLE ROW LEVEL SECURITY;
      ALTER TABLE IF EXISTS article_analytics ENABLE ROW LEVEL SECURITY;
      
      -- Create permissive policies
      CREATE POLICY IF NOT EXISTS "Enable all operations for page_views" ON page_views FOR ALL USING (true) WITH CHECK (true);
      CREATE POLICY IF NOT EXISTS "Enable all operations for performance_metrics" ON performance_metrics FOR ALL USING (true) WITH CHECK (true);
      CREATE POLICY IF NOT EXISTS "Enable all operations for error_logs" ON error_logs FOR ALL USING (true) WITH CHECK (true);
      CREATE POLICY IF NOT EXISTS "Enable all operations for user_sessions" ON user_sessions FOR ALL USING (true) WITH CHECK (true);
      CREATE POLICY IF NOT EXISTS "Enable all operations for analytics_events" ON analytics_events FOR ALL USING (true) WITH CHECK (true);
      CREATE POLICY IF NOT EXISTS "Enable all operations for article_analytics" ON article_analytics FOR ALL USING (true) WITH CHECK (true);
    `
    
    console.log('📝 SQL Script to run in Supabase Dashboard:')
    console.log('🔗 Go to: https://supabase.com/dashboard > SQL Editor')
    console.log('\n--- COPY AND PASTE THE SQL BELOW ---')
    console.log(sqlScript)
    console.log('--- END OF SQL ---\n')

    // Try a different approach - test each table individually
    const tables = ['page_views', 'performance_metrics', 'error_logs', 'user_sessions', 'analytics_events']
    
    for (const tableName of tables) {
      try {
        console.log(`🧪 Testing ${tableName} access...`)
        const { error } = await supabase.from(tableName).select('*').limit(1)
        
        if (error) {
          console.log(`❌ ${tableName}: ${error.message}`)
        } else {
          console.log(`✅ ${tableName}: Read access OK`)
        }
      } catch (err) {
        console.log(`❌ ${tableName}: ${err.message}`)
      }
    }

    console.log('\n📋 Manual steps required:')
    console.log('1. Go to your Supabase dashboard')
    console.log('2. Navigate to SQL Editor')
    console.log('3. Copy and paste the SQL script above')
    console.log('4. Run the script')
    console.log('5. Restart your development server')
    
  } catch (error) {
    console.error('❌ Error during RLS fix:', error)
    console.log('\n🔧 Manual fix required. Please run this SQL in your Supabase dashboard:')
    console.log(`
      ALTER TABLE page_views DISABLE ROW LEVEL SECURITY;
      ALTER TABLE performance_metrics DISABLE ROW LEVEL SECURITY;
      ALTER TABLE error_logs DISABLE ROW LEVEL SECURITY;
      ALTER TABLE user_sessions DISABLE ROW LEVEL SECURITY;
      ALTER TABLE analytics_events DISABLE ROW LEVEL SECURITY;
      ALTER TABLE article_analytics DISABLE ROW LEVEL SECURITY;
    `)
  }
}

// Execute the function
fixAnalyticsRLS() 