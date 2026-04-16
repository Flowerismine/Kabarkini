import type { Metadata } from 'next'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { BreakingTicker } from '@/components/layout/breaking-ticker'
import { HeroSection } from '@/components/news/hero-section'
import { TrendingSection } from '@/components/news/trending-section'
import { CategorySection } from '@/components/news/category-section'
import { ArticleCard } from '@/components/news/article-card'
import { AdSlot } from '@/components/ads/ad-slot'
import {
  ARTICLES,
  CATEGORIES,
  TRENDING_TOPICS,
  getFeaturedArticles,
  getTrendingArticles,
  getArticlesByCategory,
} from '@/lib/mock-data'
import Link from 'next/link'
import { NewsletterForm } from '@/components/news/newsletter-form'
import { ArrowRight, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'KabarKini — Fakta Cepat. Analisis Tepat.',
  description:
    'Portal berita digital Indonesia terpercaya. Berita terkini, analisis mendalam, dan isu-isu panas nasional setiap hari.',
  openGraph: {
    title: 'KabarKini — Fakta Cepat. Analisis Tepat.',
    description:
      'Portal berita digital Indonesia terpercaya. Berita terkini, analisis mendalam, dan isu-isu panas nasional setiap hari.',
    type: 'website',
  },
}

export default function HomePage() {
  const featuredArticles = getFeaturedArticles()
  const trendingArticles = getTrendingArticles()
  const publishedArticles = ARTICLES.filter((a) => a.status === 'published')
  const latestArticles = [...publishedArticles].sort(
    (a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime()
  )

  const politikArticles = getArticlesByCategory('politik')
  const hukumArticles = getArticlesByCategory('hukum')
  const ekonomiArticles = getArticlesByCategory('ekonomi')
  const teknologiArticles = getArticlesByCategory('teknologi')

  // Editor picks
  const editorPicks = publishedArticles.filter((a) => a.isFeatured).slice(0, 3)

  return (
    <>
      <SiteHeader />
      <BreakingTicker />

      {/* Leaderboard Ad */}
      <div className="bg-white border-b border-border py-3 flex justify-center">
        <AdSlot position="header" />
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8" id="main-content">
        {/* Hero */}
        <HeroSection articles={latestArticles.slice(0, 4)} />

        {/* Category nav strip */}
        <nav
          aria-label="Kategori berita"
          className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide"
        >
          <Link
            href="/"
            className="shrink-0 bg-[var(--navy)] text-white text-xs font-bold px-4 py-2 rounded-full"
          >
            Semua
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/kategori/${cat.slug}`}
              className="shrink-0 text-xs font-semibold px-4 py-2 rounded-full border border-border hover:border-[var(--navy)] hover:text-[var(--navy)] transition-colors whitespace-nowrap"
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        {/* Latest news grid */}
        <section aria-labelledby="terbaru-heading" className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-[var(--navy)] rounded-full" />
              <h2 id="terbaru-heading" className="font-serif text-xl font-bold text-foreground">
                Berita Terbaru
              </h2>
            </div>
            <Link
              href="/arsip"
              className="text-sm text-[var(--navy)] font-semibold hover:text-[var(--red)] transition-colors flex items-center gap-1"
            >
              Lihat arsip <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {latestArticles.slice(0, 6).map((article) => (
              <ArticleCard key={article.id} article={article} variant="default" />
            ))}
          </div>
        </section>

        {/* In-content Ad 1 */}
        <div className="flex justify-center my-8">
          <AdSlot position="in_content_1" />
        </div>

        {/* Trending */}
        <TrendingSection topics={TRENDING_TOPICS} articles={trendingArticles} />

        {/* Two column: categories + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Main content column */}
          <div className="lg:col-span-2 space-y-10">
            {/* Politik */}
            {politikArticles.length > 0 && (
              <CategorySection
                category={CATEGORIES[0]}
                articles={politikArticles}
                layout="grid"
              />
            )}

            {/* In-content Ad 2 */}
            <div className="flex justify-center">
              <AdSlot position="in_content_2" />
            </div>

            {/* Hukum */}
            {hukumArticles.length > 0 && (
              <CategorySection
                category={CATEGORIES[1]}
                articles={hukumArticles}
                layout="grid"
              />
            )}

            {/* Ekonomi */}
            {ekonomiArticles.length > 0 && (
              <CategorySection
                category={CATEGORIES[2]}
                articles={ekonomiArticles}
                layout="grid"
              />
            )}

            {/* Teknologi */}
            {teknologiArticles.length > 0 && (
              <CategorySection
                category={CATEGORIES[3]}
                articles={teknologiArticles}
                layout="grid"
              />
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Sidebar Ad */}
            <div className="sticky top-24">
              <AdSlot position="sidebar" className="mb-6" />

              {/* Editor picks */}
              <div className="bg-white rounded-xl border border-border p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <h3 className="font-serif font-bold text-base text-foreground">
                    Pilihan Editor
                  </h3>
                </div>
                <div className="space-y-4">
                  {editorPicks.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      variant="minimal"
                      showImage={false}
                    />
                  ))}
                </div>
              </div>

              {/* Popular articles */}
              <div className="bg-white rounded-xl border border-border p-5 mt-5">
                <h3 className="font-serif font-bold text-base text-foreground mb-4 border-b border-border pb-3">
                  Paling Banyak Dibaca
                </h3>
                <ol className="space-y-3">
                  {[...publishedArticles]
                    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
                    .slice(0, 5)
                    .map((article, idx) => (
                      <li key={article.id} className="flex items-start gap-3 group">
                        <span className="font-serif text-2xl font-bold text-border leading-none shrink-0 w-6 text-center">
                          {idx + 1}
                        </span>
                        <div>
                          <Link
                            href={`/${article.slug}`}
                            className="text-sm font-semibold text-foreground group-hover:text-[var(--navy)] transition-colors line-clamp-2 leading-snug"
                          >
                            {article.title}
                          </Link>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {article.viewCount?.toLocaleString('id-ID')} pembaca
                          </p>
                        </div>
                      </li>
                    ))}
                </ol>
              </div>

              {/* Tags cloud */}
              <div className="bg-white rounded-xl border border-border p-5 mt-5">
                <h3 className="font-serif font-bold text-base text-foreground mb-4 border-b border-border pb-3">
                  Topik Populer
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['DPR', 'KPK', 'Korupsi', 'Pemilu', 'BI Rate', 'AI', 'Hukum', 'APBN', 'Gempa', 'Timnas'].map(
                    (tag) => (
                      <Link
                        key={tag}
                        href={`/pencarian?q=${encodeURIComponent(tag)}`}
                        className="text-xs bg-muted hover:bg-[var(--navy)] hover:text-white px-3 py-1.5 rounded-full transition-colors font-medium"
                      >
                        {tag}
                      </Link>
                    )
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Newsletter */}
        <section
          aria-label="Langganan newsletter"
          className="bg-[var(--navy)] rounded-2xl p-8 md:p-12 text-white mb-10"
        >
          <div className="max-w-xl mx-auto text-center">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-white text-balance">
              Jangan Ketinggalan Berita Penting
            </h2>
            <p className="text-slate-300 mt-3 text-sm leading-relaxed">
              Langganan newsletter KabarKini dan dapatkan ringkasan berita terpenting langsung di
              inbox Anda setiap pagi sebelum memulai hari.
            </p>
            <NewsletterForm />
            <p className="text-slate-500 text-xs mt-3">
              Tanpa spam. Bisa berhenti berlangganan kapan saja.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
