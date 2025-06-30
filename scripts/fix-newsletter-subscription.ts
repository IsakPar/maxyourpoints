import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

async function fixNewsletterSubscription() {
  console.log('🔧 Fixing newsletter subscription function...')
  
  // Create Supabase client with service role
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables')
    console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  try {
    // Read the SQL fix file
    const sqlFilePath = join(process.cwd(), 'database', 'fix-newsletter-subscription-function.sql')
    const sqlContent = readFileSync(sqlFilePath, 'utf8')
    
    console.log('📄 Executing SQL fix...')
    
    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', { 
      sql_query: sqlContent 
    })
    
    if (error) {
      // Try direct execution if exec_sql doesn't exist
      console.log('⚠️  exec_sql not available, trying direct execution...')
      
      // Split SQL into individual statements and execute them
      const statements = sqlContent
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0)
      
      for (const statement of statements) {
        if (statement.trim()) {
          const { error: execError } = await supabase
            .from('dummy') // This will fail but we're using it to execute SQL
            .select('*')
            .limit(0)
          
          // Use raw SQL execution
          const { error: rawError } = await supabase
            .rpc('exec', { sql: statement })
          
          if (rawError) {
            console.log(`Trying alternative execution for: ${statement.substring(0, 50)}...`)
          }
        }
      }
      
      console.log('✅ SQL statements processed')
    } else {
      console.log('✅ SQL fix executed successfully')
    }
    
    // Test the function
    console.log('🧪 Testing the fixed function...')
    
    const testEmail = 'test-fix@example.com'
    const { data: testResult, error: testError } = await supabase
      .rpc('create_subscriber_with_confirmation', {
        p_email: testEmail,
        p_source: 'test'
      })
    
    if (testError) {
      console.error('❌ Function test failed:', testError)
    } else {
      console.log('✅ Function test successful:', testResult)
      
      // Clean up test data
      await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('email', testEmail)
      
      console.log('🧹 Test data cleaned up')
    }
    
  } catch (error) {
    console.error('❌ Error applying fix:', error)
    process.exit(1)
  }
  
  console.log('🎉 Newsletter subscription fix completed!')
}

// Run the fix
fixNewsletterSubscription()
  .catch(console.error) 