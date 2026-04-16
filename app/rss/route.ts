// ============================================
// KabarKini — RSS Feed
// GET /rss
// ============================================

import { NextResponse } from 'next/server'
import { ARTICLES, CATEGORIES } from '@/lib/mock-data'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kabarkini.id'
const SITE_NAME = 'KabarKini'
const SITE_DESC = 'Portal berita digital Indonesia terpercaya. Berita terkini, analisis mendalam, dan isu-isu panas nasional setiap hari.'

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const publishedArticles = ARTICLES.filter((a) => a.status === 'published')
    .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime())
    .slice(0, 50)

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:content="http://purl.org/rss/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:media="http://search.yahoo.com/mrss/"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESC)}</description>
    <language>id</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <managingEditor>redaksi@kabarkini.id (Tim Redaksi KabarKini)</managingEditor>
    <copyright>Copyright ${new Date().getFullYear()} KabarKini</copyright>
    <atom:link href="${SITE_URL}/rss" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/logo.png</url>
      <title>${escapeXml(SITE_NAME)}</title>
      <link>${SITE_URL}</link>
    </image>
    ${publishedArticles
      .map(
        (article) => `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${SITE_URL}/${article.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/${article.slug}</guid>
      <description>${escapeXml(article.excerpt)}</description>
      <content:encoded><![CDATA[${article.articleHtml}]]></content:encoded>
      <pubDate>${new Date(article.publishedAt || article.createdAt).toUTCString()}</pubDate>
      <dc:creator>${escapeXml(article.authorLabel)}</dc:creator>
      <category>${escapeXml(article.category.name)}</category>
      ${article.tags.map((tag) => `<category>${escapeXml(tag.name)}</category>`).join('\n      ')}
      ${article.coverImageUrl ? `<media:thumbnail url="${article.coverImageUrl}"/>` : ''}
    </item>`
      )
      .join('')}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=7200',
    },
  })
}
