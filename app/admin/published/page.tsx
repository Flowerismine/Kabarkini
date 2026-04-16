'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Filter,
  Eye,
  Edit3,
  EyeOff,
  ExternalLink,
  TrendingUp,
  ChevronDown,
  BarChart2,
  Globe,
} from 'lucide-react'
import { ARTICLES, CATEGORIES } from '@/lib/mock-data'
import { formatDate, formatDistanceToNow } from '@/lib/date-utils'
import { cn } from '@/lib/utils'

export default function AdminPublishedPage() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'trending'>('newest')

  const published = ARTICLES.filter((a) => a.status === 'published')

  const filtered = published
    .filter((a) => {
      const matchSearch =
        !search ||
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.focusKeyword.toLowerCase().includes(search.toLowerCase())
      const matchCat = categoryFilter === 'all' || a.category.slug === categoryFilter
      return matchSearch && matchCat
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return (b.viewCount || 0) - (a.viewCount || 0)
      if (sortBy === 'trending') return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0)
      return new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime()
    })

  const totalViews = published.reduce((acc, a) => acc + (a.viewCount || 0), 0)
  const featuredCount = published.filter((a) => a.isFeatured).length
  const trendingCount = published.filter((a) => a.isTrending).length

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-serif font-bold text-slate-800">Artikel Terbit</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Semua artikel yang sudah live dan dapat diakses publik.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Terbit', value: published.length, icon: Globe, color: 'text-green-600 bg-green-50 border-green-100' },
          { label: 'Total Pembaca', value: totalViews.toLocaleString('id-ID'), icon: Eye, color: 'text-blue-600 bg-blue-50 border-blue-100' },
          { label: 'Artikel Featured', value: featuredCount, icon: BarChart2, color: 'text-purple-600 bg-purple-50 border-purple-100' },
          { label: 'Sedang Trending', value: trendingCount, icon: TrendingUp, color: 'text-amber-600 bg-amber-50 border-amber-100' },
        ].map((s) => (
          <div key={s.label} className={cn('border rounded-xl p-4 flex items-center gap-3', s.color)}>
            <s.icon className="w-5 h-5 shrink-0" />
            <div>
              <p className="text-lg font-bold">{s.value}</p>
              <p className="text-xs font-medium mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Cari artikel terbit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-sm text-slate-700 flex-1 focus:outline-none bg-transparent"
          />
        </div>

        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 pr-8 focus:outline-none cursor-pointer"
          >
            <option value="all">Semua Kategori</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.slug} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 pr-8 focus:outline-none cursor-pointer"
          >
            <option value="newest">Terbaru</option>
            <option value="popular">Paling Dibaca</option>
            <option value="trending">Trending</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="flex items-center gap-1 text-sm text-slate-500">
          <Filter className="w-4 h-4" />
          {filtered.length} artikel
        </div>
      </div>

      {/* Articles table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Artikel</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Pembaca</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Tanggal Terbit</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Label</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-400 text-sm">
                    Tidak ada artikel yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filtered.map((article) => (
                  <tr key={article.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-2 mb-0.5">
                        <span
                          className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded text-white shrink-0"
                          style={{ backgroundColor: article.category.color }}
                        >
                          {article.category.name}
                        </span>
                        {article.isBreaking && (
                          <span className="text-[9px] font-bold uppercase bg-red-600 text-white px-1.5 py-0.5 rounded shrink-0">
                            Breaking
                          </span>
                        )}
                        {article.isTrending && (
                          <span className="text-[9px] font-bold uppercase bg-amber-400 text-white px-1.5 py-0.5 rounded shrink-0">
                            Trending
                          </span>
                        )}
                      </div>
                      <p className="font-semibold text-slate-700 line-clamp-2 max-w-sm leading-snug mt-1">
                        {article.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-1 font-mono line-clamp-1">
                        /{article.slug}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-700">
                          {(article.viewCount || 0).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500 whitespace-nowrap">
                      <div>{formatDate(article.publishedAt || article.createdAt)}</div>
                      <div className="text-slate-400 mt-0.5">{formatDistanceToNow(article.publishedAt || article.createdAt)}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {article.isFeatured && (
                          <span className="text-[10px] font-semibold bg-purple-50 text-purple-600 border border-purple-200 px-1.5 py-0.5 rounded">
                            Featured
                          </span>
                        )}
                        {article.isTrending && (
                          <span className="text-[10px] font-semibold bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded">
                            Trending
                          </span>
                        )}
                        {article.isBreaking && (
                          <span className="text-[10px] font-semibold bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded">
                            Breaking
                          </span>
                        )}
                        {!article.isFeatured && !article.isTrending && !article.isBreaking && (
                          <span className="text-[10px] text-slate-400">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/${article.slug}`}
                          target="_blank"
                          className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Lihat di website"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/articles/${article.id}`}
                          className="p-1.5 text-slate-400 hover:text-[var(--navy)] hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Unpublish"
                        >
                          <EyeOff className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Menampilkan {filtered.length} dari {published.length} artikel terbit</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-slate-200 rounded bg-white hover:bg-slate-50 disabled:opacity-40">
              Sebelumnya
            </button>
            <span className="px-3 py-1.5 bg-[var(--navy)] text-white rounded">1</span>
            <button className="px-3 py-1.5 border border-slate-200 rounded bg-white hover:bg-slate-50">
              Berikutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
