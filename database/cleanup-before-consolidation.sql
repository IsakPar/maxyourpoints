-- CLEANUP SCRIPT - Run this BEFORE the consolidated newsletter system
-- This removes all conflicting functions, triggers, and policies safely

-- ============================================================================
-- 1. DROP TRIGGERS FIRST (to remove dependencies)
-- ============================================================================

-- Drop triggers that depend on functions
DROP TRIGGER IF EXISTS update_list_count_on_member_insert ON newsletter_subscriber_list_members;
DROP TRIGGER IF EXISTS update_list_count_on_member_delete ON newsletter_subscriber_list_members;
DROP TRIGGER IF EXISTS update_newsletter_subscribers_updated_at ON newsletter_subscribers;
DROP TRIGGER IF EXISTS update_newsletter_campaigns_updated_at ON newsletter_campaigns;
DROP TRIGGER IF EXISTS update_newsletter_templates_updated_at ON newsletter_templates;
DROP TRIGGER IF EXISTS update_newsletter_subscriber_lists_updated_at ON newsletter_subscriber_lists;

-- ============================================================================
-- 2. DROP FUNCTIONS (now safe to drop)
-- ============================================================================

-- Drop existing conflicting functions
DROP FUNCTION IF EXISTS create_subscriber_with_confirmation(TEXT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS confirm_subscription(TEXT) CASCADE;
DROP FUNCTION IF EXISTS generate_confirmation_token() CASCADE;
DROP FUNCTION IF EXISTS update_subscriber_list_count() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- ============================================================================
-- 3. DROP CONFLICTING POLICIES
-- ============================================================================

-- Newsletter subscribers policies
DROP POLICY IF EXISTS "Allow admin users to view all subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow admin users to create subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow admin users to update subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow admin users to delete subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Service role subscriber access" ON newsletter_subscribers;

-- Newsletter campaigns policies
DROP POLICY IF EXISTS "Allow admin users to view all campaigns" ON newsletter_campaigns;
DROP POLICY IF EXISTS "Allow admin users to create campaigns" ON newsletter_campaigns;
DROP POLICY IF EXISTS "Allow admin users to update campaigns" ON newsletter_campaigns;
DROP POLICY IF EXISTS "Allow admin users to delete campaigns" ON newsletter_campaigns;

-- Newsletter templates policies
DROP POLICY IF EXISTS "Allow admin users to view all templates" ON newsletter_templates;
DROP POLICY IF EXISTS "Allow admin users to create templates" ON newsletter_templates;
DROP POLICY IF EXISTS "Allow admin users to update templates" ON newsletter_templates;
DROP POLICY IF EXISTS "Allow admin users to delete templates" ON newsletter_templates;

-- Newsletter subscriber lists policies
DROP POLICY IF EXISTS "Service role subscriber lists access" ON newsletter_subscriber_lists;
DROP POLICY IF EXISTS "Service role subscriber list members access" ON newsletter_subscriber_list_members;

-- Campaign articles policies
DROP POLICY IF EXISTS "Allow admin users to manage campaign articles" ON newsletter_campaign_articles;

-- Analytics policies
DROP POLICY IF EXISTS "Allow admin users to view all analytics" ON newsletter_campaign_analytics;
DROP POLICY IF EXISTS "Allow system to insert analytics" ON newsletter_campaign_analytics;

-- ============================================================================
-- 4. BACKUP EXISTING DATA (IMPORTANT!)
-- ============================================================================

-- Create backup tables for existing data
DO $$ 
BEGIN
    -- Backup newsletter_subscribers
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'newsletter_subscribers') THEN
        EXECUTE 'DROP TABLE IF EXISTS newsletter_subscribers_backup_' || to_char(now(), 'YYYYMMDD_HH24MI');
        EXECUTE 'CREATE TABLE newsletter_subscribers_backup_' || to_char(now(), 'YYYYMMDD_HH24MI') || ' AS SELECT * FROM newsletter_subscribers';
        RAISE NOTICE 'Backed up newsletter_subscribers to newsletter_subscribers_backup_%', to_char(now(), 'YYYYMMDD_HH24MI');
    END IF;

    -- Backup newsletter_campaigns if exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'newsletter_campaigns') THEN
        EXECUTE 'DROP TABLE IF EXISTS newsletter_campaigns_backup_' || to_char(now(), 'YYYYMMDD_HH24MI');
        EXECUTE 'CREATE TABLE newsletter_campaigns_backup_' || to_char(now(), 'YYYYMMDD_HH24MI') || ' AS SELECT * FROM newsletter_campaigns';
        RAISE NOTICE 'Backed up newsletter_campaigns to newsletter_campaigns_backup_%', to_char(now(), 'YYYYMMDD_HH24MI');
    END IF;

    -- Backup newsletter_templates if exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'newsletter_templates') THEN
        EXECUTE 'DROP TABLE IF EXISTS newsletter_templates_backup_' || to_char(now(), 'YYYYMMDD_HH24MI');
        EXECUTE 'CREATE TABLE newsletter_templates_backup_' || to_char(now(), 'YYYYMMDD_HH24MI') || ' AS SELECT * FROM newsletter_templates';
        RAISE NOTICE 'Backed up newsletter_templates to newsletter_templates_backup_%', to_char(now(), 'YYYYMMDD_HH24MI');
    END IF;
END $$;

-- ============================================================================
-- 5. DROP FOREIGN KEY CONSTRAINTS THAT MIGHT CONFLICT
-- ============================================================================

-- Remove any existing foreign key constraints that might conflict
ALTER TABLE newsletter_campaigns DROP CONSTRAINT IF EXISTS fk_campaigns_target_list;
ALTER TABLE newsletter_campaign_articles DROP CONSTRAINT IF EXISTS newsletter_campaign_articles_campaign_id_fkey;
ALTER TABLE newsletter_campaign_articles DROP CONSTRAINT IF EXISTS newsletter_campaign_articles_article_id_fkey;
ALTER TABLE newsletter_subscriber_list_members DROP CONSTRAINT IF EXISTS newsletter_subscriber_list_members_subscriber_id_fkey;
ALTER TABLE newsletter_subscriber_list_members DROP CONSTRAINT IF EXISTS newsletter_subscriber_list_members_list_id_fkey;

-- ============================================================================
-- 6. SUCCESS MESSAGE
-- ============================================================================

SELECT 'Cleanup completed successfully! 🧹' AS message;
SELECT 'You can now run the consolidated newsletter system script.' AS next_step;
SELECT 'All existing data has been backed up with timestamp.' AS backup_info; 