-- Create newsletter_campaign_articles table for associating articles with campaigns
-- This table was missing and causing 500 errors in the campaign system

CREATE TABLE IF NOT EXISTS newsletter_campaign_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES newsletter_campaigns(id) ON DELETE CASCADE,
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique position per campaign
  UNIQUE(campaign_id, position),
  -- Ensure article isn't associated with same campaign multiple times
  UNIQUE(campaign_id, article_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_newsletter_campaign_articles_campaign_id 
ON newsletter_campaign_articles(campaign_id);

CREATE INDEX IF NOT EXISTS idx_newsletter_campaign_articles_article_id 
ON newsletter_campaign_articles(article_id);

CREATE INDEX IF NOT EXISTS idx_newsletter_campaign_articles_position 
ON newsletter_campaign_articles(campaign_id, position);

-- Enable RLS (Row Level Security)
ALTER TABLE newsletter_campaign_articles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin access
CREATE POLICY "Admin can view all campaign articles" ON newsletter_campaign_articles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admin can insert campaign articles" ON newsletter_campaign_articles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admin can update campaign articles" ON newsletter_campaign_articles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admin can delete campaign articles" ON newsletter_campaign_articles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Add comments for documentation
COMMENT ON TABLE newsletter_campaign_articles IS 'Association table linking newsletter campaigns with articles';
COMMENT ON COLUMN newsletter_campaign_articles.campaign_id IS 'Reference to the newsletter campaign';
COMMENT ON COLUMN newsletter_campaign_articles.article_id IS 'Reference to the article being included';
COMMENT ON COLUMN newsletter_campaign_articles.position IS 'Order position of article within the campaign (0-based)'; 