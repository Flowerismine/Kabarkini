// app/sitemap.ts
import { MetadataRoute } from 'next'
import { getPublishedArticles, getCategories, getTags } from '@/lib/supabase/queries'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kabarkini.id'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories, tags] = await Promise.all([
    getPublishedArticles(500),
    getCategories(),
    getTags(),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'hourly',  priority: 1.0 },
    { url: `${SITE_URL}/trending`,  lastModified: new Date(), changeFrequency: 'hourly',  priority: 0.9 },
    { url: `${SITE_URL}/arsip`,     lastModified: new Date(), changeFrequency: 'daily',   priority: 0.6 },
    { url: `${SITE_URL}/pencarian`, lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.5 },
    { url: `${SITE_URL}/tentang-kami`,       changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/kontak`,             changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/kebijakan-privasi`,  changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/syarat-ketentuan`,   changeFrequency: 'monthly', priority: 0.3 },
  ]

  const articlePages: MetadataRoute.Sitemap = articles.map(a => ({
    url:             `${SITE_URL}/${a.slug}`,
    lastModified:    new Date(a.updatedAt || a.publishedAt || a.createdAt),
    changeFrequency: 'weekly' as const,
    priority:        a.isBreaking || a.isTrending ? 0.9 : 0.8,
  }))

  const categoryPages: MetadataRoute.Sitemap = categories.map(c => ({
    url:             `${SITE_URL}/kategori/${c.slug}`,
    lastModified:    new Date(),
    changeFrequency: 'hourly' as const,
    priority:        0.7,
  }))

  const tagPages: MetadataRoute.Sitemap = tags.map(t => ({
    url:             `${SITE_URL}/tag/${t.slug}`,
    lastModified:    new Date(),
    changeFrequency: 'daily' as const,
    priority:        0.5,
  }))

  return [...staticPages, ...articlePages, ...categoryPages, ...tagPages]
}
