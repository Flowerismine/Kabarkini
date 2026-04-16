-- ============================================================
-- KabarKini — Initial Supabase Schema
-- ============================================================
-- Run via: supabase db push  OR  paste di Supabase SQL Editor
-- ============================================================

-- ── EXTENSIONS ──────────────────────────────────────────────
create extension if not exists "pgcrypto";   -- gen_random_uuid()
create extension if not exists "pg_trgm";    -- full-text search on title/excerpt

-- ── ENUMS ───────────────────────────────────────────────────
create type article_status      as enum ('draft','review','scheduled','published','rejected');
create type verification_status as enum ('unverified','partial','verified','developing');
create type author_type         as enum ('ai','editor','contributor');
create type source_type         as enum ('media','official','press_release','social');
create type workflow_run_type   as enum ('daily_main','daily_noon','daily_evening','breaking','manual');
create type workflow_run_status as enum ('running','completed','failed','partial');
create type workflow_log_level  as enum ('info','warn','error','success');
create type source_status       as enum ('pending','processed','rejected');
create type user_role           as enum ('superadmin','editor','reviewer','writer');
create type user_status         as enum ('active','inactive','suspended');

-- ── CATEGORIES ──────────────────────────────────────────────
create table categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  color       text not null default '#374151',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
comment on table categories is 'Kategori artikel berita';

-- ── TAGS ────────────────────────────────────────────────────
create table tags (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  created_at timestamptz not null default now()
);
comment on table tags is 'Tag/label artikel';

-- ── ARTICLES ────────────────────────────────────────────────
create table articles (
  id                       uuid primary key default gen_random_uuid(),
  title                    text not null,
  alternative_titles       text[]    not null default '{}',
  slug                     text not null unique,
  excerpt                  text not null default '',
  meta_title               text not null default '',
  meta_description         text not null default '',
  focus_keyword            text not null default '',
  related_keywords         text[]    not null default '{}',
  category_id              uuid not null references categories(id) on delete restrict,
  cover_image_url          text not null default '',
  cover_image_prompt       text not null default '',
  cover_image_alt          text not null default '',
  article_text             text not null default '',
  article_html             text not null default '',
  bullet_points            text[]    not null default '{}',
  why_it_matters           text not null default '',
  next_to_watch            text not null default '',
  verification_status      verification_status not null default 'unverified',
  originality_score        smallint not null default 0 check (originality_score between 0 and 100),
  readability_score        smallint not null default 0 check (readability_score between 0 and 100),
  seo_score                smallint not null default 0 check (seo_score between 0 and 100),
  factual_consistency_score smallint not null default 0 check (factual_consistency_score between 0 and 100),
  duplication_risk_score   smallint not null default 0 check (duplication_risk_score between 0 and 100),
  publish_readiness_score  smallint not null default 0 check (publish_readiness_score between 0 and 100),
  status                   article_status not null default 'draft',
  author_type              author_type not null default 'ai',
  author_label             text not null default 'AI News Desk',
  editor_id                uuid references auth.users(id) on delete set null,
  editor_name              text,
  is_breaking              boolean not null default false,
  is_featured              boolean not null default false,
  is_trending              boolean not null default false,
  word_count               int not null default 0,
  reading_time             int not null default 0,
  canonical_url            text not null default '',
  scheduled_at             timestamptz,
  published_at             timestamptz,
  view_count               int not null default 0,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);
comment on table articles is 'Artikel berita utama';

-- Computed columns helpers (views / generated columns not available for jsonb relations)
-- article_tags junction
create table article_tags (
  article_id uuid not null references articles(id) on delete cascade,
  tag_id     uuid not null references tags(id)     on delete cascade,
  primary key (article_id, tag_id)
);

-- Per-article source references (ArticleSource type)
create table article_sources (
  id           uuid primary key default gen_random_uuid(),
  article_id   uuid not null references articles(id) on delete cascade,
  name         text not null,
  url          text not null,
  source_type  source_type not null default 'media',
  trust_score  smallint not null default 80 check (trust_score between 0 and 100),
  published_at date,
  created_at   timestamptz not null default now()
);
comment on table article_sources is 'Sumber referensi per artikel';

-- ── INGESTED SOURCES (Source type — admin sumber panel) ─────
create table ingested_sources (
  id                   uuid primary key default gen_random_uuid(),
  source_name          text not null,
  source_type          source_type not null default 'media',
  home_url             text not null,
  article_url          text not null,
  article_title        text not null,
  fetched_summary      text not null default '',
  published_at_source  timestamptz,
  fetched_at           timestamptz not null default now(),
  trust_score          smallint not null default 80 check (trust_score between 0 and 100),
  verification_level   text not null default 'medium',
  notes                text,
  status               source_status not null default 'pending',
  created_at           timestamptz not null default now()
);
comment on table ingested_sources is 'Sumber berita yang di-crawl/ingest';

-- ── WORKFLOW RUNS ────────────────────────────────────────────
create table workflow_runs (
  id                  uuid primary key default gen_random_uuid(),
  run_type            workflow_run_type   not null,
  status              workflow_run_status not null default 'running',
  started_at          timestamptz not null default now(),
  completed_at        timestamptz,
  sources_ingested    int not null default 0,
  topics_clustered    int not null default 0,
  articles_generated  int not null default 0,
  articles_published  int not null default 0,
  articles_reviewed   int not null default 0,
  articles_rejected   int not null default 0,
  errors              text[] not null default '{}'
);
comment on table workflow_runs is 'Riwayat eksekusi workflow AI pipeline';

