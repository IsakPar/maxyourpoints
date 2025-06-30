const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

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
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, '../database/analytics-system.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')
    
    console.log('📊 Creating analytics tables...')
    
    // Split SQL into individual statements and execute them
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0)
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim()
      if (statement) {
        try {
          console.log(`Executing statement ${i + 1}/${statements.length}...`)
          const { error } = await supabase.rpc('exec', { sql: statement + ';' })
          
          if (error) {
            if (error.message?.includes('already exists') || 
                error.message?.includes('already defined') ||
                error.code === '42P07' || // relation already exists
                error.code === '42723') { // function already exists
              console.log('⚠️ Object already exists, skipping...')
            } else {
              console.error('SQL Error:', error.message)
            }
          }
        } catch (err) {
          if (err.message?.includes('already exists')) {
            console.log('⚠️ Object already exists, skipping...')
          } else {
            console.error('Execution error:', err.message)
          }
        }
      }
    }
    
    // Test the tables were created
    console.log('🔍 Verifying analytics tables...')
    
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['article_analytics', 'analytics_events', 'newsletter_analytics', 'site_analytics_daily'])
    
    if (tableError) {
      console.error('❌ Error checking tables:', tableError.message)
    } else {
      const tableNames = tables.map(t => t.table_name)
      console.log('✅ Found analytics tables:', tableNames)
      
      if (tableNames.length >= 4) {
        console.log('🎉 Analytics system setup complete!')
        console.log('📈 You can now access the analytics dashboard at /admin/analytics')
      } else {
        console.log('⚠️ Some tables may be missing. Manual setup may be required.')
      }
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    process.exit(1)
  }
}

setupAnalytics() 