-- ============================================================
-- INFONESIA.ID — AI NEWS PORTAL
-- Database Schema v1.0
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- 1. USERS & ROLES
-- ============================================================

CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE, -- superadmin, admin, editor, viewer
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id),
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. CATEGORIES & TAGS
-- ============================================================

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#DC2626',
  icon TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. ARTICLES
-- ============================================================

CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  alt_titles JSONB DEFAULT '[]',
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  summary_points JSONB DEFAULT '[]',
  why_it_matters TEXT,
  next_to_watch TEXT,
  content_text TEXT,
  content_html TEXT,
  cover_image_prompt TEXT,
  cover_image_url TEXT,
  cover_image_alt TEXT,
  category_id UUID REFERENCES categories(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','review','scheduled','published','rejected','archived')),
  is_breaking BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_trending BOOLEAN DEFAULT FALSE,
  is_pinned BOOLEAN DEFAULT FALSE,
  source_count INTEGER DEFAULT 0,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending','partial','verified','disputed')),
  -- Quality Scores
  originality_score NUMERIC(5,2) DEFAULT 0,
  readability_score NUMERIC(5,2) DEFAULT 0,
  seo_score NUMERIC(5,2) DEFAULT 0,
  factual_consistency_score NUMERIC(5,2) DEFAULT 0,
  duplication_risk_score NUMERIC(5,2) DEFAULT 0,
  publish_readiness_score NUMERIC(5,2) DEFAULT 0,
  -- Author
  author_type TEXT DEFAULT 'ai' CHECK (author_type IN ('ai','human','hybrid')),
  author_label TEXT DEFAULT 'Tim Redaksi AI',
  editor_id UUID REFERENCES profiles(id),
  editor_notes TEXT,
  -- Scheduling
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  -- SEO
  canonical_url TEXT,
  meta_title TEXT,
  meta_description TEXT,
  focus_keyword TEXT,
  related_keywords JSONB DEFAULT '[]',
  -- Stats
  word_count INTEGER DEFAULT 0,
  reading_time INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  -- Workflow
  workflow_run_id UUID,
  generation_model TEXT,
  generation_prompt TEXT,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS article_tags (
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

CREATE TABLE IF NOT EXISTS article_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  title TEXT,
  content_html TEXT,
  changed_by UUID REFERENCES profiles(id),
  change_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. SOURCES
-- ============================================================

CREATE TABLE IF NOT EXISTS sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_name TEXT NOT NULL,
  source_type TEXT DEFAULT 'media' CHECK (source_type IN ('media','official','government','corporate','wire')),
  source_home_url TEXT NOT NULL,
  rss_url TEXT,
  priority INTEGER DEFAULT 5,
  trust_score NUMERIC(3,1) DEFAULT 8.0,
  verification_level TEXT DEFAULT 'trusted' CHECK (verification_level IN ('trusted','verified','official','unverified')),
  is_active BOOLEAN DEFAULT TRUE,
  last_fetched_at TIMESTAMPTZ,
  fetch_interval_minutes INTEGER DEFAULT 60,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS source_fetch_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id UUID REFERENCES sources(id),
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  articles_found INTEGER DEFAULT 0,
  articles_new INTEGER DEFAULT 0,
  status TEXT DEFAULT 'success',
  error_message TEXT,
  duration_ms INTEGER
);

CREATE TABLE IF NOT EXISTS article_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  source_id UUID REFERENCES sources(id),
  source_url TEXT NOT NULL,
  source_title TEXT,
  source_name TEXT,
  source_type TEXT DEFAULT 'media',
  fetched_summary TEXT,
  published_at_source TIMESTAMPTZ,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  is_primary BOOLEAN DEFAULT FALSE
);

-- ============================================================
-- 5. TRENDING & TOPIC CLUSTERING
-- ============================================================

