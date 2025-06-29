-- Enhanced Newsletter System with Article Selection
-- Run this in your Supabase SQL Editor

-- Add campaign_articles table to track which articles are included in each campaign
CREATE TABLE IF NOT EXISTS newsletter_campaign_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES newsletter_campaigns(id) ON DELETE CASCADE,
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  position INTEGER DEFAULT 0, -- Order of article in newsletter
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campaign_id, article_id)
);

-- Add indexes for campaign articles
CREATE INDEX IF NOT EXISTS idx_campaign_articles_campaign_id ON newsletter_campaign_articles(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_articles_article_id ON newsletter_campaign_articles(article_id);
CREATE INDEX IF NOT EXISTS idx_campaign_articles_position ON newsletter_campaign_articles(position);

-- Enable RLS for campaign articles
ALTER TABLE newsletter_campaign_articles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for campaign articles
CREATE POLICY "Allow admin users to manage campaign articles" ON newsletter_campaign_articles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'editor')
    )
  );

-- Update newsletter_campaigns table to include additional fields
ALTER TABLE newsletter_campaigns 
ADD COLUMN IF NOT EXISTS campaign_type VARCHAR(50) DEFAULT 'custom' CHECK (campaign_type IN ('weekly', 'airfare_daily', 'custom')),
ADD COLUMN IF NOT EXISTS target_date DATE,
ADD COLUMN IF NOT EXISTS description TEXT;

-- Delete existing templates first to avoid conflicts
DELETE FROM newsletter_templates WHERE name IN ('Weekly Newsletter Template', 'Airfare Deal of the Day', 'Subscription Confirmation', 'Unsubscribe Confirmation');

