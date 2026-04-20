import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Rss } from 'lucide-react'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { BreakingTicker } from '@/components/layout/breaking-ticker'
import { ArticleCard } from '@/components/news/article-card'
import { AdSlot } from '@/components/ads/ad-slot'
import {
  getArticlesByCategory,
  getPublishedArticles,
  getCategories,
} from '@/lib/supabase/public-queries'

export const dynamic   = 'force-dynamic'
export const revalidate = 0

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

// Hardcode kategori agar tidak perlu fetch untuk metadata
const STATIC_CATEGORIES = [
  { slug: 'politik',       name: 'Politik',       color: '#1D4ED8' },
  { slug: 'hukum',         name: 'Hukum',         color: '#7C3AED' },
  { slug: 'ekonomi',       name: 'Ekonomi',       color: '#059669' },
  { slug: 'teknologi',     name: 'Teknologi',     color: '#0284C7' },
  { slug: 'sosial',        name: 'Sosial',        color: '#D97706' },
  { slug: 'olahraga',      name: 'Olahraga',      color: '#DC2626' },
  { slug: 'internasional', name: 'Internasional', color: '#374151' },
  { slug: 'viral',         name: 'Viral',         color: '#DB2777' },
]

function getCategoryStatic(slug: string) {
  return STATIC_CATEGORIES.find(c => c.slug === slug)
}

