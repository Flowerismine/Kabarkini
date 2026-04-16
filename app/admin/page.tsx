'use client'

import Link from 'next/link'
import {
  FileText,
  Clock,
  Eye,
  CheckCircle,
  Calendar,
  Zap,
  TrendingUp,
  Activity,
  AlertTriangle,
  ArrowUpRight,
  ArrowRight,
  RefreshCw,
  Play,
  BarChart3,
  Globe,
  Cpu,
  ShieldCheck,
} from 'lucide-react'
import { ADMIN_STATS, WORKFLOW_RUNS, ARTICLES, SAMPLE_SOURCES } from '@/lib/mock-data'
import { formatDistanceToNow, formatTime } from '@/lib/date-utils'
import { cn } from '@/lib/utils'

const STATUS_COLORS: Record<string, string> = {
  running: 'bg-blue-100 text-blue-700 border-blue-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  failed: 'bg-red-100 text-red-700 border-red-200',
  partial: 'bg-yellow-100 text-yellow-700 border-yellow-200',
}

const LOG_LEVEL_COLORS: Record<string, string> = {
  info: 'text-slate-500',
  warn: 'text-yellow-600',
  error: 'text-red-600',
  success: 'text-green-600',
}

const LOG_LEVEL_DOT: Record<string, string> = {
  info: 'bg-slate-400',
  warn: 'bg-yellow-500',
  error: 'bg-red-500',
  success: 'bg-green-500',
}

