'use client'

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, X, SlidersHorizontal, Clock } from 'lucide-react'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { ArticleCard } from '@/components/news/article-card'
import { ARTICLES, CATEGORIES } from '@/lib/mock-data'

function SearchResults() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortBy, setSortBy] = useState<'relevance' | 'latest'>('relevance')

  const published = ARTICLES.filter((a) => a.status === 'published')

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    let filtered = published.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.name.toLowerCase().includes(q) ||
        a.tags.some((t) => t.name.toLowerCase().includes(q)) ||
        a.focusKeyword.toLowerCase().includes(q)
    )
    if (activeCategory !== 'all') {
      filtered = filtered.filter((a) => a.category.slug === activeCategory)
    }
    if (sortBy === 'latest') {
      filtered = [...filtered].sort(
        (a, b) =>
          new Date(b.publishedAt || b.createdAt).getTime() -
          new Date(a.publishedAt || a.createdAt).getTime()
      )
    }
    return filtered
  }, [query, activeCategory, sortBy, published])

  const recentSearches = ['Pilkada', 'Ekonomi Indonesia', 'Korupsi KPK', 'Rupiah dolar']

  return (
    <>
      <SiteHeader />
      <main className="max-w-5xl mx-auto px-4 py-8" id="main-content">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-6">Pencarian Artikel</h1>

        {/* Search bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari berita, topik, atau kata kunci..."
            className="w-full pl-12 pr-12 py-3.5 text-base border-2 border-border rounded-xl focus:outline-none focus:border-[var(--navy)] bg-white text-foreground placeholder:text-muted-foreground transition-colors"
            autoFocus
            aria-label="Kolom pencarian"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Hapus pencarian"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {!query.trim() ? (
          /* Empty state — show suggestions */
          <div className="space-y-8">
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Pencarian Populer
              </h2>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="px-4 py-2 bg-white border border-border rounded-full text-sm text-slate-700 hover:border-[var(--navy)] hover:text-[var(--navy)] transition-colors font-medium"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Jelajahi Kategori
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setActiveCategory(cat.slug); setQuery(cat.name) }}
                    className="flex items-center gap-3 bg-white border border-border rounded-xl p-3 hover:border-[var(--navy)] transition-colors text-left group"
                  >
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-[var(--navy)] transition-colors">
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Search results */
          <div>
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-6 pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Filter:</span>
              </div>

              {/* Category filter */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    activeCategory === 'all'
                      ? 'bg-[var(--navy)] text-white'
                      : 'bg-white border border-border text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Semua
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.slug)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                      activeCategory === cat.slug
                        ? 'text-white'
                        : 'bg-white border border-border text-slate-600 hover:bg-slate-50'
                    }`}
                    style={activeCategory === cat.slug ? { backgroundColor: cat.color } : {}}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="ml-auto flex items-center gap-1.5">
                {(['relevance', 'latest'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSortBy(s)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                      sortBy === s
                        ? 'bg-slate-800 text-white'
                        : 'bg-white border border-border text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {s === 'relevance' ? 'Relevansi' : 'Terbaru'}
                  </button>
                ))}
              </div>
            </div>

            {/* Result count */}
            <p className="text-sm text-muted-foreground mb-4">
              {results.length > 0 ? (
                <>
                  Ditemukan <strong className="text-foreground">{results.length}</strong> artikel untuk{' '}
                  <strong className="text-foreground">&ldquo;{query}&rdquo;</strong>
                </>
              ) : (
                <>
                  Tidak ada hasil untuk <strong>&ldquo;{query}&rdquo;</strong>
                </>
              )}
            </p>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {results.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="default" />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border border-border">
                <Search className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                <p className="font-serif font-bold text-lg text-foreground mb-2">
                  Tidak ada artikel ditemukan
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Coba kata kunci yang berbeda atau jelajahi kategori di bawah ini.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { setQuery(cat.name); setActiveCategory(cat.slug) }}
                      className="px-3 py-1.5 text-xs font-semibold rounded-full text-white transition-opacity hover:opacity-80"
                      style={{ backgroundColor: cat.color }}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  )
}

export default function PencarianPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--navy)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SearchResults />
    </Suspense>
  )
}
