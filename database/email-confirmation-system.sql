-- Email Confirmation System Setup
-- Add confirmation token and confirmation timestamp to newsletter subscribers

-- First, add the new columns
ALTER TABLE newsletter_subscribers 
ADD COLUMN IF NOT EXISTS confirmation_token TEXT,
ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS confirmation_sent_at TIMESTAMP WITH TIME ZONE;

-- Update existing confirmed subscribers to have confirmed_at timestamp
UPDATE newsletter_subscribers 
SET confirmed_at = created_at 
WHERE status = 'confirmed' AND confirmed_at IS NULL;

-- Create function to generate confirmation tokens
CREATE OR REPLACE FUNCTION generate_confirmation_token() 
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Create function to handle new subscriber with confirmation
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
BEGIN
  -- Generate confirmation token
  v_token := generate_confirmation_token();
  
  -- Insert new subscriber with pending status
  INSERT INTO newsletter_subscribers (
    email,
    status,
    source,
    confirmation_token,
    confirmation_sent_at,
    subscribed_at,
    created_at
  ) VALUES (
    p_email,
    'pending',
    p_source,
    v_token,
    NOW(),
    NOW(),
    NOW()
  ) 
  ON CONFLICT (email) DO UPDATE SET
    status = CASE 
      WHEN newsletter_subscribers.status = 'unsubscribed' THEN 'pending'
      ELSE newsletter_subscribers.status
    END,
    confirmation_token = CASE 
      WHEN newsletter_subscribers.status = 'unsubscribed' THEN v_token
      ELSE newsletter_subscribers.confirmation_token
    END,
    confirmation_sent_at = CASE 
      WHEN newsletter_subscribers.status = 'unsubscribed' THEN NOW()
      ELSE newsletter_subscribers.confirmation_sent_at
    END,
    updated_at = NOW()
  RETURNING newsletter_subscribers.id INTO v_subscriber_id;
  
  -- Return subscriber info
  RETURN QUERY 
  SELECT 
    v_subscriber_id,
    v_token,
    p_email,
    'pending'::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Create function to confirm subscription
CREATE OR REPLACE FUNCTION confirm_subscription(p_token TEXT)
RETURNS TABLE(
  success BOOLEAN,
  email TEXT,
  message TEXT
) AS $$
DECLARE
  v_subscriber_id UUID;
  v_email TEXT;
BEGIN
  -- Find subscriber by token
  SELECT id, email INTO v_subscriber_id, v_email
  FROM newsletter_subscribers 
  WHERE confirmation_token = p_token 
    AND status = 'pending'
    AND confirmation_sent_at > NOW() - INTERVAL '7 days'; -- Token expires after 7 days
  
  IF v_subscriber_id IS NULL THEN
    RETURN QUERY SELECT FALSE, ''::TEXT, 'Invalid or expired confirmation token'::TEXT;
    RETURN;
  END IF;
  
  -- Update subscriber to confirmed
  UPDATE newsletter_subscribers 
  SET 
    status = 'confirmed',
    confirmed_at = NOW(),
    confirmation_token = NULL,
    updated_at = NOW()
  WHERE id = v_subscriber_id;
  
  RETURN QUERY SELECT TRUE, v_email, 'Email confirmed successfully'::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_confirmation_token 
ON newsletter_subscribers(confirmation_token);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status 
ON newsletter_subscribers(status);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_confirmed_at 
ON newsletter_subscribers(confirmed_at);

-- Add comments
COMMENT ON COLUMN newsletter_subscribers.confirmation_token IS 'Unique token for email confirmation (null after confirmation)';
COMMENT ON COLUMN newsletter_subscribers.confirmed_at IS 'Timestamp when email was confirmed';
COMMENT ON COLUMN newsletter_subscribers.confirmation_sent_at IS 'Timestamp when confirmation email was sent';

-- Example usage:
/*
-- Subscribe a new user (creates pending status with token)
SELECT * FROM create_subscriber_with_confirmation('user@example.com', 'homepage');

-- Confirm subscription using token
SELECT * FROM confirm_subscription('abc123token456');

-- Get all pending confirmations that need reminders (older than 24 hours)
SELECT email, confirmation_sent_at 
FROM newsletter_subscribers 
WHERE status = 'pending' 
  AND confirmation_sent_at < NOW() - INTERVAL '24 hours'
  AND confirmation_sent_at > NOW() - INTERVAL '7 days';
*/ 