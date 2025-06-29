import { supabaseAdmin } from '../lib/supabase/server'

async function testNewsletterIntegration() {
  console.log('🧪 Testing newsletter integration...')

  // Add some test subscribers
  const testSubscribers = [
    {
      email: 'test1@example.com',
      status: 'active',
      source: 'website',
      subscribed_at: new Date().toISOString()
    },
    {
      email: 'test2@example.com', 
      status: 'active',
      source: 'website',
      subscribed_at: new Date(Date.now() - 86400000).toISOString() // Yesterday
    },
    {
      email: 'test3@example.com',
      status: 'unsubscribed', 
      source: 'website',
      subscribed_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      unsubscribed_at: new Date(Date.now() - 86400000).toISOString() // Yesterday
    }
  ]

  try {
    // Check if any test data already exists
    const { data: existing, error: checkError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('email')
      .in('email', testSubscribers.map(s => s.email))

    if (checkError) {
      console.error('Error checking existing data:', checkError)
      return
    }

    if (existing && existing.length > 0) {
      console.log('✅ Test data already exists:', existing.map(s => s.email))
      console.log('Skipping test data insertion')
      return
    }

    // Insert test data
    const { data, error } = await supabaseAdmin
      .from('newsletter_subscribers')
      .insert(testSubscribers)
      .select()

    if (error) {
      console.error('❌ Error adding test subscribers:', error)
      return
    }

    console.log('✅ Added test newsletter subscribers:')
    data?.forEach(sub => {
      console.log(`   - ${sub.email} (${sub.status})`)
    })

    // Test fetching data
    const { data: allSubscribers, error: fetchError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      console.error('❌ Error fetching subscribers:', fetchError)
      return
    }

    console.log(`\n📊 Total subscribers in database: ${allSubscribers?.length || 0}`)
    console.log('Newsletter integration test completed! ✅')

  } catch (error) {
    console.error('❌ Test error:', error)
  }
}

if (require.main === module) {
  testNewsletterIntegration()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Script failed:', error)
      process.exit(1)
    })
}

export { testNewsletterIntegration } 