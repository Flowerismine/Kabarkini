'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Menu, X, Rss } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Politik', href: '/kategori/politik' },
  { label: 'Hukum', href: '/kategori/hukum' },
  { label: 'Ekonomi', href: '/kategori/ekonomi' },
  { label: 'Teknologi', href: '/kategori/teknologi' },
  { label: 'Sosial', href: '/kategori/sosial' },
  { label: 'Olahraga', href: '/kategori/olahraga' },
  { label: 'Internasional', href: '/kategori/internasional' },
  { label: 'Viral', href: '/kategori/viral' },
]

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar */}
      <div className="bg-[var(--navy)] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-slate-300 hidden sm:block">{today}</span>
          <div className="flex items-center gap-4">
            <Link href="/tentang-kami" className="text-slate-300 hover:text-white transition-colors">
              Tentang Kami
            </Link>
            <Link href="/kontak" className="text-slate-300 hover:text-white transition-colors">
              Kontak
            </Link>
            <Link href="/pedoman-editorial" className="text-slate-300 hover:text-white transition-colors">
              Editorial Policy
            </Link>
            <Link
              href="/rss"
              className="flex items-center gap-1 text-orange-400 hover:text-orange-300 transition-colors"
              aria-label="RSS Feed"
            >
              <Rss className="w-3 h-3" />
              <span>RSS</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex items-center">
              <span className="font-serif text-2xl font-bold text-[var(--navy)] tracking-tight">
                Kabar
              </span>
              <span className="font-serif text-2xl font-bold text-[var(--red)] tracking-tight">
                Kini
              </span>
            </div>
            <div className="hidden md:flex flex-col border-l border-border pl-3 ml-1">
              <span className="text-[10px] font-sans text-muted-foreground leading-tight tracking-wider uppercase">
                Fakta Cepat
              </span>
              <span className="text-[10px] font-sans text-muted-foreground leading-tight tracking-wider uppercase">
                Analisis Tepat
              </span>
            </div>
          </Link>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            {searchOpen ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari berita..."
                  className="border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--navy)] w-64"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      window.location.href = `/pencarian?q=${encodeURIComponent(searchQuery)}`
                    }
                  }}
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Tutup pencarian"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-muted-foreground hover:text-[var(--navy)] transition-colors rounded-md hover:bg-muted"
                aria-label="Buka pencarian"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
            <Link
              href="/admin"
              className="bg-[var(--navy)] text-white text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-[var(--navy-light)] transition-colors"
            >
              Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-muted-foreground"
              aria-label="Pencarian"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-muted-foreground"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {searchOpen && (
          <div className="md:hidden px-4 pb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berita..."
              className="border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--navy)] w-full"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  window.location.href = `/pencarian?q=${encodeURIComponent(searchQuery)}`
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="bg-[var(--navy)] text-white hidden md:block" aria-label="Navigasi utama">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center gap-0">
            <li>
              <Link
                href="/"
                className="block px-3 py-2.5 text-sm font-medium hover:bg-white/10 transition-colors"
              >
                Beranda
              </Link>
            </li>
            <li>
              <Link
                href="/trending"
                className="block px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-white/10 transition-colors"
              >
                Trending
              </Link>
            </li>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block px-3 py-2.5 text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-border shadow-lg">
          <nav aria-label="Navigasi mobile">
            <ul className="py-2">
              <li>
                <Link
                  href="/"
                  className="block px-4 py-2.5 text-sm font-medium hover:bg-muted"
                  onClick={() => setMobileOpen(false)}
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/trending"
                  className="block px-4 py-2.5 text-sm font-medium text-[var(--red)] hover:bg-muted"
                  onClick={() => setMobileOpen(false)}
                >
                  Trending
                </Link>
              </li>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block px-4 py-2.5 text-sm hover:bg-muted"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="border-t border-border mt-2 pt-2">
                <Link
                  href="/admin"
                  className="block px-4 py-2.5 text-sm font-medium text-[var(--navy)]"
                  onClick={() => setMobileOpen(false)}
                >
                  Admin Panel
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}