-- Insert enhanced newsletter templates
INSERT INTO newsletter_templates (name, subject, content, html_content, type) VALUES 
(
  'Weekly Newsletter Template',
  'Max Your Points Weekly: {{date}} Edition ✈️',
  'Your weekly travel tips and deals are here!',
  '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Max Your Points Weekly</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%); padding: 40px 20px; text-align: center; }
        .header h1 { color: white; font-size: 28px; margin-bottom: 10px; }
        .header p { color: rgba(255,255,255,0.9); font-size: 16px; }
        .content { padding: 30px 20px; }
        .date-badge { background: #ecfdf5; color: #065f46; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; margin-bottom: 30px; display: inline-block; }
        .intro { font-size: 18px; color: #374151; margin-bottom: 30px; }
        .articles-section { margin: 30px 0; }
        .articles-title { color: #0f766e; font-size: 24px; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #14b8a6; }
        .article-item { background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #14b8a6; }
        .article-title { color: #0f766e; font-size: 20px; font-weight: 600; margin-bottom: 10px; }
        .article-excerpt { color: #4b5563; font-size: 16px; margin-bottom: 15px; }
        .article-link { background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; }
        .footer { background: #1f2937; color: white; padding: 30px 20px; text-align: center; }
        .social-links { margin: 20px 0; }
        .social-links a { color: #14b8a6; text-decoration: none; margin: 0 10px; }
        .unsubscribe { font-size: 12px; color: #9ca3af; margin-top: 20px; }
        .unsubscribe a { color: #14b8a6; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Max Your Points Weekly ✈️</h1>
            <p>Your travel hacking digest is here!</p>
        </div>
        
        <div class="content">
            <div class="date-badge">{{date}}</div>
            
            <div class="intro">
                Hey there, travel hacker! 👋<br><br>
                Ready for another week of epic travel deals, credit card hacks, and points strategies? 
                We''ve curated the best content just for you.
            </div>
            
            <div class="articles-section">
                <h2 class="articles-title">🎯 This Week''s Must-Reads</h2>
                
                <!-- ARTICLES WILL BE INSERTED HERE -->
                {{articles}}
                
            </div>
            
            <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); padding: 25px; border-radius: 12px; margin: 30px 0; text-align: center;">
                <h3 style="color: #065f46; margin-bottom: 15px;">💡 Weekly Travel Tip</h3>
                <p style="color: #047857; font-style: italic;">
                    "Always check award availability before transferring points. Sometimes the best deals are hiding in plain sight!"
                </p>
            </div>
        </div>
        
        <div class="footer">
            <h3 style="color: #14b8a6; margin-bottom: 15px;">Stay Connected</h3>
            <div class="social-links">
                <a href="https://x.com/max_your_points">Follow us on X</a> | 
                <a href="https://maxyourpoints.com">Visit our website</a>
            </div>
            <p style="color: #9ca3af;">
                Making travel dreams affordable, one point at a time.
            </p>
            <div class="unsubscribe">
                <p>Don''t want these emails? <a href="{{unsubscribe_url}}">Unsubscribe here</a></p>
                <p>Max Your Points | Built with love by Isak Parild</p>
            </div>
        </div>
    </div>
</body>
</html>',
  'weekly'
);

INSERT INTO newsletter_templates (name, subject, content, html_content, type) VALUES 
(
  'Airfare Deal of the Day',
  '🔥 Daily Airfare Alert: {{destination}} from ${{price}}!',
  'Amazing airfare deal spotted!',
  '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Airfare Deal Alert</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #fef3c7; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px 20px; text-align: center; position: relative; }
        .header::before { content: "✈️"; font-size: 40px; position: absolute; top: -5px; right: 20px; opacity: 0.3; }
        .alert-badge { background: #dc2626; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 15px; display: inline-block; }
        .header h1 { color: white; font-size: 32px; margin-bottom: 8px; font-weight: 700; }
        .header p { color: rgba(255,255,255,0.9); font-size: 18px; }
        .deal-highlight { background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%); padding: 30px 20px; text-align: center; border-bottom: 3px solid #f59e0b; }
        .price { font-size: 48px; font-weight: 900; color: #dc2626; margin: 10px 0; }
        .destination { font-size: 24px; color: #92400e; font-weight: 600; margin-bottom: 10px; }
        .deal-details { color: #78350f; font-size: 16px; }
        .content { padding: 30px 20px; }
        .urgency { background: #fef2f2; border: 2px solid #fecaca; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center; }
        .urgency h3 { color: #dc2626; font-size: 20px; margin-bottom: 10px; }
        .urgency p { color: #991b1b; font-weight: 600; }
        .cta-button { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 18px 36px; text-decoration: none; border-radius: 12px; display: inline-block; font-weight: 700; font-size: 18px; margin: 20px 0; box-shadow: 0 4px 15px rgba(220,38,38,0.3); }
        .features { background: #f8fafc; border-radius: 12px; padding: 25px; margin: 25px 0; }
        .features h3 { color: #0f766e; margin-bottom: 15px; }
        .features ul { list-style: none; }
        .features li { color: #374151; margin-bottom: 8px; padding-left: 20px; position: relative; }
        .features li::before { content: "✓"; color: #10b981; font-weight: bold; position: absolute; left: 0; }
        .articles-section { margin: 30px 0; }
        .articles-title { color: #92400e; font-size: 20px; margin-bottom: 15px; }
        .article-item { background: #fffbeb; border-radius: 8px; padding: 15px; margin-bottom: 15px; border-left: 4px solid #f59e0b; }
        .article-title { color: #92400e; font-size: 16px; font-weight: 600; margin-bottom: 8px; }
        .article-excerpt { color: #78350f; font-size: 14px; margin-bottom: 10px; }
        .article-link { color: #d97706; text-decoration: none; font-weight: 600; font-size: 14px; }
        .footer { background: #1f2937; color: white; padding: 25px 20px; text-align: center; }
        .unsubscribe { font-size: 12px; color: #9ca3af; margin-top: 15px; }
        .unsubscribe a { color: #f59e0b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="alert-badge">Deal Alert</div>
            <h1>🔥 Airfare Alert!</h1>
            <p>Limited time deal spotted</p>
        </div>
        
        <div class="deal-highlight">
            <div class="destination">{{destination}}</div>
            <div class="price">${{price}}</div>
            <div class="deal-details">Round-trip from {{origin}} | {{dates}}</div>
        </div>
        
        <div class="content">
            <div class="urgency">
                <h3>⏰ Act Fast!</h3>
                <p>This deal typically sells out within 24-48 hours</p>
            </div>
            
            <div style="text-align: center;">
                <a href="{{booking_link}}" class="cta-button">Book This Deal Now →</a>
            </div>
            
            <div class="features">
                <h3>🎯 Why This Deal Rocks:</h3>
                <ul>
                    <li>{{discount}}% off regular price</li>
                    <li>Major airline with good reviews</li>
                    <li>Flexible change policies</li>
                    <li>Available for multiple travel dates</li>
                    <li>Perfect for earning points/miles</li>
                </ul>
            </div>
            
            <div class="articles-section">
                <h3 class="articles-title">📚 Related Travel Tips</h3>
                <!-- ARTICLES WILL BE INSERTED HERE -->
                {{articles}}
            </div>
            
            <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
                <p style="color: #065f46; font-weight: 600;">
                    💡 Pro Tip: Use a travel rewards credit card for 2-3x points on this purchase!
                </p>
            </div>
        </div>
        
        <div class="footer">
            <h3 style="color: #f59e0b; margin-bottom: 10px;">Max Your Points</h3>
            <p style="color: #9ca3af; font-size: 14px;">
                Daily deals, weekly tips, lifetime savings.
            </p>
            <div class="unsubscribe">
                <p>Don''t want deal alerts? <a href="{{unsubscribe_url}}">Unsubscribe here</a></p>
                <p>Max Your Points | Built with love by Isak Parild</p>
            </div>
        </div>
    </div>
</body>
</html>',
  'custom'
);

-- Insert custom subscription confirmation template
INSERT INTO newsletter_templates (name, subject, content, html_content, type) VALUES 
(
  'Subscription Confirmation',
  '🎉 Welcome to Max Your Points! Your travel journey starts now ✈️',
  'Welcome to the Max Your Points community!',
  '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Max Your Points!</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f0fdf4; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 50px 20px; text-align: center; position: relative; }
        .header::before { content: "🎉"; font-size: 60px; position: absolute; top: 10px; right: 30px; opacity: 0.3; }
        .header h1 { color: white; font-size: 36px; margin-bottom: 15px; font-weight: 700; }
        .header p { color: rgba(255,255,255,0.95); font-size: 20px; }
        .welcome-badge { background: #dcfce7; color: #166534; padding: 10px 20px; border-radius: 25px; font-size: 14px; font-weight: 700; margin-bottom: 30px; display: inline-block; }
        .content { padding: 40px 30px; }
        .intro { font-size: 18px; color: #374151; margin-bottom: 30px; text-align: center; }
        .benefits { background: #f0fdf4; border-radius: 12px; padding: 30px; margin: 30px 0; }
        .benefits h3 { color: #166534; font-size: 24px; margin-bottom: 20px; text-align: center; }
        .benefit-item { display: flex; align-items: flex-start; margin-bottom: 20px; }
        .benefit-icon { background: #10b981; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; flex-shrink: 0; }
        .benefit-text { color: #374151; }
        .benefit-title { font-weight: 600; color: #166534; margin-bottom: 5px; }
        .cta-section { background: linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%); border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; }
        .cta-section h3 { color: #5b21b6; margin-bottom: 15px; }
        .cta-button { background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; display: inline-block; font-weight: 600; font-size: 16px; margin: 10px; }
        .social-proof { background: #fffbeb; border: 2px solid #fed7aa; border-radius: 12px; padding: 25px; margin: 30px 0; text-align: center; }
        .social-proof h4 { color: #92400e; margin-bottom: 15px; }
        .stats { display: flex; justify-content: space-around; margin: 20px 0; }
        .stat { text-align: center; }
        .stat-number { font-size: 28px; font-weight: 900; color: #dc2626; }
        .stat-label { font-size: 12px; color: #78350f; text-transform: uppercase; font-weight: 600; }
        .footer { background: #1f2937; color: white; padding: 30px 20px; text-align: center; }
        .social-links { margin: 20px 0; }
        .social-links a { color: #10b981; text-decoration: none; margin: 0 15px; font-weight: 600; }
        .unsubscribe { font-size: 12px; color: #9ca3af; margin-top: 20px; }
        .unsubscribe a { color: #10b981; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome aboard! 🚀</h1>
            <p>Your travel rewards journey starts now</p>
        </div>
        
        <div class="content">
            <div class="welcome-badge">✈️ New Subscriber</div>
            
            <div class="intro">
                Hey {{subscriber_name}}! 👋<br><br>
                Welcome to the Max Your Points community! You''ve just joined thousands of smart travelers 
                who are maximizing their points, miles, and travel experiences.
            </div>
            
            <div class="benefits">
                <h3>🎯 Here''s what you''ll get:</h3>
                
                <div class="benefit-item">
                    <div class="benefit-icon">📧</div>
                    <div class="benefit-text">
                        <div class="benefit-title">Weekly Newsletter</div>
                        Every week, get curated travel tips, credit card strategies, and exclusive deals.
                    </div>
                </div>
                
                <div class="benefit-item">
                    <div class="benefit-icon">🔥</div>
                    <div class="benefit-text">
                        <div class="benefit-title">Daily Deal Alerts</div>
                        Be the first to know about mistake fares, flash sales, and amazing travel deals.
                    </div>
                </div>
                
                <div class="benefit-item">
                    <div class="benefit-icon">💳</div>
                    <div class="benefit-text">
                        <div class="benefit-title">Credit Card Guides</div>
                        Learn which cards offer the best bonuses and how to maximize your earning potential.
                    </div>
                </div>
                
                <div class="benefit-item">
                    <div class="benefit-icon">🏆</div>
                    <div class="benefit-text">
                        <div class="benefit-title">Exclusive Content</div>
                        Subscriber-only tips, strategies, and insider knowledge from travel experts.
                    </div>
                </div>
            </div>
            
            <div class="cta-section">
                <h3>🚀 Start exploring right now!</h3>
                <p style="color: #5b21b6; margin-bottom: 20px;">Check out our most popular guides to get started</p>
                <a href="https://maxyourpoints.com/blog" class="cta-button">Browse Latest Articles</a>
                <a href="https://maxyourpoints.com/blog/categories/credit-cards-and-points" class="cta-button">Credit Card Guides</a>
            </div>
            
            <div class="social-proof">
                <h4>🌟 Join thousands of happy travelers</h4>
                <div class="stats">
                    <div class="stat">
                        <div class="stat-number">25k+</div>
                        <div class="stat-label">Subscribers</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">$2M+</div>
                        <div class="stat-label">Saved</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">500+</div>
                        <div class="stat-label">Countries</div>
                    </div>
                </div>
                <p style="color: #78350f; font-style: italic; margin-top: 15px;">
                    "Thanks to Max Your Points, I saved over $3,000 on my honeymoon flights!" - Sarah M.
                </p>
            </div>
        </div>
        
        <div class="footer">
            <h3 style="color: #10b981; margin-bottom: 15px;">Max Your Points</h3>
            <div class="social-links">
                <a href="https://x.com/max_your_points">Follow on X</a> | 
                <a href="https://maxyourpoints.com">Visit Website</a> |
                <a href="mailto:isak@maxyourpoints.com">Contact Us</a>
            </div>
            <p style="color: #9ca3af; margin: 15px 0;">
                Making travel dreams affordable, one point at a time.
            </p>
            <div class="unsubscribe">
                <p>Change your preferences or <a href="{{unsubscribe_url}}">unsubscribe here</a></p>
                <p>Max Your Points | Built with love by Isak Parild</p>
            </div>
        </div>
    </div>
</body>
</html>',
  'welcome'
);

-- Insert custom unsubscription confirmation template  
INSERT INTO newsletter_templates (name, subject, content, html_content, type) VALUES 
(
  'Unsubscribe Confirmation',
  'Sorry to see you go! 😢 You''ve been unsubscribed',
  'You have been successfully unsubscribed.',
  '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Unsubscribed - Max Your Points</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f9fafb; }
        .container { max-width: 600px; margin: 50px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 20px; text-align: center; }
        .header h1 { color: white; font-size: 32px; margin-bottom: 10px; }
        .header p { color: rgba(255,255,255,0.9); font-size: 18px; }
        .content { padding: 40px 30px; text-align: center; }
        .sad-emoji { font-size: 64px; margin-bottom: 20px; }
        .message { font-size: 18px; color: #374151; margin-bottom: 30px; }
        .feedback-section { background: #f9fafb; border-radius: 12px; padding: 30px; margin: 30px 0; }
        .feedback-section h3 { color: #374151; margin-bottom: 20px; }
        .feedback-reasons { text-align: left; }
        .feedback-reasons label { display: block; margin-bottom: 15px; color: #4b5563; cursor: pointer; }
        .feedback-reasons input { margin-right: 10px; }
        .resubscribe-section { background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 12px; padding: 30px; margin: 30px 0; }
        .resubscribe-section h3 { color: #065f46; margin-bottom: 15px; }
        .resubscribe-button { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; margin-top: 15px; }
        .footer { background: #1f2937; color: white; padding: 25px 20px; text-align: center; }
        .social-links a { color: #10b981; text-decoration: none; margin: 0 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>You''re all set 👋</h1>
            <p>We''ve removed you from our mailing list</p>
        </div>
        
        <div class="content">
            <div class="sad-emoji">😢</div>
            
            <div class="message">
                <strong>{{subscriber_email}}</strong> has been successfully unsubscribed from Max Your Points.<br><br>
                We''re sorry to see you go! We hope our content was helpful during your time with us.
            </div>
            
            <div class="feedback-section">
                <h3>📝 Help us improve (optional)</h3>
                <p style="color: #6b7280; margin-bottom: 20px;">Why did you unsubscribe?</p>
                <form class="feedback-reasons">
                    <label><input type="checkbox"> Too many emails</label>
                    <label><input type="checkbox"> Content wasn''t relevant</label>
                    <label><input type="checkbox"> Found better alternatives</label>
                    <label><input type="checkbox"> No longer traveling</label>
                    <label><input type="checkbox"> Other reason</label>
                </form>
            </div>
            
            <div class="resubscribe-section">
                <h3>🤔 Changed your mind?</h3>
                <p style="color: #047857;">
                    No worries! You can always resubscribe at any time to get back to maximizing your travel rewards.
                </p>
                <a href="https://maxyourpoints.com" class="resubscribe-button">Resubscribe</a>
            </div>
            
            <div style="background: #fffbeb; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <p style="color: #92400e; font-size: 16px;">
                    💡 <strong>Quick tip:</strong> You can always check our website for the latest travel deals and tips at 
                    <a href="https://maxyourpoints.com" style="color: #d97706;">maxyourpoints.com</a>
                </p>
            </div>
        </div>
        
        <div class="footer">
            <h3 style="color: #10b981; margin-bottom: 15px;">Max Your Points</h3>
            <div class="social-links">
                <a href="https://x.com/max_your_points">Follow on X</a> | 
                <a href="https://maxyourpoints.com">Visit Website</a> |
                <a href="mailto:isak@maxyourpoints.com">Contact Us</a>
            </div>
            <p style="color: #9ca3af; margin: 15px 0; font-size: 14px;">
                Thanks for being part of our journey!
            </p>
            <p style="color: #6b7280; font-size: 12px;">
                Max Your Points | Built with love by Isak Parild
            </p>
        </div>
    </div>
</body>
</html>',
  'custom'
);

-- Refresh the updated_at for all templates
UPDATE newsletter_templates SET updated_at = NOW(); 