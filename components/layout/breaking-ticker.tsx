'use client'

import Link from 'next/link'
import { Zap } from 'lucide-react'
import { getBreakingArticles } from '@/lib/mock-data'

export function BreakingTicker() {
  const breaking = getBreakingArticles()

  if (breaking.length === 0) return null

  const tickerText = breaking
    .map((a, i) => `${i + 1}. ${a.title}`)
    .join('     ///     ')

  return (
    <div className="bg-[var(--red)] text-white flex items-center overflow-hidden" role="marquee" aria-label="Berita terkini">
      {/* Label */}
      <div className="flex items-center gap-1.5 bg-red-800 px-4 py-2 shrink-0 z-10 font-bold text-sm tracking-wide uppercase">
        <Zap className="w-3.5 h-3.5 fill-current" />
        <span>Breaking</span>
      </div>

      {/* Ticker */}
      <div className="overflow-hidden flex-1 py-2 relative">
        <div className="ticker-animate inline-block text-sm font-medium whitespace-nowrap">
          {tickerText}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {tickerText}
        </div>
      </div>

      {/* View all */}
      <Link
        href="/trending"
        className="shrink-0 px-4 py-2 text-xs font-semibold bg-red-800 hover:bg-red-900 transition-colors whitespace-nowrap"
      >
        Lihat Semua
      </Link>
    </div>
  )
}
