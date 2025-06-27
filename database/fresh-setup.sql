-- Max Your Points CMS - Fresh Database Setup
-- Run this in Supabase SQL Editor

-- Step 1: Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 2: Create custom types (with IF NOT EXISTS to avoid conflicts)
DO $$ 
BEGIN
    -- Create article_status enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'article_status') THEN
        CREATE TYPE article_status AS ENUM ('draft', 'published', 'scheduled');
    END IF;
    
    -- Create user_role enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'editor', 'author', 'subscriber');
    END IF;
END $$;

-- Step 3: Create tables (with IF NOT EXISTS to avoid conflicts)

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role user_role DEFAULT 'subscriber',
  verified BOOLEAN DEFAULT false,
  password_hash VARCHAR(255),
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7),
  icon VARCHAR(50),
  parent_id UUID REFERENCES categories(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  summary TEXT,
  content TEXT NOT NULL,
  hero_image_url TEXT,
  hero_image_alt VARCHAR(255),
  category_id UUID REFERENCES categories(id),
  author_id UUID REFERENCES users(id),
  status article_status DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  featured_main BOOLEAN DEFAULT false,
  featured_category BOOLEAN DEFAULT false,
  meta_description VARCHAR(320),
  focus_keyword VARCHAR(100),
  seo_score INTEGER DEFAULT 0,
  tags TEXT[],
  reading_time INTEGER,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media table
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_size INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  url TEXT NOT NULL,
  alt_text VARCHAR(255),
  caption TEXT,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active',
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  source VARCHAR(100),
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at);
CREATE INDEX IF NOT EXISTS idx_articles_category_id ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_featured_main ON articles(featured_main);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Step 5: Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 6: Add triggers (drop and recreate to avoid conflicts)
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_media_updated_at ON media;
CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON media
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Step 7: Insert default data (with conflict handling)

-- Insert categories
INSERT INTO categories (name, slug, description, color) VALUES
('Airlines and Aviation', 'airlines-and-aviation', 'Articles about airlines, aircraft, and aviation industry', '#3B82F6'),
('Credit Cards and Points', 'credit-cards-and-points', 'Credit card reviews and points strategies', '#10B981'),
('Hotels and Trip Reports', 'hotels-and-trip-reports', 'Hotel reviews and detailed trip reports', '#F59E0B'),
('Travel Hacks and Deals', 'travel-hacks-and-deals', 'Money-saving travel tips and deals', '#EF4444')
ON CONFLICT (slug) DO NOTHING;

-- Clean up any existing problematic user records safely
-- Option 1: Update existing user if exists, or create new one
INSERT INTO users (email, name, full_name, role, verified) VALUES
('isak.parild@gmail.com', 'Isak Parild', 'Isak Parild', 'admin', true)
ON CONFLICT (email) DO UPDATE SET 
role = 'admin', 
verified = true,
updated_at = NOW();

-- Clean up any other problematic users that might have invalid enum values
-- First, get the admin user ID for reassigning articles
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Get the admin user ID
    SELECT id INTO admin_user_id FROM users WHERE email = 'isak.parild@gmail.com';
    
    -- Update any articles from users we're about to delete to point to admin
    UPDATE articles SET author_id = admin_user_id 
    WHERE author_id IN (
        SELECT id FROM users 
        WHERE email != 'isak.parild@gmail.com' 
        AND (role NOT IN ('admin', 'editor', 'author', 'subscriber') OR role IS NULL)
    );
    
    -- Now safely delete problematic users
    DELETE FROM users 
    WHERE email != 'isak.parild@gmail.com' 
    AND (role NOT IN ('admin', 'editor', 'author', 'subscriber') OR role IS NULL);
END $$;

-- Insert sample article
INSERT INTO articles (
  title, 
  slug, 
  summary, 
  content, 
  category_id, 
  author_id,
  status,
  published_at,
  featured_main
) VALUES (
  'Welcome to Max Your Points CMS',
  'welcome-to-max-your-points-cms',
  'Your new CMS is ready! This is a sample article to test the system.',
  '<h2>Welcome to Max Your Points!</h2><p>Your CMS is now set up and ready to use. This system includes:</p><ul><li>✅ Next.js 15 frontend</li><li>✅ Supabase database</li><li>✅ Admin authentication</li><li>✅ Article management</li><li>✅ Media uploads</li></ul><p>You can edit or delete this article anytime from the admin panel.</p>',
  (SELECT id FROM categories WHERE slug = 'travel-hacks-and-deals' LIMIT 1),
  (SELECT id FROM users WHERE email = 'isak.parild@gmail.com' LIMIT 1),
  'published',
  NOW(),
  true
) ON CONFLICT (slug) DO NOTHING;

-- Step 8: Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Step 9: Create RLS Policies

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public articles viewable" ON articles;
DROP POLICY IF EXISTS "Public categories viewable" ON categories;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Service role full access" ON users;
DROP POLICY IF EXISTS "Service role articles access" ON articles;
DROP POLICY IF EXISTS "Service role categories access" ON categories;
DROP POLICY IF EXISTS "Service role media access" ON media;
DROP POLICY IF EXISTS "Service role newsletter access" ON newsletter_subscribers;

-- Public read access
CREATE POLICY "Public articles viewable" ON articles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public categories viewable" ON categories
  FOR SELECT USING (is_active = true);

-- Service role (your backend) has full access
CREATE POLICY "Service role full access" ON users
  FOR ALL USING (current_setting('role') = 'service_role');

CREATE POLICY "Service role articles access" ON articles
  FOR ALL USING (current_setting('role') = 'service_role');

CREATE POLICY "Service role categories access" ON categories
  FOR ALL USING (current_setting('role') = 'service_role');

CREATE POLICY "Service role media access" ON media
  FOR ALL USING (current_setting('role') = 'service_role');

CREATE POLICY "Service role newsletter access" ON newsletter_subscribers
  FOR ALL USING (current_setting('role') = 'service_role');

-- Verification queries
SELECT 'Database setup complete! 🎉' AS message;
SELECT 'Admin user created:' AS info, email, role FROM users WHERE role = 'admin';
SELECT 'Categories created:' AS info, count(*) as total FROM categories;
SELECT 'Sample article created:' AS info, count(*) as total FROM articles; 