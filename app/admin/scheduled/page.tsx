'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Calendar,
  Clock,
  Edit3,
  Trash2,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from 'lucide-react'
import { ARTICLES } from '@/lib/mock-data'
import { formatDate } from '@/lib/date-utils'
import { cn } from '@/lib/utils'

// Simulate scheduled articles by using published + adding scheduledAt
const SCHEDULED_ARTICLES = ARTICLES.filter((a) => a.status === 'published').slice(0, 3).map((a, i) => ({
  ...a,
  status: 'scheduled' as const,
  scheduledAt: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toISOString(),
  publishedAt: undefined,
}))

// Combine with any real scheduled articles from ARTICLES
const ALL_SCHEDULED = [
  ...SCHEDULED_ARTICLES,
  ...ARTICLES.filter((a) => a.status === 'scheduled'),
]

export default function AdminScheduledPage() {
  const [view, setView] = useState<'list' | 'calendar'>('list')

  const today = new Date()
  const grouped: Record<string, typeof ALL_SCHEDULED> = {}
  ALL_SCHEDULED.forEach((a) => {
    const key = a.scheduledAt
      ? new Date(a.scheduledAt).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      : 'Tidak Terjadwal'
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(a)
  })

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-serif font-bold text-slate-800">Artikel Terjadwal</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Artikel yang sudah disetujui dan akan terbit otomatis sesuai jadwal.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-sm">
            <button
              onClick={() => setView('list')}
              className={cn(
                'px-3 py-1.5 rounded-md font-medium transition-colors',
                view === 'list' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              )}
            >
              List
            </button>
            <button
              onClick={() => setView('calendar')}
              className={cn(
                'px-3 py-1.5 rounded-md font-medium transition-colors',
                view === 'calendar' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              )}
            >
              Kalender
            </button>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Terjadwal', value: ALL_SCHEDULED.length, color: 'text-blue-600 bg-blue-50 border-blue-100' },
          { label: 'Hari ini', value: ALL_SCHEDULED.filter((a) => a.scheduledAt && new Date(a.scheduledAt).toDateString() === today.toDateString()).length, color: 'text-green-600 bg-green-50 border-green-100' },
          { label: 'Minggu ini', value: ALL_SCHEDULED.filter((a) => {
            if (!a.scheduledAt) return false
            const d = new Date(a.scheduledAt)
            const diff = (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
            return diff >= 0 && diff <= 7
          }).length, color: 'text-purple-600 bg-purple-50 border-purple-100' },
          { label: 'Bulan ini', value: ALL_SCHEDULED.filter((a) => {
            if (!a.scheduledAt) return false
            const d = new Date(a.scheduledAt)
            return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()
          }).length, color: 'text-amber-600 bg-amber-50 border-amber-100' },
        ].map((s) => (
          <div key={s.label} className={cn('border rounded-xl p-4', s.color)}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* List view */}
      {view === 'list' && (
        <div className="space-y-4">
          {ALL_SCHEDULED.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
              <CalendarDays className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="font-semibold text-slate-600">Tidak ada artikel terjadwal</p>
              <p className="text-sm text-slate-400 mt-1">Approve artikel dari review queue untuk menjadwalkan.</p>
            </div>
          ) : (
            Object.entries(grouped).map(([date, articles]) => (
              <div key={date}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    <Calendar className="w-3.5 h-3.5" />
                    {date}
                  </div>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
                <div className="space-y-2">
                  {articles.map((article) => (
                    <div
                      key={article.id}
                      className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 hover:border-slate-300 hover:shadow-sm transition-all"
                    >
                      {/* Time badge */}
                      <div className="shrink-0 text-center bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 min-w-[64px]">
                        <div className="text-xs text-blue-500 font-semibold">
                          {article.scheduledAt
                            ? new Date(article.scheduledAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                            : '--:--'}
                        </div>
                        <div className="text-[10px] text-blue-400 mt-0.5">WIB</div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span
                            className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded text-white"
                            style={{ backgroundColor: article.category.color }}
                          >
                            {article.category.name}
                          </span>
                        </div>
                        <p className="font-semibold text-slate-700 text-sm leading-snug line-clamp-1">
                          {article.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                          <span>{article.wordCount} kata</span>
                          <span>Skor: <span className={article.publishReadinessScore >= 85 ? 'text-green-600' : 'text-yellow-600'}>{article.publishReadinessScore}</span></span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="shrink-0 flex items-center gap-1.5">
                        <button
                          className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                          title="Terbitkan sekarang"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Tunda"
                        >
                          <Pause className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/admin/articles/${article.id}`}
                          className="p-1.5 text-slate-400 hover:text-[var(--navy)] hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus jadwal"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Calendar view (simple month grid) */}
      {view === 'calendar' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          {/* Calendar header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
            <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
              <ChevronLeft className="w-4 h-4 text-slate-500" />
            </button>
            <h2 className="font-serif font-bold text-slate-800">
              {today.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
            </h2>
            <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d) => (
              <div key={d} className="px-2 py-2 text-center text-xs font-semibold text-slate-500">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7">
            {Array.from({ length: 35 }, (_, i) => {
              const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay()
              const dayNum = i - firstDay + 1
              const isCurrentMonth = dayNum > 0 && dayNum <= new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
              const isToday = dayNum === today.getDate() && isCurrentMonth
              const hasArticle = ALL_SCHEDULED.some((a) => {
                if (!a.scheduledAt) return false
                const d = new Date(a.scheduledAt)
                return d.getDate() === dayNum && d.getMonth() === today.getMonth()
              })
              const articleCount = ALL_SCHEDULED.filter((a) => {
                if (!a.scheduledAt) return false
                const d = new Date(a.scheduledAt)
                return d.getDate() === dayNum && d.getMonth() === today.getMonth()
              }).length

              return (
                <div
                  key={i}
                  className={cn(
                    'min-h-[60px] p-2 border-b border-r border-slate-100 text-xs',
                    !isCurrentMonth && 'bg-slate-50/50',
                    isToday && 'bg-blue-50'
                  )}
                >
                  {isCurrentMonth && (
                    <>
                      <span
                        className={cn(
                          'inline-flex items-center justify-center w-5 h-5 rounded-full font-semibold',
                          isToday ? 'bg-[var(--navy)] text-white' : 'text-slate-600'
                        )}
                      >
                        {dayNum}
                      </span>
                      {hasArticle && (
                        <div className="mt-1">
                          <span className="inline-block bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                            {articleCount} artikel
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
