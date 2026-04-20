import Link from 'next/link'
import { Clock, Eye, ArrowRight } from 'lucide-react'
import type { Article } from '@/types'
import { formatDistanceToNow } from '@/lib/date-utils'

interface HeroSectionProps {
  articles: Article[]
}

// Fallback images per kategori dari Unsplash (tidak pakai placehold.co)
const CATEGORY_FALLBACK: Record<string, string> = {
  politik:       'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&h=680&fit=crop&auto=format',
  hukum:         'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&h=680&fit=crop&auto=format',
  ekonomi:       'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=680&fit=crop&auto=format',
  teknologi:     'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=680&fit=crop&auto=format',
  sosial:        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=680&fit=crop&auto=format',
  olahraga:      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=680&fit=crop&auto=format',
  internasional: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=1200&h=680&fit=crop&auto=format',
  viral:         'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=1200&h=680&fit=crop&auto=format',
}

const THUMB_FALLBACK: Record<string, string> = {
  politik:       'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=200&h=140&fit=crop&auto=format',
  hukum:         'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200&h=140&fit=crop&auto=format',
  ekonomi:       'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&h=140&fit=crop&auto=format',
  teknologi:     'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=140&fit=crop&auto=format',
  sosial:        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&h=140&fit=crop&auto=format',
  olahraga:      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=140&fit=crop&auto=format',
  internasional: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=200&h=140&fit=crop&auto=format',
  viral:         'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=200&h=140&fit=crop&auto=format',
}

function getHeroImage(article: Article): string {
  if (article.coverImageUrl && article.coverImageUrl.startsWith('http')) {
    return article.coverImageUrl
  }
  return CATEGORY_FALLBACK[article.category.slug] || CATEGORY_FALLBACK.sosial
}

function getThumbImage(article: Article): string {
  if (article.coverImageUrl && article.coverImageUrl.startsWith('http')) {
    return article.coverImageUrl
  }
  return THUMB_FALLBACK[article.category.slug] || THUMB_FALLBACK.sosial
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getHeroImage(hero)}
                alt={hero.coverImageAlt || hero.title}
                className="w-full h-64 sm:h-80 lg:h-[420px] object-cover group-hover:scale-105 transition-transform duration-500"
                loading="eager"
                width={1200}
                height={680}
                onError={(e) => {
                  const img = e.target as HTMLImageElement
                  const fallback = CATEGORY_FALLBACK[hero.category.slug] || CATEGORY_FALLBACK.sosial
                  if (img.src !== fallback) img.src = fallback
                }}
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
                  {hero.readingTime > 0 && (
                    <>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" aria-hidden="true" />
                        {hero.readingTime} mnt baca
                      </span>
                      <span aria-hidden="true">&bull;</span>
                    </>
                  )}
                  <time>{formatDistanceToNow(hero.publishedAt || hero.createdAt)}</time>
                  {!!hero.viewCount && (
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getThumbImage(article)}
                    alt={article.coverImageAlt || article.title}
                    className="w-24 h-[72px] md:w-28 md:h-20 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    width={160}
                    height={110}
                    onError={(e) => {
                      const img = e.target as HTMLImageElement
                      const fallback = THUMB_FALLBACK[article.category.slug] || THUMB_FALLBACK.sosial
                      if (img.src !== fallback) img.src = fallback
                    }}
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
                  {!!article.viewCount && (
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
