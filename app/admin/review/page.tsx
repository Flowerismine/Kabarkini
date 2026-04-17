'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  CheckCircle, XCircle, Clock, Eye,
  ChevronDown, ChevronUp, AlertTriangle,
  ShieldCheck, FileText, Calendar, Trash2, AlertCircle,
} from 'lucide-react'
import { formatDistanceToNow } from '@/lib/date-utils'
import { cn } from '@/lib/utils'

interface ArticleSource {
  id: string; name: string; url: string; type: string; trustScore: number
}
interface Article {
  id: string; title: string; excerpt: string; status: string
  category: { name: string; color: string }
  wordCount: number; sourceCount: number
  publishReadinessScore: number; originalityScore: number
  readabilityScore: number; seoScore: number
  factualConsistencyScore: number; duplicationRiskScore: number
  bulletPoints: string[]; sources: ArticleSource[]; createdAt: string
}

interface Toast { msg: string; type: 'success' | 'error' }

const SCORE_BAR = (value: number) => (
  <div className="flex items-center gap-2">
    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div
        className={cn('h-full rounded-full',
          value >= 85 ? 'bg-green-500' : value >= 70 ? 'bg-yellow-500' : 'bg-red-500'
        )}
        style={{ width: `${value}%` }}
      />
    </div>
    <span className={cn('text-xs font-bold w-8 text-right',
      value >= 85 ? 'text-green-600' : value >= 70 ? 'text-yellow-600' : 'text-red-600'
    )}>
      {value}
    </span>
  </div>
)

