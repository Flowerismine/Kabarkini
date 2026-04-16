// lib/supabase/queries.ts
// ─────────────────────────────────────────────────────────────
// Drop-in replacement untuk lib/mock-data.tsx
// Semua fungsi return tipe yang sama (dari types/index.ts)
// sehingga halaman-halaman yang sudah ada tidak perlu refactor besar.
// ─────────────────────────────────────────────────────────────

import { createServerClient, createAdminClient } from './server'
import type {
  Article,
  Category,
  Tag,
  Source,
  WorkflowRun,
  AdminStats,
  TrendingTopic,
} from '@/types'

// ────────────────────────────────────────────────────────────
// INTERNAL: shape mapper — DB row → App type
// ────────────────────────────────────────────────────────────

type DBArticleRow = {
  id: string
  title: string
  alternative_titles: string[]
  slug: string
  excerpt: string
  meta_title: string
  meta_description: string
  focus_keyword: string
  related_keywords: string[]
  category_id: string
  category_name: string
  category_slug: string
  category_color: string
  cover_image_url: string
  cover_image_prompt: string
  cover_image_alt: string
  article_text: string
  article_html: string
  bullet_points: string[]
  why_it_matters: string
  next_to_watch: string
  verification_status: Article['verificationStatus']
  originality_score: number
  readability_score: number
  seo_score: number
  factual_consistency_score: number
  duplication_risk_score: number
  publish_readiness_score: number
  status: Article['status']
  author_type: Article['authorType']
  author_label: string
  editor_id: string | null
  editor_name: string | null
  is_breaking: boolean
  is_featured: boolean
  is_trending: boolean
  word_count: number
  reading_time: number
  canonical_url: string
  scheduled_at: string | null
  published_at: string | null
  view_count: number
  created_at: string
  updated_at: string
  // joined
  tags?: { tag_id: string; tags: { id: string; name: string; slug: string } | null }[]
  article_sources?: {
    id: string
    name: string
    url: string
    source_type: Article['sources'][0]['type']
    trust_score: number
    published_at: string | null
  }[]
}

