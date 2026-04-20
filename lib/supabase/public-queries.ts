// lib/supabase/public-queries.ts
// ─────────────────────────────────────────────────────────────────────────────
// Query layer untuk halaman PUBLIK — pakai createAdminClient (service_role)
// TIDAK memerlukan cookies() / request context → aman dipanggil dari mana saja
// ─────────────────────────────────────────────────────────────────────────────

import { createAdminClient } from './server'
import type { Article, Category, Tag } from '@/types'

// ── mappers ──────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): Article {
  const tags: Tag[] = (row.tags ?? [])
    .map((t: any) => t.tags ? { id: t.tags.id, name: t.tags.name, slug: t.tags.slug } : null)
    .filter(Boolean)

  const sources: Article['sources'] = (row.article_sources ?? []).map((s: any) => ({
    id:          s.id,
    name:        s.name,
    url:         s.url,
    type:        s.source_type,
    trustScore:  s.trust_score,
    publishedAt: s.published_at ?? undefined,
  }))

  return {
    id:                     row.id,
    title:                  row.title,
    alternativeTitles:      row.alternative_titles ?? [],
    slug:                   row.slug,
    excerpt:                row.excerpt ?? '',
    metaTitle:              row.meta_title ?? '',
    metaDescription:        row.meta_description ?? '',
    focusKeyword:           row.focus_keyword ?? '',
    relatedKeywords:        row.related_keywords ?? [],
    category: {
      id:    row.category_id,
      name:  row.category_name  ?? '',
      slug:  row.category_slug  ?? '',
      color: row.category_color ?? '#374151',
    },
    tags,
    coverImageUrl:          row.cover_image_url   ?? '',
    coverImagePrompt:       row.cover_image_prompt ?? '',
    coverImageAlt:          row.cover_image_alt   ?? '',
    articleText:            row.article_text  ?? '',
    articleHtml:            row.article_html  ?? '',
    bulletPoints:           row.bullet_points ?? [],
    whyItMatters:           row.why_it_matters ?? '',
    nextToWatch:            row.next_to_watch  ?? '',
    sources,
    verificationStatus:     row.verification_status   ?? 'unverified',
    originalityScore:       row.originality_score     ?? 0,
    readabilityScore:       row.readability_score     ?? 0,
    seoScore:               row.seo_score             ?? 0,
    factualConsistencyScore:row.factual_consistency_score ?? 0,
    duplicationRiskScore:   row.duplication_risk_score    ?? 0,
    publishReadinessScore:  row.publish_readiness_score   ?? 0,
    status:                 row.status,
    authorType:             row.author_type   ?? 'ai',
    authorLabel:            row.author_label  ?? 'AI News Desk',
    editorId:               row.editor_id    ?? undefined,
    editorName:             row.editor_name  ?? undefined,
    isBreaking:             row.is_breaking  ?? false,
    isFeatured:             row.is_featured  ?? false,
    isTrending:             row.is_trending  ?? false,
    sourceCount:            sources.length,
    wordCount:              row.word_count   ?? 0,
    readingTime:            row.reading_time ?? 0,
    canonicalUrl:           row.canonical_url ?? '',
    scheduledAt:            row.scheduled_at  ?? undefined,
    publishedAt:            row.published_at  ?? undefined,
    viewCount:              row.view_count    ?? 0,
    createdAt:              row.created_at,
    updatedAt:              row.updated_at,
  }
}

const SELECT = '*, tags:article_tags(tag_id, tags(*)), article_sources(*)'

// ── helpers ───────────────────────────────────────────────────
async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try { return await fn() } catch (e) { console.error('[public-queries]', e); return fallback }
}

// ── Public queries ────────────────────────────────────────────

export async function getPublishedArticles(limit = 12): Promise<Article[]> {
  return safe(async () => {
    const db = createAdminClient()
    let q = db.from('articles_with_category')
      .select(SELECT)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
    if (limit) q = q.limit(limit)
    const { data, error } = await q
    if (error) throw error
    return (data ?? []).map(mapRow)
  }, [])
}

export async function getFeaturedArticles(): Promise<Article[]> {
  return safe(async () => {
    const db = createAdminClient()
    const { data, error } = await db.from('articles_with_category')
      .select(SELECT)
      .eq('status', 'published')
      .eq('is_featured', true)
      .order('published_at', { ascending: false })
      .limit(6)
    if (error) throw error
    return (data ?? []).map(mapRow)
  }, [])
}

export async function getArticlesByCategory(slug: string): Promise<Article[]> {
  return safe(async () => {
    const db = createAdminClient()
    const { data, error } = await db.from('articles_with_category')
      .select(SELECT)
      .eq('category_slug', slug)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(20)
    if (error) throw error
    return (data ?? []).map(mapRow)
  }, [])
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return safe(async () => {
    const db = createAdminClient()
    const { data, error } = await db.from('articles_with_category')
      .select(SELECT)
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
    if (error) throw error
    return mapRow(data)
  }, null)
}

export async function getRelatedArticles(article: Article, limit = 4): Promise<Article[]> {
  return safe(async () => {
    const db = createAdminClient()
    const { data, error } = await db.from('articles_with_category')
      .select(SELECT)
      .eq('category_slug', article.category.slug)
      .eq('status', 'published')
      .neq('id', article.id)
      .order('published_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    return (data ?? []).map(mapRow)
  }, [])
}

export async function getArticlesByTag(tagSlug: string): Promise<Article[]> {
  return safe(async () => {
    const db = createAdminClient()
    const { data: tagData } = await db.from('tags').select('id').eq('slug', tagSlug).single()
    if (!tagData) return []
    const { data: atData } = await db.from('article_tags').select('article_id').eq('tag_id', tagData.id)
    if (!atData?.length) return []
    const ids = atData.map((r: any) => r.article_id)
    const { data, error } = await db.from('articles_with_category')
      .select(SELECT)
      .in('id', ids)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
    if (error) throw error
    return (data ?? []).map(mapRow)
  }, [])
}

export async function getCategories(): Promise<Category[]> {
  return safe(async () => {
    const db = createAdminClient()
    const { data, error } = await db.from('categories').select('*').order('name')
    if (error) throw error
    return (data ?? []).map((c: any) => ({
      id:           c.id,
      name:         c.name,
      slug:         c.slug,
      description:  c.description ?? '',
      color:        c.color ?? '#374151',
      articleCount: 0,
      createdAt:    c.created_at,
    }))
  }, [])
}

export async function getTags(): Promise<Tag[]> {
  return safe(async () => {
    const db = createAdminClient()
    const { data, error } = await db.from('tags').select('*').order('name')
    if (error) throw error
    return (data ?? []).map((t: any) => ({
      id:           t.id,
      name:         t.name,
      slug:         t.slug,
      articleCount: 0,
      createdAt:    t.created_at,
    }))
  }, [])
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  return safe(async () => {
    const db = createAdminClient()
    const { data, error } = await db.from('tags').select('*').eq('slug', slug).single()
    if (error) throw error
    return { id: data.id, name: data.name, slug: data.slug, articleCount: 0, createdAt: data.created_at }
  }, null)
}
