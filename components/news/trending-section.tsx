import Link from 'next/link'
import { TrendingUp, Flame, ArrowRight } from 'lucide-react'
import type { TrendingTopic, Article } from '@/types'

interface TrendingSectionProps {
  topics: TrendingTopic[]
  articles: Article[]
}

export function TrendingSection({ topics, articles }: TrendingSectionProps) {
  return (
    <section aria-labelledby="trending-heading" className="mb-10">
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-[var(--red)] rounded-full" />
          <h2 id="trending-heading" className="font-serif text-xl font-bold text-foreground flex items-center gap-2">
            <Flame className="w-5 h-5 text-[var(--red)]" />
            Trending Hari Ini
          </h2>
        </div>
        <Link
          href="/trending"
          className="text-sm text-[var(--navy)] font-semibold hover:text-[var(--red)] transition-colors flex items-center gap-1"
        >
          Lihat semua
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trending topics list */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-border p-5">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
            Topik Panas
          </h3>
          <ol className="space-y-0">
            {topics.slice(0, 6).map((topic, idx) => (
              <li key={topic.id} className="border-b border-border last:border-0">
                <Link
                  href={`/pencarian?q=${encodeURIComponent(topic.keywords[0] || topic.title)}`}
                  className="flex items-center gap-3 py-3 group hover:bg-muted/50 -mx-1 px-1 rounded transition-colors"
                >
                  <span
                    className={`font-serif text-2xl font-bold leading-none shrink-0 w-7 text-center ${
                      idx < 3 ? 'text-[var(--red)]' : 'text-border'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground group-hover:text-[var(--navy)] transition-colors line-clamp-1">
                      {topic.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className="text-xs px-1.5 py-0.5 rounded font-medium"
                        style={{
                          backgroundColor: `${topic.category === 'Hukum' ? '#7C3AED' : topic.category === 'Ekonomi' ? '#065F46' : '#1D4ED8'}22`,
                          color: topic.category === 'Hukum' ? '#7C3AED' : topic.category === 'Ekonomi' ? '#065F46' : '#1D4ED8',
                        }}
                      >
                        {topic.category}
                      </span>
                      <span className="text-xs text-muted-foreground">{topic.articleCount} artikel</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: Math.min(5, Math.ceil(topic.hotness / 20)) }).map((_, i) => (
                        <div
                          key={i}
                          className="w-1 rounded-full"
                          style={{
                            height: `${8 + i * 3}px`,
                            backgroundColor: topic.hotness > 90 ? '#DC2626' : topic.hotness > 70 ? '#F97316' : '#94A3B8',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </div>

        {/* Trending articles grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {articles.slice(0, 4).map((article) => (
            <article key={article.id} className="group news-card bg-white rounded-xl border border-border overflow-hidden">
              <Link href={`/${article.slug}`} className="block overflow-hidden">
                <img
                  src={`https://placehold.co/400x220?text=${encodeURIComponent(article.category.name + ' Trending')}`}
                  alt={article.coverImageAlt}
                  className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  width={400}
                  height={220}
                />
              </Link>
              <div className="p-4">
                <span
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: article.category.color }}
                >
                  {article.category.name}
                </span>
                <h3 className="font-serif font-bold text-sm leading-snug mt-1 group-hover:text-[var(--navy)] transition-colors line-clamp-2">
                  <Link href={`/${article.slug}`}>{article.title}</Link>
                </h3>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 text-[var(--red)]" />
                  <span>{article.viewCount?.toLocaleString('id-ID') || '0'} pembaca</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
