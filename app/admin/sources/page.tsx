'use client'

import { useState } from 'react'
import {
  Globe,
  Plus,
  Edit3,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Search,
  Shield,
  Clock,
} from 'lucide-react'
import { SAMPLE_SOURCES } from '@/lib/mock-data'
import { formatDistanceToNow } from '@/lib/date-utils'
import { cn } from '@/lib/utils'

const PRIMARY_SOURCES = [
  { id: 'ps-1', name: 'ANTARA', url: 'https://antara.co.id', type: 'media', trustScore: 95, status: 'active', lastFetch: '2026-04-15T06:30:00Z', articlesProcessed: 234 },
  { id: 'ps-2', name: 'Kompas.com', url: 'https://kompas.com', type: 'media', trustScore: 92, status: 'active', lastFetch: '2026-04-15T06:30:00Z', articlesProcessed: 189 },
  { id: 'ps-3', name: 'Tempo.co', url: 'https://tempo.co', type: 'media', trustScore: 90, status: 'active', lastFetch: '2026-04-15T06:30:00Z', articlesProcessed: 156 },
  { id: 'ps-4', name: 'Liputan6.com', url: 'https://liputan6.com', type: 'media', trustScore: 85, status: 'active', lastFetch: '2026-04-15T06:30:00Z', articlesProcessed: 143 },
  { id: 'ps-5', name: 'MetroTV News', url: 'https://metrotvnews.com', type: 'media', trustScore: 83, status: 'active', lastFetch: '2026-04-15T06:30:00Z', articlesProcessed: 98 },
  { id: 'ps-6', name: 'Bank Indonesia', url: 'https://bi.go.id', type: 'official', trustScore: 99, status: 'active', lastFetch: '2026-04-15T06:30:00Z', articlesProcessed: 22 },
  { id: 'ps-7', name: 'BMKG', url: 'https://bmkg.go.id', type: 'official', trustScore: 99, status: 'active', lastFetch: '2026-04-15T06:30:00Z', articlesProcessed: 45 },
  { id: 'ps-8', name: 'DPR RI', url: 'https://dpr.go.id', type: 'official', trustScore: 99, status: 'active', lastFetch: '2026-04-15T06:28:00Z', articlesProcessed: 31 },
  { id: 'ps-9', name: 'Mahkamah Konstitusi', url: 'https://mkri.id', type: 'official', trustScore: 99, status: 'active', lastFetch: '2026-04-15T06:28:00Z', articlesProcessed: 18 },
  { id: 'ps-10', name: 'KPU RI', url: 'https://kpu.go.id', type: 'official', trustScore: 97, status: 'active', lastFetch: '2026-04-15T06:29:00Z', articlesProcessed: 15 },
  { id: 'ps-11', name: 'OJK', url: 'https://ojk.go.id', type: 'official', trustScore: 97, status: 'active', lastFetch: '2026-04-15T06:29:00Z', articlesProcessed: 24 },
  { id: 'ps-12', name: 'BPS', url: 'https://bps.go.id', type: 'official', trustScore: 98, status: 'active', lastFetch: '2026-04-15T06:29:00Z', articlesProcessed: 19 },
]

const FETCH_LOGS = [
  { id: 1, source: 'ANTARA', articles: 23, status: 'success', time: '2026-04-15T06:30:22Z' },
  { id: 2, source: 'Kompas.com', articles: 18, status: 'success', time: '2026-04-15T06:30:45Z' },
  { id: 3, source: 'Tempo.co', articles: 14, status: 'success', time: '2026-04-15T06:31:03Z' },
  { id: 4, source: 'Liputan6.com', articles: 21, status: 'success', time: '2026-04-15T06:31:22Z' },
  { id: 5, source: 'MetroTV News', articles: 9, status: 'success', time: '2026-04-15T06:31:40Z' },
  { id: 6, source: 'Bank Indonesia', articles: 2, status: 'success', time: '2026-04-15T06:31:55Z' },
  { id: 7, source: 'BMKG', articles: 4, status: 'success', time: '2026-04-15T06:32:10Z' },
]