const FALLBACK_IMAGES: Record<string, string> = {
  politik:       'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=900&h=500&fit=crop&auto=format',
  hukum:         'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=900&h=500&fit=crop&auto=format',
  ekonomi:       'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900&h=500&fit=crop&auto=format',
  teknologi:     'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&h=500&fit=crop&auto=format',
  sosial:        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&h=500&fit=crop&auto=format',
  olahraga:      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&h=500&fit=crop&auto=format',
  internasional: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=900&h=500&fit=crop&auto=format',
  viral:         'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=900&h=500&fit=crop&auto=format',
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const cat = getCategoryStatic(slug)
  if (!cat) return { title: 'Kategori Tidak Ditemukan | KabarKini' }
  return {
    title:       `${cat.name} — Berita Terkini | KabarKini`,
    description: `Kumpulan berita ${cat.name} terkini dan terpercaya dari KabarKini.`,
    alternates:  { canonical: `https://kabarkini.id/kategori/${cat.slug}` },
    openGraph: {
      title:       `${cat.name} — Berita Terkini | KabarKini`,
      description: `Kumpulan berita ${cat.name} terkini dari KabarKini.`,
      type:        'website',
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const categoryStatic = getCategoryStatic(slug)
  if (!categoryStatic) notFound()

  // Fetch parallel
  const [articles, allCategories, popularArticles] = await Promise.all([
    getArticlesByCategory(slug),
    getCategories(),
    getPublishedArticles(10),
  ])

  // Gunakan color dari DB jika ada, fallback ke static
  const dbCat = allCategories.find(c => c.slug === slug)
  const category = {
    ...categoryStatic,
    color: dbCat?.color || categoryStatic.color,
  }

  const [hero, ...rest] = articles
  const otherCategories = allCategories.filter(c => c.slug !== slug)
  const popular = [...popularArticles]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .filter(a => a.category.slug !== slug)
    .slice(0, 5)

  const heroImg = (hero?.coverImageUrl?.startsWith('http') ? hero.coverImageUrl : null)
    || FALLBACK_IMAGES[slug]
    || FALLBACK_IMAGES.sosial

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Beranda', item: 'https://kabarkini.id' },
      { '@type': 'ListItem', position: 2, name: category.name, item: `https://kabarkini.id/kategori/${category.slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <SiteHeader />
      <BreakingTicker />

      <main id="main-content" className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-5">
          <Link href="/" className="hover:text-[var(--navy)] transition-colors">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="font-semibold" style={{ color: category.color }}>{category.name}</span>
        </nav>

        {/* Category header */}
        <header className="mb-8 pb-6 border-b-2 border-border" style={{ borderBottomColor: category.color }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-3 h-8 rounded-full" style={{ backgroundColor: category.color }} />
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">{category.name}</h1>
              </div>
              <p className="text-muted-foreground text-sm ml-6">
                {articles.length} artikel tersedia &bull; Diperbarui setiap hari
              </p>
            </div>
            <Link href="/rss" className="flex items-center gap-1.5 text-xs font-semibold border border-border px-3 py-1.5 rounded-full text-muted-foreground hover:border-[var(--navy)] hover:text-[var(--navy)] transition-colors">
              <Rss className="w-3.5 h-3.5" /> RSS Feed
            </Link>
          </div>
        </header>

        {articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">Belum ada artikel di kategori ini.</p>
            <Link href="/" className="mt-4 inline-block text-[var(--navy)] font-semibold hover:underline">
              Kembali ke Beranda
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hero */}
              {hero && (
                <article className="group">
                  <Link href={`/${hero.slug}`} className="block overflow-hidden rounded-xl shadow-sm">
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={heroImg}
                        alt={hero.coverImageAlt || hero.title}
                        className="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="eager"
                        width={900}
                        height={500}
                        onError={(e) => {
                          const img = e.target as HTMLImageElement
                          const fb = FALLBACK_IMAGES[slug] || FALLBACK_IMAGES.sosial
                          if (img.src !== fb) img.src = fb
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="text-white text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wide"
                          style={{ backgroundColor: category.color }}>
                          {category.name}
                        </span>
                        {hero.isBreaking && (
                          <span className="bg-[var(--red)] text-white text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wide">
                            Breaking
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h2 className="font-serif text-xl md:text-2xl font-bold text-white leading-tight text-balance">
                          {hero.title}
                        </h2>
                        <p className="text-slate-300 text-sm mt-2 line-clamp-2 hidden sm:block leading-relaxed">
                          {hero.excerpt}
                        </p>
                        <div className="flex items-center gap-3 mt-3 text-slate-400 text-xs">
                          <span>{hero.authorLabel}</span>
                          {hero.readingTime > 0 && <><span>&bull;</span><span>{hero.readingTime} mnt baca</span></>}
                          {!!hero.viewCount && <><span>&bull;</span><span>{hero.viewCount.toLocaleString('id-ID')} pembaca</span></>}
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              )}

              <div className="flex justify-center">
                <AdSlot position="in_content_1" />
              </div>

              {/* Article grid */}
              {rest.length > 0 && (
                <section>
                  <h2 className="font-serif text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                    <div className="w-1 h-6 rounded-full" style={{ backgroundColor: category.color }} />
                    Semua Artikel {category.name}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {rest.map(article => <ArticleCard key={article.id} article={article} variant="default" />)}
                  </div>
                </section>
              )}

              <div className="flex justify-center">
                <AdSlot position="in_content_2" />
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-5">
                <AdSlot position="sidebar" />

                {/* Other categories */}
                <div className="bg-white rounded-xl border border-border p-5">
                  <h3 className="font-serif font-bold text-base text-foreground mb-3 border-b border-border pb-3">
                    Kategori Lainnya
                  </h3>
                  <nav>
                    {otherCategories.slice(0, 7).map(cat => (
                      <Link key={cat.id} href={`/kategori/${cat.slug}`}
                        className="flex items-center justify-between py-2.5 border-b border-border last:border-0 group">
                        <span className="flex items-center gap-2.5 text-sm font-medium text-foreground group-hover:text-[var(--navy)] transition-colors">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                          {cat.name}
                        </span>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          {(cat as unknown as { articleCount?: number }).articleCount || 0}
                        </span>
                      </Link>
                    ))}
                  </nav>
                </div>

                {/* Popular */}
                {popular.length > 0 && (
                  <div className="bg-white rounded-xl border border-border p-5">
                    <h3 className="font-serif font-bold text-base text-foreground mb-4 border-b border-border pb-3">
                      Populer Saat Ini
                    </h3>
                    <ol className="space-y-3">
                      {popular.map((a, idx) => (
                        <li key={a.id} className="flex items-start gap-3 group">
                          <span className="font-serif text-2xl font-bold text-border leading-none shrink-0 w-6 text-center mt-0.5">
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: a.category.color }}>
                              {a.category.name}
                            </span>
                            <Link href={`/${a.slug}`}
                              className="block text-sm font-semibold text-foreground group-hover:text-[var(--navy)] transition-colors leading-snug mt-0.5 line-clamp-2">
                              {a.title}
                            </Link>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </aside>
          </div>
        )}
      </main>

      <SiteFooter />
    </>
  )
}
