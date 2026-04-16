import type { Metadata } from 'next'
import Link from 'next/link'
import { Home, Search, TrendingUp, ArrowRight } from 'lucide-react'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { CategoryHoverLinks } from '@/components/news/category-hover-links'
import { CATEGORIES, ARTICLES } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: 'Halaman Tidak Ditemukan | KabarKini',
  description: 'Halaman yang Anda cari tidak ditemukan. Kembali ke beranda atau cari berita terkini.',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  const popularArticles = ARTICLES
    .filter((a) => a.status === 'published')
    .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
    .slice(0, 4)

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="max-w-4xl mx-auto px-4 py-16 text-center">

        {/* Big 404 */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[var(--navy)]/10 mb-6">
            <span className="font-serif text-4xl font-black text-[var(--navy)]">404</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
            Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
            Mungkin URL yang Anda masukkan salah atau halaman ini sudah dihapus.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
          <Link
            href="/"
            className="flex items-center gap-2 bg-[var(--navy)] text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-[var(--navy-light)] transition-colors text-sm"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            Kembali ke Beranda
          </Link>
          <Link
            href="/pencarian"
            className="flex items-center gap-2 border-2 border-[var(--navy)] text-[var(--navy)] font-semibold px-6 py-2.5 rounded-lg hover:bg-[var(--navy)] hover:text-white transition-colors text-sm"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            Cari Berita
          </Link>
          <Link
            href="/trending"
            className="flex items-center gap-2 border border-border text-muted-foreground font-semibold px-6 py-2.5 rounded-lg hover:bg-muted transition-colors text-sm"
          >
            <TrendingUp className="w-4 h-4" aria-hidden="true" />
            Berita Trending
          </Link>
        </div>

        {/* Kategori navigation */}
        <div className="mb-12">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-widest mb-4">
            Jelajahi Kategori
          </h2>
          <CategoryHoverLinks categories={CATEGORIES} />
        </div>

        {/* Popular articles */}
        {popularArticles.length > 0 && (
          <div className="text-left">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-xl font-bold text-foreground">Artikel Populer</h2>
              <Link
                href="/trending"
                className="flex items-center gap-1 text-sm text-[var(--navy)] font-semibold hover:underline"
              >
                Lihat semua
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {popularArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/${article.slug}`}
                  className="group flex gap-3 bg-white rounded-xl border border-border p-3.5 hover:shadow-md transition-all"
                >
                  <img
                    src={`https://placehold.co/80x60?text=${encodeURIComponent(article.category.name)}`}
                    alt={article.coverImageAlt}
                    className="w-20 h-14 object-cover rounded-lg shrink-0"
                    width={80}
                    height={60}
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wide"
                      style={{ color: article.category.color }}
                    >
                      {article.category.name}
                    </span>
                    <h3 className="font-serif font-bold text-sm text-foreground leading-snug line-clamp-2 group-hover:text-[var(--navy)] transition-colors">
                      {article.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
