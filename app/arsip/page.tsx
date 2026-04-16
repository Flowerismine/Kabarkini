'use client'

import { useState, useMemo } from 'react'
import { Archive, Filter, ChevronDown } from 'lucide-react'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { BreakingTicker } from '@/components/layout/breaking-ticker'
import { ArticleCard } from '@/components/news/article-card'
import { ARTICLES, CATEGORIES } from '@/lib/mock-data'
import { formatDate } from '@/lib/date-utils'

export default function ArsipPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeMonth, setActiveMonth] = useState('all')
  const [displayCount, setDisplayCount] = useState(12)

  const published = ARTICLES.filter((a) => a.status === 'published')

  // Get unique months from articles
  const months = useMemo(() => {
    const set = new Set<string>()
    published.forEach((a) => {
      const d = new Date(a.publishedAt || a.createdAt)
      set.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
    })
    return Array.from(set).sort((a, b) => b.localeCompare(a))
  }, [published])

  const monthLabel = (ym: string) => {
    const [y, m] = ym.split('-')
    return new Date(Number(y), Number(m) - 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
  }

  const filtered = useMemo(() => {
    return published.filter((a) => {
      if (activeCategory !== 'all' && a.category.slug !== activeCategory) return false
      if (activeMonth !== 'all') {
        const d = new Date(a.publishedAt || a.createdAt)
        const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        if (ym !== activeMonth) return false
      }
      return true
    }).sort(
      (a, b) =>
        new Date(b.publishedAt || b.createdAt).getTime() -
        new Date(a.publishedAt || a.createdAt).getTime()
    )
  }, [published, activeCategory, activeMonth])

  const visible = filtered.slice(0, displayCount)

  return (
    <>
      <SiteHeader />
      <BreakingTicker />
      <main className="max-w-7xl mx-auto px-4 py-8" id="main-content">
        <div className="flex items-center gap-3 mb-6">
          <Archive className="w-7 h-7 text-[var(--navy)]" />
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Arsip Artikel</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {published.length} artikel tersimpan — jelajahi semua berita yang pernah kami terbitkan
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-border rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filter:</span>
          </div>

          {/* Category */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                activeCategory === 'all'
                  ? 'bg-[var(--navy)] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  activeCategory === cat.slug ? 'text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                style={activeCategory === cat.slug ? { backgroundColor: cat.color } : {}}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Month */}
          <div className="ml-auto">
            <select
              value={activeMonth}
              onChange={(e) => { setActiveMonth(e.target.value); setDisplayCount(12) }}
              className="text-sm border border-border rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--navy)]"
            >
              <option value="all">Semua Bulan</option>
              {months.map((ym) => (
                <option key={ym} value={ym}>{monthLabel(ym)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Result count */}
        <p className="text-sm text-muted-foreground mb-4">
          Menampilkan <strong className="text-foreground">{Math.min(displayCount, filtered.length)}</strong> dari{' '}
          <strong className="text-foreground">{filtered.length}</strong> artikel
        </p>

        {/* Articles grid */}
        {filtered.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {visible.map((article) => (
                <ArticleCard key={article.id} article={article} variant="default" />
              ))}
            </div>

            {displayCount < filtered.length && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setDisplayCount((c) => c + 12)}
                  className="inline-flex items-center gap-2 bg-white border border-border text-slate-700 font-semibold px-6 py-3 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                >
                  <ChevronDown className="w-4 h-4" />
                  Muat {Math.min(12, filtered.length - displayCount)} artikel lagi
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-border">
            <Archive className="w-10 h-10 text-slate-300 mx-auto mb-4" />
            <p className="font-serif font-bold text-lg text-foreground mb-2">Tidak ada artikel</p>
            <p className="text-sm text-muted-foreground">
              Coba ubah filter kategori atau bulan untuk menemukan artikel.
            </p>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