function mapArticle(row: DBArticleRow): Article {
  const tags: Tag[] = (row.tags ?? [])
    .map((t) =>
      t.tags
        ? { id: t.tags.id, name: t.tags.name, slug: t.tags.slug }
        : null
    )
    .filter(Boolean) as Tag[]

  const sources: Article['sources'] = (row.article_sources ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    url: s.url,
    type: s.source_type,
    trustScore: s.trust_score,
    publishedAt: s.published_at ?? undefined,
  }))

  return {
    id: row.id,
    title: row.title,
    alternativeTitles: row.alternative_titles,
    slug: row.slug,
    excerpt: row.excerpt,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    focusKeyword: row.focus_keyword,
    relatedKeywords: row.related_keywords,
    category: {
      id: row.category_id,
      name: row.category_name,
      slug: row.category_slug,
      color: row.category_color,
    },
    tags,
    coverImageUrl: row.cover_image_url,
    coverImagePrompt: row.cover_image_prompt,
    coverImageAlt: row.cover_image_alt,
    articleText: row.article_text,
    articleHtml: row.article_html,
    bulletPoints: row.bullet_points,
    whyItMatters: row.why_it_matters,
    nextToWatch: row.next_to_watch,
    sources,
    verificationStatus: row.verification_status,
    originalityScore: row.originality_score,
    readabilityScore: row.readability_score,
    seoScore: row.seo_score,
    factualConsistencyScore: row.factual_consistency_score,
    duplicationRiskScore: row.duplication_risk_score,
    publishReadinessScore: row.publish_readiness_score,
    status: row.status,
    authorType: row.author_type,
    authorLabel: row.author_label,
    editorId: row.editor_id ?? undefined,
    editorName: row.editor_name ?? undefined,
    isBreaking: row.is_breaking,
    isFeatured: row.is_featured,
    isTrending: row.is_trending,
    sourceCount: sources.length,
    wordCount: row.word_count,
    readingTime: row.reading_time,
    canonicalUrl: row.canonical_url,
    scheduledAt: row.scheduled_at ?? undefined,
    publishedAt: row.published_at ?? undefined,
    viewCount: row.view_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// ────────────────────────────────────────────────────────────
// Base query builder — artikel dengan relasi
// ────────────────────────────────────────────────────────────
const ARTICLE_SELECT = `
  *,
  category_name:categories!inner(name),
  category_slug:categories!inner(slug),
  category_color:categories!inner(color),
  tags:article_tags(tag_id, tags(*)),
  article_sources(*)
` as const

// ────────────────────────────────────────────────────────────
// PUBLIC QUERIES (anon key, respects RLS)
// ────────────────────────────────────────────────────────────

export async function getPublishedArticles(limit?: number): Promise<Article[]> {
  const supabase = await createServerClient()
  let q = supabase
    .from('articles_with_category')
    .select('*, tags:article_tags(tag_id, tags(*)), article_sources(*)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (limit) q = q.limit(limit)

  const { data, error } = await q
  if (error) { console.error('[getPublishedArticles]', error); return [] }
  return (data as DBArticleRow[]).map(mapArticle)
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('articles_with_category')
    .select('*, tags:article_tags(tag_id, tags(*)), article_sources(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) { console.error('[getArticleBySlug]', error); return null }
  return mapArticle(data as DBArticleRow)
}

export async function getArticlesByCategory(slug: string): Promise<Article[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('articles_with_category')
    .select('*, tags:article_tags(tag_id, tags(*)), article_sources(*)')
    .eq('category_slug', slug)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) { console.error('[getArticlesByCategory]', error); return [] }
  return (data as DBArticleRow[]).map(mapArticle)
}

export async function getArticlesByTag(tagSlug: string): Promise<Article[]> {
  const supabase = await createServerClient()
  // Join lewat article_tags → tags
  const { data: tagData } = await supabase
    .from('tags').select('id').eq('slug', tagSlug).single()
  if (!tagData) return []

  const { data: atData } = await supabase
    .from('article_tags').select('article_id').eq('tag_id', tagData.id)
  if (!atData?.length) return []

  const ids = atData.map((r) => r.article_id)
  const { data, error } = await supabase
    .from('articles_with_category')
    .select('*, tags:article_tags(tag_id, tags(*)), article_sources(*)')
    .in('id', ids)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) { console.error('[getArticlesByTag]', error); return [] }
  return (data as DBArticleRow[]).map(mapArticle)
}

export async function getFeaturedArticles(): Promise<Article[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('articles_with_category')
    .select('*, tags:article_tags(tag_id, tags(*)), article_sources(*)')
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('published_at', { ascending: false })

  if (error) { console.error('[getFeaturedArticles]', error); return [] }
  return (data as DBArticleRow[]).map(mapArticle)
}

export async function getTrendingArticles(): Promise<Article[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('articles_with_category')
    .select('*, tags:article_tags(tag_id, tags(*)), article_sources(*)')
    .eq('status', 'published')
    .eq('is_trending', true)
    .order('view_count', { ascending: false })

  if (error) { console.error('[getTrendingArticles]', error); return [] }
  return (data as DBArticleRow[]).map(mapArticle)
}

export async function getBreakingArticles(): Promise<Article[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('articles_with_category')
    .select('*, tags:article_tags(tag_id, tags(*)), article_sources(*)')
    .eq('status', 'published')
    .eq('is_breaking', true)
    .order('published_at', { ascending: false })
    .limit(5)

  if (error) { console.error('[getBreakingArticles]', error); return [] }
  return (data as DBArticleRow[]).map(mapArticle)
}

export async function getRelatedArticles(article: Article, limit = 4): Promise<Article[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('articles_with_category')
    .select('*, tags:article_tags(tag_id, tags(*)), article_sources(*)')
    .eq('status', 'published')
    .eq('category_id', article.category.id)
    .neq('id', article.id)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) { console.error('[getRelatedArticles]', error); return [] }
  return (data as DBArticleRow[]).map(mapArticle)
}

