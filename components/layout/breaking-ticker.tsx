'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Zap } from 'lucide-react'

interface Article { title: string; slug: string }

export function BreakingTicker() {
  const [breaking, setBreaking] = useState<Article[]>([])

  useEffect(() => {
    fetch('/api/articles?status=published&pageSize=5')
      .then(r => r.json())
      .then(d => {
        // Ambil artikel breaking, fallback ke 5 terbaru
        const arts: Article[] = d.articles ?? []
        const breakingArts = arts.filter((a: Article & { isBreaking?: boolean }) => a.isBreaking)
        setBreaking(breakingArts.length > 0 ? breakingArts : arts.slice(0, 5))
      })
      .catch(() => {})
  }, [])

  if (breaking.length === 0) return null

  const tickerText = breaking.map((a, i) => `${i + 1}. ${a.title}`).join('     ///     ')

  return (
    <div className="bg-[var(--red)] text-white flex items-center overflow-hidden" role="marquee" aria-label="Berita terkini">
      <div className="flex items-center gap-1.5 bg-red-800 px-4 py-2 shrink-0 z-10 font-bold text-sm tracking-wide uppercase">
        <Zap className="w-3.5 h-3.5 fill-current" />
        <span>Breaking</span>
      </div>
      <div className="overflow-hidden flex-1 py-2 relative">
        <div className="ticker-animate inline-block text-sm font-medium whitespace-nowrap">
          {tickerText}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{tickerText}
        </div>
      </div>
      <Link href="/trending" className="shrink-0 px-4 py-2 text-xs font-semibold bg-red-800 hover:bg-red-900 transition-colors whitespace-nowrap">
        Lihat Semua
      </Link>
    </div>
  )
}
