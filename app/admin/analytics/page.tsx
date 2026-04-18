'use client'

import { useState, useEffect } from 'react'
import {
  BarChart3, TrendingUp, Eye, Users, Clock, FileText,
  ArrowUp, ArrowDown, Minus, Globe, Search,
  Smartphone, Monitor, Share2, Download, RefreshCw,
} from 'lucide-react'

interface AnalyticsData {
  totalArticles:   number
  totalViews:      number
  featuredCount:   number
  trendingCount:   number
  avgReadingTime:  string
  todayCount:      number
  uniqueVisitors:  number
  topArticles:     { id: string; title: string; slug: string; views: number; change: number }[]
  categories:      { name: string; color: string; count: number; views: number }[]
  trafficSources:  { source: string; pct: number; color: string }[]
}

const DEVICE_BREAKDOWN = [
  { device: 'Mobile',  pct: 68, icon: Smartphone },
  { device: 'Desktop', pct: 27, icon: Monitor    },
  { device: 'Tablet',  pct: 5,  icon: Monitor    },
]

function StatCard({ label, value, change, icon: Icon, suffix = '' }: {
  label: string; value: string | number; change: number; icon: React.ElementType; suffix?: string
}) {
  const isUp   = change > 0
  const isFlat = change === 0
  return (
    <div className="bg-white rounded-xl border border-border p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
          <p className="font-serif text-2xl font-bold text-foreground mt-1">
            {typeof value === 'number' ? value.toLocaleString('id-ID') : value}
            {suffix && <span className="text-base font-normal text-muted-foreground ml-1">{suffix}</span>}
          </p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
          <Icon className="w-5 h-5 text-[var(--navy)]" />
        </div>
      </div>
      {change !== 0 && (
        <div className={`flex items-center gap-1 mt-3 text-xs font-semibold ${isUp ? 'text-green-600' : isFlat ? 'text-muted-foreground' : 'text-red-500'}`}>
          {isFlat ? <Minus className="w-3.5 h-3.5" /> : isUp ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
          <span>{Math.abs(change)}% vs minggu lalu</span>
        </div>
      )}
    </div>
  )
}

export default function AdminAnalyticsPage() {
  const [data,    setData]    = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period,  setPeriod]  = useState<'7d' | '30d' | '90d'>('7d')

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/analytics')
      const d   = await res.json()
      setData(d)
    } catch {
      /* silent */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[60vh]">
      <div className="flex items-center gap-3 text-slate-400">
        <RefreshCw className="w-5 h-5 animate-spin" />
        <span className="text-sm">Memuat analytics…</span>
      </div>
    </div>
  )

  if (!data) return (
    <div className="p-8 text-center text-slate-400 text-sm">Gagal memuat data analytics.</div>
  )

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Performa konten dan traffic website KabarKini</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-muted rounded-lg p-1">
            {(['7d', '30d', '90d'] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${period === p ? 'bg-white text-[var(--navy)] shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                {p === '7d' ? '7 Hari' : p === '30d' ? '30 Hari' : '90 Hari'}
              </button>
            ))}
          </div>
          <button onClick={load} className="p-2 border border-border rounded-lg hover:bg-muted transition-colors" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
            <Download className="w-4 h-4" /> Ekspor
          </button>
        </div>
      </div>

      {/* Stat cards — REAL dari Supabase */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Tayangan"   value={data.totalViews}      change={0} icon={Eye}      />
        <StatCard label="Pengunjung Unik"  value={data.uniqueVisitors}  change={0} icon={Users}    />
        <StatCard label="Artikel Terbit"   value={data.totalArticles}   change={0} icon={FileText} />
        <StatCard label="Rata-rata Baca"   value={data.avgReadingTime}  change={0} icon={Clock} suffix="mnt" />
      </div>

      {/* Today highlight */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Terbit Hari Ini',     value: data.todayCount    },
          { label: 'Artikel Featured',    value: data.featuredCount },
          { label: 'Sedang Trending',     value: data.trendingCount },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-border p-4 text-center">
            <p className="text-2xl font-bold font-serif text-[var(--navy)]">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Traffic sources + device */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Sumber traffic — placeholder */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-border p-5">
          <h2 className="font-serif font-bold text-base text-foreground mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            Sumber Traffic
            <span className="text-xs text-muted-foreground font-normal">(estimasi industri)</span>
          </h2>
          <div className="space-y-3">
            {data.trafficSources.map(src => (
              <div key={src.source}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-foreground font-medium">{src.source}</span>
                  <span className="text-sm font-bold">{src.pct}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${src.pct}%`, backgroundColor: src.color }} />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4 border-t border-border pt-3">
            Hubungkan Google Analytics atau Vercel Analytics untuk data traffic nyata.
          </p>
        </div>

        {/* Device */}
        <div className="bg-white rounded-xl border border-border p-5">
          <h2 className="font-serif font-bold text-base text-foreground mb-4">Perangkat</h2>
          <div className="space-y-4">
            {DEVICE_BREAKDOWN.map(({ device, pct, icon: DevIcon }) => (
              <div key={device}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <DevIcon className="w-4 h-4 text-muted-foreground" />{device}
                  </span>
                  <span className="font-bold text-sm">{pct}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--navy)] rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top articles — REAL dari Supabase by view_count */}
      <div className="bg-white rounded-xl border border-border p-5">
        <h2 className="font-serif font-bold text-base text-foreground mb-4">
          Artikel Paling Dibaca
          <span className="text-xs text-muted-foreground font-normal ml-2">(berdasarkan view_count)</span>
        </h2>
        {data.topArticles.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada data pembaca.</p>
        ) : (
          <div className="space-y-0">
            {data.topArticles.map((a, idx) => (
              <div key={a.id} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                <span className="font-serif text-xl font-bold text-border shrink-0 w-6 text-center">{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground line-clamp-1">{a.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{(a.views || 0).toLocaleString('id-ID')} tayangan</p>
                </div>
                <a href={`/${a.slug}`} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-[var(--navy)] hover:underline shrink-0">Lihat →</a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category performance — REAL count dari Supabase */}
      {data.categories.length > 0 && (
        <div className="bg-white rounded-xl border border-border p-5">
          <h2 className="font-serif font-bold text-base text-foreground mb-5">Performa per Kategori</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2.5 pr-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Kategori</th>
                  <th className="text-right py-2.5 pr-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Artikel</th>
                </tr>
              </thead>
              <tbody>
                {data.categories.map(cat => (
                  <tr key={cat.name} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                    <td className="py-3 pr-4">
                      <span className="flex items-center gap-2 font-semibold text-foreground">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                        {cat.name}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right font-semibold">{cat.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Social share placeholder */}
      <div className="bg-white rounded-xl border border-border p-5">
        <div className="flex items-center gap-2 mb-5">
          <Share2 className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-serif font-bold text-base text-foreground">Performa Media Sosial</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { platform: 'Facebook',  color: '#1877F2' },
            { platform: 'Twitter/X', color: '#000000' },
            { platform: 'WhatsApp',  color: '#25D366' },
            { platform: 'Telegram',  color: '#26A5E4' },
          ].map(s => (
            <div key={s.platform} className="text-center p-4 bg-muted rounded-xl">
              <p className="text-lg font-bold font-serif text-muted-foreground">—</p>
              <p className="text-xs text-muted-foreground mt-1">{s.platform}</p>
              <div className="h-1 rounded-full mt-2 mx-auto w-8" style={{ backgroundColor: s.color }} />
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Integrasi share tracking akan tersedia setelah pixel sosial media dikonfigurasi.
        </p>
      </div>
    </div>
  )
}
