'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard, FileText, Clock, Eye, CheckCircle,
  Calendar, Tag, FolderOpen, Globe, Zap, TrendingUp,
  Settings, Search, MonitorPlay, Users, ChevronLeft,
  ExternalLink, Rss, Activity, BarChart3, LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Dynamic review badge ───────────────────────────────────────
function useReviewCount() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    const load = () =>
      fetch('/api/articles?status=review&pageSize=1')
        .then(r => r.json())
        .then(d => setCount(d.total ?? 0))
        .catch(() => setCount(null))

    load()
    // Refresh every 60 seconds so badge stays current
    const interval = setInterval(load, 60_000)
    return () => clearInterval(interval)
  }, [])

  return count
}

export function AdminSidebar() {
  const pathname     = usePathname()
  const reviewCount  = useReviewCount()

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  const NAV_GROUPS = [
    {
      label: 'Redaksi',
      items: [
        { label: 'Dashboard',      href: '/admin',           icon: LayoutDashboard },
        { label: 'Semua Artikel',  href: '/admin/articles',  icon: FileText        },
        { label: 'Draft Queue',    href: '/admin/drafts',    icon: Clock           },
        {
          label: 'Review Queue',
          href: '/admin/review',
          icon: Eye,
          // Show badge only when there are articles in review
          badge: reviewCount !== null && reviewCount > 0 ? String(reviewCount) : undefined,
        },
        { label: 'Terjadwal',      href: '/admin/scheduled', icon: Calendar        },
        { label: 'Terbit',         href: '/admin/published', icon: CheckCircle     },
      ],
    },
    {
      label: 'Konten',
      items: [
        { label: 'Kategori',        href: '/admin/categories', icon: FolderOpen  },
        { label: 'Tag',             href: '/admin/tags',       icon: Tag         },
        { label: 'Sumber Berita',   href: '/admin/sources',    icon: Globe       },
        { label: 'Topik Trending',  href: '/admin/trending',   icon: TrendingUp  },
      ],
    },
    {
      label: 'Otomasi',
      items: [
        { label: 'Workflow / Jadwal', href: '/admin/workflow',   icon: Zap      },
        { label: 'Analytics',         href: '/admin/analytics',  icon: BarChart3 },
        { label: 'Log Aktivitas',     href: '/admin/logs',       icon: Activity  },
      ],
    },
    {
      label: 'Pengaturan',
      items: [
        { label: 'SEO',                href: '/admin/seo',       icon: Search      },
        { label: 'Iklan / Monetisasi', href: '/admin/ads',       icon: MonitorPlay },
        { label: 'WordPress Bridge',   href: '/admin/wordpress', icon: Rss         },
        { label: 'Pengguna & Peran',   href: '/admin/users',     icon: Users       },
        { label: 'Pengaturan Situs',   href: '/admin/settings',  icon: Settings    },
      ],
    },
  ]

  return (
    <aside className="w-60 shrink-0 bg-[var(--navy)] min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2 group mb-0.5">
          <span className="font-serif text-xl font-bold text-white">Kabar</span>
          <span className="font-serif text-xl font-bold text-red-400">Kini</span>
        </Link>
        <p className="text-xs text-slate-500 mt-0.5">AI Newsroom Dashboard</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5" aria-label="Admin navigasi">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 px-2 mb-2">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon   = item.icon
                const active = isActive(item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn('admin-nav-link', active && 'active')}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="bg-[var(--red)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none animate-pulse">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom links */}
      <div className="border-t border-white/10 px-3 py-4 space-y-1">
        <Link href="/" target="_blank" className="admin-nav-link text-xs">
          <ExternalLink className="w-3.5 h-3.5" />
          Lihat Website
        </Link>
        <Link href="/admin" className="admin-nav-link text-xs text-slate-600">
          <ChevronLeft className="w-3.5 h-3.5" />
          Kembali ke Dashboard
        </Link>
        <button
          type="button"
          onClick={async () => {
            await fetch('/api/auth/login', { method: 'DELETE' })
            window.location.href = '/admin/login'
          }}
          className="admin-nav-link text-xs w-full text-left"
        >
          <LogOut className="w-3.5 h-3.5" />
          Keluar
        </button>
      </div>
    </aside>
  )
}
