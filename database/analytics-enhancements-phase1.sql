-- ================================================
-- ANALYTICS PHASE 1 ENHANCEMENTS
-- Enhanced Error Tracking, Performance Alerts, Engagement Scoring
-- ================================================

-- Enhanced Error Logs with categorization
ALTER TABLE error_logs 
ADD COLUMN IF NOT EXISTS severity VARCHAR(20) DEFAULT 'warning' CHECK (severity IN ('critical', 'warning', 'info')),
ADD COLUMN IF NOT EXISTS error_group VARCHAR(255),
ADD COLUMN IF NOT EXISTS first_occurrence TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS occurrence_count INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS is_resolved BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS browser_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS os_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS viewport_width INTEGER,
ADD COLUMN IF NOT EXISTS viewport_height INTEGER;

-- Performance Budgets table for alerts
CREATE TABLE IF NOT EXISTS performance_budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name VARCHAR(50) NOT NULL, -- 'lcp', 'fid', 'cls', 'ttfb'
    threshold_value DECIMAL(10,2) NOT NULL,
    threshold_type VARCHAR(20) NOT NULL CHECK (threshold_type IN ('good', 'needs_improvement', 'poor')),
    alert_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(metric_name, threshold_type)
);

-- Insert default performance budgets
INSERT INTO performance_budgets (metric_name, threshold_value, threshold_type) VALUES
('lcp', 2500, 'good'),
('lcp', 4000, 'needs_improvement'),
('fid', 100, 'good'),
('fid', 300, 'needs_improvement'),
('cls', 0.1, 'good'),
('cls', 0.25, 'needs_improvement'),
('ttfb', 600, 'good'),
('ttfb', 1000, 'needs_improvement')
ON CONFLICT (metric_name, threshold_type) DO NOTHING;

-- Performance Alerts table
CREATE TABLE IF NOT EXISTS performance_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name VARCHAR(50) NOT NULL,
    page_path TEXT NOT NULL,
    alert_type VARCHAR(20) NOT NULL, -- 'budget_exceeded', 'trend_degrading'
    current_value DECIMAL(10,2),
    threshold_value DECIMAL(10,2),
    severity VARCHAR(20) DEFAULT 'warning',
    is_acknowledged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    acknowledged_at TIMESTAMPTZ
);

-- Content Engagement Scores table
CREATE TABLE IF NOT EXISTS content_engagement_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_path TEXT NOT NULL,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    
    -- Individual metrics (0-100 scale)
    time_score INTEGER DEFAULT 0,
    scroll_score INTEGER DEFAULT 0,
    interaction_score INTEGER DEFAULT 0,
    conversion_score INTEGER DEFAULT 0,
    
    -- Combined engagement score (0-100)
    total_engagement_score INTEGER DEFAULT 0,
    
    -- Supporting data
    avg_time_on_page DECIMAL(10,2),
    avg_scroll_depth DECIMAL(5,2),
    bounce_rate DECIMAL(5,2),
    conversion_rate DECIMAL(5,2),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(page_path, date)
);

-- Page Performance Summary table
CREATE TABLE IF NOT EXISTS page_performance_summary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_path TEXT NOT NULL,
    date DATE NOT NULL,
    
    -- Performance metrics aggregates
    avg_lcp DECIMAL(10,2),
    avg_fid DECIMAL(10,2),
    avg_cls DECIMAL(10,4),
    avg_ttfb DECIMAL(10,2),
    avg_load_time DECIMAL(10,2),
    
    -- Performance scores (0-100, Google PageSpeed style)
    performance_score INTEGER,
    lcp_score INTEGER,
    fid_score INTEGER,
    cls_score INTEGER,
    
    -- Visit data
    total_visits INTEGER DEFAULT 0,
    unique_visits INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(page_path, date)
);

-- Function to calculate engagement score
CREATE OR REPLACE FUNCTION calculate_engagement_score(
    time_on_page DECIMAL,
    scroll_depth DECIMAL,
    bounce_rate DECIMAL,
    conversion_rate DECIMAL
) RETURNS INTEGER AS $$
DECLARE
    time_score INTEGER := 0;
    scroll_score INTEGER := 0;
    interaction_score INTEGER := 0;
    conversion_score INTEGER := 0;
    total_score INTEGER := 0;
BEGIN
    -- Time score (0-25 points): 0-5min = 0-25 points
    time_score := LEAST(25, GREATEST(0, ROUND(time_on_page / 12)::INTEGER));
    
    -- Scroll score (0-25 points): 0-100% = 0-25 points  
    scroll_score := ROUND(scroll_depth * 25 / 100)::INTEGER;
    
    -- Interaction score (0-25 points): Inverse of bounce rate
    interaction_score := ROUND((100 - bounce_rate) * 25 / 100)::INTEGER;
    
    -- Conversion score (0-25 points): Newsletter signups, etc.
    conversion_score := ROUND(conversion_rate * 25 / 100)::INTEGER;
    
    total_score := time_score + scroll_score + interaction_score + conversion_score;
    
    RETURN LEAST(100, total_score);
END;
$$ LANGUAGE plpgsql;

-- Function to calculate performance score (Google PageSpeed style)
CREATE OR REPLACE FUNCTION calculate_performance_score(
    lcp_ms DECIMAL,
    fid_ms DECIMAL,
    cls_score DECIMAL
) RETURNS INTEGER AS $$
DECLARE
    lcp_points INTEGER := 0;
    fid_points INTEGER := 0;
    cls_points INTEGER := 0;
    total_score INTEGER := 0;
BEGIN
    -- LCP Score (0-40 points)
    IF lcp_ms IS NULL THEN lcp_points := 20;
    ELSIF lcp_ms <= 2500 THEN lcp_points := 40;
    ELSIF lcp_ms <= 4000 THEN lcp_points := 20;
    ELSE lcp_points := 0;
    END IF;
    
    -- FID Score (0-30 points)  
    IF fid_ms IS NULL THEN fid_points := 15;
    ELSIF fid_ms <= 100 THEN fid_points := 30;
    ELSIF fid_ms <= 300 THEN fid_points := 15;
    ELSE fid_points := 0;
    END IF;
    
    -- CLS Score (0-30 points)
    IF cls_score IS NULL THEN cls_points := 15;
    ELSIF cls_score <= 0.1 THEN cls_points := 30;
    ELSIF cls_score <= 0.25 THEN cls_points := 15;
    ELSE cls_points := 0;
    END IF;
    
    total_score := lcp_points + fid_points + cls_points;
    
    RETURN total_score;
END;
$$ LANGUAGE plpgsql;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON error_logs(severity);
CREATE INDEX IF NOT EXISTS idx_error_logs_group ON error_logs(error_group);
CREATE INDEX IF NOT EXISTS idx_error_logs_resolved ON error_logs(is_resolved);
CREATE INDEX IF NOT EXISTS idx_performance_alerts_acknowledged ON performance_alerts(is_acknowledged);
CREATE INDEX IF NOT EXISTS idx_content_engagement_date ON content_engagement_scores(date);
CREATE INDEX IF NOT EXISTS idx_content_engagement_score ON content_engagement_scores(total_engagement_score);
CREATE INDEX IF NOT EXISTS idx_page_performance_date ON page_performance_summary(date);
CREATE INDEX IF NOT EXISTS idx_page_performance_score ON page_performance_summary(performance_score); 