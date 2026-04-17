'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Play, Zap, Clock, CheckCircle, AlertCircle,
  RefreshCw, Settings, TrendingUp, Globe, Cpu,
  FileText, ShieldCheck, Send, BarChart3,
} from 'lucide-react'
import { formatDistanceToNow, formatTime } from '@/lib/date-utils'
import { cn } from '@/lib/utils'

// ── Types ────────────────────────────────────────────────────
interface WorkflowLog {
  step: string; message: string
  level: 'info' | 'warn' | 'error' | 'success'
  timestamp: string
}
interface WorkflowRun {
  id: string; runType: string; status: string
  startedAt: string; completedAt: string | null
  articlesPublished: number; articlesReviewed: number; articlesRejected: number
  logs: WorkflowLog[]
}
interface Settings {
  autoPublishThreshold: number; reviewThreshold: number
  dailyRunTimes: string[]; breakingNewsEnabled: boolean
}
interface Toast { msg: string; type: 'success' | 'error' | 'info' }

// ── Static config ────────────────────────────────────────────
const STEP_ICONS: Record<string, React.ElementType> = {
  'Source Ingestion': Globe, 'Pre-filter': ShieldCheck,
  'Topic Clustering': TrendingUp, 'Hotness Scoring': BarChart3,
  'Topic Selection': CheckCircle, 'Fact Extraction': FileText,
  'Cross-check': ShieldCheck, 'Article Generation': Cpu,
  'SEO Packaging': TrendingUp, 'Quality Gate': ShieldCheck,
  Publish: Send, Indexing: Globe, Workflow: Zap,
}
const STATUS_COLORS: Record<string, string> = {
  running:   'border-blue-300 bg-blue-50 text-blue-700',
  completed: 'border-green-300 bg-green-50 text-green-700',
  failed:    'border-red-300 bg-red-50 text-red-700',
  partial:   'border-yellow-300 bg-yellow-50 text-yellow-700',
}
const LOG_COLORS: Record<string, string> = {
  info: 'text-slate-500', warn: 'text-yellow-600',
  error: 'text-red-600', success: 'text-green-600',
}
const LOG_DOTS: Record<string, string> = {
  info: 'bg-slate-300', warn: 'bg-yellow-400',
  error: 'bg-red-500', success: 'bg-green-500',
}
const PIPELINE_STEPS = [
  { id: 1, name: 'Source Ingestion',    desc: 'Ambil berita dari 12 sumber terkonfigurasi' },
  { id: 2, name: 'Pre-filter',          desc: 'Buang artikel tipis, terlalu lama, tidak relevan' },
  { id: 3, name: 'Topic Clustering',    desc: 'Gabungkan artikel yang membahas isu sama' },
  { id: 4, name: 'Hotness Scoring',     desc: 'Hitung skor urgensi dan potensi viral tiap topik' },
  { id: 5, name: 'Topic Selection',     desc: 'Pilih 5–10 topik terbaik untuk ditulis' },
  { id: 6, name: 'Fact Extraction',     desc: 'Ekstrak fakta inti dari setiap topik terpilih' },
  { id: 7, name: 'Cross-check',         desc: 'Bandingkan minimal 2 sumber untuk tiap klaim' },
  { id: 8, name: 'Article Generation',  desc: 'Tulis artikel orisinal berbasis fakta' },
  { id: 9, name: 'SEO Packaging',       desc: 'Buat meta, slug, keyword, schema' },
  { id: 10, name: 'Quality Gate',       desc: 'Nilai dan putuskan: auto-publish / review / tolak' },
  { id: 11, name: 'Publish',            desc: 'Simpan ke database dan tampilkan ke website' },
  { id: 12, name: 'Indexing',           desc: 'Update sitemap, RSS, trending, feeds' },
]

const RUN_TYPE_MAP: Record<string, string> = {
  daily_main: 'Run Utama Harian', daily_noon: 'Run Siang',
  daily_evening: 'Run Sore', breaking: 'Breaking News', manual: 'Manual',
}

