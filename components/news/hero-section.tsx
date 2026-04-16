import Link from 'next/link'
import { Clock, Eye, ArrowRight } from 'lucide-react'
import type { Article } from '@/types'
import { formatDistanceToNow } from '@/lib/date-utils'

interface HeroSectionProps {
  articles: Article[]
}

export function HeroSection({ articles }: HeroSectionProps) {
  const [hero, ...secondaries] = articles
  if (!hero) return null

  return (
    <section aria-labelledby="hero-heading" className="mb-10">
      <h2 id="hero-heading" className="sr-only">Berita Utama</h2>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* ── Main hero ─────────────────────────────── */}
        <article className="lg:col-span-3 group">
          <Link href={`/${hero.slug}`} className="block overflow-hidden rounded-xl shadow-md">
            <div className="relative">
              <img
                src={`https://placehold.co/1200x680?text=${encodeURIComponent(hero.category.name + '+Berita+Utama+Indonesia+Terkini+Hari+Ini')}`}
                alt={hero.coverImageAlt}
                className="w-full h-64 sm:h-80 lg:h-[420px] object-cover group-hover:scale-105 transition-transform duration-500"
                loading="eager"
                width={1200}
                height={680}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                {hero.isBreaking && (
                  <span className="bg-[var(--red)] text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">
                    Breaking
                  </span>
                )}
                <span
                  className="text-white text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wide"
                  style={{ backgroundColor: hero.category.color }}
                >
                  {hero.category.name}
                </span>
              </div>

              {/* Text overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
                <h3 className="font-serif text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight text-balance group-hover:text-slate-100 transition-colors">
                  {hero.title}
                </h3>
                <p className="text-slate-300 text-sm mt-2 line-clamp-2 hidden sm:block leading-relaxed">
                  {hero.excerpt}
                </p>
                <div className="flex items-center gap-3 mt-3 text-slate-400 text-xs flex-wrap">
                  <span>{hero.authorLabel}</span>
                  <span aria-hidden="true">&bull;</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" aria-hidden="true" />
                    {hero.readingTime} mnt baca
                  </span>
                  <span aria-hidden="true">&bull;</span>
                  <time>{formatDistanceToNow(hero.publishedAt || hero.createdAt)}</time>
                  {hero.viewCount && (
                    <>
                      <span aria-hidden="true">&bull;</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" aria-hidden="true" />
                        {hero.viewCount.toLocaleString('id-ID')} pembaca
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </article>

        {/* ── Secondary articles ────────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {secondaries.slice(0, 3).map((article) => (
            <article
              key={article.id}
              className="group flex gap-3 bg-white rounded-xl border border-border p-3.5 news-card shadow-sm"
            >
              {/* Thumbnail */}
              <Link href={`/${article.slug}`} className="shrink-0">
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={`https://placehold.co/160x110?text=${encodeURIComponent(article.category.name + '+News')}`}
                    alt={article.coverImageAlt}
                    className="w-24 h-18 md:w-28 md:h-20 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    width={160}
                    height={110}
                  />
                  {article.isBreaking && (
                    <span className="absolute top-1 left-1 bg-[var(--red)] text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
                      Breaking
                    </span>
                  )}
                </div>
              </Link>

              {/* Text */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: article.category.color }}
                  >
                    {article.category.name}
                  </span>
                  <h3 className="font-serif font-bold text-foreground text-sm leading-snug mt-1 group-hover:text-[var(--navy)] transition-colors line-clamp-3">
                    <Link href={`/${article.slug}`}>{article.title}</Link>
                  </h3>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <time>{formatDistanceToNow(article.publishedAt || article.createdAt)}</time>
                  {article.viewCount && (
                    <>
                      <span aria-hidden="true">&bull;</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" aria-hidden="true" />
                        {article.viewCount.toLocaleString('id-ID')}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </article>
          ))}

          {/* View all CTA */}
          <Link
            href="/trending"
            className="flex items-center justify-center gap-2 text-sm font-semibold text-[var(--navy)] border-2 border-[var(--navy)] rounded-xl py-3 hover:bg-[var(--navy)] hover:text-white transition-all duration-200 mt-auto"
          >
            Semua Berita Terkini
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
