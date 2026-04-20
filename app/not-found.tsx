import type { Metadata } from 'next'
import Link from 'next/link'
import { Home, Search, TrendingUp } from 'lucide-react'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { getPublishedArticles } from '@/lib/supabase/queries'

export const metadata: Metadata = {
  title:       'Halaman Tidak Ditemukan | KabarKini',
  description: 'Halaman yang Anda cari tidak ditemukan. Kembali ke beranda atau cari berita terkini.',
  robots:      { index: false, follow: true },
}

const CATEGORIES = [
  { slug: 'politik',       name: 'Politik',       color: '#1D4ED8' },
  { slug: 'hukum',         name: 'Hukum',         color: '#7C3AED' },
  { slug: 'ekonomi',       name: 'Ekonomi',       color: '#059669' },
  { slug: 'teknologi',     name: 'Teknologi',     color: '#0284C7' },
  { slug: 'sosial',        name: 'Sosial',        color: '#D97706' },
  { slug: 'olahraga',      name: 'Olahraga',      color: '#DC2626' },
  { slug: 'internasional', name: 'Internasional', color: '#374151' },
  { slug: 'viral',         name: 'Viral',         color: '#DB2777' },
]

export default async function NotFound() {
  const allArticles = await getPublishedArticles(10).catch(() => [])
  const popularArticles = [...allArticles]
    .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
    .slice(0, 4)

  return (
    <>
      <SiteHeader />
      <main className="max-w-4xl mx-auto px-4 py-16 text-center" id="main-content">
        {/* 404 visual */}
        <div className="mb-8">
          <div className="font-serif text-8xl font-black text-slate-100 select-none leading-none">404</div>
          <div className="-mt-6 relative z-10">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
              Halaman Tidak Ditemukan
            </h1>
            <p className="text-muted-foreground mt-3 text-sm max-w-md mx-auto leading-relaxed">
              Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan. Mungkin URL yang Anda masukkan salah atau halaman ini sudah dihapus.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <Link href="/"
            className="inline-flex items-center gap-2 bg-[var(--navy)] text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-[var(--navy-light)] transition-colors text-sm">
            <Home className="w-4 h-4" /> Kembali ke Beranda
          </Link>
          <Link href="/pencarian"
            className="inline-flex items-center gap-2 border border-border text-foreground font-semibold px-5 py-2.5 rounded-lg hover:bg-muted transition-colors text-sm">
            <Search className="w-4 h-4" /> Cari Berita
          </Link>
          <Link href="/trending"
            className="inline-flex items-center gap-2 border border-border text-foreground font-semibold px-5 py-2.5 rounded-lg hover:bg-muted transition-colors text-sm">
            <TrendingUp className="w-4 h-4" /> Berita Trending
          </Link>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="font-serif text-lg font-bold text-foreground mb-4">Jelajahi Kategori</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map(cat => (
              <Link key={cat.slug} href={`/kategori/${cat.slug}`}
                className="px-4 py-2 rounded-full text-sm font-semibold text-white hover:opacity-80 transition-opacity"
                style={{ backgroundColor: cat.color }}>
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Popular articles */}
        {popularArticles.length > 0 && (
          <div className="text-left">
            <h2 className="font-serif text-lg font-bold text-foreground mb-4">Artikel Populer</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {popularArticles.map(a => (
                <Link key={a.id} href={`/${a.slug}`}
                  className="flex items-start gap-3 bg-white border border-border rounded-xl p-4 hover:border-[var(--navy)] hover:shadow-sm transition-all group">
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold uppercase tracking-wide" style={{ color: a.category.color }}>
                      {a.category.name}
                    </span>
                    <p className="text-sm font-semibold text-foreground group-hover:text-[var(--navy)] transition-colors mt-1 line-clamp-2 leading-snug">
                      {a.title}
                    </p>
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
