import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { BreakingTicker } from '@/components/layout/breaking-ticker'
import { getPublishedArticles, getCategories, getTags } from '@/lib/supabase/queries'
import { ChevronRight } from 'lucide-react'

export const dynamic   = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title:       'Peta Situs',
  description: 'Daftar lengkap semua halaman dan kategori di KabarKini.',
  robots:      { index: true, follow: true },
}

const STATIC_PAGES = [
  { label: 'Beranda',        href: '/'                    },
  { label: 'Trending',       href: '/trending'            },
  { label: 'Arsip Berita',   href: '/arsip'               },
  { label: 'Pencarian',      href: '/pencarian'           },
  { label: 'Tentang Kami',   href: '/tentang-kami'        },
  { label: 'Kontak',         href: '/kontak'              },
  { label: 'Kebijakan Privasi', href: '/kebijakan-privasi'},
  { label: 'Syarat & Ketentuan', href: '/syarat-ketentuan'},
  { label: 'Disclaimer',     href: '/disclaimer'          },
  { label: 'Pedoman Editorial', href: '/pedoman-editorial'},
  { label: 'RSS Feed',       href: '/rss'                 },
]

export default async function PetaSitusPage() {
  const [articles, categories, tags] = await Promise.all([
    getPublishedArticles(100),
    getCategories(),
    getTags(),
  ])

  return (
    <>
      <SiteHeader />
      <BreakingTicker />
      <main className="max-w-5xl mx-auto px-4 py-10" id="main-content">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Peta Situs</h1>
        <p className="text-muted-foreground text-sm mb-8">Daftar lengkap semua halaman, kategori, dan artikel di KabarKini.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Halaman Statis */}
          <div>
            <h2 className="font-serif font-bold text-lg text-foreground mb-3 border-b border-border pb-2">Halaman Utama</h2>
            <ul className="space-y-2">
              {STATIC_PAGES.map(p => (
                <li key={p.href}>
                  <Link href={p.href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[var(--navy)] transition-colors">
                    <ChevronRight className="w-3.5 h-3.5" /> {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kategori */}
          <div>
            <h2 className="font-serif font-bold text-lg text-foreground mb-3 border-b border-border pb-2">Kategori</h2>
            <ul className="space-y-2">
              {categories.map(cat => (
                <li key={cat.id}>
                  <Link href={`/kategori/${cat.slug}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[var(--navy)] transition-colors">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>

            {tags.length > 0 && (
              <>
                <h2 className="font-serif font-bold text-lg text-foreground mt-6 mb-3 border-b border-border pb-2">Tag</h2>
                <ul className="space-y-2">
                  {tags.slice(0, 20).map(tag => (
                    <li key={tag.id}>
                      <Link href={`/tag/${tag.slug}`}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[var(--navy)] transition-colors">
                        <ChevronRight className="w-3.5 h-3.5" /> #{tag.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Artikel Terbaru */}
          <div>
            <h2 className="font-serif font-bold text-lg text-foreground mb-3 border-b border-border pb-2">
              Artikel Terbaru ({articles.length})
            </h2>
            <ul className="space-y-2">
              {articles.slice(0, 30).map(a => (
                <li key={a.id}>
                  <Link href={`/${a.slug}`}
                    className="flex items-start gap-2 text-sm text-muted-foreground hover:text-[var(--navy)] transition-colors">
                    <ChevronRight className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{a.title}</span>
                  </Link>
                </li>
              ))}
              {articles.length > 30 && (
                <li>
                  <Link href="/arsip" className="text-sm text-[var(--navy)] hover:underline font-medium">
                    Lihat {articles.length - 30} artikel lainnya →
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
