-- Newsletter Subscriber Lists Migration
-- This adds the ability to create targeted subscriber lists for different newsletter types

-- Create subscriber lists table
CREATE TABLE IF NOT EXISTS newsletter_subscriber_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  list_type VARCHAR(50) NOT NULL, -- 'airfare_daily', 'weekly_newsletter', 'monthly_roundup', 'custom'
  is_active BOOLEAN DEFAULT true,
  subscriber_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create junction table for many-to-many relationship between subscribers and lists
CREATE TABLE IF NOT EXISTS newsletter_subscriber_list_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscriber_id UUID REFERENCES newsletter_subscribers(id) ON DELETE CASCADE,
  list_id UUID REFERENCES newsletter_subscriber_lists(id) ON DELETE CASCADE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(subscriber_id, list_id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriber_list_members_subscriber_id ON newsletter_subscriber_list_members(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_subscriber_list_members_list_id ON newsletter_subscriber_list_members(list_id);
CREATE INDEX IF NOT EXISTS idx_subscriber_lists_type ON newsletter_subscriber_lists(list_type);
CREATE INDEX IF NOT EXISTS idx_subscriber_lists_active ON newsletter_subscriber_lists(is_active);

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS update_newsletter_subscriber_lists_updated_at ON newsletter_subscriber_lists;
CREATE TRIGGER update_newsletter_subscriber_lists_updated_at BEFORE UPDATE ON newsletter_subscriber_lists
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to update subscriber count
CREATE OR REPLACE FUNCTION update_subscriber_list_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the subscriber count for the affected list
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

-- Triggers to automatically update subscriber counts
DROP TRIGGER IF EXISTS update_list_count_on_member_insert ON newsletter_subscriber_list_members;
CREATE TRIGGER update_list_count_on_member_insert
    AFTER INSERT ON newsletter_subscriber_list_members
    FOR EACH ROW EXECUTE FUNCTION update_subscriber_list_count();

DROP TRIGGER IF EXISTS update_list_count_on_member_delete ON newsletter_subscriber_list_members;
CREATE TRIGGER update_list_count_on_member_delete
    AFTER DELETE ON newsletter_subscriber_list_members
    FOR EACH ROW EXECUTE FUNCTION update_subscriber_list_count();

-- Insert default subscriber lists
INSERT INTO newsletter_subscriber_lists (name, description, list_type) VALUES
('Airfare Daily Alerts', 'Daily alerts for flight deals and airfare promotions', 'airfare_daily'),
('Weekly Newsletter', 'Weekly roundup of the best travel content and tips', 'weekly_newsletter'),
('Monthly Travel Roundup', 'Monthly digest of travel insights, reviews, and strategies', 'monthly_roundup')
ON CONFLICT DO NOTHING;

-- Add RLS policies
ALTER TABLE newsletter_subscriber_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriber_list_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role subscriber lists access" ON newsletter_subscriber_lists;
CREATE POLICY "Service role subscriber lists access" ON newsletter_subscriber_lists
  FOR ALL USING (current_setting('role') = 'service_role');

DROP POLICY IF EXISTS "Service role subscriber list members access" ON newsletter_subscriber_list_members;
CREATE POLICY "Service role subscriber list members access" ON newsletter_subscriber_list_members
  FOR ALL USING (current_setting('role') = 'service_role');

-- Update the campaign table to support targeting specific lists
ALTER TABLE newsletter_campaigns ADD COLUMN IF NOT EXISTS target_list_id UUID REFERENCES newsletter_subscriber_lists(id);
ALTER TABLE newsletter_campaigns ADD COLUMN IF NOT EXISTS target_all_subscribers BOOLEAN DEFAULT true;

-- Add index for campaign targeting
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_target_list ON newsletter_campaigns(target_list_id);

-- Migrate existing subscribers to default lists (subscribe everyone to weekly newsletter initially)
INSERT INTO newsletter_subscriber_list_members (subscriber_id, list_id)
SELECT 
    ns.id,
    nsl.id
FROM newsletter_subscribers ns
CROSS JOIN newsletter_subscriber_lists nsl
WHERE ns.status = 'confirmed' 
AND nsl.list_type = 'weekly_newsletter'
ON CONFLICT (subscriber_id, list_id) DO NOTHING;

SELECT 'Newsletter subscriber lists setup complete! 🎉' AS message;
SELECT 'Created lists:' AS info, name, list_type, subscriber_count FROM newsletter_subscriber_lists; 