CREATE TABLE IF NOT EXISTS trending_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  keyword TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  hotness_score NUMERIC(5,2) DEFAULT 0,
  source_count INTEGER DEFAULT 0,
  article_count INTEGER DEFAULT 0,
  category_id UUID REFERENCES categories(id),
  trend_start TIMESTAMPTZ DEFAULT NOW(),
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS topic_clusters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  summary TEXT,
  keywords JSONB DEFAULT '[]',
  entities JSONB DEFAULT '[]',
  source_urls JSONB DEFAULT '[]',
  hotness_score NUMERIC(5,2) DEFAULT 0,
  category_id UUID REFERENCES categories(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','selected','processing','done','skipped')),
  workflow_run_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. EDITORIAL & REVIEWS
-- ============================================================

CREATE TABLE IF NOT EXISTS editorial_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES profiles(id),
  decision TEXT CHECK (decision IN ('approve','reject','revise','schedule')),
  notes TEXT,
  score_override JSONB,
  reviewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. WORKFLOW
-- ============================================================

CREATE TABLE IF NOT EXISTS workflow_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  run_type TEXT DEFAULT 'daily' CHECK (run_type IN ('daily','breaking','manual','test')),
  status TEXT DEFAULT 'running' CHECK (status IN ('running','completed','failed','partial')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  topics_found INTEGER DEFAULT 0,
  topics_selected INTEGER DEFAULT 0,
  articles_generated INTEGER DEFAULT 0,
  articles_published INTEGER DEFAULT 0,
  articles_rejected INTEGER DEFAULT 0,
  articles_queued_review INTEGER DEFAULT 0,
  error_log JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS publish_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  workflow_run_id UUID REFERENCES workflow_runs(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','processing','published','failed','skipped')),
  publish_target TEXT DEFAULT 'website' CHECK (publish_target IN ('website','wordpress','both')),
  scheduled_for TIMESTAMPTZ,
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 8. SEO & MEDIA
-- ============================================================

CREATE TABLE IF NOT EXISTS seo_metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type TEXT NOT NULL, -- article, category, tag, page
  entity_id UUID NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  twitter_title TEXT,
  twitter_description TEXT,
  focus_keyword TEXT,
  alt_headlines JSONB DEFAULT '[]',
  schema_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  file_name TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  alt_text TEXT,
  caption TEXT,
  source_credit TEXT,
  is_cover BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 9. ADS & HOMEPAGE
-- ============================================================

CREATE TABLE IF NOT EXISTS ad_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slot_name TEXT NOT NULL UNIQUE,
  slot_position TEXT NOT NULL, -- header_banner, in_content_1, in_content_2, sidebar, sticky_mobile, footer
  ad_code TEXT,
  is_active BOOLEAN DEFAULT FALSE,
  device_target TEXT DEFAULT 'all' CHECK (device_target IN ('all','desktop','mobile')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS homepage_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key TEXT NOT NULL UNIQUE,
  section_title TEXT,
  section_type TEXT, -- hero, grid, trending, category_feed, editor_picks, popular
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  config JSONB DEFAULT '{}'
);

-- ============================================================
-- 10. WORDPRESS SYNC
-- ============================================================

CREATE TABLE IF NOT EXISTS wordpress_sync_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  wp_post_id INTEGER,
  wp_post_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','synced','failed','skipped')),
  error_message TEXT,
  synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 11. ANALYTICS & AUDIT
-- ============================================================

CREATE TABLE IF NOT EXISTS analytics_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  snapshot_date DATE NOT NULL,
  total_articles INTEGER DEFAULT 0,
  published_today INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  top_articles JSONB DEFAULT '[]',
  top_categories JSONB DEFAULT '[]',
  top_keywords JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 12. SITE SETTINGS
-- ============================================================

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_is_breaking ON articles(is_breaking) WHERE is_breaking = TRUE;
CREATE INDEX IF NOT EXISTS idx_articles_is_featured ON articles(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_articles_trending ON articles(is_trending) WHERE is_trending = TRUE;
CREATE INDEX IF NOT EXISTS idx_articles_fulltext ON articles USING gin(to_tsvector('indonesian', coalesce(title,'') || ' ' || coalesce(excerpt,'')));
CREATE INDEX IF NOT EXISTS idx_source_fetch_logs_source ON source_fetch_logs(source_id, fetched_at DESC);
CREATE INDEX IF NOT EXISTS idx_trending_hotness ON trending_topics(hotness_score DESC) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_workflow_runs_started ON workflow_runs(started_at DESC);

-- ============================================================
-- SEED: CATEGORIES
-- ============================================================

INSERT INTO categories (name, slug, description, color, display_order) VALUES
  ('Nasional', 'nasional', 'Berita nasional Indonesia', '#DC2626', 1),
  ('Politik', 'politik', 'Politik dan pemerintahan', '#7C3AED', 2),
  ('Hukum', 'hukum', 'Hukum dan peradilan', '#1D4ED8', 3),
  ('Ekonomi', 'ekonomi', 'Ekonomi dan bisnis', '#059669', 4),
  ('Teknologi', 'teknologi', 'Teknologi dan inovasi', '#0891B2', 5),
  ('Sosial', 'sosial', 'Isu sosial dan masyarakat', '#D97706', 6),
  ('Internasional', 'internasional', 'Berita dunia', '#6B7280', 7),
  ('Viral', 'viral', 'Trending dan viral', '#EC4899', 8)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SEED: SOURCES
-- ============================================================

INSERT INTO sources (source_name, source_type, source_home_url, rss_url, priority, trust_score, verification_level) VALUES
  ('ANTARA News', 'wire', 'https://www.antaranews.com', 'https://www.antaranews.com/rss/top-stories.xml', 10, 9.5, 'official'),
  ('Kompas.com', 'media', 'https://www.kompas.com', 'https://rss.kompas.com/feed/news/nasional', 9, 9.0, 'verified'),
  ('Tempo.co', 'media', 'https://www.tempo.co', 'https://www.tempo.co/rss/nasional', 9, 9.0, 'verified'),
  ('Liputan6.com', 'media', 'https://www.liputan6.com', 'https://www.liputan6.com/rssfeeds/1/', 8, 8.5, 'verified'),
  ('MetroTV News', 'media', 'https://www.metrotvnews.com', 'https://www.metrotvnews.com/rss', 8, 8.5, 'verified')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED: AD SLOTS
-- ============================================================

INSERT INTO ad_slots (slot_name, slot_position, is_active, device_target, display_order) VALUES
  ('Header Banner', 'header_banner', FALSE, 'all', 1),
  ('In-Content 1', 'in_content_1', FALSE, 'all', 2),
  ('In-Content 2', 'in_content_2', FALSE, 'all', 3),
  ('Sidebar Desktop', 'sidebar', FALSE, 'desktop', 4),
  ('Sticky Mobile', 'sticky_mobile', FALSE, 'mobile', 5),
  ('Footer', 'footer', FALSE, 'all', 6)
ON CONFLICT (slot_name) DO NOTHING;

-- ============================================================
-- SEED: SITE SETTINGS
-- ============================================================

INSERT INTO site_settings (key, value, description) VALUES
  ('site_name', '"InfoNesia.id"', 'Nama situs'),
  ('site_tagline', '"Berita Terkini, Analisis Mendalam"', 'Tagline situs'),
  ('site_url', '"https://infonesia.id"', 'URL produksi'),
  ('auto_publish_enabled', 'true', 'Aktifkan auto-publish'),
  ('auto_publish_threshold', '85', 'Minimum publish_readiness_score untuk auto-publish'),
  ('review_threshold', '70', 'Minimum score untuk masuk review queue'),
  ('daily_article_limit', '10', 'Maksimum artikel per hari'),
  ('wordpress_enabled', 'false', 'Aktifkan WordPress bridge'),
  ('wordpress_url', '""', 'WordPress site URL'),
  ('breaking_news_enabled', 'true', 'Aktifkan breaking news mode'),
  ('default_author_label', '"Tim Redaksi AI"', 'Label author default'),
  ('workflow_schedule_morning', '"06:30"', 'Jadwal run pagi'),
  ('workflow_schedule_noon', '"12:00"', 'Jadwal run siang'),
  ('workflow_schedule_evening', '"18:00"', 'Jadwal run sore')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- SEED: HOMEPAGE SECTIONS
-- ============================================================

INSERT INTO homepage_sections (section_key, section_title, section_type, is_active, display_order) VALUES
  ('hero', 'Berita Utama', 'hero', TRUE, 1),
  ('breaking', 'Breaking News', 'breaking', TRUE, 2),
  ('trending', 'Trending Hari Ini', 'trending', TRUE, 3),
  ('latest', 'Berita Terbaru', 'latest_grid', TRUE, 4),
  ('nasional_feed', 'Nasional', 'category_feed', TRUE, 5),
  ('politik_feed', 'Politik', 'category_feed', TRUE, 6),
  ('ekonomi_feed', 'Ekonomi', 'category_feed', TRUE, 7),
  ('editor_picks', 'Pilihan Editor', 'editor_picks', TRUE, 8),
  ('popular', 'Paling Banyak Dibaca', 'popular', TRUE, 9),
  ('newsletter', 'Newsletter', 'newsletter', TRUE, 10)
ON CONFLICT (section_key) DO NOTHING;

-- ============================================================
-- SEED: ROLES
-- ============================================================

INSERT INTO roles (name, permissions) VALUES
  ('superadmin', '{"all": true}'),
  ('admin', '{"articles": true, "sources": true, "settings": true, "analytics": true}'),
  ('editor', '{"articles": true, "review": true}'),
  ('viewer', '{"read": true}')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Public can read published articles
CREATE POLICY "articles_public_read" ON articles
  FOR SELECT USING (status = 'published');

-- Authenticated users (editors+) can read all
CREATE POLICY "articles_auth_read" ON articles
  FOR SELECT TO authenticated USING (TRUE);

-- Authenticated can insert/update
CREATE POLICY "articles_auth_write" ON articles
  FOR ALL TO authenticated USING (TRUE);

-- Profiles: users see their own
CREATE POLICY "profiles_own" ON profiles
  FOR ALL USING (auth.uid() = id);
