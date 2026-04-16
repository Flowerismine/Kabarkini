'use client'

import { useState } from 'react'
import {
  Play,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Settings,
  TrendingUp,
  Globe,
  Cpu,
  FileText,
  ShieldCheck,
  Send,
  BarChart3,
} from 'lucide-react'
import { WORKFLOW_RUNS } from '@/lib/mock-data'
import { formatDistanceToNow, formatDateTime, formatTime } from '@/lib/date-utils'
import { cn } from '@/lib/utils'

const STEP_ICONS: Record<string, React.ElementType> = {
  'Source Ingestion': Globe,
  'Pre-filter': ShieldCheck,
  'Topic Clustering': TrendingUp,
  'Hotness Scoring': BarChart3,
  'Topic Selection': CheckCircle,
  'Fact Extraction': FileText,
  'Cross-check': ShieldCheck,
  'Article Generation': Cpu,
  'SEO Packaging': TrendingUp,
  'Quality Gate': ShieldCheck,
  Publish: Send,
  Indexing: Globe,
  Workflow: Zap,
}

const STATUS_COLORS: Record<string, string> = {
  running: 'border-blue-300 bg-blue-50 text-blue-700',
  completed: 'border-green-300 bg-green-50 text-green-700',
  failed: 'border-red-300 bg-red-50 text-red-700',
  partial: 'border-yellow-300 bg-yellow-50 text-yellow-700',
}

const LOG_COLORS: Record<string, string> = {
  info: 'text-slate-500',
  warn: 'text-yellow-600',
  error: 'text-red-600',
  success: 'text-green-600',
}
const LOG_DOTS: Record<string, string> = {
  info: 'bg-slate-300',
  warn: 'bg-yellow-400',
  error: 'bg-red-500',
  success: 'bg-green-500',
}

const PIPELINE_STEPS = [
  { id: 1, name: 'Source Ingestion', desc: 'Ambil berita dari 12 sumber terkonfigurasi' },
  { id: 2, name: 'Pre-filter', desc: 'Buang artikel tipis, terlalu lama, tidak relevan' },
  { id: 3, name: 'Topic Clustering', desc: 'Gabungkan artikel yang membahas isu sama' },
  { id: 4, name: 'Hotness Scoring', desc: 'Hitung skor urgensi dan potensi viral tiap topik' },
  { id: 5, name: 'Topic Selection', desc: 'Pilih 5–10 topik terbaik untuk ditulis' },
  { id: 6, name: 'Fact Extraction', desc: 'Ekstrak fakta inti dari setiap topik terpilih' },
  { id: 7, name: 'Cross-check', desc: 'Bandingkan minimal 2 sumber untuk tiap klaim' },
  { id: 8, name: 'Article Generation', desc: 'Tulis artikel orisinal berbasis fakta' },
  { id: 9, name: 'SEO Packaging', desc: 'Buat meta, slug, keyword, schema' },
  { id: 10, name: 'Quality Gate', desc: 'Nilai dan putuskan: auto-publish / review / tolak' },
  { id: 11, name: 'Publish', desc: 'Simpan ke database dan tampilkan ke website' },
  { id: 12, name: 'Indexing', desc: 'Update sitemap, RSS, trending, feeds' },
]