create table workflow_logs (
  id              uuid primary key default gen_random_uuid(),
  workflow_run_id uuid not null references workflow_runs(id) on delete cascade,
  timestamp       timestamptz not null default now(),
  step            text not null,
  message         text not null,
  level           workflow_log_level not null default 'info'
);
comment on table workflow_logs is 'Log detail per step workflow';

-- ── TRENDING TOPICS ──────────────────────────────────────────
create table trending_topics (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text not null unique,
  hotness      smallint not null default 50 check (hotness between 0 and 100),
  article_count int not null default 0,
  category     text not null default '',
  keywords     text[] not null default '{}',
  last_updated timestamptz not null default now(),
  created_at   timestamptz not null default now()
);

-- ── ADMIN USERS ──────────────────────────────────────────────
-- Extends Supabase auth.users
create table admin_users (
  id                  uuid primary key references auth.users(id) on delete cascade,
  name                text not null,
  email               text not null unique,
  role                user_role   not null default 'reviewer',
  status              user_status not null default 'active',
  articles_published  int not null default 0,
  articles_reviewed   int not null default 0,
  last_login          timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
comment on table admin_users is 'Profil user admin (extends auth.users)';

-- ── SITE SETTINGS ────────────────────────────────────────────
-- Single-row config table
create table site_settings (
  id                      int primary key default 1 check (id = 1),  -- enforce singleton
  site_name               text not null default 'KabarKini',
  tagline                 text not null default '',
  site_url                text not null default 'https://kabarkini.id',
  admin_email             text not null default '',
  articles_per_page       int  not null default 10,
  auto_publish_threshold  int  not null default 90,
  review_threshold        int  not null default 70,
  reject_threshold        int  not null default 50,
  daily_run_enabled       boolean not null default true,
  daily_run_times         text[]  not null default '{"06:00","12:00","18:00"}',
  breaking_news_enabled   boolean not null default true,
  wordpress_config        jsonb   not null default '{}',
  ad_slots_config         jsonb   not null default '[]',
  updated_at              timestamptz not null default now()
);
insert into site_settings (id) values (1) on conflict do nothing;

-- ── INDEXES ─────────────────────────────────────────────────
create index idx_articles_status       on articles(status);
create index idx_articles_category_id  on articles(category_id);
create index idx_articles_published_at on articles(published_at desc);
create index idx_articles_is_breaking  on articles(is_breaking) where is_breaking = true;
create index idx_articles_is_featured  on articles(is_featured) where is_featured = true;
create index idx_articles_is_trending  on articles(is_trending) where is_trending = true;
create index idx_articles_scheduled_at on articles(scheduled_at) where scheduled_at is not null;
create index idx_articles_slug         on articles(slug);
create index idx_articles_trgm_title   on articles using gin(title gin_trgm_ops);
create index idx_article_tags_tag      on article_tags(tag_id);
create index idx_workflow_runs_started on workflow_runs(started_at desc);
create index idx_ingested_sources_status on ingested_sources(status);

-- ── UPDATED_AT TRIGGER ───────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_articles_updated_at
  before update on articles
  for each row execute function set_updated_at();

create trigger trg_categories_updated_at
  before update on categories
  for each row execute function set_updated_at();

create trigger trg_admin_users_updated_at
  before update on admin_users
  for each row execute function set_updated_at();

-- ── ROW LEVEL SECURITY ───────────────────────────────────────
-- Artikel published → bisa dibaca publik
alter table articles        enable row level security;
alter table categories      enable row level security;
alter table tags            enable row level security;
alter table article_tags    enable row level security;
alter table article_sources enable row level security;
alter table trending_topics enable row level security;

-- Public read: published articles only
create policy "public_read_published_articles" on articles
  for select using (status = 'published');

create policy "public_read_categories" on categories
  for select using (true);

create policy "public_read_tags" on tags
  for select using (true);

create policy "public_read_article_tags" on article_tags
  for select using (true);

create policy "public_read_article_sources" on article_sources
  for select using (true);

create policy "public_read_trending" on trending_topics
  for select using (true);

-- Admin full access (via service_role key dari server / API routes)
-- Semua operasi admin pakai supabaseAdmin (service_role) → bypass RLS

-- ── HELPER VIEWS ────────────────────────────────────────────
-- View untuk admin dashboard stats (di-query via supabaseAdmin)
create or replace view admin_stats as
select
  count(*) filter (where status = 'published' and published_at >= current_date)                           as today_published,
  count(*) filter (where status = 'review')                                                                as pending_review,
  count(*) filter (where status = 'draft')                                                                 as processing,
  count(*) filter (where status = 'scheduled')                                                             as scheduled,
  count(*)                                                                                                  as total_articles,
  round(avg((originality_score + readability_score + seo_score + factual_consistency_score) / 4.0))::int  as avg_quality_score
from articles;

-- View artikel + category name (dipakai di banyak halaman admin)
create or replace view articles_with_category as
select
  a.*,
  c.name  as category_name,
  c.slug  as category_slug,
  c.color as category_color
from articles a
join categories c on c.id = a.category_id;
