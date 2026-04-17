'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Edit3, Trash2, Eye, Plus, Search,
  Clock, FileText, Send, CheckCircle, AlertCircle,
} from 'lucide-react'
import { formatDistanceToNow } from '@/lib/date-utils'
import { cn } from '@/lib/utils'

interface Article {
  id: string; title: string; slug: string; excerpt: string
  category: { name: string; color: string }
  authorType: string; wordCount: number; sourceCount: number
  publishReadinessScore: number; createdAt: string
}

interface Toast { msg: string; type: 'success' | 'error' }

const SCORE_COLOR = (s: number) =>
  s >= 85 ? 'text-green-600' : s >= 70 ? 'text-yellow-600' : 'text-red-600'

export default function AdminDraftsPage() {
  const [allDrafts, setAllDrafts] = useState<Article[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [toast, setToast]         = useState<Toast | null>(null)
  const [acting, setActing]       = useState<string | null>(null)

  const showToast = (msg: string, type: Toast['type'] = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    fetch('/api/articles?status=draft&pageSize=100')
      .then(r => r.json())
      .then(d => setAllDrafts(d.articles ?? []))
      .catch(() => showToast('Gagal memuat draft', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const drafts = allDrafts.filter(
    a =>
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus draft "${title}"?`)) return
    setActing(id)
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
      setAllDrafts(prev => prev.filter(a => a.id !== id))
      showToast('Draft berhasil dihapus')
    } catch (e: unknown) {
      showToast((e as Error).message || 'Gagal menghapus', 'error')
    } finally {
      setActing(null)
    }
  }

  const handleSubmitReview = async (id: string) => {
    setActing(id)
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'review' }),
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
      setAllDrafts(prev => prev.filter(a => a.id !== id))
      showToast('Artikel berhasil diajukan ke review')
    } catch (e: unknown) {
      showToast((e as Error).message || 'Gagal mengajukan review', 'error')
    } finally {
      setActing(null)
    }
  }

  return (
    <div className="p-6 space-y-5">
      {/* Toast */}
      {toast && (
        <div className={cn(
          'fixed top-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2',
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        )}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-serif font-bold text-slate-800">Draft Artikel</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Artikel yang masih dalam proses penulisan atau belum diajukan review.
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 text-sm bg-[var(--navy)] text-white px-4 py-2 rounded-lg hover:bg-[var(--navy-light)] transition-colors font-semibold"
        >
          <Plus className="w-4 h-4" /> Artikel Baru
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Draft',      value: allDrafts.length,                                              icon: FileText, color: 'text-slate-600 bg-slate-100' },
          { label: 'Siap Diajukan',    value: allDrafts.filter(a => a.publishReadinessScore >= 70).length,   icon: Send,     color: 'text-blue-600 bg-blue-50'    },
          { label: 'Perlu Perbaikan',  value: allDrafts.filter(a => a.publishReadinessScore < 70).length,    icon: Clock,    color: 'text-amber-600 bg-amber-50'  },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
            <div className={cn('p-2 rounded-lg', stat.color)}>
              <stat.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 max-w-md">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Cari draft..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-sm text-slate-700 flex-1 focus:outline-none bg-transparent"
        />
      </div>

      {/* Draft list */}
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2 animate-spin" />
          <p className="text-sm text-slate-400">Memuat draft…</p>
        </div>
      ) : drafts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <FileText className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <p className="font-semibold text-slate-600">Tidak ada draft</p>
          <p className="text-sm text-slate-400 mt-1">
            {search ? 'Tidak ada draft yang cocok dengan pencarian.' : 'Semua artikel sudah diajukan atau diterbitkan.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {drafts.map((article) => (
            <div
              key={article.id}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded text-white"
                      style={{ backgroundColor: article.category.color }}
                    >
                      {article.category.name}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase">
                      Draft
                    </span>
                    {article.authorType === 'ai' && (
                      <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded uppercase">
                        AI Generated
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif font-bold text-slate-800 text-base leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center flex-wrap gap-4 mt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Dibuat {formatDistanceToNow(article.createdAt)}
                    </span>
                    <span>{article.wordCount > 0 ? `${article.wordCount} kata` : 'Belum ada isi'}</span>
                    <span>{article.sourceCount} sumber</span>
                  </div>
                </div>

                {/* Score */}
                <div className="shrink-0 text-center hidden sm:block">
                  <div className={cn('text-2xl font-bold', SCORE_COLOR(article.publishReadinessScore))}>
                    {article.publishReadinessScore}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wide">Skor Siap</div>
                  <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1 mx-auto">
                    <div
                      className={cn('h-full rounded-full',
                        article.publishReadinessScore >= 85 ? 'bg-green-500'
                        : article.publishReadinessScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      )}
                      style={{ width: `${article.publishReadinessScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                <Link
                  href={`/admin/articles/${article.id}`}
                  className="flex items-center gap-1.5 text-sm text-white bg-[var(--navy)] px-3 py-1.5 rounded-lg hover:bg-[var(--navy-light)] transition-colors font-medium"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </Link>

                {article.publishReadinessScore >= 70 && (
                  <button
                    onClick={() => handleSubmitReview(article.id)}
                    disabled={acting === article.id}
                    className="flex items-center gap-1.5 text-sm text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors font-medium disabled:opacity-50"
                  >
                    {acting === article.id
                      ? <Clock className="w-3.5 h-3.5 animate-spin" />
                      : <Send className="w-3.5 h-3.5" />}
                    Ajukan Review
                  </button>
                )}

                <Link
                  href={`/admin/articles/${article.id}`}
                  className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors font-medium"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview
                </Link>

                <button
                  onClick={() => handleDelete(article.id, article.title)}
                  disabled={acting === article.id}
                  className="ml-auto flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors font-medium disabled:opacity-50"
                >
                  {acting === article.id
                    ? <Clock className="w-3.5 h-3.5 animate-spin" />
                    : <Trash2 className="w-3.5 h-3.5" />}
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
