'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Search, Filter, Eye, Edit3, ExternalLink,
  TrendingUp, ChevronDown, BarChart2, Globe,
  Trash2, Clock, CheckCircle, AlertCircle, AlertTriangle,
} from 'lucide-react'
import { formatDate, formatDistanceToNow } from '@/lib/date-utils'
import { cn } from '@/lib/utils'

interface Article {
  id: string; title: string; slug: string
  category: { name: string; color: string; slug: string }
  viewCount: number; publishedAt: string | null; createdAt: string
  isFeatured: boolean; isTrending: boolean; isBreaking: boolean
  focusKeyword: string
}

interface Toast { msg: string; type: 'success' | 'error' }

export default function AdminPublishedPage() {
  const [articles,       setArticles]       = useState<Article[]>([])
  const [categories,     setCategories]     = useState<{ name: string; slug: string }[]>([])
  const [loading,        setLoading]        = useState(true)
  const [total,          setTotal]          = useState(0)
  const [search,         setSearch]         = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy,         setSortBy]         = useState<'newest' | 'popular'>('newest')
  const [deleting,       setDeleting]       = useState<string | null>(null)
  const [deletingAll,    setDeletingAll]    = useState(false)
  const [confirmAll,     setConfirmAll]     = useState(false)
  const [selected,       setSelected]       = useState<Set<string>>(new Set())
  const [toast,          setToast]          = useState<Toast | null>(null)

  const showToast = (msg: string, type: Toast['type'] = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const loadArticles = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        status: 'published', pageSize: '100',
        ...(categoryFilter !== 'all' && { category: categoryFilter }),
        ...(sortBy === 'popular' && { sort: 'views' }),
      })
      const res  = await fetch(`/api/articles?${params}`)
      const data = await res.json()
      let arts   = (data.articles ?? []) as Article[]

      // Client-side filter + sort
      if (search) {
        arts = arts.filter(a =>
          a.title.toLowerCase().includes(search.toLowerCase()) ||
          a.focusKeyword?.toLowerCase().includes(search.toLowerCase())
        )
      }
      if (sortBy === 'popular') arts.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      else arts.sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime())

      setArticles(arts)
      setTotal(data.total ?? arts.length)
    } catch {
      showToast('Gagal memuat artikel', 'error')
    } finally {
      setLoading(false)
    }
  }, [categoryFilter, sortBy, search])

  useEffect(() => { loadArticles() }, [loadArticles])

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => setCategories(d.categories ?? []))
  }, [])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus artikel "${title}"?\nTidak bisa dibatalkan.`)) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
      setArticles(prev => prev.filter(a => a.id !== id))
      setTotal(prev => prev - 1)
      showToast('Artikel berhasil dihapus')
    } catch (e: unknown) {
      showToast((e as Error).message || 'Gagal menghapus', 'error')
    } finally {
      setDeleting(null)
    }
  }

  const handleDeleteSelected = async () => {
    if (selected.size === 0) return
    if (!confirm(`Hapus ${selected.size} artikel yang dipilih?\nTidak bisa dibatalkan.`)) return
    setDeletingAll(true)
    let ok = 0
    for (const id of selected) {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' })
      if (res.ok) ok++
    }
    setSelected(new Set())
    showToast(`${ok} artikel berhasil dihapus`)
    loadArticles()
    setDeletingAll(false)
  }

  const handleDeleteAll = async () => {
    setDeletingAll(true)
    setConfirmAll(false)
    let ok = 0
    for (const a of articles) {
      const res = await fetch(`/api/articles/${a.id}`, { method: 'DELETE' })
      if (res.ok) ok++
    }
    showToast(`${ok} artikel berhasil dihapus`)
    loadArticles()
    setDeletingAll(false)
  }

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }

  const toggleSelectAll = () => {
    setSelected(prev => prev.size === articles.length ? new Set() : new Set(articles.map(a => a.id)))
  }

  const totalViews  = articles.reduce((s, a) => s + (a.viewCount || 0), 0)
  const featuredCnt = articles.filter(a => a.isFeatured).length
  const trendingCnt = articles.filter(a => a.isTrending).length

  return (
    <div className="p-6 space-y-5">
      {/* Toast */}
      {toast && (
        <div className={cn('fixed top-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2',
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        )}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Confirm hapus semua modal */}
      {confirmAll && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-slate-800">Hapus Semua Artikel Terbit?</h3>
            </div>
            <p className="text-sm text-slate-600">
              Ini akan menghapus <strong>{articles.length} artikel</strong> yang sedang ditampilkan. Tindakan ini <strong>tidak bisa dibatalkan</strong>.
            </p>
            <div className="flex gap-2">
              <button onClick={handleDeleteAll} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors">
                Ya, Hapus Semua
              </button>
              <button onClick={() => setConfirmAll(false)} className="flex-1 border border-slate-200 rounded-lg py-2.5 text-sm hover:bg-slate-50 transition-colors">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-serif font-bold text-slate-800">Artikel Terbit</h1>
          <p className="text-sm text-slate-500 mt-0.5">Semua artikel yang sudah live dan dapat diakses publik.</p>
        </div>
        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <button
              onClick={handleDeleteSelected}
              disabled={deletingAll}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Hapus {selected.size} Dipilih
            </button>
          )}
          <button
            onClick={() => setConfirmAll(true)}
            disabled={deletingAll || articles.length === 0}
            className="flex items-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-40"
          >
            {deletingAll ? <Clock className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Hapus Semua
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Terbit',    value: total,                             icon: Globe,    color: 'text-green-600 bg-green-50 border-green-100'   },
          { label: 'Total Pembaca',   value: totalViews.toLocaleString('id-ID'), icon: Eye,      color: 'text-blue-600 bg-blue-50 border-blue-100'     },
          { label: 'Artikel Featured',value: featuredCnt,                        icon: BarChart2,color: 'text-purple-600 bg-purple-50 border-purple-100'},
          { label: 'Sedang Trending', value: trendingCnt,                        icon: TrendingUp,color:'text-amber-600 bg-amber-50 border-amber-100'  },
        ].map(s => (
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
            type="text" placeholder="Cari artikel terbit..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="text-sm text-slate-700 flex-1 focus:outline-none bg-transparent"
          />
        </div>
        <div className="relative">
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm pr-8 focus:outline-none cursor-pointer">
            <option value="all">Semua Kategori</option>
            {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <div className="relative">
          <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm pr-8 focus:outline-none cursor-pointer">
            <option value="newest">Terbaru</option>
            <option value="popular">Paling Dibaca</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <div className="flex items-center gap-1 text-sm text-slate-500">
          <Filter className="w-4 h-4" />
          {articles.length} artikel
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input type="checkbox"
                    checked={selected.size === articles.length && articles.length > 0}
                    onChange={toggleSelectAll}
                    className="accent-[var(--navy)]"
                  />
                </th>
                {['Artikel', 'Pembaca', 'Tanggal Terbit', 'Label', 'Aksi'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400 text-sm">
                  <Clock className="w-5 h-5 animate-spin inline mr-2" />Memuat…
                </td></tr>
              ) : articles.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400 text-sm">Tidak ada artikel terbit.</td></tr>
              ) : articles.map(a => (
                <tr key={a.id} className={cn('hover:bg-slate-50/60 transition-colors', selected.has(a.id) && 'bg-blue-50/40')}>
                  <td className="px-4 py-4">
                    <input type="checkbox" checked={selected.has(a.id)} onChange={() => toggleSelect(a.id)} className="accent-[var(--navy)]" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-start gap-1.5 mb-1 flex-wrap">
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded text-white"
                        style={{ backgroundColor: a.category.color }}>{a.category.name}</span>
                      {a.isBreaking && <span className="text-[9px] font-bold uppercase bg-red-600 text-white px-1.5 py-0.5 rounded">Breaking</span>}
                      {a.isTrending && <span className="text-[9px] font-bold uppercase bg-amber-400 text-white px-1.5 py-0.5 rounded">Trending</span>}
                    </div>
                    <p className="font-semibold text-slate-700 line-clamp-2 max-w-sm leading-snug">{a.title}</p>
                    <p className="text-xs text-slate-400 mt-1 font-mono line-clamp-1">/{a.slug}</p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-700">{(a.viewCount || 0).toLocaleString('id-ID')}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-xs text-slate-500 whitespace-nowrap">
                    <div>{formatDate(a.publishedAt || a.createdAt)}</div>
                    <div className="text-slate-400 mt-0.5">{formatDistanceToNow(a.publishedAt || a.createdAt)}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {a.isFeatured && <span className="text-[10px] font-semibold bg-purple-50 text-purple-600 border border-purple-200 px-1.5 py-0.5 rounded">Featured</span>}
                      {a.isTrending && <span className="text-[10px] font-semibold bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded">Trending</span>}
                      {a.isBreaking && <span className="text-[10px] font-semibold bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded">Breaking</span>}
                      {!a.isFeatured && !a.isTrending && !a.isBreaking && <span className="text-[10px] text-slate-400">—</span>}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <Link href={`/${a.slug}`} target="_blank"
                        className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Lihat di website">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <Link href={`/admin/articles/${a.id}`}
                        className="p-1.5 text-slate-400 hover:text-[var(--navy)] hover:bg-slate-100 rounded-lg transition-colors" title="Edit">
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(a.id, a.title)}
                        disabled={deleting === a.id}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                        title="Hapus"
                      >
                        {deleting === a.id
                          ? <Clock className="w-4 h-4 animate-spin" />
                          : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500">
          Menampilkan {articles.length} dari {total} artikel terbit
          {selected.size > 0 && <span className="ml-2 text-blue-600 font-medium">· {selected.size} dipilih</span>}
        </div>
      </div>
    </div>
  )
}
