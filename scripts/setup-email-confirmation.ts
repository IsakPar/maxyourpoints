import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

async function setupEmailConfirmation() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    console.log('🚀 Setting up email confirmation system...')

    // Read the SQL migration file
    const migrationPath = join(process.cwd(), 'database', 'email-confirmation-system.sql')
    const migrationSQL = readFileSync(migrationPath, 'utf-8')

    // Split into individual statements (separated by semicolons)
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('/*'))

    console.log(`📜 Executing ${statements.length} SQL statements...`)

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      
      if (statement.trim()) {
        console.log(`⚡ Executing statement ${i + 1}/${statements.length}`)
        
        const { error } = await supabase.rpc('exec_sql', { 
          sql_statement: statement + ';' 
        })

        if (error) {
          // Try direct execution if RPC fails
          const { error: directError } = await supabase
            .from('pg_stat_activity')
            .select('*')
            .limit(0) // Just to test connection

          if (directError) {
            console.error(`❌ Error executing statement ${i + 1}:`, error)
            throw error
          }
          
          // If it's just the RPC that doesn't exist, we'll need to use a different approach
          console.log('⚠️  RPC method not available, trying alternative...')
          
          // For this case, we'll just log what needs to be done manually
          console.log('📝 Please run this SQL manually in your Supabase SQL editor:')
          console.log('='.repeat(60))
          console.log(migrationSQL)
          console.log('='.repeat(60))
          return
        }
      }
    }

    console.log('✅ Email confirmation system setup complete!')
    console.log('')
    console.log('📧 Next steps:')
    console.log('1. Test the confirmation flow by subscribing with a test email')
    console.log('2. Check that confirmation emails are being sent')
    console.log('3. Verify that pending subscribers can be confirmed')
    console.log('')

  } catch (error) {
    console.error('💥 Setup failed:', error)
    process.exit(1)
  }
}

setupEmailConfirmation() 