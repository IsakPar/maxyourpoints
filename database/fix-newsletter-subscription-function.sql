-- Fix for newsletter subscription function
-- Addresses the ambiguous column reference "email" error

-- Ensure we have the token generation function
CREATE OR REPLACE FUNCTION generate_confirmation_token() 
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Drop the existing function first
DROP FUNCTION IF EXISTS create_subscriber_with_confirmation(TEXT, TEXT) CASCADE;

-- Create the fixed function
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
        ''::TEXT, -- No new token needed
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
$$ LANGUAGE plpgsql; 