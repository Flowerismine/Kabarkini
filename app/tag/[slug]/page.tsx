import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Tag, ChevronRight, Hash, TrendingUp, ArrowRight } from 'lucide-react'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { BreakingTicker } from '@/components/layout/breaking-ticker'
import { ArticleCard } from '@/components/news/article-card'
import { AdSlot } from '@/components/ads/ad-slot'
import { getArticlesByTag, getTagBySlug, getPublishedArticles, getTags } from '@/lib/supabase/queries'

export const dynamic   = 'force-dynamic'
export const revalidate = 0

interface TagPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params
  const tag = await getTagBySlug(slug)
  if (!tag) return { title: 'Tag Tidak Ditemukan | KabarKini' }
  return {
    title:       `#${tag.name} — Artikel & Berita Terkini | KabarKini`,
    description: `Kumpulan artikel dan berita terkini bertag #${tag.name} dari KabarKini.`,
    alternates:  { canonical: `https://kabarkini.id/tag/${tag.slug}` },
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params
  const [tag, articles, popular, allTags] = await Promise.all([
    getTagBySlug(slug),
    getArticlesByTag(slug),
    getPublishedArticles(10),
    getTags(),
  ])

  if (!tag) notFound()

  const popularSorted = [...popular]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 5)

  const relatedTags = allTags.filter(t => t.slug !== slug).slice(0, 12)

  return (
    <>
      <SiteHeader />
      <BreakingTicker />
      <main id="main-content" className="max-w-7xl mx-auto px-4 py-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-5">
          <Link href="/" className="hover:text-[var(--navy)] transition-colors">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="text-foreground font-semibold">#{tag.name}</span>
        </nav>

        <header className="mb-8 pb-6 border-b border-border">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="w-14 h-14 rounded-xl bg-[var(--navy)] flex items-center justify-center shrink-0">
              <Hash className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">#{tag.name}</h1>
              <p className="text-muted-foreground text-sm mt-1.5">
                <span className="font-semibold text-foreground">{articles.length}</span> artikel tersedia &bull; Diperbarui setiap hari
              </p>
              {relatedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {relatedTags.slice(0, 8).map(t => (
                    <Link key={t.id} href={`/tag/${t.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-medium bg-muted hover:bg-[var(--navy)] hover:text-white text-muted-foreground px-2.5 py-1 rounded-full transition-colors">
                      <Hash className="w-3 h-3" />{t.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {articles.length === 0 ? (
              <div className="bg-white rounded-xl border border-border p-12 text-center">
                <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="font-serif text-xl font-bold text-foreground mb-2">Belum Ada Artikel</h2>
                <p className="text-muted-foreground text-sm mb-6">Belum ada artikel bertag #{tag.name} saat ini.</p>
                <Link href="/" className="inline-flex items-center gap-2 bg-[var(--navy)] text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-[var(--navy-light)] transition-colors text-sm">
                  Kembali ke Beranda <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <section>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[var(--navy)]" /> Artikel Terbaru
                  </h2>
                  <span className="text-sm text-muted-foreground">{articles.length} artikel</span>
                </div>
                <div className="flex justify-center mb-6">
                  <AdSlot position="in_content_1" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {articles.map((article, idx) => (
                    <>
                      <ArticleCard key={article.id} article={article} variant="default" />
                      {idx === 3 && (
                        <div key="mid-ad" className="sm:col-span-2 flex justify-center">
                          <AdSlot position="in_content_2" />
                        </div>
                      )}
                    </>
                  ))}
                </div>
              </section>
            )}

            {/* All tags */}
            {allTags.length > 0 && (
              <section className="mt-10 bg-white rounded-xl border border-border p-6">
                <h2 className="font-serif font-bold text-base text-foreground mb-4">Semua Topik</h2>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(t => (
                    <Link key={t.id} href={`/tag/${t.slug}`}
                      className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full transition-colors border ${
                        t.slug === slug
                          ? 'bg-[var(--navy)] text-white border-[var(--navy)]'
                          : 'bg-white text-muted-foreground border-border hover:border-[var(--navy)] hover:text-[var(--navy)]'
                      }`}>
                      <Hash className="w-3 h-3" />{t.name}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-5">
              <AdSlot position="sidebar" />
              {popularSorted.length > 0 && (
                <div className="bg-white rounded-xl border border-border p-5">
                  <h3 className="font-serif font-bold text-base text-foreground mb-4 border-b border-border pb-3">
                    Paling Banyak Dibaca
                  </h3>
                  <ol className="space-y-4">
                    {popularSorted.map((a, idx) => (
                      <li key={a.id} className="flex items-start gap-3 group">
                        <span className="font-serif text-2xl font-bold text-border leading-none shrink-0 w-6 text-center mt-0.5">{idx + 1}</span>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: a.category.color }}>{a.category.name}</span>
                          <Link href={`/${a.slug}`}
                            className="block text-sm font-semibold text-foreground group-hover:text-[var(--navy)] transition-colors leading-snug mt-0.5 line-clamp-2">
                            {a.title}
                          </Link>
                          {!!a.viewCount && (
                            <p className="text-xs text-muted-foreground mt-1">{a.viewCount.toLocaleString('id-ID')} pembaca</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
