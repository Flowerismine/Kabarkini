// ============================================
// KabarKini — XML Sitemap
// Auto-generated for all published articles + static pages
// ============================================

import { MetadataRoute } from 'next'
import { ARTICLES, CATEGORIES, TAGS } from '@/lib/mock-data'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kabarkini.id'

export default function sitemap(): MetadataRoute.Sitemap {
  const publishedArticles = ARTICLES.filter((a) => a.status === 'published')

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/trending`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/pencarian`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/arsip`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/tentang-kami`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/kontak`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/kebijakan-privasi`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/pedoman-editorial`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ]

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${SITE_URL}/kategori/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'hourly' as const,
    priority: 0.8,
  }))

  // Tag pages
  const tagPages: MetadataRoute.Sitemap = TAGS.map((tag) => ({
    url: `${SITE_URL}/tag/${tag.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }))

  // Article pages
  const articlePages: MetadataRoute.Sitemap = publishedArticles.map((article) => ({
    url: `${SITE_URL}/${article.slug}`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: article.isFeatured ? 0.9 : article.isTrending ? 0.85 : 0.7,
  }))

  return [...staticPages, ...categoryPages, ...tagPages, ...articlePages]
}
