'use client'

import { useState } from 'react'
import {
  BarChart3,
  TrendingUp,
  Eye,
  Users,
  Clock,
  FileText,
  ArrowUp,
  ArrowDown,
  Minus,
  Globe,
  Search,
  Smartphone,
  Monitor,
  Share2,
  Calendar,
  Download,
} from 'lucide-react'
import { ARTICLES, CATEGORIES, TRENDING_TOPICS } from '@/lib/mock-data'

// ─── Mock analytics data ─────────────────────────────────────────────
const DAILY_TRAFFIC = [
  { day: 'Sen', views: 4200, visitors: 3100 },
  { day: 'Sel', views: 5800, visitors: 4300 },
  { day: 'Rab', views: 7200, visitors: 5600 },
  { day: 'Kam', views: 6400, visitors: 4900 },
  { day: 'Jum', views: 8900, visitors: 6700 },
  { day: 'Sab', views: 9600, visitors: 7200 },
  { day: 'Min', views: 11200, visitors: 8400 },
]

const TOP_PAGES = [
  { title: 'DPR Sahkan RUU Perampasan Aset', views: 24300, change: 12 },
  { title: 'KPU Tetapkan Jadwal Pilkada 2026', views: 18700, change: 7 },
  { title: 'Bank Indonesia Turunkan Suku Bunga', views: 15200, change: -3 },
  { title: 'Startup Unicorn Baru Indonesia', views: 12800, change: 22 },
  { title: 'Banjir Bandang Sulawesi Selatan', views: 11400, change: 45 },
]

const TRAFFIC_SOURCES = [
  { source: 'Pencarian Organik', pct: 48, color: '#1D4ED8' },
  { source: 'Langsung', pct: 24, color: '#0369A1' },
  { source: 'Media Sosial', pct: 18, color: '#DC2626' },
  { source: 'Rujukan', pct: 7, color: '#065F46' },
  { source: 'Lainnya', pct: 3, color: '#94A3B8' },
]

const DEVICE_BREAKDOWN = [
  { device: 'Mobile', pct: 68, icon: Smartphone },
  { device: 'Desktop', pct: 27, icon: Monitor },
  { device: 'Tablet', pct: 5, icon: Monitor },
]

const CATEGORY_PERFORMANCE = CATEGORIES.map((cat, i) => ({
  ...cat,
  views: [47200, 31800, 38900, 29400, 22100, 18700, 25300, 14200][i] || 10000,
  articles: cat.articleCount || 10,
  avgTimeOnPage: ['4:32', '5:12', '3:58', '6:01', '4:45', '3:22', '5:38', '2:57'][i] || '4:00',
  bounceRate: [38, 41, 45, 35, 52, 48, 43, 60][i] || 45,
}))

const SEARCH_KEYWORDS = [
  { keyword: 'ruu perampasan aset', impressions: 12400, clicks: 3200, ctr: 25.8, position: 2.1 },
  { keyword: 'suku bunga bi 2026', impressions: 8900, clicks: 2100, ctr: 23.6, position: 3.4 },
  { keyword: 'pilkada 2026 jadwal', impressions: 7600, clicks: 1840, ctr: 24.2, position: 1.8 },
  { keyword: 'korupsi kpk terbaru', impressions: 6200, clicks: 1380, ctr: 22.3, position: 4.2 },
  { keyword: 'berita teknologi indonesia', impressions: 5800, clicks: 1260, ctr: 21.7, position: 5.1 },
]

