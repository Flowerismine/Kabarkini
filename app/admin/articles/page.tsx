'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit3,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  ExternalLink,
  MoreHorizontal,
  ChevronDown,
} from 'lucide-react'
import { ARTICLES, CATEGORIES } from '@/lib/mock-data'
import { formatDistanceToNow } from '@/lib/date-utils'
import { cn } from '@/lib/utils'
import type { ArticleStatus } from '@/types'

const STATUS_CONFIG: Record<ArticleStatus, { label: string; color: string; icon: React.ElementType }> = {
  published: { label: 'Terbit', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
  review: { label: 'Review', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Eye },
  draft: { label: 'Draft', color: 'bg-slate-100 text-slate-600 border-slate-200', icon: Edit3 },
  scheduled: { label: 'Terjadwal', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Calendar },
  rejected: { label: 'Ditolak', color: 'bg-red-100 text-red-700 border-red-200', icon: AlertCircle },
}

const SCORE_COLOR = (score: number) =>
  score >= 85 ? 'text-green-600' : score >= 70 ? 'text-yellow-600' : 'text-red-600'

export default function AdminArticlesPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const filtered = ARTICLES.filter((a) => {
    const matchSearch =
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.focusKeyword.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || a.status === statusFilter
    const matchCat = categoryFilter === 'all' || a.category.slug === categoryFilter
    return matchSearch && matchStatus && matchCat
  })

  const statusCounts = ARTICLES.reduce(
    (acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-serif font-bold text-slate-800">Semua Artikel</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {ARTICLES.length} artikel total di database
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 text-sm bg-[var(--navy)] text-white px-4 py-2 rounded-lg hover:bg-[var(--navy-light)] transition-colors font-semibold"
        >
          <Plus className="w-4 h-4" />
          Artikel Baru
        </Link>
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'all', label: 'Semua', count: ARTICLES.length },
          ...Object.entries(statusCounts).map(([key, count]) => ({
            key,
            label: STATUS_CONFIG[key as ArticleStatus]?.label || key,
            count,
          })),
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={cn(
              'shrink-0 flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition-colors font-medium',
              statusFilter === tab.key
                ? 'bg-[var(--navy)] text-white border-[var(--navy)]'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            )}
          >
            {tab.label}
            <span
              className={cn(
                'text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none',
                statusFilter === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              )}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Cari judul, keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-sm text-slate-700 flex-1 focus:outline-none bg-transparent"
          />
        </div>
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 pr-8 focus:outline-none focus:ring-2 focus:ring-[var(--navy)] cursor-pointer"
          >
            <option value="all">Semua Kategori</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <div className="flex items-center gap-1 text-sm text-slate-500">
          <Filter className="w-4 h-4" />
          {filtered.length} hasil
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Artikel
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Skor Siap Terbit
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Skor Detail
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Waktu
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500 text-sm">
                    Tidak ada artikel yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filtered.map((article) => {
                  const StatusIcon = STATUS_CONFIG[article.status]?.icon || Clock
                  return (
                    <tr key={article.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4">
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            {article.isBreaking && (
                              <span className="text-[9px] font-bold uppercase bg-red-600 text-white px-1.5 py-0.5 rounded">
                                Breaking
                              </span>
                            )}
                            <span
                              className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded text-white"
                              style={{ backgroundColor: article.category.color }}
                            >
                              {article.category.name}
                            </span>
                          </div>
                          <p className="font-semibold text-slate-700 line-clamp-2 max-w-sm leading-snug">
                            {article.title}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                            <span>{article.wordCount} kata</span>
                            <span>{article.sourceCount} sumber</span>
                            <span className="font-mono">{article.slug.slice(0, 30)}...</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded border',
                            STATUS_CONFIG[article.status]?.color
                          )}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {STATUS_CONFIG[article.status]?.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              'text-xl font-bold',
                              SCORE_COLOR(article.publishReadinessScore)
                            )}
                          >
                            {article.publishReadinessScore}
                          </span>
                          <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                'h-full rounded-full',
                                article.publishReadinessScore >= 85
                                  ? 'bg-green-500'
                                  : article.publishReadinessScore >= 70
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              )}
                              style={{ width: `${article.publishReadinessScore}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="grid grid-cols-2 gap-1 text-xs">
                          <span className="text-slate-500">Ori: <span className={SCORE_COLOR(article.originalityScore)}>{article.originalityScore}</span></span>
                          <span className="text-slate-500">Baca: <span className={SCORE_COLOR(article.readabilityScore)}>{article.readabilityScore}</span></span>
                          <span className="text-slate-500">SEO: <span className={SCORE_COLOR(article.seoScore)}>{article.seoScore}</span></span>
                          <span className="text-slate-500">Dup: <span className={article.duplicationRiskScore <= 20 ? 'text-green-600' : 'text-red-600'}>{article.duplicationRiskScore}</span></span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-xs text-slate-500 whitespace-nowrap">
                        {formatDistanceToNow(article.publishedAt || article.createdAt)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/articles/${article.id}`}
                            className="p-1.5 text-slate-400 hover:text-[var(--navy)] hover:bg-slate-100 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>
                          {article.status === 'published' && (
                            <Link
                              href={`/${article.slug}`}
                              target="_blank"
                              className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Lihat"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          )}
                          {article.status === 'review' && (
                            <Link
                              href={`/admin/review/${article.id}`}
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                              title="Review"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          )}
                          <button
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Menampilkan {filtered.length} dari {ARTICLES.length} artikel</span>
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
