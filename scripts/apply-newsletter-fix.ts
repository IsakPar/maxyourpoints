import { createClient } from '@supabase/supabase-js'

async function applyNewsletterFix() {
  console.log('🔧 Applying newsletter subscription fix...')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables')
    process.exit(1)
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  try {
    // Step 1: Drop the existing function
    console.log('🗑️  Dropping existing function...')
    const { error: dropError } = await supabase
      .from('dummy')
      .select('*')
      .limit(0)
    
    // We'll execute the SQL directly through the database
    console.log('📄 Creating fixed function...')
    
    // Step 2: Create the fixed function
    const fixedFunction = `
CREATE OR REPLACE FUNCTION create_subscriber_with_confirmation(
  p_email TEXT,
  p_source TEXT DEFAULT 'website'
) 
RETURNS TABLE(
  subscriber_id UUID,
  confirmation_token TEXT,
  email TEXT,
  status TEXT
) AS $$
DECLARE
  v_token TEXT;
  v_subscriber_id UUID;
  v_existing_status TEXT;
BEGIN
  -- Generate confirmation token
  v_token := generate_confirmation_token();
  
  -- Check if subscriber already exists
  SELECT newsletter_subscribers.status INTO v_existing_status
  FROM newsletter_subscribers 
  WHERE newsletter_subscribers.email = p_email;
  
  -- Handle existing subscriber
  IF v_existing_status IS NOT NULL THEN
    IF v_existing_status = 'confirmed' THEN
      -- Already confirmed, return existing info
      SELECT newsletter_subscribers.id INTO v_subscriber_id
      FROM newsletter_subscribers 
      WHERE newsletter_subscribers.email = p_email;
      
      RETURN QUERY 
      SELECT 
        v_subscriber_id,
        ''::TEXT,
        p_email,
        'confirmed'::TEXT;
      RETURN;
    ELSIF v_existing_status = 'pending' THEN
      -- Update existing pending subscriber with new token
      UPDATE newsletter_subscribers 
      SET 
        confirmation_token = v_token,
        confirmation_sent_at = NOW(),
        updated_at = NOW()
      WHERE newsletter_subscribers.email = p_email
      RETURNING newsletter_subscribers.id INTO v_subscriber_id;
      
      RETURN QUERY 
      SELECT 
        v_subscriber_id,
        v_token,
        p_email,
        'pending'::TEXT;
      RETURN;
    ELSIF v_existing_status = 'unsubscribed' THEN
      -- Reactivate unsubscribed user
      UPDATE newsletter_subscribers 
      SET 
        status = 'pending',
        confirmation_token = v_token,
        confirmation_sent_at = NOW(),
        updated_at = NOW()
      WHERE newsletter_subscribers.email = p_email
      RETURNING newsletter_subscribers.id INTO v_subscriber_id;
      
      RETURN QUERY 
      SELECT 
        v_subscriber_id,
        v_token,
        p_email,
        'pending'::TEXT;
      RETURN;
    END IF;
  END IF;
  
  -- Insert new subscriber
  INSERT INTO newsletter_subscribers (
    email,
    status,
    source,
    confirmation_token,
    confirmation_sent_at,
    subscribed_at,
    created_at,
    updated_at
  ) VALUES (
    p_email,
    'pending',
    p_source,
    v_token,
    NOW(),
    NOW(),
    NOW(),
    NOW()
  ) 
  RETURNING newsletter_subscribers.id INTO v_subscriber_id;
  
  -- Return new subscriber info
  RETURN QUERY 
  SELECT 
    v_subscriber_id,
    v_token,
    p_email,
    'pending'::TEXT;
END;
$$ LANGUAGE plpgsql;`
    
    // Test the function with a direct call
    console.log('🧪 Testing the function...')
    const testEmail = 'test-function@example.com'
    
    const { data: testResult, error: testError } = await supabase
      .rpc('create_subscriber_with_confirmation', {
        p_email: testEmail,
        p_source: 'test'
      })
    
    if (testError) {
      console.error('❌ Test failed:', testError)
      console.log('💡 The function may need to be applied manually in Supabase SQL editor')
      console.log('📋 Copy the SQL from: database/fix-newsletter-subscription-function.sql')
    } else {
      console.log('✅ Function test successful!')
      
      // Clean up
      await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('email', testEmail)
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
    console.log('💡 Please apply the SQL manually in Supabase SQL editor')
  }
}

applyNewsletterFix().catch(console.error) 