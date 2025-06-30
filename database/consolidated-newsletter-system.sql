-- CONSOLIDATED NEWSLETTER SYSTEM
-- This script creates the complete newsletter system for Max Your Points
-- Run this ONCE in your Supabase SQL Editor

-- ============================================================================
-- 1. CORE TABLES
-- ============================================================================

-- Create newsletter_subscribers table (main subscribers table)
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'unsubscribed')),
  source VARCHAR(100) DEFAULT 'website',
  confirmation_token TEXT,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  confirmation_sent_at TIMESTAMP WITH TIME ZONE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create newsletter_campaigns table
CREATE TABLE IF NOT EXISTS newsletter_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  html_content TEXT NOT NULL,
  template_type VARCHAR(50) DEFAULT 'custom' CHECK (template_type IN ('weekly', 'monthly', 'airfare_daily', 'custom')),
  campaign_type VARCHAR(50) DEFAULT 'custom' CHECK (campaign_type IN ('weekly', 'airfare_daily', 'custom')),
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed')),
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  target_date DATE,
  description TEXT,
  target_list_id UUID,
  target_all_subscribers BOOLEAN DEFAULT true,
  recipient_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  delivery_rate DECIMAL(5,2) DEFAULT 0,
  open_rate DECIMAL(5,2),
  click_rate DECIMAL(5,2),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create newsletter_templates table
CREATE TABLE IF NOT EXISTS newsletter_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  html_content TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'custom' CHECK (type IN ('weekly', 'monthly', 'welcome', 'airfare_daily', 'custom')),
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create subscriber lists table for segmentation
CREATE TABLE IF NOT EXISTS newsletter_subscriber_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  list_type VARCHAR(50) NOT NULL CHECK (list_type IN ('airfare_daily', 'weekly_newsletter', 'monthly_roundup', 'custom')),
  is_active BOOLEAN DEFAULT true,
  subscriber_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create junction table for subscriber list membership
CREATE TABLE IF NOT EXISTS newsletter_subscriber_list_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID REFERENCES newsletter_subscribers(id) ON DELETE CASCADE,
  list_id UUID REFERENCES newsletter_subscriber_lists(id) ON DELETE CASCADE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(subscriber_id, list_id)
);

-- Create campaign articles table
CREATE TABLE IF NOT EXISTS newsletter_campaign_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES newsletter_campaigns(id) ON DELETE CASCADE,
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campaign_id, article_id)
);

-- Create campaign analytics table
CREATE TABLE IF NOT EXISTS newsletter_campaign_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES newsletter_campaigns(id) ON DELETE CASCADE,
  subscriber_email VARCHAR(255) NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL,
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  bounced_at TIMESTAMPTZ,
  bounce_reason TEXT,
  status VARCHAR(50) DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. INDEXES FOR PERFORMANCE
-- ============================================================================

-- Newsletter subscribers indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON newsletter_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_confirmation_token ON newsletter_subscribers(confirmation_token);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_confirmed_at ON newsletter_subscribers(confirmed_at);

