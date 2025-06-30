import { createClient } from '@supabase/supabase-js'

async function checkSubscriberStatus() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables')
    process.exit(1)
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  try {
    // Check the specific email
    const email = 'isak.parild2@gmail.com'
    
    console.log(`🔍 Checking database status for: ${email}`)
    
    const { data: subscribers, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', email)
    
    if (error) {
      console.error('❌ Database error:', error)
      return
    }
    
    if (subscribers && subscribers.length > 0) {
      console.log('✅ Found subscriber data:')
      subscribers.forEach((sub, index) => {
        console.log(`\n📧 Subscriber ${index + 1}:`)
        console.log(`   ID: ${sub.id}`)
        console.log(`   Email: ${sub.email}`)
        console.log(`   Status: ${sub.status}`)
        console.log(`   Confirmation Token: ${sub.confirmation_token ? 'Present' : 'None'}`)
        console.log(`   Subscribed At: ${sub.subscribed_at}`)
        console.log(`   Created At: ${sub.created_at}`)
        console.log(`   Source: ${sub.source}`)
      })
    } else {
      console.log('❌ No subscriber found with that email')
    }
    
    // Also check all subscribers to see the general state
    console.log('\n📊 All subscribers in database:')
    const { data: allSubs, error: allError } = await supabase
      .from('newsletter_subscribers')
      .select('email, status, created_at')
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (allError) {
      console.error('❌ Error fetching all subscribers:', allError)
    } else {
      allSubs?.forEach((sub, index) => {
        console.log(`   ${index + 1}. ${sub.email} - ${sub.status} (${new Date(sub.created_at).toLocaleString()})`)
      })
    }
    
  } catch (error) {
    console.error('❌ Script error:', error)
  }
}

checkSubscriberStatus() 