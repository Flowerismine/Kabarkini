// ============================================
// KabarKini — Global TypeScript Types
// ============================================

export type ArticleStatus = 'draft' | 'review' | 'scheduled' | 'published' | 'rejected'
export type VerificationStatus = 'unverified' | 'partial' | 'verified' | 'developing'
export type AuthorType = 'ai' | 'editor' | 'contributor'
export type SourceType = 'media' | 'official' | 'press_release' | 'social'

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  color: string
  articleCount?: number
}

export interface Tag {
  id: string
  name: string
  slug: string
  articleCount?: number
}

export interface ArticleSource {
  id: string
  name: string
  url: string
  type: SourceType
  trustScore: number
  publishedAt?: string
}

export interface Article {
  id: string
  title: string
  alternativeTitles: string[]
  slug: string
  excerpt: string
  metaTitle: string
  metaDescription: string
  focusKeyword: string
  relatedKeywords: string[]
  category: Category
  tags: Tag[]
  coverImageUrl: string
  coverImagePrompt: string
  coverImageAlt: string
  articleText: string
  articleHtml: string
  bulletPoints: string[]
  whyItMatters: string
  nextToWatch: string
  sources: ArticleSource[]
  verificationStatus: VerificationStatus
  originalityScore: number
  readabilityScore: number
  seoScore: number
  factualConsistencyScore: number
  duplicationRiskScore: number
  publishReadinessScore: number
  status: ArticleStatus
  authorType: AuthorType
  authorLabel: string
  editorId?: string
  editorName?: string
  isBreaking: boolean
  isFeatured: boolean
  isTrending: boolean
  sourceCount: number
  wordCount: number
  readingTime: number
  canonicalUrl: string
  scheduledAt?: string
  publishedAt?: string
  createdAt: string
  updatedAt: string
  viewCount?: number
}

export interface TrendingTopic {
  id: string
  title: string
  slug: string
  hotness: number
  articleCount: number
  category: string
  keywords: string[]
  lastUpdated: string
}

export interface Source {
  id: string
  sourceName: string
  sourceType: SourceType
  homeUrl: string
  articleUrl: string
  articleTitle: string
  fetchedSummary: string
  publishedAtSource: string
  fetchedAt: string
  trustScore: number
  verificationLevel: string
  notes?: string
  status: 'pending' | 'processed' | 'rejected'
}

export interface WorkflowRun {
  id: string
  runType: 'daily_main' | 'daily_noon' | 'daily_evening' | 'breaking' | 'manual'
  status: 'running' | 'completed' | 'failed' | 'partial'
  startedAt: string
  completedAt?: string
  sourcesIngested: number
  topicsClustered: number
  articlesGenerated: number
  articlesPublished: number
  articlesReviewed: number
  articlesRejected: number
  errors: string[]
  logs: WorkflowLog[]
}

export interface WorkflowLog {
  timestamp: string
  step: string
  message: string
  level: 'info' | 'warn' | 'error' | 'success'
}

export interface AdSlot {
  id: string
  name: string
  position: 'header' | 'in_content_1' | 'in_content_2' | 'sidebar' | 'footer' | 'mobile_sticky'
  isEnabled: boolean
  adCode?: string
  width: number
  height: number
}

export interface SeoMetadata {
  articleId: string
  metaTitle: string
  metaDescription: string
  focusKeyword: string
  relatedKeywords: string[]
  canonicalUrl: string
  ogTitle: string
  ogDescription: string
  ogImageUrl: string
  twitterTitle: string
  twitterDescription: string
  schemaType: 'NewsArticle' | 'Article' | 'BlogPosting'
  breadcrumbs: Breadcrumb[]
}

export interface Breadcrumb {
  name: string
  url: string
}

export interface AdminStats {
  todayPublished: number
  pendingReview: number
  processing: number
  scheduled: number
  totalArticles: number
  avgQualityScore: number
  topCategories: { name: string; count: number }[]
  recentWorkflow?: WorkflowRun
}

export interface WordPressSyncConfig {
  enabled: boolean
  siteUrl: string
  username: string
  applicationPassword: string
  postStatus: 'draft' | 'publish'
  defaultCategoryMapping: Record<string, number>
  autoRetryOnFail: boolean
}

export interface SiteSettings {
  siteName: string
  tagline: string
  siteUrl: string
  adminEmail: string
  articlesPerPage: number
  autoPublishThreshold: number
  reviewThreshold: number
  rejectThreshold: number
  dailyRunEnabled: boolean
  dailyRunTimes: string[]
  breakingNewsEnabled: boolean
  wordpressSync: WordPressSyncConfig
  adSlotsConfig: AdSlot[]
}