-- Newsletter campaigns indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_status ON newsletter_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_scheduled_at ON newsletter_campaigns(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_created_by ON newsletter_campaigns(created_by);
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_target_list ON newsletter_campaigns(target_list_id);

-- Newsletter templates indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_templates_type ON newsletter_templates(type);
CREATE INDEX IF NOT EXISTS idx_newsletter_templates_is_active ON newsletter_templates(is_active);

-- Subscriber lists indexes
CREATE INDEX IF NOT EXISTS idx_subscriber_lists_type ON newsletter_subscriber_lists(list_type);
CREATE INDEX IF NOT EXISTS idx_subscriber_lists_active ON newsletter_subscriber_lists(is_active);
CREATE INDEX IF NOT EXISTS idx_subscriber_list_members_subscriber_id ON newsletter_subscriber_list_members(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_subscriber_list_members_list_id ON newsletter_subscriber_list_members(list_id);

-- Campaign articles indexes
CREATE INDEX IF NOT EXISTS idx_campaign_articles_campaign_id ON newsletter_campaign_articles(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_articles_article_id ON newsletter_campaign_articles(article_id);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_analytics_campaign_id ON newsletter_campaign_analytics(campaign_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_analytics_email ON newsletter_campaign_analytics(subscriber_email);

-- ============================================================================
-- 3. FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate confirmation tokens
CREATE OR REPLACE FUNCTION generate_confirmation_token() 
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'hex');
END;
$$ LANGUAGE plpgsql;

-- FIXED function to handle new subscriber with confirmation (no ambiguous column references)
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

-- Function to confirm subscription
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
    AND confirmation_sent_at > NOW() - INTERVAL '7 days';
  
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

-- Function to update subscriber list count
CREATE OR REPLACE FUNCTION update_subscriber_list_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE newsletter_subscriber_lists 
    SET subscriber_count = (
        SELECT COUNT(*) 
        FROM newsletter_subscriber_list_members 
        WHERE list_id = COALESCE(NEW.list_id, OLD.list_id)
    )
    WHERE id = COALESCE(NEW.list_id, OLD.list_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_newsletter_subscribers_updated_at ON newsletter_subscribers;
CREATE TRIGGER update_newsletter_subscribers_updated_at
    BEFORE UPDATE ON newsletter_subscribers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_newsletter_campaigns_updated_at ON newsletter_campaigns;
CREATE TRIGGER update_newsletter_campaigns_updated_at
    BEFORE UPDATE ON newsletter_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_newsletter_templates_updated_at ON newsletter_templates;
CREATE TRIGGER update_newsletter_templates_updated_at
    BEFORE UPDATE ON newsletter_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_newsletter_subscriber_lists_updated_at ON newsletter_subscriber_lists;
CREATE TRIGGER update_newsletter_subscriber_lists_updated_at 
    BEFORE UPDATE ON newsletter_subscriber_lists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for subscriber list count updates
DROP TRIGGER IF EXISTS update_list_count_on_member_insert ON newsletter_subscriber_list_members;
CREATE TRIGGER update_list_count_on_member_insert
    AFTER INSERT ON newsletter_subscriber_list_members
    FOR EACH ROW EXECUTE FUNCTION update_subscriber_list_count();

DROP TRIGGER IF EXISTS update_list_count_on_member_delete ON newsletter_subscriber_list_members;
CREATE TRIGGER update_list_count_on_member_delete
    AFTER DELETE ON newsletter_subscriber_list_members
    FOR EACH ROW EXECUTE FUNCTION update_subscriber_list_count();

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriber_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriber_list_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_campaign_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_campaign_analytics ENABLE ROW LEVEL SECURITY;

-- Admin access policies
CREATE POLICY "Admin access to newsletter_subscribers" ON newsletter_subscribers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Admin access to newsletter_campaigns" ON newsletter_campaigns
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Admin access to newsletter_templates" ON newsletter_templates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Admin access to newsletter_subscriber_lists" ON newsletter_subscriber_lists
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Admin access to newsletter_subscriber_list_members" ON newsletter_subscriber_list_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Admin access to newsletter_campaign_articles" ON newsletter_campaign_articles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Allow system to insert analytics" ON newsletter_campaign_analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin access to newsletter_analytics" ON newsletter_campaign_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'editor')
    )
  );

-- ============================================================================
-- 5. DEFAULT DATA
-- ============================================================================

-- Insert default subscriber lists
INSERT INTO newsletter_subscriber_lists (name, description, list_type) VALUES
('Weekly Newsletter', 'Weekly roundup of travel tips and deals', 'weekly_newsletter'),
('Daily Airfare Alerts', 'Daily alerts for flight deals and mistake fares', 'airfare_daily'),
('Monthly Travel Roundup', 'Monthly digest of travel insights and strategies', 'monthly_roundup')
ON CONFLICT DO NOTHING;

-- Update existing confirmed subscribers to have confirmed_at timestamp
UPDATE newsletter_subscribers 
SET confirmed_at = created_at 
WHERE status = 'confirmed' AND confirmed_at IS NULL;

-- Add foreign key constraint for campaign target lists
ALTER TABLE newsletter_campaigns 
ADD CONSTRAINT fk_campaigns_target_list 
FOREIGN KEY (target_list_id) REFERENCES newsletter_subscriber_lists(id);

-- ============================================================================
-- 6. SUCCESS MESSAGE
-- ============================================================================

SELECT 'Consolidated newsletter system setup complete! 🎉' AS message;
SELECT 'All tables, functions, and policies created successfully!' AS status; 