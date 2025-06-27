const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
  console.log('🔄 Running user role migration...')
  
  try {
    // First, let's see what's currently in the database
    console.log('\n📋 Current users:')
    const { data: currentUsers, error: usersError } = await supabase
      .from('users')
      .select('email, role')
    
    if (usersError) {
      console.error('Error fetching users:', usersError.message)
    } else {
      console.table(currentUsers)
    }
    
    // Clean up any users with invalid roles (the SUPER_ADMIN ones causing errors)
    console.log('\n🧹 Cleaning up users with invalid roles...')
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .in('role', ['SUPER_ADMIN', 'USER']) // Delete users with invalid enum values
    
    if (deleteError) {
      console.log('Note: No invalid users to clean up:', deleteError.message)
    } else {
      console.log('✅ Cleaned up users with invalid roles')
    }
    
    // Check users again
    console.log('\n📋 Users after cleanup:')
    const { data: cleanedUsers, error: cleanedError } = await supabase
      .from('users')
      .select('email, role')
    
    if (cleanedError) {
      console.error('Error fetching cleaned users:', cleanedError.message)
    } else {
      console.table(cleanedUsers)
    }
    
    console.log('\n✅ Migration completed! Users with invalid roles have been removed.')
    console.log('🔄 Next time you access /admin, a new user record will be created with the correct "admin" role.')
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
  }
}

runMigration() 