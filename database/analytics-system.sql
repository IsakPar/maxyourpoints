-- ================================================
-- ANALYTICS SYSTEM DATABASE SCHEMA
-- Max Your Points - Advanced Tracking & Analytics
-- ================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Article Analytics Table
CREATE TABLE IF NOT EXISTS article_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Page Analytics
  page_view_count INTEGER DEFAULT 1,
  unique_view BOOLEAN DEFAULT true,
  
  -- Reading Analytics
  time_on_page INTEGER, -- seconds
  scroll_depth DECIMAL(3,2), -- 0.0 to 1.0
  reading_progress DECIMAL(3,2), -- 0.0 to 1.0
  article_completed BOOLEAN DEFAULT false,
  
  -- Engagement Analytics
  newsletter_signup_from_article BOOLEAN DEFAULT false,
  external_links_clicked INTEGER DEFAULT 0,
  social_shares INTEGER DEFAULT 0,
  
  -- Technical Analytics
  referrer_url TEXT,
  traffic_source VARCHAR(100), -- 'direct', 'google', 'social', etc.
  device_type VARCHAR(50), -- 'mobile', 'desktop', 'tablet'
  country_code VARCHAR(2),
  
  -- Timestamps
  first_viewed_at TIMESTAMPTZ DEFAULT NOW(),
  last_viewed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics Events Table (for real-time tracking)
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  event_type VARCHAR(50) NOT NULL, -- 'page_view', 'scroll_progress', 'reading_completion', 'newsletter_signup', 'external_link_click'
  event_data JSONB, -- Flexible data storage for event-specific information
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter Analytics Table
CREATE TABLE IF NOT EXISTS newsletter_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscriber_id UUID REFERENCES newsletter_subscribers(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES newsletter_campaigns(id) ON DELETE CASCADE,
  article_id UUID REFERENCES articles(id) ON DELETE SET NULL, -- Source article if applicable
  
  -- Subscription Analytics
  subscription_source VARCHAR(100), -- 'homepage', 'article', 'footer', etc.
  subscription_referrer TEXT,
  
  -- Engagement Analytics
  emails_sent INTEGER DEFAULT 0,
  emails_opened INTEGER DEFAULT 0,
  emails_clicked INTEGER DEFAULT 0,
  unsubscribed BOOLEAN DEFAULT false,
  
  -- Timestamps
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  last_engagement_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Analytics Summary Table (for dashboard performance)
CREATE TABLE IF NOT EXISTS site_analytics_daily (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  
  -- Page Views
  total_page_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  
  -- Engagement
  average_session_duration INTEGER DEFAULT 0, -- seconds
  bounce_rate DECIMAL(5,2) DEFAULT 0, -- percentage
  pages_per_session DECIMAL(5,2) DEFAULT 0,
  
  -- Newsletter
  newsletter_signups INTEGER DEFAULT 0,
  newsletter_conversion_rate DECIMAL(5,2) DEFAULT 0, -- percentage
  
  -- Traffic Sources
  direct_traffic INTEGER DEFAULT 0,
  organic_traffic INTEGER DEFAULT 0,
  social_traffic INTEGER DEFAULT 0,
  referral_traffic INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date)
);

-- Page Views table (existing)
CREATE TABLE IF NOT EXISTS page_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_path TEXT NOT NULL,
    page_title TEXT,
    referrer TEXT,
    user_agent TEXT,
    ip_address INET,
    session_id TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    country TEXT,
    city TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT
);

-- Performance Metrics table (NEW)
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL,
    page_path TEXT NOT NULL,
    
    -- Core Web Vitals
    lcp DECIMAL(10,2), -- Largest Contentful Paint (ms)
    fid DECIMAL(10,2), -- First Input Delay (ms)
    cls DECIMAL(10,4), -- Cumulative Layout Shift (score)
    
    -- Additional Performance Metrics
    fcp DECIMAL(10,2), -- First Contentful Paint (ms)
    ttfb DECIMAL(10,2), -- Time to First Byte (ms)
    dom_load_time DECIMAL(10,2), -- DOM Content Loaded (ms)
    window_load_time DECIMAL(10,2), -- Window Load Event (ms)
    
    -- Navigation Timing
    navigation_type TEXT, -- 'navigate', 'reload', 'back_forward', 'prerender'
    connection_type TEXT, -- 'slow-2g', '2g', '3g', '4g', 'unknown'
    effective_connection_type TEXT,
    
    -- Device Info
    device_memory INTEGER, -- Device memory in GB
    hardware_concurrency INTEGER, -- Number of CPU cores
    viewport_width INTEGER,
    viewport_height INTEGER,
    
    -- User Experience
    bounce_rate BOOLEAN DEFAULT FALSE,
    time_on_page DECIMAL(10,2), -- seconds
    scroll_depth DECIMAL(5,2), -- percentage
    
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_lcp CHECK (lcp >= 0),
    CONSTRAINT valid_fid CHECK (fid >= 0),
    CONSTRAINT valid_cls CHECK (cls >= 0),
    CONSTRAINT valid_scroll_depth CHECK (scroll_depth >= 0 AND scroll_depth <= 100)
);

