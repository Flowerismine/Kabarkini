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

export function ArticleCard({
  article,
  variant = 'default',
  className = '',
  showImage = true,
  showExcerpt = true,
  showMeta = true,
}: ArticleCardProps) {
  const categoryColor = article.category.color

  if (variant === 'minimal') {
    return (
      <article className={`group flex items-start gap-3 py-3 border-b border-border last:border-0 ${className}`}>
        <div className="flex-1 min-w-0">
          <span
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: categoryColor }}
          >
            {article.category.name}
          </span>
          <h3 className="font-serif text-sm font-bold text-foreground leading-snug mt-0.5 group-hover:text-[var(--navy)] transition-colors line-clamp-2">
            <Link href={`/${article.slug}`} className="hover:underline">
              {article.title}
            </Link>
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(article.publishedAt || article.createdAt)}
          </p>
        </div>
        {showImage && (
          <Link href={`/${article.slug}`} className="shrink-0">
            <img
              src={`https://placehold.co/80x60?text=${encodeURIComponent(article.category.name)}`}
              alt={article.coverImageAlt}
              className="w-20 h-14 object-cover rounded"
              loading="lazy"
              width={80}
              height={60}
            />
          </Link>
        )}
      </article>
    )
  }

  if (variant === 'horizontal') {
    return (
      <article className={`group flex gap-4 news-card ${className}`}>
        {showImage && (
          <Link href={`/${article.slug}`} className="shrink-0">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={article.coverImageUrl || `https://placehold.co/160x120?text=${encodeURIComponent(article.category.name)}`}
                alt={article.coverImageAlt}
                className="w-40 h-28 object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                width={160}
                height={120}
                onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/160x120?text=${encodeURIComponent(article.category.name)}` }}
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
            <span
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: categoryColor }}
            >
              {article.category.name}
            </span>
            <h3 className="font-serif font-bold text-foreground leading-snug mt-1 group-hover:text-[var(--navy)] transition-colors line-clamp-2 text-base">
              <Link href={`/${article.slug}`}>{article.title}</Link>
            </h3>
            {showExcerpt && (
              <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                {article.excerpt}
              </p>
            )}
          </div>
          {showMeta && (
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.readingTime} menit
              </span>
              <span>{formatDistanceToNow(article.publishedAt || article.createdAt)}</span>
              {article.viewCount && (
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {article.viewCount.toLocaleString('id-ID')}
                </span>
              )}
            </div>
          )}
        </div>
      </article>
    )
  }

  if (variant === 'compact') {
    return (
      <article className={`group news-card bg-white rounded-lg overflow-hidden border border-border ${className}`}>
        {showImage && (
          <Link href={`/${article.slug}`} className="block overflow-hidden">
            <div className="relative">
              <img
                src={article.coverImageUrl || `https://placehold.co/400x220?text=${encodeURIComponent(article.category.name)}`}
                alt={article.coverImageAlt}
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                width={400}
                height={220}
                onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/400x220?text=${encodeURIComponent(article.category.name)}` }}
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
          <span
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: categoryColor }}
          >
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

  // Default variant
  return (
    <article className={`group news-card bg-white rounded-xl overflow-hidden border border-border shadow-sm ${className}`}>
      {showImage && (
        <Link href={`/${article.slug}`} className="block overflow-hidden">
          <div className="relative">
            <img
              src={article.coverImageUrl || `https://placehold.co/600x340?text=${encodeURIComponent(article.category.name)}`}
              alt={article.coverImageAlt}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              width={600}
              height={340}
              onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/600x340?text=${encodeURIComponent(article.category.name)}` }}
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
        <span
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: categoryColor }}
        >
          {article.category.name}
        </span>
        <h3 className="font-serif font-bold text-foreground leading-snug mt-2 group-hover:text-[var(--navy)] transition-colors text-lg line-clamp-2">
          <Link href={`/${article.slug}`}>{article.title}</Link>
        </h3>
        {showExcerpt && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
        )}
        {showMeta && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
            <span>{article.authorLabel}</span>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.readingTime} mnt
              </span>
              <span>&bull;</span>
              <span>{formatDistanceToNow(article.publishedAt || article.createdAt)}</span>
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
