import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { BreakingTicker } from '@/components/layout/breaking-ticker'
import { CATEGORIES, TAGS, getPublishedArticles } from '@/lib/mock-data'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Peta Situs',
  description: 'Daftar lengkap semua halaman dan kategori di KabarKini.',
  robots: { index: true, follow: true },
}

const STATIC_PAGES = [
  { label: 'Beranda', href: '/' },
  { label: 'Trending', href: '/trending' },
  { label: 'Arsip Berita', href: '/arsip' },
  { label: 'Pencarian', href: '/pencarian' },
  { label: 'Sumber Berita', href: '/sumber' },
]

const INFO_PAGES = [
  { label: 'Tentang Kami', href: '/tentang-kami' },
  { label: 'Hubungi Kami', href: '/kontak' },
  { label: 'Pedoman Editorial', href: '/pedoman-editorial' },
  { label: 'Kebijakan Privasi', href: '/kebijakan-privasi' },
  { label: 'Syarat & Ketentuan', href: '/syarat-ketentuan' },
  { label: 'Disclaimer', href: '/disclaimer' },
]

export default function PetaSitusPage() {
  const articles = getPublishedArticles()

  return (
    <>
      <SiteHeader />
      <BreakingTicker />
      <main className="max-w-5xl mx-auto px-4 py-12" id="main-content">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-xs text-muted-foreground mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[var(--navy)] transition-colors">Beranda</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">Peta Situs</span>
        </nav>

        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Peta Situs</h1>
        <p className="text-muted-foreground text-sm mb-10">
          Daftar lengkap semua halaman, kategori, dan artikel yang tersedia di KabarKini.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Halaman Utama */}
          <section>
            <h2 className="font-serif font-bold text-base text-foreground border-b border-border pb-3 mb-4">
              Halaman Utama
            </h2>
            <ul className="space-y-2">
              {STATIC_PAGES.map((p) => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    className="text-sm text-[var(--navy)] hover:text-[var(--red)] transition-colors flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3 shrink-0" />
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Kategori */}
          <section>
            <h2 className="font-serif font-bold text-base text-foreground border-b border-border pb-3 mb-4">
              Kategori Berita
            </h2>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/kategori/${cat.slug}`}
                    className="text-sm text-[var(--navy)] hover:text-[var(--red)] transition-colors flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3 shrink-0" />
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Informasi */}
          <section>
            <h2 className="font-serif font-bold text-base text-foreground border-b border-border pb-3 mb-4">
              Informasi & Legal
            </h2>
            <ul className="space-y-2">
              {INFO_PAGES.map((p) => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    className="text-sm text-[var(--navy)] hover:text-[var(--red)] transition-colors flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3 shrink-0" />
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Tags */}
          <section>
            <h2 className="font-serif font-bold text-base text-foreground border-b border-border pb-3 mb-4">
              Tag Populer
            </h2>
            <ul className="space-y-2">
              {TAGS.slice(0, 12).map((tag) => (
                <li key={tag.id}>
                  <Link
                    href={`/tag/${tag.slug}`}
                    className="text-sm text-[var(--navy)] hover:text-[var(--red)] transition-colors flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3 shrink-0" />
                    #{tag.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Feed & API */}
          <section>
            <h2 className="font-serif font-bold text-base text-foreground border-b border-border pb-3 mb-4">
              Feed & Data
            </h2>
            <ul className="space-y-2">
              {[
                { label: 'RSS Feed', href: '/rss' },
                { label: 'Google News Sitemap', href: '/news-sitemap.xml' },
                { label: 'XML Sitemap', href: '/sitemap.xml' },
                { label: 'Robots.txt', href: '/robots.txt' },
              ].map((p) => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    className="text-sm text-[var(--navy)] hover:text-[var(--red)] transition-colors flex items-center gap-1"
                    target={p.href.includes('.xml') || p.href.includes('.txt') ? '_blank' : undefined}
                  >
                    <ChevronRight className="w-3 h-3 shrink-0" />
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Artikel terbaru */}
          <section className="md:col-span-2 lg:col-span-3">
            <h2 className="font-serif font-bold text-base text-foreground border-b border-border pb-3 mb-4">
              Artikel Terbaru ({articles.length} artikel)
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
              {articles.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/${a.slug}`}
                    className="text-sm text-[var(--navy)] hover:text-[var(--red)] transition-colors flex items-start gap-1 py-1"
                  >
                    <ChevronRight className="w-3 h-3 shrink-0 mt-1" />
                    <span className="line-clamp-2 leading-snug">{a.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
