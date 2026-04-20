// app/rss/route.ts
import { NextResponse } from 'next/server'
import { getPublishedArticles } from '@/lib/supabase/public-queries'

const SITE_URL  = process.env.NEXT_PUBLIC_SITE_URL || 'https://kabarkini.id'
const SITE_NAME = 'KabarKini'
const SITE_DESC = 'Portal berita digital Indonesia terpercaya. Berita terkini, analisis mendalam, dan isu-isu panas nasional setiap hari.'

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

export async function GET() {
  const articles = await getPublishedArticles(50)

  const items = articles.map(a => `
    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${SITE_URL}/${a.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/${a.slug}</guid>
      <description>${escapeXml(a.excerpt || '')}</description>
      <pubDate>${new Date(a.publishedAt || a.createdAt).toUTCString()}</pubDate>
      <category>${escapeXml(a.category.name)}</category>
      <author>redaksi@kabarkini.id (${escapeXml(a.authorLabel)})</author>
      ${a.coverImageUrl ? `<enclosure url="${escapeXml(a.coverImageUrl)}" type="image/jpeg" />` : ''}
    </item>`).join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESC}</description>
    <language>id-ID</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