export async function searchArticles(query: string): Promise<Article[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('articles_with_category')
    .select('*, tags:article_tags(tag_id, tags(*)), article_sources(*)')
    .eq('status', 'published')
    .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,focus_keyword.ilike.%${query}%`)
    .order('published_at', { ascending: false })

  if (error) { console.error('[searchArticles]', error); return [] }
  return (data as DBArticleRow[]).map(mapArticle)
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) { console.error('[getCategories]', error); return [] }
  return data.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description ?? undefined,
    color: c.color,
  }))
}

export async function getTags(): Promise<Tag[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name')

  if (error) { console.error('[getTags]', error); return [] }
  return data.map((t) => ({ id: t.id, name: t.name, slug: t.slug }))
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('tags').select('*').eq('slug', slug).single()
  if (error) return null
  return { id: data.id, name: data.name, slug: data.slug }
}

export async function getTrendingTopics(): Promise<TrendingTopic[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('trending_topics')
    .select('*')
    .order('hotness', { ascending: false })
    .limit(10)

  if (error) { console.error('[getTrendingTopics]', error); return [] }
  return data.map((t) => ({
    id: t.id,
    title: t.title,
    slug: t.slug,
    hotness: t.hotness,
    articleCount: t.article_count,
    category: t.category,
    keywords: t.keywords,
    lastUpdated: t.last_updated,
  }))
}

// ────────────────────────────────────────────────────────────
// ADMIN QUERIES (service_role — pakai di API routes & server actions)
// ────────────────────────────────────────────────────────────

export async function adminGetArticles(opts: {
  status?: Article['status']
  limit?: number
  offset?: number
} = {}): Promise<{ data: Article[]; count: number }> {
  const supabase = createAdminClient()
  let q = supabase
    .from('articles_with_category')
    .select('*, tags:article_tags(tag_id, tags(*)), article_sources(*)', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (opts.status) q = q.eq('status', opts.status)
  if (opts.limit)  q = q.limit(opts.limit)
  if (opts.offset) q = q.range(opts.offset, opts.offset + (opts.limit ?? 10) - 1)

  const { data, error, count } = await q
  if (error) { console.error('[adminGetArticles]', error); return { data: [], count: 0 } }
  return { data: (data as DBArticleRow[]).map(mapArticle), count: count ?? 0 }
}

export async function adminGetArticleById(id: string): Promise<Article | null> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('articles_with_category')
    .select('*, tags:article_tags(tag_id, tags(*)), article_sources(*)')
    .eq('id', id)
    .single()

  if (error) { console.error('[adminGetArticleById]', error); return null }
  return mapArticle(data as DBArticleRow)
}

export async function adminUpdateArticleStatus(
  id: string,
  status: Article['status'],
  extra?: { scheduled_at?: string; editor_id?: string; editor_name?: string }
): Promise<boolean> {
  const supabase = createAdminClient()
  const updates: Record<string, unknown> = { status }
  if (status === 'published') updates.published_at = new Date().toISOString()
  if (extra?.scheduled_at)  updates.scheduled_at  = extra.scheduled_at
  if (extra?.editor_id)     updates.editor_id      = extra.editor_id
  if (extra?.editor_name)   updates.editor_name    = extra.editor_name

  const { error } = await supabase.from('articles').update(updates).eq('id', id)
  if (error) { console.error('[adminUpdateArticleStatus]', error); return false }
  return true
}

export async function adminDeleteArticle(id: string): Promise<boolean> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('articles').delete().eq('id', id)
  if (error) { console.error('[adminDeleteArticle]', error); return false }
  return true
}

export async function adminUpsertCategory(cat: Omit<Category, 'articleCount'>): Promise<boolean> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('categories').upsert({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    color: cat.color,
    description: cat.description ?? null,
  })
  if (error) { console.error('[adminUpsertCategory]', error); return false }
  return true
}

export async function adminDeleteCategory(id: string): Promise<boolean> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) { console.error('[adminDeleteCategory]', error); return false }
  return true
}

export async function adminUpsertTag(tag: Omit<Tag, 'articleCount'>): Promise<boolean> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('tags').upsert({
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
  })
  if (error) { console.error('[adminUpsertTag]', error); return false }
  return true
}

export async function adminDeleteTag(id: string): Promise<boolean> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('tags').delete().eq('id', id)
  if (error) { console.error('[adminDeleteTag]', error); return false }
  return true
}

export async function adminGetStats(): Promise<AdminStats> {
  const supabase = createAdminClient()

  const [{ data: statsRow }, { data: catRows }] = await Promise.all([
    supabase.from('admin_stats').select('*').single(),
    supabase.rpc('get_top_categories' as never).limit(5),   // optional RPC; fallback below
  ])

  // Fallback top categories via direct query
  const { data: topCats } = await supabase
    .from('articles')
    .select('category_id, categories!inner(name)')
    .eq('status', 'published')

  const catMap: Record<string, { name: string; count: number }> = {}
  for (const row of topCats ?? []) {
    const cat = (row as { categories: { name: string } }).categories
    if (!catMap[row.category_id]) catMap[row.category_id] = { name: cat.name, count: 0 }
    catMap[row.category_id].count++
  }
  const topCategories = Object.values(catMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Latest workflow run
  const { data: wfRun } = await supabase
    .from('workflow_runs')
    .select('*, workflow_logs(*)')
    .order('started_at', { ascending: false })
    .limit(1)
    .single()

  return {
    todayPublished:  statsRow?.today_published  ?? 0,
    pendingReview:   statsRow?.pending_review   ?? 0,
    processing:      statsRow?.processing       ?? 0,
    scheduled:       statsRow?.scheduled        ?? 0,
    totalArticles:   statsRow?.total_articles   ?? 0,
    avgQualityScore: statsRow?.avg_quality_score ?? 0,
    topCategories,
    recentWorkflow:  wfRun ? mapWorkflowRun(wfRun) : undefined,
  }
}

export async function adminGetWorkflowRuns(limit = 10): Promise<WorkflowRun[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('workflow_runs')
    .select('*, workflow_logs(*)')
    .order('started_at', { ascending: false })
    .limit(limit)

  if (error) { console.error('[adminGetWorkflowRuns]', error); return [] }
  return data.map(mapWorkflowRun)
}

function mapWorkflowRun(row: {
  id: string
  run_type: WorkflowRun['runType']
  status: WorkflowRun['status']
  started_at: string
  completed_at: string | null
  sources_ingested: number
  topics_clustered: number
  articles_generated: number
  articles_published: number
  articles_reviewed: number
  articles_rejected: number
  errors: string[]
  workflow_logs?: { timestamp: string; step: string; message: string; level: WorkflowRun['logs'][0]['level'] }[]
}): WorkflowRun {
  return {
    id: row.id,
    runType: row.run_type,
    status: row.status,
    startedAt: row.started_at,
    completedAt: row.completed_at ?? undefined,
    sourcesIngested: row.sources_ingested,
    topicsClustered: row.topics_clustered,
    articlesGenerated: row.articles_generated,
    articlesPublished: row.articles_published,
    articlesReviewed: row.articles_reviewed,
    articlesRejected: row.articles_rejected,
    errors: row.errors,
    logs: (row.workflow_logs ?? []).map((l) => ({
      timestamp: l.timestamp,
      step: l.step,
      message: l.message,
      level: l.level,
    })),
  }
}

export async function adminGetIngestedSources(status?: Source['status']): Promise<Source[]> {
  const supabase = createAdminClient()
  let q = supabase.from('ingested_sources').select('*').order('fetched_at', { ascending: false })
  if (status) q = q.eq('status', status)

  const { data, error } = await q
  if (error) { console.error('[adminGetIngestedSources]', error); return [] }
  return data.map((s) => ({
    id: s.id,
    sourceName: s.source_name,
    sourceType: s.source_type,
    homeUrl: s.home_url,
    articleUrl: s.article_url,
    articleTitle: s.article_title,
    fetchedSummary: s.fetched_summary,
    publishedAtSource: s.published_at_source ?? '',
    fetchedAt: s.fetched_at,
    trustScore: s.trust_score,
    verificationLevel: s.verification_level,
    notes: s.notes ?? undefined,
    status: s.status,
  }))
}

export async function adminGetUsers() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .order('created_at')

  if (error) { console.error('[adminGetUsers]', error); return [] }
  return data
}

export async function adminGetSiteSettings() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('site_settings').select('*').single()
  if (error) { console.error('[adminGetSiteSettings]', error); return null }
  return data
}

export async function adminSaveSiteSettings(
  settings: Partial<Omit<ReturnType<typeof adminGetSiteSettings> extends Promise<infer T> ? NonNullable<T> : never, 'id'>>
): Promise<boolean> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('site_settings')
    .update({ ...settings, updated_at: new Date().toISOString() })
    .eq('id', 1)
  if (error) { console.error('[adminSaveSiteSettings]', error); return false }
  return true
}