export default function AdminSourcesPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'media' | 'official'>('all')

  const filtered = PRIMARY_SOURCES.filter((src) => {
    const matchSearch = !search || src.name.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'all' || src.type === typeFilter
    return matchSearch && matchType
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-serif font-bold text-slate-800">Sumber Berita</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Kelola sumber data untuk pipeline otomasi berita
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 text-sm border border-slate-200 bg-white px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-600">
            <RefreshCw className="w-4 h-4" />
            Fetch Semua Sekarang
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 text-sm bg-[var(--navy)] text-white px-4 py-2 rounded-lg hover:bg-[var(--navy-light)] transition-colors font-semibold"
          >
            <Plus className="w-4 h-4" />
            Tambah Sumber
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Sumber', value: PRIMARY_SOURCES.length, color: 'text-[var(--navy)]' },
          { label: 'Sumber Aktif', value: PRIMARY_SOURCES.filter(s => s.status === 'active').length, color: 'text-green-600' },
          { label: 'Sumber Resmi', value: PRIMARY_SOURCES.filter(s => s.type === 'official').length, color: 'text-purple-600' },
          { label: 'Media', value: PRIMARY_SOURCES.filter(s => s.type === 'media').length, color: 'text-blue-600' },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <p className={cn('text-2xl font-bold', item.color)}>{item.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-700 mb-4">Tambah Sumber Baru</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">Nama Sumber</label>
              <input
                type="text"
                placeholder="Contoh: CNN Indonesia"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--navy)]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">URL Homepage</label>
              <input
                type="url"
                placeholder="https://cnnindonesia.com"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--navy)]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">Tipe Sumber</label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--navy)]">
                <option value="media">Media / Pers</option>
                <option value="official">Sumber Resmi / Pemerintah</option>
                <option value="press_release">Siaran Pers</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">Skor Kepercayaan (0-100)</label>
              <input
                type="number"
                min={0}
                max={100}
                defaultValue={80}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--navy)]"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <button className="bg-[var(--navy)] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[var(--navy-light)] transition-colors">
              Simpan Sumber
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-sm text-slate-600 hover:text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sources table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Cari sumber..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="text-sm text-slate-700 flex-1 focus:outline-none bg-transparent"
              />
            </div>
            <div className="flex items-center gap-1">
              {(['all', 'media', 'official'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={cn(
                    'text-xs px-3 py-1.5 rounded-lg font-medium transition-colors',
                    typeFilter === t
                      ? 'bg-[var(--navy)] text-white'
                      : 'text-slate-500 hover:bg-slate-100'
                  )}
                >
                  {t === 'all' ? 'Semua' : t === 'media' ? 'Media' : 'Resmi'}
                </button>
              ))}
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {filtered.map((src) => (
              <div key={src.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-700">{src.name}</p>
                    <span
                      className={cn(
                        'text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase',
                        src.type === 'official'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      )}
                    >
                      {src.type === 'official' ? 'Resmi' : 'Media'}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
                    <span>{src.articlesProcessed} artikel diproses</span>
                    <span>Fetch {formatDistanceToNow(src.lastFetch)}</span>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-sm font-bold text-slate-700">{src.trustScore}/100</div>
                  <div className="text-[10px] text-slate-400">Kepercayaan</div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-slate-400 hover:text-[var(--navy)] hover:bg-slate-100 rounded transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button className="p-1.5 text-slate-400 hover:text-[var(--navy)] hover:bg-slate-100 rounded transition-colors">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fetch logs */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <h3 className="font-semibold text-slate-700 text-sm">Log Fetch Terakhir</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {FETCH_LOGS.map((log) => (
              <div key={log.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">{log.source}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {log.articles} artikel · {formatDistanceToNow(log.time)}
                  </p>
                </div>
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
