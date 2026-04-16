import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'KabarKini — Fakta Cepat. Analisis Tepat.',
    template: '%s | KabarKini',
  },
  description:
    'Portal berita digital Indonesia terpercaya. Berita terkini, analisis mendalam, dan isu-isu panas nasional setiap hari.',
  keywords: ['berita indonesia', 'berita terkini', 'isu nasional', 'politik', 'ekonomi', 'hukum'],
  authors: [{ name: 'Tim Redaksi KabarKini' }],
  creator: 'KabarKini',
  publisher: 'KabarKini',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kabarkini.id'),
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'KabarKini',
    title: 'KabarKini — Fakta Cepat. Analisis Tepat.',
    description:
      'Portal berita digital Indonesia terpercaya. Berita terkini, analisis mendalam, dan isu-isu panas nasional setiap hari.',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@KabarKini',
    creator: '@KabarKini',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    types: {
      'application/rss+xml': '/rss',
    },
  },
}

export const viewport: Viewport = {
  themeColor: '#0F1F3D',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
