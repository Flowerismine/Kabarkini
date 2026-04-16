import type { Metadata } from 'next'
import Link from 'next/link'
import { TrendingUp, Flame, ArrowRight } from 'lucide-react'
import { TRENDING_TOPICS, ARTICLES } from '@/lib/mock-data'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { BreakingTicker } from '@/components/layout/breaking-ticker'
import { ArticleCard } from '@/components/news/article-card'
import { formatDistanceToNow } from '@/lib/date-utils'

export const metadata: Metadata = {
  title: 'Trending Sekarang | KabarKini',
  description: 'Topik dan artikel yang paling banyak dibicarakan saat ini. Diperbarui setiap jam.',
  alternates: { canonical: 'https://kabarkini.id/trending' },
}

function HeatBadge({ value }: { value: number }) {
  const [label, cls] =
    value >= 90 ? ['🔥 Sangat Panas', 'bg-red-100 text-red-700 border-red-200'] :
    value >= 75 ? ['Panas', 'bg-orange-100 text-orange-700 border-orange-200'] :
    value >= 60 ? ['Hangat', 'bg-yellow-100 text-yellow-700 border-yellow-200'] :
    ['Baru Naik', 'bg-slate-100 text-slate-600 border-slate-200']
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${cls}`}>
      {label}
    </span>
  )
}

export default function TrendingPage() {
  const sorted = [...TRENDING_TOPICS].sort((a, b) => b.hotness - a.hotness)

  const trendingArticles = ARTICLES
    .filter((a) => a.status === 'published')
    .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
    .slice(0, 8)

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

          {/* Top trending — numbered list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sorted.slice(0, 6).map((topic, idx) => (
              <Link
                key={topic.id}
                href={`/kategori/${TRENDING_TOPICS[0].category.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex items-start gap-4 bg-card border border-border rounded-xl p-4 hover:border-[var(--navy)] hover:shadow-sm transition-all group"
              >
                <span className="font-serif font-black text-4xl text-slate-200 shrink-0 leading-none mt-1">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
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
                    <span>Diperbarui {formatDistanceToNow(topic.lastUpdated)}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {topic.keywords.slice(0, 3).map((kw) => (
                      <span key={kw} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[var(--navy)] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
              </Link>
            ))}
          </div>
        </section>

        {/* Trending articles */}
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

        {/* All topics */}
        {sorted.length > 6 && (
          <section>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6 pb-3 border-b border-border">
              Semua Topik Trending
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sorted.slice(6).map((topic) => (
                <div key={topic.id} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      {topic.category}
                    </span>
                    <HeatBadge value={topic.hotness} />
                  </div>
                  <h3 className="font-serif font-bold text-sm text-foreground leading-snug">
                    {topic.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span>{topic.articleCount} artikel</span>
                    <span>{formatDistanceToNow(topic.lastUpdated)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