export default function AdminWorkflowPage() {
  const [runType, setRunType] = useState<'main' | 'breaking' | 'manual'>('main')
  const [isRunning, setIsRunning] = useState(false)
  const [autoPublishThreshold, setAutoPublishThreshold] = useState(85)
  const [reviewThreshold, setReviewThreshold] = useState(70)
  const [articlesPerRun, setArticlesPerRun] = useState(8)
  const [dailyRun06, setDailyRun06] = useState(true)
  const [dailyRun12, setDailyRun12] = useState(true)
  const [dailyRun18, setDailyRun18] = useState(false)

  const handleRunWorkflow = () => {
    setIsRunning(true)
    setTimeout(() => setIsRunning(false), 3000)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-serif font-bold text-slate-800">Workflow & Otomasi</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Jalankan pipeline AI dan atur jadwal auto-post harian
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Run panel + pipeline */}
        <div className="lg:col-span-2 space-y-5">
          {/* Manual run panel */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Play className="w-4 h-4 text-[var(--navy)]" />
              Jalankan Workflow Manual
            </h2>

            <div className="flex items-center gap-3 mb-5">
              {[
                { key: 'main', label: 'Run Utama', desc: 'Berita harian lengkap (semua langkah)' },
                { key: 'breaking', label: 'Breaking News', desc: 'Mode cepat untuk berita mendesak' },
                { key: 'manual', label: 'Manual Pilih Topik', desc: 'Input topik spesifik sendiri' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setRunType(opt.key as typeof runType)}
                  className={cn(
                    'flex-1 text-left px-4 py-3 rounded-lg border-2 transition-all text-sm',
                    runType === opt.key
                      ? 'border-[var(--navy)] bg-[var(--navy)]/5'
                      : 'border-slate-200 hover:border-slate-300'
                  )}
                >
                  <div className="font-semibold text-slate-700">{opt.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>

            {runType === 'manual' && (
              <div className="mb-4">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5">
                  Topik yang Ingin Ditulis
                </label>
                <textarea
                  placeholder="Contoh: Kenaikan BBM Pertamina Juli 2026, Sidang Kasus Korupsi X..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--navy)] resize-none h-20"
                />
              </div>
            )}

            <button
              onClick={handleRunWorkflow}
              disabled={isRunning}
              className={cn(
                'flex items-center gap-2 text-white font-semibold px-6 py-2.5 rounded-lg transition-all text-sm',
                isRunning
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-[var(--navy)] hover:bg-[var(--navy-light)]'
              )}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Workflow Berjalan...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Jalankan Sekarang
                </>
              )}
            </button>

            {isRunning && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-700 text-sm font-semibold mb-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Workflow sedang berjalan...
                </div>
                <div className="w-full h-1.5 bg-blue-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full animate-pulse w-1/3" />
                </div>
                <p className="text-xs text-blue-600 mt-2">Step 1/12 — Source Ingestion</p>
              </div>
            )}
          </div>

          {/* Pipeline visualizer */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              Pipeline 12 Langkah
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PIPELINE_STEPS.map((step) => {
                const Icon = STEP_ICONS[step.name] || Cpu
                return (
                  <div
                    key={step.id}
                    className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-lg border border-slate-100"
                  >
                    <div className="w-7 h-7 rounded-full bg-[var(--navy)] text-white text-xs flex items-center justify-center font-bold shrink-0">
                      {step.id}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700">{step.name}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{step.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent runs */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <h2 className="font-semibold text-slate-700 text-sm">Riwayat Workflow Run</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {WORKFLOW_RUNS.map((run) => (
                <details key={run.id} className="group">
                  <summary className="flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-slate-50 transition-colors list-none">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          'text-xs font-semibold px-2 py-0.5 rounded border',
                          STATUS_COLORS[run.status]
                        )}
                      >
                        {run.status === 'completed' ? 'Selesai' : run.status}
                      </span>
                      <span className="text-sm text-slate-700 font-medium">
                        {run.runType === 'daily_main' ? 'Run Utama Harian' : run.runType}
                      </span>
                      <span className="text-xs text-slate-500">
                        {formatDistanceToNow(run.startedAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="text-green-600 font-semibold">
                        +{run.articlesPublished} terbit
                      </span>
                      <span>{run.articlesReviewed} review</span>
                      <span className="text-red-500">{run.articlesRejected} tolak</span>
                    </div>
                  </summary>
                  <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 space-y-1.5 max-h-48 overflow-y-auto">
                    {run.logs.map((log, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <span className={cn('w-1.5 h-1.5 rounded-full mt-1.5 shrink-0', LOG_DOTS[log.level])} />
                        <span className="text-slate-400 font-mono shrink-0">{formatTime(log.timestamp)}</span>
                        <span className="text-slate-500 font-medium shrink-0">[{log.step}]</span>
                        <span className={LOG_COLORS[log.level]}>{log.message}</span>
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Schedule + quality settings */}
        <div className="space-y-5">
          {/* Schedule config */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--navy)]" />
              Jadwal Auto-Run
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Pagi — 06:30 WIB', key: 'run06', value: dailyRun06, setter: setDailyRun06, desc: 'Run utama harian' },
                { label: 'Siang — 12:00 WIB', key: 'run12', value: dailyRun12, setter: setDailyRun12, desc: 'Update siang' },
                { label: 'Sore — 18:00 WIB', key: 'run18', value: dailyRun18, setter: setDailyRun18, desc: 'Update sore' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => item.setter(!item.value)}
                    className={cn(
                      'w-10 h-5 rounded-full transition-colors relative',
                      item.value ? 'bg-green-500' : 'bg-slate-300'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform',
                        item.value ? 'translate-x-5' : 'translate-x-0.5'
                      )}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quality gate settings */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--navy)]" />
              Quality Gate
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-600">
                    Auto-Publish jika skor ≥
                  </label>
                  <span className="text-xs font-bold text-green-600">{autoPublishThreshold}</span>
                </div>
                <input
                  type="range"
                  min={70}
                  max={100}
                  value={autoPublishThreshold}
                  onChange={(e) => setAutoPublishThreshold(Number(e.target.value))}
                  className="w-full accent-green-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>70</span>
                  <span>100</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-600">
                    Kirim ke Review jika skor ≥
                  </label>
                  <span className="text-xs font-bold text-yellow-600">{reviewThreshold}</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={85}
                  value={reviewThreshold}
                  onChange={(e) => setReviewThreshold(Number(e.target.value))}
                  className="w-full accent-yellow-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-600">
                    Artikel per Run
                  </label>
                  <span className="text-xs font-bold text-[var(--navy)]">{articlesPerRun}</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={20}
                  value={articlesPerRun}
                  onChange={(e) => setArticlesPerRun(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>Skor ≥ {autoPublishThreshold}:</span>
                  <span className="font-semibold text-green-600">Auto-publish</span>
                </div>
                <div className="flex justify-between">
                  <span>Skor {reviewThreshold}–{autoPublishThreshold - 1}:</span>
                  <span className="font-semibold text-yellow-600">Kirim ke review</span>
                </div>
                <div className="flex justify-between">
                  <span>{'Skor < '}{reviewThreshold}:</span>
                  <span className="font-semibold text-red-600">Tolak / Regenerasi</span>
                </div>
              </div>

              <button className="w-full bg-[var(--navy)] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[var(--navy-light)] transition-colors flex items-center justify-center gap-2">
                <Settings className="w-4 h-4" />
                Simpan Pengaturan
              </button>
            </div>
          </div>

          {/* Breaking news mode */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">
            <h2 className="font-semibold text-red-700 mb-2 flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4" />
              Mode Breaking News
            </h2>
            <p className="text-xs text-red-600 mb-3">
              Aktifkan untuk merespon berita mendesak di luar jadwal. Pipeline dipercepat, review wajib.
            </p>
            <button className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" />
              Aktifkan Breaking Mode
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
