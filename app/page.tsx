import type { Metadata } from 'next'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { BreakingTicker } from '@/components/layout/breaking-ticker'
import { HeroSection } from '@/components/news/hero-section'
import { ArticleCard } from '@/components/news/article-card'
import { AdSlot } from '@/components/ads/ad-slot'
import {
  getPublishedArticles,
  getFeaturedArticles,
  getArticlesByCategory,
} from '@/lib/supabase/public-queries'
import Link from 'next/link'
import { NewsletterForm } from '@/components/news/newsletter-form'
import { ArrowRight, Star } from 'lucide-react'
import type { Article } from '@/types'

export const dynamic    = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title:       'KabarKini — Fakta Cepat. Analisis Tepat.',
  description: 'Portal berita digital Indonesia terpercaya. Berita terkini, analisis mendalam, dan isu-isu panas nasional setiap hari.',
  openGraph: {
    title:       'KabarKini — Fakta Cepat. Analisis Tepat.',
    description: 'Portal berita digital Indonesia terpercaya.',
    type:        'website',
  },
}

const NAV_CATEGORIES = [
  { name: 'Politik',       slug: 'politik'       },
  { name: 'Hukum',         slug: 'hukum'         },
  { name: 'Ekonomi',       slug: 'ekonomi'       },
  { name: 'Teknologi',     slug: 'teknologi'     },
  { name: 'Sosial',        slug: 'sosial'        },
  { name: 'Olahraga',      slug: 'olahraga'      },
  { name: 'Internasional', slug: 'internasional' },
  { name: 'Viral',         slug: 'viral'         },
]

const POPULAR_TAGS = ['DPR','KPK','Korupsi','Pemilu','BI Rate','AI','Hukum','APBN','Gempa','Timnas']

// Safe fetch — never throws, returns [] on error
async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try { return await fn() } catch { return fallback }
}

