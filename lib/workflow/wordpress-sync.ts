// ============================================
// KabarKini — WordPress REST API Bridge
// Syncs published articles to WordPress
// ============================================

export interface WordPressConfig {
  siteUrl: string
  username: string
  applicationPassword: string
  postStatus: 'publish' | 'draft'
  categoryMapping: Record<string, number>
  sendFeaturedImage: boolean
  sendSeoFields: boolean
  autoRetryOnFail: boolean
}

export interface WordPressSyncResult {
  articleId: string
  success: boolean
  wpPostId?: number
  error?: string
  timestamp: string
}

export interface WordPressCategory {
  id: number
  name: string
  slug: string
}

// Build Basic Auth token for WordPress Application Passwords
function buildAuthHeader(username: string, appPassword: string): string {
  const token = Buffer.from(`${username}:${appPassword}`).toString('base64')
  return `Basic ${token}`
}

// Test connection to WordPress REST API
export async function testWordPressConnection(config: WordPressConfig): Promise<{
  success: boolean
  siteTitle?: string
  wpVersion?: string
  error?: string
}> {
  try {
    const res = await fetch(`${config.siteUrl}/wp-json/wp/v2/users/me`, {
      headers: {
        Authorization: buildAuthHeader(config.username, config.applicationPassword),
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) {
      return { success: false, error: `HTTP ${res.status}: ${res.statusText}` }
    }

    const user = await res.json()
    return {
      success: true,
      siteTitle: user.name,
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Connection failed',
    }
  }
}

// Fetch categories from WordPress to help with mapping
export async function fetchWordPressCategories(config: WordPressConfig): Promise<WordPressCategory[]> {
  try {
    const res = await fetch(`${config.siteUrl}/wp-json/wp/v2/categories?per_page=100`, {
      headers: {
        Authorization: buildAuthHeader(config.username, config.applicationPassword),
      },
    })

    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

// Upload a featured image to WordPress media library
async function uploadFeaturedImage(
  config: WordPressConfig,
  imageUrl: string,
  altText: string
): Promise<number | null> {
  try {
    // Fetch the image from URL
    const imageRes = await fetch(imageUrl)
    if (!imageRes.ok) return null

    const imageBlob = await imageRes.blob()
    const filename = `kabarkini-${Date.now()}.jpg`

    const formData = new FormData()
    formData.append('file', imageBlob, filename)
    formData.append('alt_text', altText)

    const res = await fetch(`${config.siteUrl}/wp-json/wp/v2/media`, {
      method: 'POST',
      headers: {
        Authorization: buildAuthHeader(config.username, config.applicationPassword),
      },
      body: formData,
    })

    if (!res.ok) return null
    const media = await res.json()
    return media.id
  } catch {
    return null
  }
}

// Sync a single article to WordPress
export async function syncArticleToWordPress(
  article: {
    id: string
    title: string
    slug: string
    excerpt: string
    articleHtml: string
    category: string
    tags: string[]
    coverImageUrl?: string
    coverImageAlt?: string
    metaTitle?: string
    metaDescription?: string
    focusKeyword?: string
    publishedAt?: string
  },
  config: WordPressConfig
): Promise<WordPressSyncResult> {
  const timestamp = new Date().toISOString()

  try {
    const wpCategoryId = config.categoryMapping[article.category] || 1

    // Build WordPress post payload
    const postPayload: Record<string, unknown> = {
      title: article.title,
      slug: article.slug,
      content: article.articleHtml,
      excerpt: article.excerpt,
      status: config.postStatus,
      categories: [wpCategoryId],
      date: article.publishedAt,
    }

    // Upload featured image if configured
    if (config.sendFeaturedImage && article.coverImageUrl) {
      const mediaId = await uploadFeaturedImage(
        config,
        article.coverImageUrl,
        article.coverImageAlt || article.title
      )
      if (mediaId) {
        postPayload.featured_media = mediaId
      }
    }

    // Create the WordPress post
    const res = await fetch(`${config.siteUrl}/wp-json/wp/v2/posts`, {
      method: 'POST',
      headers: {
        Authorization: buildAuthHeader(config.username, config.applicationPassword),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postPayload),
    })

    if (!res.ok) {
      const errBody = await res.text()
      return {
        articleId: article.id,
        success: false,
        error: `WordPress API error ${res.status}: ${errBody.slice(0, 200)}`,
        timestamp,
      }
    }

    const wpPost = await res.json()

    // Send SEO fields if Yoast/RankMath is available and configured
    if (config.sendSeoFields && article.metaTitle && wpPost.id) {
      try {
        await fetch(`${config.siteUrl}/wp-json/wp/v2/posts/${wpPost.id}`, {
          method: 'POST',
          headers: {
            Authorization: buildAuthHeader(config.username, config.applicationPassword),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            meta: {
              _yoast_wpseo_title: article.metaTitle,
              _yoast_wpseo_metadesc: article.metaDescription,
              _yoast_wpseo_focuskw: article.focusKeyword,
              rank_math_title: article.metaTitle,
              rank_math_description: article.metaDescription,
              rank_math_focus_keyword: article.focusKeyword,
            },
          }),
        })
      } catch {
        // SEO field sync failure is non-critical
      }
    }

    return {
      articleId: article.id,
      success: true,
      wpPostId: wpPost.id,
      timestamp,
    }
  } catch (err) {
    return {
      articleId: article.id,
      success: false,
      error: err instanceof Error ? err.message : 'Unknown sync error',
      timestamp,
    }
  }
}

// Batch sync multiple articles to WordPress
export async function batchSyncToWordPress(
  articles: Parameters<typeof syncArticleToWordPress>[0][],
  config: WordPressConfig,
  onProgress?: (result: WordPressSyncResult, index: number, total: number) => void
): Promise<WordPressSyncResult[]> {
  const results: WordPressSyncResult[] = []

  for (let i = 0; i < articles.length; i++) {
    const result = await syncArticleToWordPress(articles[i], config)
    results.push(result)

    if (onProgress) {
      onProgress(result, i + 1, articles.length)
    }

    // Respect WordPress rate limits: wait 500ms between requests
    if (i < articles.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    // Auto-retry on failure
    if (!result.success && config.autoRetryOnFail) {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const retry = await syncArticleToWordPress(articles[i], config)
      if (retry.success) {
        results[results.length - 1] = retry
      }
    }
  }

  return results
}
