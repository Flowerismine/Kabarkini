'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard, FileText, Clock, Eye, CheckCircle,
  Calendar, Tag, FolderOpen, Globe, Zap, TrendingUp,
  Settings, Search, MonitorPlay, Users,
  ExternalLink, Rss, Activity, BarChart3, LogOut,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

function useReviewCount() {
  const [count, setCount] = useState<number | null>(null)
  useEffect(() => {
    const load = () =>
      fetch('/api/articles?status=review&pageSize=1')
        .then(r => r.json())
        .then(d => setCount(d.total ?? 0))
        .catch(() => setCount(null))
    load()
    const interval = setInterval(load, 60_000)
    return () => clearInterval(interval)
  }, [])
  return count
}

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badge?: string
}

interface NavGroup {
  label: string
  items: NavItem[]
}

export function AdminSidebar() {
  const pathname    = usePathname()
  const reviewCount = useReviewCount()

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  const NAV_GROUPS: NavGroup[] = [
    {
      label: 'Redaksi',
      items: [
        { label: 'Dashboard',     href: '/admin',           icon: LayoutDashboard },
        { label: 'Semua Artikel', href: '/admin/articles',  icon: FileText        },
        { label: 'Draft',         href: '/admin/drafts',    icon: Clock           },
        {
          label: 'Review',
          href: '/admin/review',
          icon: Eye,
          badge: reviewCount !== null && reviewCount > 0 ? String(reviewCount) : undefined,
        },
        { label: 'Terjadwal',     href: '/admin/scheduled', icon: Calendar    },
        { label: 'Terbit',        href: '/admin/published', icon: CheckCircle },
      ],
    },
    {
      label: 'Konten',
      items: [
        { label: 'Kategori',       href: '/admin/categories', icon: FolderOpen },
        { label: 'Tag',            href: '/admin/tags',       icon: Tag        },
        { label: 'Sumber Berita',  href: '/admin/sources',    icon: Globe      },
        { label: 'Topik Trending', href: '/admin/trending',   icon: TrendingUp },
      ],
    },
    {
      label: 'Otomasi',
      items: [
        { label: 'Workflow',      href: '/admin/workflow',  icon: Zap      },
        { label: 'Analytics',     href: '/admin/analytics', icon: BarChart3 },
        { label: 'Log Aktivitas', href: '/admin/logs',      icon: Activity  },
      ],
    },
    {
      label: 'Pengaturan',
      items: [
        { label: 'SEO',            href: '/admin/seo',       icon: Search      },
        { label: 'Iklan',          href: '/admin/ads',       icon: MonitorPlay },
        { label: 'WordPress',      href: '/admin/wordpress', icon: Rss         },
        { label: 'Pengguna',       href: '/admin/users',     icon: Users       },
        { label: 'Pengaturan',     href: '/admin/settings',  icon: Settings    },
      ],
    },
  ]

  return (
    <aside className="w-56 shrink-0 min-h-screen flex flex-col" style={{
      background: 'linear-gradient(180deg, #0a1628 0%, #0f1f3d 40%, #0d1c38 100%)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
    }}>

      {/* Logo */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <Link href="/" className="flex items-center gap-0.5 mb-1 group">
          <span className="font-serif text-[22px] font-bold tracking-tight text-white group-hover:text-slate-200 transition-colors">
            Kabar
          </span>
          <span className="font-serif text-[22px] font-bold tracking-tight text-red-400 group-hover:text-red-300 transition-colors">
            Kini
          </span>
        </Link>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-medium tracking-wide text-slate-500 uppercase">
            AI Newsroom
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4 scrollbar-hide" aria-label="Admin navigasi">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>

            {/* Group label */}
            <div className="flex items-center gap-2 px-2 mb-1.5">
              <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">
                {group.label}
              </span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
            </div>

            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon   = item.icon
                const active = isActive(item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all duration-150 group relative',
                        active
                          ? 'text-white font-semibold'
                          : 'text-slate-400 hover:text-slate-200 font-medium'
                      )}
                      style={active ? {
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
                      } : undefined}
                    >
                      {/* Active indicator bar */}
                      {active && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full bg-red-400" />
                      )}

                      {/* Icon wrapper */}
                      <div className={cn(
                        'w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-all duration-150',
                        active
                          ? 'bg-red-500/20 text-red-400'
                          : 'text-slate-500 group-hover:text-slate-300 group-hover:bg-white/5'
                      )}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>

                      <span className="flex-1 text-[13px] leading-none">{item.label}</span>

                      {/* Badge */}
                      {item.badge && (
                        <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-red-500 text-white leading-none">
                          {item.badge}
                        </span>
                      )}

                      {/* Hover arrow */}
                      {!active && (
                        <ChevronRight className="w-3 h-3 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity -mr-0.5" />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 pt-3 space-y-0.5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all text-[12px] font-medium group"
        >
          <div className="w-7 h-7 rounded-md flex items-center justify-center group-hover:bg-white/5 transition-colors">
            <ExternalLink className="w-3.5 h-3.5" />
          </div>
          <span>Lihat Website</span>
        </Link>

        <button
          type="button"
          onClick={async () => {
            await fetch('/api/auth/login', { method: 'DELETE' })
            window.location.href = '/admin/login'
          }}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all text-[12px] font-medium group"
        >
          <div className="w-7 h-7 rounded-md flex items-center justify-center group-hover:bg-red-500/10 transition-colors">
            <LogOut className="w-3.5 h-3.5" />
          </div>
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  )
}
