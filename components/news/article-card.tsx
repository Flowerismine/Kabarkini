'use client'

import Link from 'next/link'
import { Clock, Eye } from 'lucide-react'
import type { Article } from '@/types'
import { formatDistanceToNow } from '@/lib/date-utils'

interface ArticleCardProps {
  article: Article
  variant?: 'default' | 'compact' | 'hero' | 'horizontal' | 'minimal'
  className?: string
  showImage?: boolean
  showExcerpt?: boolean
  showMeta?: boolean
}

// Fallback Unsplash per kategori
const FALLBACK: Record<string, string> = {
  politik:       'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&h=340&fit=crop&auto=format',
  hukum:         'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=340&fit=crop&auto=format',
  ekonomi:       'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=340&fit=crop&auto=format',
  teknologi:     'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=340&fit=crop&auto=format',
  sosial:        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=340&fit=crop&auto=format',
  olahraga:      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=340&fit=crop&auto=format',
  internasional: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=600&h=340&fit=crop&auto=format',
  viral:         'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=600&h=340&fit=crop&auto=format',
}

function getImg(article: Article, fallbackW = 600, fallbackH = 340): string {
  if (article.coverImageUrl?.startsWith('http')) return article.coverImageUrl
  return FALLBACK[article.category.slug]
    || `https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=${fallbackW}&h=${fallbackH}&fit=crop&auto=format`
}

function handleImgError(e: React.SyntheticEvent<HTMLImageElement>, article: Article) {
  const img  = e.target as HTMLImageElement
  const fallback = FALLBACK[article.category.slug] || FALLBACK.sosial
  if (img.src !== fallback) img.src = fallback
}

export function ArticleCard({
  article,
  variant = 'default',
  className = '',
  showImage = true,
  showExcerpt = true,
  showMeta = true,
}: ArticleCardProps) {
  const categoryColor = article.category.color

  // ── Minimal ────────────────────────────────────────────────
  if (variant === 'minimal') {
    return (
      <article className={`group flex items-start gap-3 py-3 border-b border-border last:border-0 ${className}`}>
        <div className="flex-1 min-w-0">
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: categoryColor }}>
            {article.category.name}
          </span>
          <h3 className="font-serif text-sm font-bold text-foreground leading-snug mt-0.5 group-hover:text-[var(--navy)] transition-colors line-clamp-2">
            <Link href={`/${article.slug}`} className="hover:underline">{article.title}</Link>
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(article.publishedAt || article.createdAt)}
          </p>
        </div>
        {showImage && (
          <Link href={`/${article.slug}`} className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getImg(article, 80, 60)}
              alt={article.coverImageAlt || article.title}
              className="w-20 h-14 object-cover rounded"
              loading="lazy"
              width={80}
              height={60}
              onError={(e) => handleImgError(e, article)}
            />
          </Link>
        )}
      </article>
    )
  }

  // ── Horizontal ─────────────────────────────────────────────
  if (variant === 'horizontal') {
    return (
      <article className={`group flex gap-4 news-card ${className}`}>
        {showImage && (
          <Link href={`/${article.slug}`} className="shrink-0">
            <div className="relative overflow-hidden rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getImg(article, 160, 120)}
                alt={article.coverImageAlt || article.title}
                className="w-40 h-28 object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                width={160}
                height={120}
                onError={(e) => handleImgError(e, article)}
              />
              {article.isBreaking && (
                <span className="absolute top-1.5 left-1.5 bg-[var(--red)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
                  Breaking
                </span>
              )}
            </div>
          </Link>
        )}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: categoryColor }}>
              {article.category.name}
            </span>
            <h3 className="font-serif font-bold text-foreground leading-snug mt-1 group-hover:text-[var(--navy)] transition-colors line-clamp-2 text-base">
              <Link href={`/${article.slug}`}>{article.title}</Link>
            </h3>
            {showExcerpt && (
              <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">{article.excerpt}</p>
            )}
          </div>
          {showMeta && (
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              {article.readingTime > 0 && (
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readingTime} menit</span>
              )}
              <span>{formatDistanceToNow(article.publishedAt || article.createdAt)}</span>
              {!!article.viewCount && (
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{article.viewCount.toLocaleString('id-ID')}</span>
              )}
            </div>
          )}
        </div>
      </article>
    )
  }

  // ── Compact ────────────────────────────────────────────────
  if (variant === 'compact') {
    return (
      <article className={`group news-card bg-white rounded-lg overflow-hidden border border-border ${className}`}>
        {showImage && (
          <Link href={`/${article.slug}`} className="block overflow-hidden">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getImg(article, 400, 220)}
                alt={article.coverImageAlt || article.title}
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                width={400}
                height={220}
                onError={(e) => handleImgError(e, article)}
              />
              {article.isBreaking && (
                <span className="absolute top-2 left-2 bg-[var(--red)] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                  Breaking
                </span>
              )}
              {article.isTrending && (
                <span className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                  Trending
                </span>
              )}
            </div>
          </Link>
        )}
        <div className="p-4">
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: categoryColor }}>
            {article.category.name}
          </span>
          <h3 className="font-serif font-bold text-foreground leading-snug mt-1.5 group-hover:text-[var(--navy)] transition-colors line-clamp-3 text-[0.95rem]">
            <Link href={`/${article.slug}`}>{article.title}</Link>
          </h3>
          {showMeta && (
            <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground border-t border-border pt-3">
              <span>{article.authorLabel}</span>
              <span>&bull;</span>
              <span>{formatDistanceToNow(article.publishedAt || article.createdAt)}</span>
            </div>
          )}
        </div>
      </article>
    )
  }

  // ── Default ────────────────────────────────────────────────
  return (
    <article className={`group news-card bg-white rounded-xl overflow-hidden border border-border shadow-sm ${className}`}>
      {showImage && (
        <Link href={`/${article.slug}`} className="block overflow-hidden">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getImg(article, 600, 340)}
              alt={article.coverImageAlt || article.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              width={600}
              height={340}
              onError={(e) => handleImgError(e, article)}
            />
            {article.isBreaking && (
              <span className="absolute top-3 left-3 bg-[var(--red)] text-white text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wide">
                Breaking
              </span>
            )}
            {article.isTrending && !article.isBreaking && (
              <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wide">
                Trending
              </span>
            )}
          </div>
        </Link>
      )}
      <div className="p-5">
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: categoryColor }}>
          {article.category.name}
        </span>
        <h3 className="font-serif font-bold text-foreground leading-snug mt-2 group-hover:text-[var(--navy)] transition-colors text-lg line-clamp-2">
          <Link href={`/${article.slug}`}>{article.title}</Link>
        </h3>
        {showExcerpt && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{article.excerpt}</p>
        )}
        {showMeta && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
            <span>{article.authorLabel}</span>
            <div className="flex items-center gap-2">
              {article.readingTime > 0 && (
                <>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readingTime} mnt</span>
                  <span>&bull;</span>
                </>
              )}
              <span>{formatDistanceToNow(article.publishedAt || article.createdAt)}</span>
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