export default function AdminReviewPage() {
  const [articles, setArticles]       = useState<Article[]>([])
  const [loading, setLoading]         = useState(true)
  const [expanded, setExpanded]       = useState<string | null>(null)
  const [editorNote, setEditorNote]   = useState<Record<string, string>>({})
  const [acting, setActing]           = useState<string | null>(null)
  const [toast, setToast]             = useState<Toast | null>(null)
  // Schedule modal state
  const [scheduleId, setScheduleId]   = useState<string | null>(null)
  const [scheduleAt, setScheduleAt]   = useState('')

  const showToast = (msg: string, type: Toast['type'] = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  useEffect(() => {
    fetch('/api/articles?status=review&pageSize=100')
      .then(r => r.json())
      .then(d => setArticles(d.articles ?? []))
      .catch(() => showToast('Gagal memuat antrian review', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const removeFromList = (id: string) =>
    setArticles(prev => prev.filter(a => a.id !== id))

  const handleAction = async (
    id: string,
    body: Record<string, string>,
    successMsg: string
  ) => {
    setActing(id)
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, editorNote: editorNote[id] || '' }),
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
      removeFromList(id)
      showToast(successMsg)
    } catch (e: unknown) {
      showToast((e as Error).message || 'Terjadi kesalahan', 'error')
    } finally {
      setActing(null)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus artikel "${title}" secara permanen?`)) return
    setActing(id)
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
      removeFromList(id)
      showToast('Artikel dihapus')
    } catch (e: unknown) {
      showToast((e as Error).message || 'Gagal menghapus', 'error')
    } finally {
      setActing(null)
    }
  }

  const handleSchedule = async () => {
    if (!scheduleId || !scheduleAt) return
    await handleAction(
      scheduleId,
      { status: 'scheduled', scheduledAt: new Date(scheduleAt).toISOString() },
      `Artikel dijadwalkan terbit pada ${new Date(scheduleAt).toLocaleString('id-ID')}`
    )
    setScheduleId(null)
    setScheduleAt('')
  }

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Clock className="w-10 h-10 text-slate-300 animate-spin" />
        <p className="text-slate-400 text-sm">Memuat antrian review…</p>
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <CheckCircle className="w-16 h-16 text-green-400" />
        <h2 className="text-xl font-serif font-bold text-slate-700">Antrian Review Kosong</h2>
        <p className="text-slate-500 text-sm text-center max-w-sm">
          Semua artikel telah diproses. Jalankan workflow baru untuk menghasilkan artikel berikutnya.
        </p>
        <Link
          href="/admin/workflow"
          className="bg-[var(--navy)] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[var(--navy-light)] transition-colors"
        >
          Ke Halaman Workflow
        </Link>
      </div>
    )
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

      {/* Schedule modal */}
      {scheduleId && (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm space-y-4">
            <h3 className="font-serif font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Jadwalkan Terbit
            </h3>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                Tanggal & Waktu Terbit
              </label>
              <input
                type="datetime-local"
                value={scheduleAt}
                onChange={e => setScheduleAt(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--navy)]"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSchedule}
                disabled={!scheduleAt || acting === scheduleId}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {acting === scheduleId ? 'Menyimpan…' : 'Jadwalkan'}
              </button>
              <button
                onClick={() => { setScheduleId(null); setScheduleAt('') }}
                className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-serif font-bold text-slate-800">Review Queue</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {articles.length} artikel menunggu keputusan editorial
          </p>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-semibold text-amber-700">
            {articles.length} artikel perlu ditindaklanjuti
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {articles.map((article) => {
          const isOpen = expanded === article.id
          const busy   = acting === article.id
          return (
            <div
              key={article.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Collapsed header */}
              <button
                className="w-full flex items-start gap-4 px-5 py-4 text-left"
                onClick={() => setExpanded(isOpen ? null : article.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded text-white"
                      style={{ backgroundColor: article.category.color }}
                    >
                      {article.category.name}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(article.createdAt)}
                    </span>
                    <span className="text-xs text-slate-400">
                      {article.wordCount} kata · {article.sourceCount} sumber
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-slate-800 text-base line-clamp-2 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-1 mt-1">{article.excerpt}</p>
                </div>
                <div className="shrink-0 text-right">
                  <div className={cn('text-2xl font-bold',
                    article.publishReadinessScore >= 85 ? 'text-green-600'
                    : article.publishReadinessScore >= 70 ? 'text-yellow-600' : 'text-red-600'
                  )}>
                    {article.publishReadinessScore}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold tracking-wide">Skor Siap</div>
                </div>
                <div className="shrink-0">
                  {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </div>
              </button>

              {/* Expanded detail */}
              {isOpen && (
                <div className="border-t border-slate-100 px-5 py-5 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Score breakdown */}
                    <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                      <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Skor Kualitas
                      </h4>
                      <div className="space-y-2.5">
                        {[
                          { label: 'Originalitas',      value: article.originalityScore           },
                          { label: 'Keterbacaan',        value: article.readabilityScore           },
                          { label: 'Skor SEO',           value: article.seoScore                   },
                          { label: 'Konsistensi Fakta',  value: article.factualConsistencyScore    },
                          { label: 'Risiko Duplikasi',   value: 100 - article.duplicationRiskScore },
                        ].map((item) => (
                          <div key={item.label}>
                            <div className="flex justify-between mb-1">
                              <span className="text-xs text-slate-600">{item.label}</span>
                            </div>
                            {SCORE_BAR(item.value)}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Bullet points */}
                      {article.bulletPoints.length > 0 && (
                        <div className="bg-[var(--navy)]/5 rounded-lg p-4">
                          <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2 flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5" /> Poin Utama
                          </h4>
                          <ul className="space-y-1.5">
                            {article.bulletPoints.map((point, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--red)] shrink-0 mt-1.5" />
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Sources */}
                      {article.sources.length > 0 && (
                        <div className="bg-green-50 rounded-lg p-4">
                          <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
                            Sumber ({article.sources.length})
                          </h4>
                          <ul className="space-y-1.5">
                            {article.sources.map((src) => (
                              <li key={src.id} className="flex items-center justify-between text-xs">
                                <span className="text-slate-700 font-medium">{src.name}</span>
                                <div className="flex items-center gap-2">
                                  <span className={cn(
                                    'px-1.5 py-0.5 rounded text-[10px] font-semibold',
                                    src.type === 'official' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                  )}>
                                    {src.type === 'official' ? 'Resmi' : 'Media'}
                                  </span>
                                  <span className="text-slate-500">{src.trustScore}/100</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Preview Excerpt</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{article.excerpt}</p>
                  </div>

                  {/* Editor note */}
                  <div>
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-2">
                      Catatan Editor (opsional)
                    </label>
                    <textarea
                      value={editorNote[article.id] || ''}
                      onChange={(e) => setEditorNote(prev => ({ ...prev, [article.id]: e.target.value }))}
                      placeholder="Tambahkan catatan untuk tim atau alasan keputusan..."
                      className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--navy)] resize-none min-h-[80px]"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      onClick={() => handleAction(article.id, { status: 'published' }, 'Artikel berhasil diterbitkan')}
                      disabled={busy}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {busy ? <Clock className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                      Setujui & Terbitkan
                    </button>

                    <button
                      onClick={() => setScheduleId(article.id)}
                      disabled={busy}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Calendar className="w-4 h-4" /> Jadwalkan Terbit
                    </button>

                    <Link
                      href={`/admin/articles/${article.id}`}
                      className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <Eye className="w-4 h-4" /> Edit Artikel
                    </Link>

                    <button
                      onClick={() => handleAction(article.id, { status: 'rejected' }, 'Artikel ditolak')}
                      disabled={busy}
                      className="flex items-center gap-2 border border-red-200 text-red-600 text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" /> Tolak
                    </button>

                    <button
                      onClick={() => handleDelete(article.id, article.title)}
                      disabled={busy}
                      className="ml-auto flex items-center gap-2 text-slate-400 hover:text-red-600 hover:bg-red-50 text-sm font-semibold px-3 py-2.5 rounded-lg transition-colors disabled:opacity-50"
                      title="Hapus permanen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