// ─── Bar chart mini component ─────────────────────────────────────────
function MiniBarChart({ data }: { data: typeof DAILY_TRAFFIC }) {
  const maxVal = Math.max(...data.map((d) => d.views))
  return (
    <div className="flex items-end gap-1.5 h-20" role="img" aria-label="Grafik traffic harian 7 hari terakhir">
      {data.map((d) => (
        <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-sm bg-[var(--navy)] opacity-80 hover:opacity-100 transition-opacity"
            style={{ height: `${(d.views / maxVal) * 100}%` }}
            title={`${d.day}: ${d.views.toLocaleString('id-ID')} tayangan`}
          />
          <span className="text-[9px] text-muted-foreground">{d.day}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Stat card ────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  change,
  icon: Icon,
  suffix = '',
}: {
  label: string
  value: string | number
  change: number
  icon: React.ElementType
  suffix?: string
}) {
  const isUp = change > 0
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
          <Icon className="w-5 h-5 text-[var(--navy)]" aria-hidden="true" />
        </div>
      </div>
      <div className={`flex items-center gap-1 mt-3 text-xs font-semibold ${isUp ? 'text-green-600' : isFlat ? 'text-muted-foreground' : 'text-red-500'}`}>
        {isFlat ? (
          <Minus className="w-3.5 h-3.5" aria-hidden="true" />
        ) : isUp ? (
          <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
        ) : (
          <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
        )}
        <span>{Math.abs(change)}% vs minggu lalu</span>
      </div>
    </div>
  )
}

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('7d')

  const totalViews = DAILY_TRAFFIC.reduce((s, d) => s + d.views, 0)
  const publishedArticles = ARTICLES.filter((a) => a.status === 'published')
  const avgReadingTime = (publishedArticles.reduce((s, a) => s + a.readingTime, 0) / publishedArticles.length).toFixed(1)

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Page header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Performa konten dan traffic website KabarKini
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Period selector */}
          <div className="flex bg-muted rounded-lg p-1" role="group" aria-label="Pilih periode">
            {(['7d', '30d', '90d'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  period === p
                    ? 'bg-white text-[var(--navy)] shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-pressed={period === p}
              >
                {p === '7d' ? '7 Hari' : p === '30d' ? '30 Hari' : '90 Hari'}
              </button>
            ))}
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
            aria-label="Ekspor laporan"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            Ekspor
          </button>
        </div>
      </div>

      {/* ── Stat cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Tayangan" value={totalViews} change={14} icon={Eye} />
        <StatCard label="Pengunjung Unik" value={34800} change={9} icon={Users} />
        <StatCard label="Artikel Terbit" value={publishedArticles.length} change={23} icon={FileText} />
        <StatCard label="Rata-rata Baca" value={avgReadingTime} change={-2} icon={Clock} suffix="mnt" />
      </div>

      {/* ── Traffic chart + sources ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Bar chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif font-bold text-base text-foreground">Traffic Harian</h2>
            <span className="text-xs text-muted-foreground">7 hari terakhir</span>
          </div>
          <MiniBarChart data={DAILY_TRAFFIC} />
          <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-border">
            {DAILY_TRAFFIC.slice(-2).map((d) => (
              <div key={d.day}>
                <p className="text-xs text-muted-foreground">{d.day === 'Min' ? 'Kemarin (Min)' : 'Hari ini'}</p>
                <p className="font-bold text-foreground">{d.views.toLocaleString('id-ID')}<span className="text-xs font-normal text-muted-foreground ml-1">tayangan</span></p>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic sources */}
        <div className="bg-white rounded-xl border border-border p-5">
          <h2 className="font-serif font-bold text-base text-foreground mb-4">Sumber Traffic</h2>
          <div className="space-y-3">
            {TRAFFIC_SOURCES.map((src) => (
              <div key={src.source}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-foreground font-medium">{src.source}</span>
                  <span className="text-sm font-bold text-foreground">{src.pct}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${src.pct}%`, backgroundColor: src.color }}
                    role="progressbar"
                    aria-valuenow={src.pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${src.source}: ${src.pct}%`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Top articles + device breakdown ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Top articles */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-border p-5">
          <h2 className="font-serif font-bold text-base text-foreground mb-4">Artikel Paling Dibaca</h2>
          <div className="space-y-0">
            {TOP_PAGES.map((page, idx) => (
              <div key={page.title} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                <span className="font-serif text-xl font-bold text-border shrink-0 w-6 text-center" aria-hidden="true">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground line-clamp-1">{page.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{page.views.toLocaleString('id-ID')} tayangan</p>
                </div>
                <div className={`flex items-center gap-0.5 text-xs font-bold shrink-0 ${page.change > 0 ? 'text-green-600' : page.change < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                  {page.change > 0 ? <ArrowUp className="w-3 h-3" aria-hidden="true" /> : <ArrowDown className="w-3 h-3" aria-hidden="true" />}
                  {Math.abs(page.change)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device breakdown */}
        <div className="bg-white rounded-xl border border-border p-5">
          <h2 className="font-serif font-bold text-base text-foreground mb-4">Perangkat</h2>
          <div className="space-y-4">
            {DEVICE_BREAKDOWN.map(({ device, pct, icon: DevIcon }) => (
              <div key={device}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <DevIcon className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                    {device}
                  </span>
                  <span className="font-bold text-foreground text-sm">{pct}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--navy)] rounded-full"
                    style={{ width: `${pct}%` }}
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${device}: ${pct}%`}
                  />
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-border mt-4">
              <p className="text-xs text-muted-foreground font-medium mb-3 uppercase tracking-wide">Insight</p>
              <p className="text-sm text-foreground leading-relaxed">
                <span className="font-bold text-[var(--navy)]">68%</span> pembaca mengakses via mobile. Pastikan layout artikel dan iklan tetap optimal di layar kecil.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Category performance ────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-border p-5">
        <h2 className="font-serif font-bold text-base text-foreground mb-5">Performa per Kategori</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2.5 pr-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Kategori</th>
                <th className="text-right py-2.5 pr-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tayangan</th>
                <th className="text-right py-2.5 pr-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Artikel</th>
                <th className="text-right py-2.5 pr-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Avg. Baca</th>
                <th className="text-right py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Bounce Rate</th>
              </tr>
            </thead>
            <tbody>
              {CATEGORY_PERFORMANCE.sort((a, b) => b.views - a.views).map((cat) => (
                <tr key={cat.id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                  <td className="py-3 pr-4">
                    <span className="flex items-center gap-2 font-semibold text-foreground">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} aria-hidden="true" />
                      {cat.name}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-right font-semibold">{cat.views.toLocaleString('id-ID')}</td>
                  <td className="py-3 pr-4 text-right text-muted-foreground">{cat.articles}</td>
                  <td className="py-3 pr-4 text-right text-muted-foreground hidden md:table-cell">{cat.avgTimeOnPage}</td>
                  <td className="py-3 text-right hidden md:table-cell">
                    <span className={`font-semibold ${cat.bounceRate < 40 ? 'text-green-600' : cat.bounceRate > 55 ? 'text-red-500' : 'text-amber-600'}`}>
                      {cat.bounceRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Search keywords ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-border p-5">
        <div className="flex items-center gap-2 mb-5">
          <Search className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
          <h2 className="font-serif font-bold text-base text-foreground">Kata Kunci Pencarian (Google Search Console)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2.5 pr-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Kata Kunci</th>
                <th className="text-right py-2.5 pr-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Impresi</th>
                <th className="text-right py-2.5 pr-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Klik</th>
                <th className="text-right py-2.5 pr-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">CTR</th>
                <th className="text-right py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Posisi</th>
              </tr>
            </thead>
            <tbody>
              {SEARCH_KEYWORDS.map((kw) => (
                <tr key={kw.keyword} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                  <td className="py-3 pr-4">
                    <span className="flex items-center gap-2">
                      <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
                      <span className="font-medium text-foreground">{kw.keyword}</span>
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-right">{kw.impressions.toLocaleString('id-ID')}</td>
                  <td className="py-3 pr-4 text-right font-semibold">{kw.clicks.toLocaleString('id-ID')}</td>
                  <td className="py-3 pr-4 text-right">
                    <span className={`font-semibold ${kw.ctr > 25 ? 'text-green-600' : kw.ctr > 20 ? 'text-amber-600' : 'text-red-500'}`}>
                      {kw.ctr}%
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <span className={`font-bold ${kw.position <= 3 ? 'text-green-600' : kw.position <= 5 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                      #{kw.position}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5" aria-hidden="true" />
          Data akan terhubung langsung ke Google Search Console API setelah integrasi dikonfigurasi.
        </p>
      </div>

      {/* ── Social share performance ─────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-border p-5">
        <div className="flex items-center gap-2 mb-5">
          <Share2 className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
          <h2 className="font-serif font-bold text-base text-foreground">Performa Media Sosial</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { platform: 'Facebook', shares: 2840, color: '#1877F2' },
            { platform: 'Twitter/X', shares: 1920, color: '#000000' },
            { platform: 'WhatsApp', shares: 5670, color: '#25D366' },
            { platform: 'Telegram', shares: 1240, color: '#26A5E4' },
          ].map((s) => (
            <div key={s.platform} className="text-center p-4 bg-muted rounded-xl">
              <p className="text-2xl font-bold font-serif text-foreground">{s.shares.toLocaleString('id-ID')}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.platform}</p>
              <div className="h-1 rounded-full mt-2 mx-auto w-8" style={{ backgroundColor: s.color }} aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
