import type { Metadata } from 'next'
import Link from 'next/link'
import { Home, Search, TrendingUp } from 'lucide-react'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'

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

// Dibuat synchronous — tidak ada Supabase call
// agar tidak pernah crash ketika DB tidak tersedia
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="max-w-4xl mx-auto px-4 py-16 text-center" id="main-content">
        <div className="mb-8">
          <div className="font-serif text-8xl font-black text-slate-100 select-none leading-none">404</div>
          <div className="-mt-6 relative z-10">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
              Halaman Tidak Ditemukan
            </h1>
            <p className="text-muted-foreground mt-3 text-sm max-w-md mx-auto leading-relaxed">
              Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
              Mungkin URL yang Anda masukkan salah atau halaman ini sudah dihapus.
            </p>
          </div>
        </div>

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

        <div>
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
      </main>
      <SiteFooter />
    </>
  )
}
