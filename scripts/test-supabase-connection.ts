import { supabase } from '@/lib/supabase/client'

async function testSupabaseConnection() {
  try {
    console.log('🔧 Testing Supabase connection...')
    
    // Test the connection by getting session
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('❌ Connection error:', error.message)
      return
    }
    
    console.log('✅ Supabase connection successful')
    console.log('📊 Session status:', data.session ? 'Active session' : 'No active session')
    
    // Test a simple query to verify database connection
    const { data: testData, error: testError } = await supabase
      .from('articles')
      .select('count(*)')
      .limit(1)
    
    if (testError) {
      console.log('⚠️  Database query test failed:', testError.message)
    } else {
      console.log('✅ Database connection working')
    }
    
    console.log('🔗 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('🔑 Anon key set:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    
    console.log('\n📝 Next steps:')
    console.log('1. Go to your Supabase dashboard')
    console.log('2. Navigate to Authentication > Users')
    console.log('3. Click "Add user" to create an admin user')
    console.log('4. Use email: isak@maxyourpoints.com')
    console.log('5. Use password: admin123')
    console.log('6. Set email_confirm to true')
    console.log('7. Test login at http://localhost:3000/login')
    
  } catch (error) {
    console.error('💥 Test failed:', error)
  }
}

if (require.main === module) {
  testSupabaseConnection()
} 