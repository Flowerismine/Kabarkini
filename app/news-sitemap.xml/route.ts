// ============================================
// KabarKini — Google News Sitemap
// GET /news-sitemap.xml
// Only articles published in last 2 days (Google News requirement)
// ============================================

import { NextResponse } from 'next/server'
import { ARTICLES } from '@/lib/mock-data'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kabarkini.id'

export async function GET() {
  const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000

  const recentArticles = ARTICLES.filter(
    (a) =>
      a.status === 'published' &&
      new Date(a.publishedAt || a.createdAt).getTime() > twoDaysAgo
  ).sort(
    (a, b) =>
      new Date(b.publishedAt || b.createdAt).getTime() -
      new Date(a.publishedAt || a.createdAt).getTime()
  )

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${recentArticles
    .map(
      (article) => `
  <url>
    <loc>${SITE_URL}/${article.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>KabarKini</news:name>
        <news:language>id</news:language>
      </news:publication>
      <news:publication_date>${new Date(article.publishedAt || article.createdAt).toISOString()}</news:publication_date>
      <news:title>${article.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</news:title>
      <news:keywords>${[article.focusKeyword, ...article.relatedKeywords.slice(0, 4)].join(', ')}</news:keywords>
    </news:news>
    ${
      article.coverImageUrl
        ? `<image:image>
      <image:loc>${article.coverImageUrl}</image:loc>
      <image:title>${article.coverImageAlt?.replace(/&/g, '&amp;') || ''}</image:title>
    </image:image>`
        : ''
    }
    <lastmod>${new Date(article.updatedAt).toISOString()}</lastmod>
  </url>`
    )
    .join('')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=1800, stale-while-revalidate=3600',
    },
  })
}
