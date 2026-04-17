// lib/supabase/transform.ts
// Converts Supabase snake_case rows → camelCase Article / Category / AdminUser
// matching the shape originally used by lib/mock-data

export function transformArticleRow(
  row: Record<string, unknown>,
  sources: Record<string, unknown>[] = [],
  sourceCount?: number
) {
  return {
    id: row.id as string,
    title: row.title as string,
    slug: row.slug as string,
    excerpt: (row.excerpt as string) || '',
    articleText: (row.article_text as string) || '',
    articleHtml: (row.article_html as string) || '',
    metaTitle: (row.meta_title as string) || '',
    metaDescription: (row.meta_description as string) || '',
    focusKeyword: (row.focus_keyword as string) || '',
    relatedKeywords: (row.related_keywords as string[]) || [],
    status: row.status as string,
    category: {
      id: row.category_id as string,
      name: (row.category_name as string) || '',
      slug: (row.category_slug as string) || '',
      color: (row.category_color as string) || '#374151',
    },
    coverImageUrl: (row.cover_image_url as string) || '',
    coverImageAlt: (row.cover_image_alt as string) || '',
    bulletPoints: (row.bullet_points as string[]) || [],
    whyItMatters: (row.why_it_matters as string) || '',
    nextToWatch: (row.next_to_watch as string) || '',
    verificationStatus: (row.verification_status as string) || 'unverified',
    publishReadinessScore: (row.publish_readiness_score as number) ?? 0,
    originalityScore: (row.originality_score as number) ?? 0,
    readabilityScore: (row.readability_score as number) ?? 0,
    seoScore: (row.seo_score as number) ?? 0,
    factualConsistencyScore: (row.factual_consistency_score as number) ?? 0,
    duplicationRiskScore: (row.duplication_risk_score as number) ?? 0,
    wordCount: (row.word_count as number) ?? 0,
    readingTime: (row.reading_time as number) ?? 0,
    isBreaking: (row.is_breaking as boolean) ?? false,
    isFeatured: (row.is_featured as boolean) ?? false,
    isTrending: (row.is_trending as boolean) ?? false,
    authorType: (row.author_type as string) || 'ai',
    authorLabel: (row.author_label as string) || 'AI News Desk',
    editorName: (row.editor_name as string) || null,
    viewCount: (row.view_count as number) ?? 0,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    publishedAt: (row.published_at as string) || null,
    scheduledAt: (row.scheduled_at as string) || null,
    sourceCount: sourceCount ?? sources.length,
    sources: sources.map((s) => ({
      id: s.id as string,
      name: (s.name as string) || '',
      url: (s.url as string) || '',
      type: (s.source_type as string) || 'media',
      trustScore: (s.trust_score as number) ?? 80,
      publishedAt: (s.published_at as string) || null,
    })),
  }
}

export function transformCategoryRow(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    description: (row.description as string) || '',
    color: (row.color as string) || '#374151',
    createdAt: row.created_at as string,
  }
}

export function transformUserRow(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    role: row.role as string,
    status: row.status as string,
    articlesPublished: (row.articles_published as number) ?? 0,
    articlesReviewed: (row.articles_reviewed as number) ?? 0,
    lastLogin: (row.last_login as string) || null,
    createdAt: row.created_at as string,
  }
}
