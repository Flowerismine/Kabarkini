import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Article, Category } from '@/types'
import { ArticleCard } from './article-card'

interface CategorySectionProps {
  category: Category
  articles: Article[]
  layout?: 'grid' | 'list'
}

export function CategorySection({ category, articles, layout = 'grid' }: CategorySectionProps) {
  if (articles.length === 0) return null

  const [featured, ...rest] = articles

  return (
    <section aria-labelledby={`cat-${category.slug}`} className="mb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded-full" style={{ backgroundColor: category.color }} />
          <h2
            id={`cat-${category.slug}`}
            className="font-serif text-xl font-bold text-foreground"
          >
            {category.name}
          </h2>
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: `${category.color}15`,
              color: category.color,
            }}
          >
            {category.articleCount} artikel
          </span>
        </div>
        <Link
          href={`/kategori/${category.slug}`}
          className="text-sm text-[var(--navy)] font-semibold hover:text-[var(--red)] transition-colors flex items-center gap-1"
        >
          Lihat semua
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {layout === 'grid' && featured ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Featured */}
          <article className="md:col-span-1 group">
            <Link href={`/${featured.slug}`} className="block overflow-hidden rounded-xl">
              <div className="relative">
                <img
                  src={`https://placehold.co/600x400?text=${encodeURIComponent(category.name + '+Berita+Terbaru+Indonesia')}`}
                  alt={featured.coverImageAlt}
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  width={600}
                  height={400}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span
                    className="text-white text-xs font-bold px-2 py-0.5 rounded"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.name}
                  </span>
                  <h3 className="font-serif text-white font-bold text-base leading-snug mt-2 line-clamp-3 group-hover:text-slate-100 transition-colors">
                    {featured.title}
                  </h3>
                </div>
              </div>
            </Link>
          </article>

          {/* List */}
          <div className="md:col-span-2 flex flex-col divide-y divide-border">
            {rest.slice(0, 4).map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                variant="minimal"
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.slice(0, 6).map((article) => (
            <ArticleCard key={article.id} article={article} variant="compact" />
          ))}
        </div>
      )}
    </section>
  )
}