export default function AdminDashboard() {
  const stats = ADMIN_STATS
  const latestRun = WORKFLOW_RUNS[0]
  const reviewArticles = ARTICLES.filter((a) => a.status === 'review')
  const recentPublished = ARTICLES.filter((a) => a.status === 'published').slice(0, 5)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-800">AI Newsroom Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Pantau seluruh pipeline editorial dan performa konten secara real-time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 text-sm text-slate-600 border border-slate-200 bg-white px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <Link
            href="/admin/workflow"
            className="flex items-center gap-2 text-sm bg-[var(--navy)] text-white px-4 py-2 rounded-lg hover:bg-[var(--navy-light)] transition-colors font-semibold"
          >
            <Play className="w-4 h-4" />
            Jalankan Workflow
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Terbit Hari Ini',
            value: stats.todayPublished,
            icon: CheckCircle,
            color: 'text-green-600',
            bg: 'bg-green-50',
            href: '/admin/published',
          },
          {
            label: 'Menunggu Review',
            value: stats.pendingReview,
            icon: Eye,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            href: '/admin/review',
            alert: stats.pendingReview > 0,
          },
          {
            label: 'Sedang Diproses',
            value: stats.processing,
            icon: Cpu,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            href: '/admin/drafts',
          },
          {
            label: 'Terjadwal',
            value: stats.scheduled,
            icon: Calendar,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            href: '/admin/scheduled',
          },
        ].map((s) => {
          const Icon = s.icon
          return (
            <Link
              key={s.label}
              href={s.href}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={cn('p-2 rounded-lg', s.bg)}>
                  <Icon className={cn('w-5 h-5', s.color)} />
                </div>
                {s.alert && (
                  <span className="flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                  </span>
                )}
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
              </div>
              <p className="text-3xl font-bold text-slate-800">{s.value}</p>
              <p className="text-sm text-slate-500 mt-1">{s.label}</p>
            </Link>
          )
        })}
      </div>

      {/* Second row stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-700 text-sm">Total Artikel</h2>
            <BarChart3 className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-3xl font-bold text-slate-800">{stats.totalArticles.toLocaleString('id-ID')}</p>
          <p className="text-xs text-slate-500 mt-1">Di seluruh database</p>
          <div className="mt-4 space-y-2">
            {stats.topCategories.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2">
                <span className="text-xs text-slate-600 w-24 shrink-0">{cat.name}</span>
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--navy)] rounded-full"
                    style={{ width: `${(cat.count / 40) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500 w-6 text-right">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-700 text-sm">Rata-rata Skor Kualitas</h2>
            <ShieldCheck className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-3xl font-bold text-slate-800">{stats.avgQualityScore}</p>
          <p className="text-xs text-slate-500 mt-1">Dari 100 poin</p>
          <div className="mt-4 space-y-2.5">
            {[
              { label: 'Originalitas', value: 91 },
              { label: 'Keterbacaan', value: 88 },
              { label: 'SEO', value: 90 },
              { label: 'Konsistensi Fakta', value: 95 },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="text-xs text-slate-600 w-28 shrink-0">{item.label}</span>
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full',
                      item.value >= 90 ? 'bg-green-500' : item.value >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                    )}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500 w-8 text-right">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-700 text-sm">Sumber Berita Aktif</h2>
            <Globe className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-3xl font-bold text-slate-800">12</p>
          <p className="text-xs text-slate-500 mt-1">Sumber terkonfigurasi</p>
          <div className="mt-4 space-y-2">
            {[
              { name: 'Antara', score: 95, status: 'aktif' },
              { name: 'Kompas.com', score: 92, status: 'aktif' },
              { name: 'Tempo.co', score: 90, status: 'aktif' },
              { name: 'Liputan6', score: 85, status: 'aktif' },
              { name: 'MetroTV', score: 83, status: 'aktif' },
            ].map((src) => (
              <div key={src.name} className="flex items-center justify-between text-xs">
                <span className="text-slate-700 font-medium">{src.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">{src.score}/100</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content: workflow + review queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workflow latest run */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[var(--navy)]" />
              <h2 className="font-semibold text-slate-700 text-sm">Workflow Run Terakhir</h2>
              <span
                className={cn(
                  'text-xs font-semibold px-2 py-0.5 rounded border',
                  STATUS_COLORS[latestRun.status]
                )}
              >
                {latestRun.status === 'completed' ? 'Selesai' : latestRun.status}
              </span>
            </div>
            <Link
              href="/admin/workflow"
              className="text-xs text-[var(--navy)] font-semibold hover:underline flex items-center gap-1"
            >
              Kelola <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Run summary */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 px-5 py-4 border-b border-slate-100">
            {[
              { label: 'Sumber', value: latestRun.sourcesIngested },
              { label: 'Topik', value: latestRun.topicsClustered },
              { label: 'Dihasilkan', value: latestRun.articlesGenerated },
              { label: 'Terbit', value: latestRun.articlesPublished, highlight: true },
              { label: 'Review', value: latestRun.articlesReviewed },
              { label: 'Ditolak', value: latestRun.articlesRejected },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p
                  className={cn(
                    'text-2xl font-bold',
                    item.highlight ? 'text-green-600' : 'text-slate-700'
                  )}
                >
                  {item.value}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Log scroll */}
          <div className="px-5 py-4 max-h-56 overflow-y-auto space-y-2">
            {latestRun.logs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs">
                <span className={cn('w-1.5 h-1.5 rounded-full mt-1.5 shrink-0', LOG_LEVEL_DOT[log.level])} />
                <span className="text-slate-400 shrink-0 font-mono tabular-nums">
                  {formatTime(log.timestamp)}
                </span>
                <span className="text-slate-500 font-medium shrink-0">[{log.step}]</span>
                <span className={cn(LOG_LEVEL_COLORS[log.level])}>{log.message}</span>
              </div>
            ))}
          </div>

          <div className="px-5 py-3 bg-slate-50 rounded-b-xl border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Dimulai: {formatDistanceToNow(latestRun.startedAt)}</span>
            {latestRun.completedAt && (
              <span>Selesai: {formatTime(latestRun.completedAt)}</span>
            )}
          </div>
        </div>

        {/* Review Queue */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-500" />
              <h2 className="font-semibold text-slate-700 text-sm">Antrian Review</h2>
              {reviewArticles.length > 0 && (
                <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                  {reviewArticles.length}
                </span>
              )}
            </div>
            <Link
              href="/admin/review"
              className="text-xs text-[var(--navy)] font-semibold hover:underline"
            >
              Lihat Semua
            </Link>
          </div>

          {reviewArticles.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-slate-500">Semua artikel sudah diproses.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {reviewArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/admin/review/${article.id}`}
                  className="flex flex-col gap-1 px-5 py-3.5 hover:bg-slate-50 transition-colors"
                >
                  <p className="text-sm font-semibold text-slate-700 line-clamp-2 leading-snug">
                    {article.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded text-white"
                      style={{ backgroundColor: article.category.color }}
                    >
                      {article.category.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      Skor: {article.publishReadinessScore}/100
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="px-5 py-3 bg-slate-50 rounded-b-xl border-t border-slate-100">
            <Link
              href="/admin/review"
              className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-[var(--navy)] hover:text-[var(--red)] transition-colors"
            >
              Buka Review Queue <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recently published */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-500" />
            <h2 className="font-semibold text-slate-700 text-sm">Artikel Terbit Terbaru</h2>
          </div>
          <Link
            href="/admin/published"
            className="text-xs text-[var(--navy)] font-semibold hover:underline"
          >
            Lihat Semua
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">Judul</th>
                <th className="px-4 py-3 text-left font-semibold">Kategori</th>
                <th className="px-4 py-3 text-left font-semibold">Skor Siap Terbit</th>
                <th className="px-4 py-3 text-left font-semibold">Pembaca</th>
                <th className="px-4 py-3 text-left font-semibold">Terbit</th>
                <th className="px-4 py-3 text-left font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentPublished.map((article) => (
                <tr key={article.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-slate-700 line-clamp-1 max-w-xs">{article.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{article.wordCount} kata · {article.readingTime} menit</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className="text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded text-white"
                      style={{ backgroundColor: article.category.color }}
                    >
                      {article.category.name}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
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
                      <span className="text-xs text-slate-600 font-medium">
                        {article.publishReadinessScore}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 text-xs">
                    {article.viewCount?.toLocaleString('id-ID') || '—'}
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 text-xs whitespace-nowrap">
                    {formatDistanceToNow(article.publishedAt)}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/${article.slug}`}
                        className="text-xs text-[var(--navy)] hover:underline"
                        target="_blank"
                      >
                        Lihat
                      </Link>
                      <Link
                        href={`/admin/articles/${article.id}`}
                        className="text-xs text-slate-500 hover:underline"
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Kelola Sumber Berita', href: '/admin/sources', icon: Globe, desc: 'Tambah & konfigurasi sumber' },
          { label: 'SEO Settings', href: '/admin/seo', icon: TrendingUp, desc: 'Meta, sitemap, schema' },
          { label: 'Pengaturan Iklan', href: '/admin/ads', icon: BarChart3, desc: 'Slot AdSense & placement' },
          { label: 'WordPress Bridge', href: '/admin/wordpress', icon: Activity, desc: 'Sinkronisasi ke WordPress' },
        ].map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-[var(--navy)]/30 transition-all group"
            >
              <Icon className="w-5 h-5 text-[var(--navy)] mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-semibold text-slate-700">{item.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