-- Error Tracking table (NEW)
CREATE TABLE IF NOT EXISTS error_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT,
    page_path TEXT NOT NULL,
    error_type TEXT NOT NULL, -- 'javascript', 'network', 'console'
    error_message TEXT,
    error_stack TEXT,
    user_agent TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- User Sessions table (NEW)
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT UNIQUE NOT NULL,
    first_visit TIMESTAMPTZ DEFAULT NOW(),
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    page_count INTEGER DEFAULT 1,
    total_time_spent DECIMAL(10,2) DEFAULT 0, -- seconds
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    country TEXT,
    city TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    ip_address INET,
    user_agent TEXT,
    is_bounce BOOLEAN DEFAULT TRUE
);

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_article_analytics_article_id ON article_analytics(article_id);
CREATE INDEX IF NOT EXISTS idx_article_analytics_session_id ON article_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_article_analytics_created_at ON article_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_article_analytics_traffic_source ON article_analytics(traffic_source);

CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_article_id ON analytics_events(article_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);

CREATE INDEX IF NOT EXISTS idx_newsletter_analytics_subscriber_id ON newsletter_analytics(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_analytics_campaign_id ON newsletter_analytics(campaign_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_analytics_article_id ON newsletter_analytics(article_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_analytics_source ON newsletter_analytics(subscription_source);

CREATE INDEX IF NOT EXISTS idx_site_analytics_daily_date ON site_analytics_daily(date);

-- Enable Row Level Security
ALTER TABLE article_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_analytics_daily ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Admin access only for analytics)
CREATE POLICY "Admin access to article_analytics" ON article_analytics
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admin access to analytics_events" ON analytics_events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admin access to newsletter_analytics" ON newsletter_analytics
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admin access to site_analytics_daily" ON site_analytics_daily
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Functions for analytics processing
CREATE OR REPLACE FUNCTION process_daily_analytics(target_date DATE DEFAULT CURRENT_DATE)
RETURNS void AS $$
BEGIN
  INSERT INTO site_analytics_daily (
    date,
    total_page_views,
    unique_visitors,
    average_session_duration,
    bounce_rate,
    pages_per_session,
    newsletter_signups,
    direct_traffic,
    organic_traffic,
    social_traffic,
    referral_traffic
  )
  SELECT 
    target_date,
    COUNT(*) as total_page_views,
    COUNT(DISTINCT session_id) as unique_visitors,
    COALESCE(AVG(time_on_page), 0)::INTEGER as average_session_duration,
    COALESCE(
      (COUNT(*) FILTER (WHERE time_on_page < 30)::DECIMAL / NULLIF(COUNT(*), 0)) * 100,
      0
    ) as bounce_rate,
    COALESCE(
      COUNT(*)::DECIMAL / NULLIF(COUNT(DISTINCT session_id), 0),
      0
    ) as pages_per_session,
    (
      SELECT COUNT(*) 
      FROM newsletter_subscribers 
      WHERE DATE(created_at) = target_date
    ) as newsletter_signups,
    COUNT(*) FILTER (WHERE traffic_source = 'direct') as direct_traffic,
    COUNT(*) FILTER (WHERE traffic_source = 'organic') as organic_traffic,
    COUNT(*) FILTER (WHERE traffic_source = 'social') as social_traffic,
    COUNT(*) FILTER (WHERE traffic_source = 'referral') as referral_traffic
  FROM article_analytics
  WHERE DATE(created_at) = target_date
  ON CONFLICT (date) DO UPDATE SET
    total_page_views = EXCLUDED.total_page_views,
    unique_visitors = EXCLUDED.unique_visitors,
    average_session_duration = EXCLUDED.average_session_duration,
    bounce_rate = EXCLUDED.bounce_rate,
    pages_per_session = EXCLUDED.pages_per_session,
    newsletter_signups = EXCLUDED.newsletter_signups,
    direct_traffic = EXCLUDED.direct_traffic,
    organic_traffic = EXCLUDED.organic_traffic,
    social_traffic = EXCLUDED.social_traffic,
    referral_traffic = EXCLUDED.referral_traffic;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_page_views_timestamp ON page_views(timestamp);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_page_views_session ON page_views(session_id);

CREATE INDEX IF NOT EXISTS idx_performance_timestamp ON performance_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_performance_path ON performance_metrics(page_path);
CREATE INDEX IF NOT EXISTS idx_performance_session ON performance_metrics(session_id);
CREATE INDEX IF NOT EXISTS idx_performance_lcp ON performance_metrics(lcp);
CREATE INDEX IF NOT EXISTS idx_performance_fid ON performance_metrics(fid);
CREATE INDEX IF NOT EXISTS idx_performance_cls ON performance_metrics(cls);

CREATE INDEX IF NOT EXISTS idx_error_logs_timestamp ON error_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_error_logs_path ON error_logs(page_path);
CREATE INDEX IF NOT EXISTS idx_error_logs_type ON error_logs(error_type);

CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_first_visit ON user_sessions(first_visit);

-- Enable Row Level Security
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for analytics tables
CREATE POLICY "Analytics data is viewable by authenticated users" ON page_views
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Analytics data is insertable by anyone" ON page_views
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Performance metrics viewable by authenticated users" ON performance_metrics
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Performance metrics insertable by anyone" ON performance_metrics
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Error logs viewable by authenticated users" ON error_logs
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Error logs insertable by anyone" ON error_logs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "User sessions viewable by authenticated users" ON user_sessions
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "User sessions manageable by anyone" ON user_sessions
    FOR ALL WITH CHECK (true);

-- Functions for performance analysis

-- Function to calculate Core Web Vitals averages
CREATE OR REPLACE FUNCTION get_core_web_vitals_averages(
    start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
    end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE (
    avg_lcp DECIMAL,
    avg_fid DECIMAL,
    avg_cls DECIMAL,
    good_lcp_percentage DECIMAL,
    good_fid_percentage DECIMAL,
    good_cls_percentage DECIMAL,
    total_measurements INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ROUND(AVG(pm.lcp), 2) as avg_lcp,
        ROUND(AVG(pm.fid), 2) as avg_fid,
        ROUND(AVG(pm.cls), 4) as avg_cls,
        ROUND(
            (COUNT(CASE WHEN pm.lcp <= 2500 THEN 1 END)::DECIMAL / NULLIF(COUNT(pm.lcp), 0)) * 100, 
            2
        ) as good_lcp_percentage,
        ROUND(
            (COUNT(CASE WHEN pm.fid <= 100 THEN 1 END)::DECIMAL / NULLIF(COUNT(pm.fid), 0)) * 100, 
            2
        ) as good_fid_percentage,
        ROUND(
            (COUNT(CASE WHEN pm.cls <= 0.1 THEN 1 END)::DECIMAL / NULLIF(COUNT(pm.cls), 0)) * 100, 
            2
        ) as good_cls_percentage,
        COUNT(*)::INTEGER as total_measurements
    FROM performance_metrics pm
    WHERE pm.timestamp BETWEEN start_date AND end_date
    AND (pm.lcp IS NOT NULL OR pm.fid IS NOT NULL OR pm.cls IS NOT NULL);
END;
$$ LANGUAGE plpgsql;

-- Function to get performance trends
CREATE OR REPLACE FUNCTION get_performance_trends(
    days INTEGER DEFAULT 7
)
RETURNS TABLE (
    date_bucket DATE,
    avg_lcp DECIMAL,
    avg_fid DECIMAL,
    avg_cls DECIMAL,
    page_load_time DECIMAL,
    bounce_rate DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        DATE(pm.timestamp) as date_bucket,
        ROUND(AVG(pm.lcp), 2) as avg_lcp,
        ROUND(AVG(pm.fid), 2) as avg_fid,
        ROUND(AVG(pm.cls), 4) as avg_cls,
        ROUND(AVG(pm.window_load_time), 2) as page_load_time,
        ROUND(
            (COUNT(CASE WHEN pm.bounce_rate = true THEN 1 END)::DECIMAL / NULLIF(COUNT(*), 0)) * 100, 
            2
        ) as bounce_rate
    FROM performance_metrics pm
    WHERE pm.timestamp >= NOW() - (days || ' days')::INTERVAL
    GROUP BY DATE(pm.timestamp)
    ORDER BY date_bucket DESC;
END;
$$ LANGUAGE plpgsql; 