import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Rss } from 'lucide-react'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { BreakingTicker } from '@/components/layout/breaking-ticker'
import { ArticleCard } from '@/components/news/article-card'
import { AdSlot } from '@/components/ads/ad-slot'
import { CATEGORIES, getArticlesByCategory, getPublishedArticles } from '@/lib/mock-data'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const cat = CATEGORIES.find((c) => c.slug === slug)
  if (!cat) return { title: 'Kategori Tidak Ditemukan | KabarKini' }

  return {
    title: `${cat.name} — Berita Terkini | KabarKini`,
    description: `Kumpulan berita ${cat.name} terkini dan terpercaya. Analisis mendalam, fakta akurat, dan perkembangan terbaru seputar isu ${cat.name.toLowerCase()} di Indonesia.`,
    alternates: { canonical: `https://kabarkini.id/kategori/${cat.slug}` },
    openGraph: {
      title: `${cat.name} — Berita Terkini | KabarKini`,
      description: `Kumpulan berita ${cat.name} terkini dan terpercaya dari KabarKini.`,
      type: 'website',
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = CATEGORIES.find((c) => c.slug === slug)
  if (!category) notFound()

  const articles = getArticlesByCategory(slug)
  const [hero, ...rest] = articles
  const otherCategories = CATEGORIES.filter((c) => c.slug !== slug)
  const popular = getPublishedArticles(10)
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .filter((a) => a.category.slug !== slug)
    .slice(0, 5)

  // JSON-LD BreadcrumbList
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
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
          <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span className="font-semibold" style={{ color: category.color }}>{category.name}</span>
        </nav>

        {/* Category header */}
        <header className="mb-8 pb-6 border-b-2 border-border" style={{ borderBottomColor: category.color }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="w-3 h-8 rounded-full"
                  style={{ backgroundColor: category.color }}
                  aria-hidden="true"
                />
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                  {category.name}
                </h1>
              </div>
              <p className="text-muted-foreground text-sm ml-6">
                {articles.length} artikel tersedia &bull; Diperbarui setiap hari
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/rss"
                className="flex items-center gap-1.5 text-xs font-semibold border border-border px-3 py-1.5 rounded-full text-muted-foreground hover:border-[var(--navy)] hover:text-[var(--navy)] transition-colors"
                aria-label="Berlangganan RSS feed"
              >
                <Rss className="w-3.5 h-3.5" aria-hidden="true" />
                RSS Feed
              </Link>
            </div>
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
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">

              {/* Hero article */}
              {hero && (
                <article className="group">
                  <Link href={`/${hero.slug}`} className="block overflow-hidden rounded-xl shadow-sm">
                    <div className="relative">
                      <img
                        src={`https://placehold.co/900x500?text=${encodeURIComponent(category.name + ' - ' + hero.title.slice(0, 35) + ' - KabarKini')}`}
                        alt={hero.coverImageAlt}
                        className="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="eager"
                        width={900}
                        height={500}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span
                          className="text-white text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wide"
                          style={{ backgroundColor: category.color }}
                        >
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
                          <span aria-hidden="true">&bull;</span>
                          <span>{hero.readingTime} mnt baca</span>
                          {hero.viewCount && (
                            <>
                              <span aria-hidden="true">&bull;</span>
                              <span>{hero.viewCount.toLocaleString('id-ID')} pembaca</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              )}

              {/* Ad slot */}
              <div className="flex justify-center">
                <AdSlot position="in_content_1" />
              </div>

              {/* Article grid */}
              {rest.length > 0 && (
                <section aria-labelledby="more-articles-heading">
                  <h2 id="more-articles-heading" className="font-serif text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                    <div className="w-1 h-6 rounded-full" style={{ backgroundColor: category.color }} aria-hidden="true" />
                    Semua Artikel {category.name}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {rest.map((article) => (
                      <ArticleCard key={article.id} article={article} variant="default" />
                    ))}
                  </div>
                </section>
              )}

              {/* Second ad */}
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
                  <nav aria-label="Kategori berita lainnya">
                    {otherCategories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/kategori/${cat.slug}`}
                        className="flex items-center justify-between py-2.5 border-b border-border last:border-0 group"
                      >
                        <span className="flex items-center gap-2.5 text-sm font-medium text-foreground group-hover:text-[var(--navy)] transition-colors">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} aria-hidden="true" />
                          {cat.name}
                        </span>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          {cat.articleCount}
                        </span>
                      </Link>
                    ))}
                  </nav>
                </div>

                {/* Popular from other categories */}
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
                            <Link
                              href={`/${a.slug}`}
                              className="block text-sm font-semibold text-foreground group-hover:text-[var(--navy)] transition-colors leading-snug mt-0.5 line-clamp-2"
                            >
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
