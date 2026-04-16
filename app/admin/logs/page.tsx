'use client'

import { useState } from 'react'
import { Activity, Filter, RefreshCw, Download, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'
import { WORKFLOW_RUNS } from '@/lib/mock-data'
import { formatDateTime, formatTime } from '@/lib/date-utils'
import { cn } from '@/lib/utils'

const LEVEL_CONFIG = {
  info:    { icon: Info,          dot: 'bg-slate-400', text: 'text-slate-600',  badge: 'bg-slate-100 text-slate-600 border-slate-200' },
  success: { icon: CheckCircle,   dot: 'bg-green-500', text: 'text-green-700',  badge: 'bg-green-100 text-green-700 border-green-200'  },
  warn:    { icon: AlertTriangle, dot: 'bg-yellow-500',text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-700 border-yellow-200'},
  error:   { icon: AlertCircle,   dot: 'bg-red-500',   text: 'text-red-700',    badge: 'bg-red-100 text-red-700 border-red-200'        },
}

export default function LogsPage() {
  const [filterLevel, setFilterLevel] = useState<'all' | 'info' | 'success' | 'warn' | 'error'>('all')
  const [filterRun, setFilterRun] = useState('all')

  const allLogs = WORKFLOW_RUNS.flatMap((run) =>
    run.logs.map((log) => ({ ...log, runId: run.id, runType: run.runType }))
  )

  const filtered = allLogs.filter((log) => {
    if (filterLevel !== 'all' && log.level !== filterLevel) return false
    if (filterRun !== 'all' && log.runId !== filterRun) return false
    return true
  })

  const counts = {
    all:     allLogs.length,
    info:    allLogs.filter((l) => l.level === 'info').length,
    success: allLogs.filter((l) => l.level === 'success').length,
    warn:    allLogs.filter((l) => l.level === 'warn').length,
    error:   allLogs.filter((l) => l.level === 'error').length,
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-6 h-6 text-[var(--navy)]" />
            Log Aktivitas Sistem
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Rekam jejak lengkap workflow automation dan operasi sistem
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 text-sm bg-white border border-border px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-600">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button className="flex items-center gap-2 text-sm bg-white border border-border px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-600">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Level filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {(['all', 'success', 'info', 'warn', 'error'] as const).map((level) => {
          const cfg = level === 'all' ? null : LEVEL_CONFIG[level]
          const isActive = filterLevel === level
          return (
            <button
              key={level}
              onClick={() => setFilterLevel(level)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors',
                isActive
                  ? level === 'all'
                    ? 'bg-[var(--navy)] text-white border-[var(--navy)]'
                    : cn(cfg?.badge, 'border')
                  : 'bg-white text-slate-500 border-border hover:bg-slate-50'
              )}
            >
              {cfg && <span className={cn('w-2 h-2 rounded-full', cfg.dot)} />}
              <span className="capitalize">{level === 'all' ? 'Semua' : level}</span>
              <span className="bg-white/40 text-xs px-1.5 py-0.5 rounded-full font-bold">
                {counts[level]}
              </span>
            </button>
          )
        })}

        <div className="ml-auto flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterRun}
            onChange={(e) => setFilterRun(e.target.value)}
            className="text-sm border border-border rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--navy)]"
          >
            <option value="all">Semua Run</option>
            {WORKFLOW_RUNS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.id} — {r.runType}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Log stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Entri Log', value: counts.all, color: 'text-slate-700' },
          { label: 'Sukses', value: counts.success, color: 'text-green-600' },
          { label: 'Peringatan', value: counts.warn, color: 'text-yellow-600' },
          { label: 'Error', value: counts.error, color: 'text-red-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-border rounded-xl p-4">
            <p className={`text-2xl font-bold font-serif ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Workflow run summaries */}
      <div className="space-y-4">
        {WORKFLOW_RUNS.map((run) => {
          const runLogs = run.logs.filter((l) => {
            if (filterLevel !== 'all' && l.level !== filterLevel) return false
            if (filterRun !== 'all' && run.id !== filterRun) return false
            return true
          })

          if (filterRun !== 'all' && run.id !== filterRun) return null
          if (runLogs.length === 0 && filterLevel !== 'all') return null

          return (
            <div key={run.id} className="bg-white border border-border rounded-xl overflow-hidden">
              {/* Run header */}
              <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b border-border">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-700 font-mono">{run.id}</span>
                  <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full capitalize font-medium">
                    {run.runType.replace(/_/g, ' ')}
                  </span>
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full border font-semibold',
                    run.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' :
                    run.status === 'failed'    ? 'bg-red-100 text-red-700 border-red-200' :
                    run.status === 'running'   ? 'bg-blue-100 text-blue-700 border-blue-200' :
                    'bg-yellow-100 text-yellow-700 border-yellow-200'
                  )}>
                    {run.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>Mulai: {formatDateTime(run.startedAt)}</span>
                  {run.completedAt && <span>Selesai: {formatTime(run.completedAt)}</span>}
                  <span className="font-semibold text-slate-700">{runLogs.length} entri</span>
                </div>
              </div>

              {/* Log entries */}
              <div className="divide-y divide-slate-50">
                {runLogs.map((log, idx) => {
                  const cfg = LEVEL_CONFIG[log.level]
                  const Icon = cfg.icon
                  return (
                    <div key={idx} className="flex items-start gap-3 px-5 py-2.5 hover:bg-slate-50 transition-colors">
                      <Icon className={cn('w-3.5 h-3.5 mt-0.5 shrink-0', cfg.text)} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={cn('text-xs font-bold border px-1.5 py-0.5 rounded', cfg.badge)}>
                            {log.level.toUpperCase()}
                          </span>
                          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                            {log.step}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">{formatTime(log.timestamp)}</span>
                        </div>
                        <p className="text-sm text-slate-700 mt-1 leading-snug">{log.message}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Run stats footer */}
              <div className="flex items-center gap-6 px-5 py-3 bg-slate-50 border-t border-border text-xs text-slate-500">
                <span>Sumber: <strong>{run.sourcesIngested}</strong></span>
                <span>Kluster: <strong>{run.topicsClustered}</strong></span>
                <span>Digenerate: <strong>{run.articlesGenerated}</strong></span>
                <span className="text-green-600">Terbit: <strong>{run.articlesPublished}</strong></span>
                <span className="text-yellow-600">Review: <strong>{run.articlesReviewed}</strong></span>
                <span className="text-red-600">Ditolak: <strong>{run.articlesRejected}</strong></span>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <Activity className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="font-semibold">Tidak ada log yang cocok dengan filter ini</p>
          <p className="text-sm mt-1">Coba ubah filter level atau run ID</p>
        </div>
      )}
    </div>
  )
}