export default function AdminWorkflowPage() {
  // Run form
  const [runType, setRunType]     = useState<'daily_main' | 'breaking' | 'manual'>('daily_main')
  const [topics, setTopics]       = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [activeRunId, setActiveRunId] = useState<string | null>(null)
  const [liveLog, setLiveLog]     = useState<WorkflowLog[]>([])
  const [liveStatus, setLiveStatus] = useState<string>('running')
  const [currentStep, setCurrentStep] = useState('')
  const pollRef = useRef<NodeJS.Timeout | null>(null)

  // History
  const [runs, setRuns]       = useState<WorkflowRun[]>([])
  const [runsLoading, setRunsLoading] = useState(true)

  // Settings
  const [autoPublishThreshold, setAutoPublishThreshold] = useState(85)
  const [reviewThreshold, setReviewThreshold]           = useState(70)
  const [articlesPerRun, setArticlesPerRun]             = useState(8)
  const [dailyRun06, setDailyRun06]                     = useState(true)
  const [dailyRun12, setDailyRun12]                     = useState(true)
  const [dailyRun18, setDailyRun18]                     = useState(false)
  const [breakingEnabled, setBreakingEnabled]           = useState(true)
  const [savingSettings, setSavingSettings]             = useState(false)
  const [activatingBreaking, setActivatingBreaking]     = useState(false)

  const [toast, setToast] = useState<Toast | null>(null)
  const showToast = (msg: string, type: Toast['type'] = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4000)
  }

  // ── Load settings on mount ───────────────────────────────
  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(({ settings }: { settings: Settings }) => {
        if (!settings) return
        setAutoPublishThreshold(settings.autoPublishThreshold ?? 85)
        setReviewThreshold(settings.reviewThreshold ?? 70)
        setBreakingEnabled(settings.breakingNewsEnabled ?? true)
        const times: string[] = settings.dailyRunTimes ?? []
        setDailyRun06(times.includes('06:00') || times.includes('06:30'))
        setDailyRun12(times.includes('12:00'))
        setDailyRun18(times.includes('18:00'))
      })
      .catch(() => {/* silently fallback to defaults */})
  }, [])

  // ── Load run history on mount ────────────────────────────
  const loadRuns = () => {
    setRunsLoading(true)
    fetch('/api/workflow/runs')
      .then(r => r.json())
      .then(d => setRuns(d.runs ?? []))
      .catch(() => showToast('Gagal memuat riwayat workflow', 'error'))
      .finally(() => setRunsLoading(false))
  }
  useEffect(() => { loadRuns() }, []) // eslint-disable-line

  // ── Poll active run ──────────────────────────────────────
  const startPolling = (runId: string) => {
    if (pollRef.current) clearInterval(pollRef.current)
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/workflow/run?id=${runId}`)
        const { run, logs } = await res.json()
        setLiveLog(logs ?? [])
        setLiveStatus(run.status)
        // Latest step from last log
        if (logs?.length > 0) {
          setCurrentStep(logs[logs.length - 1].step)
        }
        if (run.status !== 'running') {
          clearInterval(pollRef.current!)
          pollRef.current = null
          setIsRunning(false)
          loadRuns()
          showToast(
            run.status === 'completed'
              ? `Workflow selesai — ${run.articles_published} artikel terbit`
              : `Workflow ${run.status}`,
            run.status === 'completed' ? 'success' : 'error'
          )
        }
      } catch {
        clearInterval(pollRef.current!)
        pollRef.current = null
        setIsRunning(false)
      }
    }, 3000) // poll every 3s
  }

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current) }, [])

  // ── 3.1 Run Workflow ─────────────────────────────────────
  const handleRunWorkflow = async () => {
    setIsRunning(true)
    setLiveLog([])
    setLiveStatus('running')
    setCurrentStep('Memulai…')
    try {
      const res = await fetch('/api/workflow/run', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ runType, topics }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setActiveRunId(data.runId)
      startPolling(data.runId)
      showToast('Workflow dimulai', 'info')
    } catch (e: unknown) {
      setIsRunning(false)
      showToast((e as Error).message || 'Gagal memulai workflow', 'error')
    }
  }

  // ── 3.2a Simpan Pengaturan ───────────────────────────────
  const handleSaveSettings = async () => {
    setSavingSettings(true)
    const dailyRunTimes: string[] = [
      ...(dailyRun06 ? ['06:00'] : []),
      ...(dailyRun12 ? ['12:00'] : []),
      ...(dailyRun18 ? ['18:00'] : []),
    ]
    try {
      const res = await fetch('/api/settings', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          autoPublishThreshold,
          reviewThreshold,
          dailyRunEnabled: dailyRunTimes.length > 0,
          dailyRunTimes,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      showToast('Pengaturan berhasil disimpan')
    } catch (e: unknown) {
      showToast((e as Error).message || 'Gagal menyimpan pengaturan', 'error')
    } finally {
      setSavingSettings(false)
    }
  }

  // ── 3.2b Aktifkan Breaking Mode ──────────────────────────
  const handleActivateBreaking = async () => {
    setActivatingBreaking(true)
    try {
      // 1. Enable breaking in settings
      await fetch('/api/settings', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ breakingNewsEnabled: true }),
      })
      // 2. Immediately trigger a breaking run
      const res = await fetch('/api/workflow/run', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ runType: 'breaking' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setBreakingEnabled(true)
      setActiveRunId(data.runId)
      setIsRunning(true)
      setLiveLog([])
      setLiveStatus('running')
      setRunType('breaking')
      startPolling(data.runId)
      showToast('Breaking Mode aktif — pipeline berjalan', 'info')
    } catch (e: unknown) {
      showToast((e as Error).message || 'Gagal mengaktifkan Breaking Mode', 'error')
    } finally {
      setActivatingBreaking(false)
    }
  }

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="p-6 space-y-6">
      {/* Toast */}
      {toast && (
        <div className={cn(
          'fixed top-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 transition-all',
          toast.type === 'success' ? 'bg-green-600 text-white'
          : toast.type === 'error' ? 'bg-red-600 text-white'
          : 'bg-blue-600 text-white'
        )}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4" />
          : toast.type === 'error' ? <AlertCircle className="w-4 h-4" />
          : <RefreshCw className="w-4 h-4 animate-spin" />}
          {toast.msg}
        </div>
      )}

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
        {/* ── Left ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Manual run panel */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Play className="w-4 h-4 text-[var(--navy)]" />
              Jalankan Workflow Manual
            </h2>

            <div className="flex items-center gap-3 mb-5">
              {[
                { key: 'daily_main', label: 'Run Utama',           desc: 'Berita harian lengkap (semua langkah)' },
                { key: 'breaking',   label: 'Breaking News',       desc: 'Mode cepat untuk berita mendesak'      },
                { key: 'manual',     label: 'Manual Pilih Topik',  desc: 'Input topik spesifik sendiri'          },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setRunType(opt.key as typeof runType)}
                  disabled={isRunning}
                  className={cn(
                    'flex-1 text-left px-4 py-3 rounded-lg border-2 transition-all text-sm disabled:opacity-50',
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
                  value={topics}
                  onChange={e => setTopics(e.target.value)}
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
                isRunning ? 'bg-slate-400 cursor-not-allowed' : 'bg-[var(--navy)] hover:bg-[var(--navy-light)]'
              )}
            >
              {isRunning
                ? <><RefreshCw className="w-4 h-4 animate-spin" /> Workflow Berjalan...</>
                : <><Play className="w-4 h-4" /> Jalankan Sekarang</>}
            </button>

            {/* Live progress */}
            {isRunning && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-700 text-sm font-semibold mb-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Workflow sedang berjalan…
                </div>
                <div className="w-full h-1.5 bg-blue-100 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-blue-500 rounded-full animate-pulse w-1/3" />
                </div>
                <p className="text-xs text-blue-600 mb-3">
                  Step terkini: <span className="font-semibold">{currentStep}</span>
                </p>
                {/* Scrollable live log */}
                {liveLog.length > 0 && (
                  <div className="bg-white/70 rounded-lg p-3 max-h-36 overflow-y-auto space-y-1.5 border border-blue-100">
                    {liveLog.slice(-20).map((log, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <span className={cn('w-1.5 h-1.5 rounded-full mt-1.5 shrink-0', LOG_DOTS[log.level])} />
                        <span className="text-slate-400 font-mono shrink-0">{formatTime(log.timestamp)}</span>
                        <span className="text-slate-500 font-medium shrink-0">[{log.step}]</span>
                        <span className={LOG_COLORS[log.level]}>{log.message}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Completed run summary */}
            {!isRunning && activeRunId && liveStatus !== 'running' && (
              <div className={cn(
                'mt-4 rounded-lg p-4 border text-sm font-semibold flex items-center gap-2',
                STATUS_COLORS[liveStatus]
              )}>
                {liveStatus === 'completed'
                  ? <CheckCircle className="w-4 h-4" />
                  : <AlertCircle className="w-4 h-4" />}
                Run {liveStatus === 'completed' ? 'selesai' : liveStatus} —
                {liveLog.length} log entries
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
                // Highlight active step during run
                const isActive = isRunning && currentStep === step.name
                return (
                  <div
                    key={step.id}
                    className={cn(
                      'flex items-start gap-2.5 p-3 rounded-lg border transition-colors',
                      isActive
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-slate-50 border-slate-100'
                    )}
                  >
                    <div className={cn(
                      'w-7 h-7 rounded-full text-white text-xs flex items-center justify-center font-bold shrink-0',
                      isActive ? 'bg-blue-500' : 'bg-[var(--navy)]'
                    )}>
                      {isActive ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : step.id}
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

          {/* Run history */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <h2 className="font-semibold text-slate-700 text-sm">Riwayat Workflow Run</h2>
              </div>
              <button
                onClick={loadRuns}
                className="p-1.5 text-slate-400 hover:text-[var(--navy)] hover:bg-slate-100 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className={cn('w-3.5 h-3.5', runsLoading && 'animate-spin')} />
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {runsLoading ? (
                <div className="px-5 py-8 text-center text-sm text-slate-400">
                  <Clock className="w-5 h-5 animate-spin mx-auto mb-2" />
                  Memuat riwayat…
                </div>
              ) : runs.length === 0 ? (
                <div className="px-5 py-8 text-center text-sm text-slate-400">
                  Belum ada riwayat workflow.
                </div>
              ) : (
                runs.map((run) => (
                  <details key={run.id} className="group">
                    <summary className="flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-slate-50 transition-colors list-none">
                      <div className="flex items-center gap-3">
                        <span className={cn('text-xs font-semibold px-2 py-0.5 rounded border', STATUS_COLORS[run.status])}>
                          {run.status === 'completed' ? 'Selesai'
                          : run.status === 'running'   ? 'Berjalan'
                          : run.status === 'failed'    ? 'Gagal'
                          : run.status}
                        </span>
                        <span className="text-sm text-slate-700 font-medium">
                          {RUN_TYPE_MAP[run.runType] || run.runType}
                        </span>
                        <span className="text-xs text-slate-500">
                          {formatDistanceToNow(run.startedAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="text-green-600 font-semibold">+{run.articlesPublished} terbit</span>
                        <span>{run.articlesReviewed} review</span>
                        <span className="text-red-500">{run.articlesRejected} tolak</span>
                      </div>
                    </summary>
                    <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 space-y-1.5 max-h-48 overflow-y-auto">
                      {run.logs.length === 0 ? (
                        <p className="text-xs text-slate-400">Tidak ada log.</p>
                      ) : (
                        run.logs.map((log, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs">
                            <span className={cn('w-1.5 h-1.5 rounded-full mt-1.5 shrink-0', LOG_DOTS[log.level])} />
                            <span className="text-slate-400 font-mono shrink-0">{formatTime(log.timestamp)}</span>
                            <span className="text-slate-500 font-medium shrink-0">[{log.step}]</span>
                            <span className={LOG_COLORS[log.level]}>{log.message}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </details>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ── Right ── */}
        <div className="space-y-5">
          {/* Schedule config */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--navy)]" />
              Jadwal Auto-Run
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Pagi — 06:00 WIB',  value: dailyRun06, setter: setDailyRun06, desc: 'Run utama harian'  },
                { label: 'Siang — 12:00 WIB', value: dailyRun12, setter: setDailyRun12, desc: 'Update siang'      },
                { label: 'Sore — 18:00 WIB',  value: dailyRun18, setter: setDailyRun18, desc: 'Update sore'       },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => item.setter(!item.value)}
                    className={cn('w-10 h-5 rounded-full transition-colors relative', item.value ? 'bg-green-500' : 'bg-slate-300')}
                  >
                    <span className={cn(
                      'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform',
                      item.value ? 'translate-x-5' : 'translate-x-0.5'
                    )} />
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
                  <label className="text-xs font-semibold text-slate-600">Auto-Publish jika skor ≥</label>
                  <span className="text-xs font-bold text-green-600">{autoPublishThreshold}</span>
                </div>
                <input type="range" min={70} max={100} value={autoPublishThreshold}
                  onChange={e => setAutoPublishThreshold(Number(e.target.value))}
                  className="w-full accent-green-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>70</span><span>100</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-600">Kirim ke Review jika skor ≥</label>
                  <span className="text-xs font-bold text-yellow-600">{reviewThreshold}</span>
                </div>
                <input type="range" min={50} max={85} value={reviewThreshold}
                  onChange={e => setReviewThreshold(Number(e.target.value))}
                  className="w-full accent-yellow-500"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-600">Artikel per Run</label>
                  <span className="text-xs font-bold text-[var(--navy)]">{articlesPerRun}</span>
                </div>
                <input type="range" min={3} max={20} value={articlesPerRun}
                  onChange={e => setArticlesPerRun(Number(e.target.value))}
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

              {/* 3.2a Simpan Pengaturan */}
              <button
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="w-full bg-[var(--navy)] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[var(--navy-light)] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {savingSettings
                  ? <><RefreshCw className="w-4 h-4 animate-spin" /> Menyimpan…</>
                  : <><Settings className="w-4 h-4" /> Simpan Pengaturan</>}
              </button>
            </div>
          </div>

          {/* 3.2b Breaking Mode */}
          <div className={cn(
            'rounded-xl p-5 border transition-colors',
            breakingEnabled ? 'bg-red-50 border-red-300' : 'bg-red-50 border-red-200'
          )}>
            <h2 className="font-semibold text-red-700 mb-2 flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4" />
              Mode Breaking News
              {breakingEnabled && (
                <span className="ml-auto text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-bold uppercase">
                  AKTIF
                </span>
              )}
            </h2>
            <p className="text-xs text-red-600 mb-3">
              Aktifkan untuk merespon berita mendesak di luar jadwal. Pipeline dipercepat, review wajib.
            </p>
            <button
              onClick={handleActivateBreaking}
              disabled={activatingBreaking || isRunning}
              className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {activatingBreaking
                ? <><RefreshCw className="w-4 h-4 animate-spin" /> Mengaktifkan…</>
                : <><Zap className="w-4 h-4" /> Aktifkan Breaking Mode</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
