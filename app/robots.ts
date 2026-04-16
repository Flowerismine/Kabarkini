import { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kabarkini.id'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/pencarian?*',
        ],
      },
      {
        userAgent: 'Googlebot-News',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: [
      `${SITE_URL}/sitemap.xml`,
      `${SITE_URL}/news-sitemap.xml`,
    ],
    host: SITE_URL,
  }
}