export default async function HomePage() {
  const [
    latestArticles,
    featuredArticles,
    politikArticles,
    hukumArticles,
    ekonomiArticles,
    teknologiArticles,
  ] = await Promise.all([
    safe(() => getPublishedArticles(12), [] as Article[]),
    safe(() => getFeaturedArticles(),    [] as Article[]),
    safe(() => getArticlesByCategory('politik'),    [] as Article[]),
    safe(() => getArticlesByCategory('hukum'),      [] as Article[]),
    safe(() => getArticlesByCategory('ekonomi'),    [] as Article[]),
    safe(() => getArticlesByCategory('teknologi'),  [] as Article[]),
  ])

  const editorPicks     = featuredArticles.slice(0, 3)
  const popularArticles = [...latestArticles]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 5)

  return (
    <>
      <SiteHeader />
      <BreakingTicker />

      <div className="bg-white border-b border-border py-3 flex justify-center">
        <AdSlot position="header" />
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8" id="main-content">
        {latestArticles.length > 0 ? (
          <HeroSection articles={latestArticles.slice(0, 4)} />
        ) : (
          <div className="bg-slate-50 rounded-2xl p-12 text-center mb-8">
            <p className="text-slate-400 text-lg font-serif">Belum ada artikel yang diterbitkan.</p>
            <p className="text-slate-400 text-sm mt-2">Jalankan workflow untuk mulai generate berita.</p>
            <Link href="/admin/workflow" className="mt-4 inline-block text-[var(--navy)] font-semibold hover:underline text-sm">
              Ke Halaman Workflow →
            </Link>
          </div>
        )}

        {/* Category nav */}
        <nav aria-label="Kategori berita" className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          <Link href="/" className="shrink-0 bg-[var(--navy)] text-white text-xs font-bold px-4 py-2 rounded-full">Semua</Link>
          {NAV_CATEGORIES.map(cat => (
            <Link key={cat.slug} href={`/kategori/${cat.slug}`}
              className="shrink-0 text-xs font-semibold px-4 py-2 rounded-full border border-border hover:border-[var(--navy)] hover:text-[var(--navy)] transition-colors whitespace-nowrap">
              {cat.name}
            </Link>
          ))}
        </nav>

        {/* Latest */}
        {latestArticles.length > 0 && (
          <section aria-labelledby="terbaru-heading" className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-[var(--navy)] rounded-full" />
                <h2 id="terbaru-heading" className="font-serif text-xl font-bold text-foreground">Berita Terbaru</h2>
              </div>
              <Link href="/arsip" className="text-sm text-[var(--navy)] font-semibold hover:text-[var(--red)] transition-colors flex items-center gap-1">
                Lihat arsip <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {latestArticles.slice(0, 6).map(article => (
                <ArticleCard key={article.id} article={article} variant="default" />
              ))}
            </div>
          </section>
        )}

        <div className="flex justify-center my-8"><AdSlot position="in_content_1" /></div>

        {/* Two column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2 space-y-10">

            {politikArticles.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-5 bg-red-600 rounded-full" />
                    <h2 className="font-serif text-lg font-bold text-foreground">
                      Politik <span className="text-sm font-normal text-muted-foreground ml-1">{politikArticles.length} artikel</span>
                    </h2>
                  </div>
                  <Link href="/kategori/politik" className="text-xs text-[var(--navy)] font-semibold hover:underline flex items-center gap-1">
                    Lihat semua <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {politikArticles.slice(0, 4).map(a => <ArticleCard key={a.id} article={a} variant="compact" />)}
                </div>
              </section>
            )}

            <div className="flex justify-center"><AdSlot position="in_content_2" /></div>

            {hukumArticles.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-5 bg-blue-600 rounded-full" />
                    <h2 className="font-serif text-lg font-bold text-foreground">
                      Hukum <span className="text-sm font-normal text-muted-foreground ml-1">{hukumArticles.length} artikel</span>
                    </h2>
                  </div>
                  <Link href="/kategori/hukum" className="text-xs text-[var(--navy)] font-semibold hover:underline flex items-center gap-1">
                    Lihat semua <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hukumArticles.slice(0, 4).map(a => <ArticleCard key={a.id} article={a} variant="compact" />)}
                </div>
              </section>
            )}

            {ekonomiArticles.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-5 bg-green-600 rounded-full" />
                    <h2 className="font-serif text-lg font-bold text-foreground">
                      Ekonomi <span className="text-sm font-normal text-muted-foreground ml-1">{ekonomiArticles.length} artikel</span>
                    </h2>
                  </div>
                  <Link href="/kategori/ekonomi" className="text-xs text-[var(--navy)] font-semibold hover:underline flex items-center gap-1">
                    Lihat semua <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ekonomiArticles.slice(0, 4).map(a => <ArticleCard key={a.id} article={a} variant="compact" />)}
                </div>
              </section>
            )}

            {teknologiArticles.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-5 bg-purple-600 rounded-full" />
                    <h2 className="font-serif text-lg font-bold text-foreground">
                      Teknologi <span className="text-sm font-normal text-muted-foreground ml-1">{teknologiArticles.length} artikel</span>
                    </h2>
                  </div>
                  <Link href="/kategori/teknologi" className="text-xs text-[var(--navy)] font-semibold hover:underline flex items-center gap-1">
                    Lihat semua <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teknologiArticles.slice(0, 4).map(a => <ArticleCard key={a.id} article={a} variant="compact" />)}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="sticky top-24">
              <AdSlot position="sidebar" className="mb-6" />

              {editorPicks.length > 0 && (
                <div className="bg-white rounded-xl border border-border p-5 mb-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <h3 className="font-serif font-bold text-base text-foreground">Pilihan Editor</h3>
                  </div>
                  <div className="space-y-4">
                    {editorPicks.map(article => (
                      <ArticleCard key={article.id} article={article} variant="minimal" showImage={false} />
                    ))}
                  </div>
                </div>
              )}

              {popularArticles.length > 0 && (
                <div className="bg-white rounded-xl border border-border p-5 mt-5">
                  <h3 className="font-serif font-bold text-base text-foreground mb-4 border-b border-border pb-3">
                    Paling Banyak Dibaca
                  </h3>
                  <ol className="space-y-3">
                    {popularArticles.map((article, idx) => (
                      <li key={article.id} className="flex items-start gap-3 group">
                        <span className="font-serif text-2xl font-bold text-border leading-none shrink-0 w-6 text-center">
                          {idx + 1}
                        </span>
                        <div>
                          <Link href={`/${article.slug}`}
                            className="text-sm font-semibold text-foreground group-hover:text-[var(--navy)] transition-colors line-clamp-2 leading-snug">
                            {article.title}
                          </Link>
                          {!!article.viewCount && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {article.viewCount.toLocaleString('id-ID')} pembaca
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <div className="bg-white rounded-xl border border-border p-5 mt-5">
                <h3 className="font-serif font-bold text-base text-foreground mb-4 border-b border-border pb-3">
                  Topik Populer
                </h3>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_TAGS.map(tag => (
                    <Link key={tag} href={`/pencarian?q=${encodeURIComponent(tag)}`}
                      className="text-xs bg-muted hover:bg-[var(--navy)] hover:text-white px-3 py-1.5 rounded-full transition-colors font-medium">
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Newsletter */}
        <section aria-label="Langganan newsletter" className="bg-[var(--navy)] rounded-2xl p-8 md:p-12 text-white mb-10">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-white text-balance">
              Jangan Ketinggalan Berita Penting
            </h2>
            <p className="text-slate-300 mt-3 text-sm leading-relaxed">
              Langganan newsletter KabarKini dan dapatkan ringkasan berita terpenting langsung di inbox Anda setiap pagi.
            </p>
            <NewsletterForm />
            <p className="text-slate-500 text-xs mt-3">Tanpa spam. Bisa berhenti berlangganan kapan saja.</p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
