-- Newsletter Campaigns and Templates System
-- Run this in your Supabase SQL Editor to add newsletter campaign functionality

-- Create newsletter_campaigns table
CREATE TABLE IF NOT EXISTS newsletter_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  html_content TEXT NOT NULL,
  template_type VARCHAR(50) DEFAULT 'custom' CHECK (template_type IN ('weekly', 'monthly', 'custom')),
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed')),
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
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
  type VARCHAR(50) DEFAULT 'custom' CHECK (type IN ('weekly', 'monthly', 'welcome', 'custom')),
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create newsletter_campaign_analytics table for detailed tracking
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

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_newsletter_campaigns_updated_at ON newsletter_campaigns;
CREATE TRIGGER update_newsletter_campaigns_updated_at
    BEFORE UPDATE ON newsletter_campaigns
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_newsletter_templates_updated_at ON newsletter_templates;
CREATE TRIGGER update_newsletter_templates_updated_at
    BEFORE UPDATE ON newsletter_templates
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_status ON newsletter_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_scheduled_at ON newsletter_campaigns(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_created_by ON newsletter_campaigns(created_by);
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_created_at ON newsletter_campaigns(created_at);

CREATE INDEX IF NOT EXISTS idx_newsletter_templates_type ON newsletter_templates(type);
CREATE INDEX IF NOT EXISTS idx_newsletter_templates_is_active ON newsletter_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_newsletter_templates_created_by ON newsletter_templates(created_by);

CREATE INDEX IF NOT EXISTS idx_newsletter_analytics_campaign_id ON newsletter_campaign_analytics(campaign_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_analytics_email ON newsletter_campaign_analytics(subscriber_email);
CREATE INDEX IF NOT EXISTS idx_newsletter_analytics_status ON newsletter_campaign_analytics(status);

-- Create RLS (Row Level Security) policies
ALTER TABLE newsletter_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_campaign_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for newsletter_campaigns
CREATE POLICY "Allow admin users to view all campaigns" ON newsletter_campaigns
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Allow admin users to create campaigns" ON newsletter_campaigns
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Allow admin users to update campaigns" ON newsletter_campaigns
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Allow admin users to delete campaigns" ON newsletter_campaigns
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- RLS Policies for newsletter_templates
CREATE POLICY "Allow admin users to view all templates" ON newsletter_templates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Allow admin users to create templates" ON newsletter_templates
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Allow admin users to update templates" ON newsletter_templates
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Allow admin users to delete templates" ON newsletter_templates
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- RLS Policies for newsletter_campaign_analytics
CREATE POLICY "Allow admin users to view all analytics" ON newsletter_campaign_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Allow system to insert analytics" ON newsletter_campaign_analytics
  FOR INSERT WITH CHECK (true);

-- Insert some sample templates
INSERT INTO newsletter_templates (name, subject, content, html_content, type) VALUES 
(
  'Weekly Travel Tips',
  'Your Weekly Travel Hacking Tips Are Here! ✈️',
  'Hi there!

Welcome to your weekly dose of travel hacking wisdom.

This week we''re covering:
• How to maximize airline miles for international flights
• The best credit card bonuses this month  
• Hotel loyalty program secrets that save you money
• Travel deals and mistake fares we''ve spotted

[Your content goes here]

Happy travels!
The Max Your Points Team',
  '<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Weekly Travel Tips ✈️</h1>
  </div>
  <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0;">
    <p>Hi there!</p>
    <p>Welcome to your weekly dose of travel hacking wisdom.</p>
    <p>This week we''re covering:</p>
    <ul>
      <li>How to maximize airline miles for international flights</li>
      <li>The best credit card bonuses this month</li>
      <li>Hotel loyalty program secrets that save you money</li>
      <li>Travel deals and mistake fares we''ve spotted</li>
    </ul>
    <div>[Your content goes here]</div>
    <p>Happy travels!<br>The Max Your Points Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #718096;">
    <p><a href="{{unsubscribe_url}}" style="color: #718096;">Unsubscribe</a></p>
  </div>
</body>
</html>',
  'weekly'
),
(
  'Monthly Roundup',
  'Your Monthly Travel Roundup - Points, Miles & More! 🌍',
  'Hello Travel Enthusiast!

It''s time for your monthly travel roundup! Here''s what happened in the world of points and miles this month.

🎯 Top Stories:
[Monthly highlights go here]

✈️ Best Travel Deals:
[Travel deals go here]

💳 Credit Card Updates:
[Credit card news goes here]

📊 Points Valuations:
[Points valuations go here]

Until next month,
The Max Your Points Team',
  '<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Monthly Travel Roundup 🌍</h1>
  </div>
  <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0;">
    <p>Hello Travel Enthusiast!</p>
    <p>It''s time for your monthly travel roundup! Here''s what happened in the world of points and miles this month.</p>
    <h3 style="color: #0f766e;">🎯 Top Stories:</h3>
    <div>[Monthly highlights go here]</div>
    <h3 style="color: #0f766e;">✈️ Best Travel Deals:</h3>
    <div>[Travel deals go here]</div>
    <h3 style="color: #0f766e;">💳 Credit Card Updates:</h3>
    <div>[Credit card news go here]</div>
    <h3 style="color: #0f766e;">📊 Points Valuations:</h3>
    <div>[Points valuations go here]</div>
    <p>Until next month,<br>The Max Your Points Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #718096;">
    <p><a href="{{unsubscribe_url}}" style="color: #718096;">Unsubscribe</a></p>
  </div>
</body>
</html>',
  'monthly'
);

-- Grant necessary permissions (adjust schema name if needed)
GRANT ALL ON newsletter_campaigns TO authenticated;
GRANT ALL ON newsletter_templates TO authenticated;
GRANT ALL ON newsletter_campaign_analytics TO authenticated;

-- Success message
SELECT 'Newsletter campaign system tables created successfully! 🎉' as message; 