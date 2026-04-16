'use client'

import { TrendingUp, Flame, RefreshCw, ExternalLink, Zap } from 'lucide-react'
import { TRENDING_TOPICS } from '@/lib/mock-data'
import { formatDistanceToNow } from '@/lib/date-utils'
import Link from 'next/link'
import { cn } from '@/lib/utils'

function HotnessBar({ value }: { value: number }) {
  const color =
    value >= 90 ? 'bg-red-500' :
    value >= 75 ? 'bg-orange-500' :
    value >= 60 ? 'bg-yellow-500' : 'bg-slate-400'
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-sm font-bold text-slate-700">{value}</span>
    </div>
  )
}

export default function TrendingAdminPage() {
  const sorted = [...TRENDING_TOPICS].sort((a, b) => b.hotness - a.hotness)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[var(--navy)]" />
            Topik Trending
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {TRENDING_TOPICS.length} topik aktif — diurutkan berdasarkan skor kepanasan
          </p>
        </div>
        <button className="flex items-center gap-2 text-sm bg-white border border-border px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-600">
          <RefreshCw className="w-4 h-4" />
          Recalculate Hotness
        </button>
      </div>

      {/* Top 3 featured */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sorted.slice(0, 3).map((topic, idx) => (
          <div
            key={topic.id}
            className={cn(
              'rounded-xl p-5 border',
              idx === 0 ? 'bg-red-50 border-red-200' :
              idx === 1 ? 'bg-orange-50 border-orange-200' :
              'bg-yellow-50 border-yellow-200'
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={cn(
                'text-3xl font-bold font-serif opacity-20',
                idx === 0 ? 'text-red-600' : idx === 1 ? 'text-orange-600' : 'text-yellow-600'
              )}>
                #{idx + 1}
              </span>
              <div className="flex items-center gap-1">
                <Flame className={cn(
                  'w-5 h-5',
                  idx === 0 ? 'text-red-500' : idx === 1 ? 'text-orange-500' : 'text-yellow-500'
                )} />
                <span className="font-bold text-lg">{topic.hotness}</span>
              </div>
            </div>
            <h3 className="font-serif font-bold text-slate-800 text-base leading-snug mb-2">
              {topic.title}
            </h3>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium">{topic.category}</span>
              <span>{topic.articleCount} artikel</span>
            </div>
          </div>
        ))}
      </div>

      {/* Full table */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-slate-50 flex items-center justify-between">
          <h2 className="font-serif font-bold text-sm text-slate-700">Semua Topik Trending</h2>
          <button className="flex items-center gap-1.5 text-xs text-[var(--navy)] font-semibold hover:text-[var(--red)] transition-colors">
            <Zap className="w-3.5 h-3.5" />
            Generate Artikel dari Topik
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-slate-500 uppercase tracking-wider">
              <th className="px-4 py-3 text-left">Rank</th>
              <th className="px-4 py-3 text-left">Topik</th>
              <th className="px-4 py-3 text-left">Kategori</th>
              <th className="px-4 py-3 text-left">Skor Hotness</th>
              <th className="px-4 py-3 text-center">Artikel</th>
              <th className="px-4 py-3 text-left">Kata Kunci</th>
              <th className="px-4 py-3 text-left">Diperbarui</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sorted.map((topic, idx) => (
              <tr key={topic.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <span className="font-bold text-slate-400 font-serif text-lg">#{idx + 1}</span>
                </td>
                <td className="px-4 py-3 font-semibold text-slate-800 max-w-xs">
                  {topic.title}
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-medium">
                    {topic.category}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <HotnessBar value={topic.hotness} />
                </td>
                <td className="px-4 py-3 text-center font-bold text-[var(--navy)]">
                  {topic.articleCount}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {topic.keywords.slice(0, 2).map((kw) => (
                      <span key={kw} className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                        {kw}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {formatDistanceToNow(topic.lastUpdated)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <Link
                      href={`/trending`}
                      target="_blank"
                      className="p-1.5 text-slate-400 hover:text-[var(--navy)] transition-colors rounded"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <button className="p-1.5 text-slate-400 hover:text-green-600 transition-colors rounded text-xs font-bold">
                      <Zap className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
