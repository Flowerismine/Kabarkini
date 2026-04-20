import type { Metadata } from 'next'
import Link from 'next/link'
import { TrendingUp, Flame, ArrowRight, Clock } from 'lucide-react'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { BreakingTicker } from '@/components/layout/breaking-ticker'
import { ArticleCard } from '@/components/news/article-card'
import { getPublishedArticles } from '@/lib/supabase/queries'
import { formatDistanceToNow } from '@/lib/date-utils'

export const dynamic   = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title:       'Trending Sekarang | KabarKini',
  description: 'Topik dan artikel yang paling banyak dibicarakan saat ini. Diperbarui setiap jam.',
  alternates:  { canonical: 'https://kabarkini.id/trending' },
}

// Cluster artikel berdasarkan kategori → simulasi "topik trending"
function buildTrendingTopics(articles: Awaited<ReturnType<typeof getPublishedArticles>>) {
  const byCategory = new Map<string, typeof articles>()

  articles.forEach(a => {
    const key = a.category.slug
    if (!byCategory.has(key)) byCategory.set(key, [])
    byCategory.get(key)!.push(a)
  })

  return Array.from(byCategory.entries())
    .map(([slug, arts]) => ({
      id:           slug,
      title:        arts[0].category.name,
      category:     arts[0].category.name,
      color:        arts[0].category.color,
      articleCount: arts.length,
      hotness:      Math.min(100, arts.length * 15 + (arts.some(a => a.isBreaking) ? 20 : 0) + 40),
      lastUpdated:  arts[0].publishedAt || arts[0].createdAt,
      keywords:     [...new Set(arts.flatMap(a => a.focusKeyword ? [a.focusKeyword] : []).slice(0, 3))],
      href:         `/kategori/${slug}`,
    }))
    .sort((a, b) => b.hotness - a.hotness)
}

function HeatBadge({ value }: { value: number }) {
  const [label, cls] =
    value >= 90 ? ['🔥 Sangat Panas', 'bg-red-100 text-red-700 border-red-200']     :
    value >= 75 ? ['Panas',           'bg-orange-100 text-orange-700 border-orange-200'] :
    value >= 60 ? ['Hangat',          'bg-yellow-100 text-yellow-700 border-yellow-200'] :
                  ['Baru Naik',       'bg-slate-100 text-slate-600 border-slate-200']
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${cls}`}>
      {label}
    </span>
  )
}

export default async function TrendingPage() {
  // Ambil semua artikel published, sort by viewCount
  const allArticles = await getPublishedArticles(50)

  const trendingArticles = [...allArticles]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 8)

  const topics = buildTrendingTopics(allArticles)

  return (
    <>
      <SiteHeader />
      <BreakingTicker />
      <main id="main-content" className="max-w-7xl mx-auto px-4 py-8 space-y-12">

        {/* Hero */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-7 h-7 text-[var(--red)]" />
            <div>
              <h1 className="font-serif text-3xl font-black text-foreground">Trending Sekarang</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Topik yang paling banyak dibicarakan saat ini, diperbarui setiap jam
              </p>
            </div>
          </div>

          {topics.length === 0 ? (
            <div className="bg-slate-50 rounded-xl p-12 text-center">
              <p className="text-muted-foreground">Belum ada topik trending. Generate berita terlebih dahulu.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topics.slice(0, 6).map((topic, idx) => (
                <Link
                  key={topic.id}
                  href={topic.href}
                  className="flex items-start gap-4 bg-card border border-border rounded-xl p-4 hover:border-[var(--navy)] hover:shadow-sm transition-all group"
                >
                  <span className="font-serif font-black text-4xl text-slate-200 shrink-0 leading-none mt-1">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide"
                        style={{ color: topic.color }}>
                        {topic.category}
                      </span>
                      <HeatBadge value={topic.hotness} />
                    </div>
                    <h2 className="font-serif font-bold text-base text-foreground leading-snug group-hover:text-[var(--navy)] transition-colors">
                      {topic.title}
                    </h2>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-400" />
                        Hotness: <strong>{topic.hotness}</strong>
                      </span>
                      <span>{topic.articleCount} artikel</span>
                      {topic.lastUpdated && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(topic.lastUpdated)}
                        </span>
                      )}
                    </div>
                    {topic.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {topic.keywords.map(kw => (
                          <span key={kw} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                            #{kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[var(--navy)] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Trending articles — real dari Supabase */}
        {trendingArticles.length > 0 && (
          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6 pb-3 border-b border-border">
              Artikel Paling Banyak Dibaca
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {trendingArticles.map((article, idx) => (
                <div key={article.id} className="relative">
                  {idx < 3 && (
                    <span className="absolute -top-2 -left-2 z-10 w-7 h-7 rounded-full bg-[var(--red)] text-white text-xs font-bold flex items-center justify-center font-serif shadow">
                      {idx + 1}
                    </span>
                  )}
                  <ArticleCard article={article} variant="compact" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All topics */}
        {topics.length > 6 && (
          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6 pb-3 border-b border-border">
              Semua Topik Trending
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topics.slice(6).map(topic => (
                <Link key={topic.id} href={topic.href}
                  className="bg-card border border-border rounded-xl p-4 hover:border-[var(--navy)] hover:shadow-sm transition-all group">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: topic.color }}>
                      {topic.category}
                    </span>
                    <HeatBadge value={topic.hotness} />
                  </div>
                  <h3 className="font-serif font-bold text-sm text-foreground leading-snug group-hover:text-[var(--navy)] transition-colors">
                    {topic.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span>{topic.articleCount} artikel</span>
                    {topic.lastUpdated && <span>{formatDistanceToNow(topic.lastUpdated)}</span>}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {allArticles.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">Belum ada artikel. Jalankan workflow untuk generate berita.</p>
            <Link href="/admin/workflow" className="mt-4 inline-block text-[var(--navy)] font-semibold hover:underline">
              Ke Halaman Workflow →
            </Link>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
