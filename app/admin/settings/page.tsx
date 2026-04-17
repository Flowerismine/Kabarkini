'use client'

import { useState, useEffect } from 'react'
import {
  Settings, Globe, Shield, Bell, Zap,
  Save, RefreshCw, CheckCircle, AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SiteSettings {
  siteName:             string
  tagline:              string
  siteUrl:              string
  adminEmail:           string
  articlesPerPage:      number
  autoPublishThreshold: number
  reviewThreshold:      number
  rejectThreshold:      number
  dailyRunEnabled:      boolean
  dailyRunTimes:        string[]
  breakingNewsEnabled:  boolean
}

const DEFAULTS: SiteSettings = {
  siteName:             'KabarKini',
  tagline:              'Fakta Cepat. Analisis Tepat.',
  siteUrl:              'https://kabarkini.id',
  adminEmail:           'redaksi@kabarkini.id',
  articlesPerPage:      12,
  autoPublishThreshold: 85,
  reviewThreshold:      70,
  rejectThreshold:      69,
  dailyRunEnabled:      true,
  dailyRunTimes:        ['06:30', '12:00', '18:00'],
  breakingNewsEnabled:  true,
}

interface Toast { msg: string; type: 'success' | 'error' }

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS)
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [toast,    setToast]    = useState<Toast | null>(null)

  const showToast = (msg: string, type: Toast['type'] = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  // ── Load settings on mount ─────────────────────────────────
  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(({ settings: s }) => {
        if (!s) return
        setSettings({
          siteName:             s.siteName             ?? DEFAULTS.siteName,
          tagline:              s.tagline              ?? DEFAULTS.tagline,
          siteUrl:              s.siteUrl              ?? DEFAULTS.siteUrl,
          adminEmail:           s.adminEmail           ?? DEFAULTS.adminEmail,
          articlesPerPage:      s.articlesPerPage      ?? DEFAULTS.articlesPerPage,
          autoPublishThreshold: s.autoPublishThreshold ?? DEFAULTS.autoPublishThreshold,
          reviewThreshold:      s.reviewThreshold      ?? DEFAULTS.reviewThreshold,
          rejectThreshold:      s.rejectThreshold      ?? DEFAULTS.rejectThreshold,
          dailyRunEnabled:      s.dailyRunEnabled      ?? DEFAULTS.dailyRunEnabled,
          dailyRunTimes:        s.dailyRunTimes        ?? DEFAULTS.dailyRunTimes,
          breakingNewsEnabled:  s.breakingNewsEnabled  ?? DEFAULTS.breakingNewsEnabled,
        })
      })
      .catch(() => showToast('Gagal memuat pengaturan, menggunakan default', 'error'))
      .finally(() => setLoading(false))
  }, [])

  // ── Save to backend ────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(settings),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      showToast('Pengaturan berhasil disimpan')
    } catch (e: unknown) {
      showToast((e as Error).message || 'Gagal menyimpan pengaturan', 'error')
    } finally {
      setSaving(false)
    }
  }

  const update = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) =>
    setSettings(prev => ({ ...prev, [key]: value }))

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-slate-400">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-sm">Memuat pengaturan…</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      {/* Toast */}
      {toast && (
        <div className={cn(
          'fixed top-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2',
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        )}>
          {toast.type === 'success'
            ? <CheckCircle className="w-4 h-4" />
            : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-6 h-6 text-[var(--navy)]" />
            Pengaturan Situs
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Konfigurasi umum KabarKini — perubahan berlaku segera setelah disimpan
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-colors bg-[var(--navy)] text-white hover:bg-[var(--navy-light)] disabled:opacity-50"
        >
          {saving
            ? <><RefreshCw className="w-4 h-4 animate-spin" /> Menyimpan…</>
            : <><Save className="w-4 h-4" /> Simpan Perubahan</>}
        </button>
      </div>

      {/* General */}
      <section className="bg-white border border-border rounded-xl p-5 space-y-4">
        <h2 className="font-serif font-bold text-base text-slate-800 flex items-center gap-2 border-b border-border pb-3">
          <Globe className="w-4 h-4 text-[var(--navy)]" />
          Informasi Situs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Nama Situs',     key: 'siteName'    as const, type: 'text'  },
            { label: 'Tagline',        key: 'tagline'     as const, type: 'text'  },
            { label: 'URL Situs',      key: 'siteUrl'     as const, type: 'url'   },
            { label: 'Email Redaksi',  key: 'adminEmail'  as const, type: 'email' },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
              <input
                type={type}
                value={settings[key] as string}
                onChange={e => update(key, e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--navy)] text-slate-800"
              />
            </div>
          ))}
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Artikel per Halaman</label>
          <input
            type="number"
            min={6} max={24}
            value={settings.articlesPerPage}
            onChange={e => update('articlesPerPage', Number(e.target.value))}
            className="w-32 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--navy)] text-slate-800"
          />
        </div>
      </section>

      {/* Quality thresholds */}
      <section className="bg-white border border-border rounded-xl p-5 space-y-4">
        <h2 className="font-serif font-bold text-base text-slate-800 flex items-center gap-2 border-b border-border pb-3">
          <Shield className="w-4 h-4 text-[var(--navy)]" />
          Ambang Batas Kualitas (Quality Gate)
        </h2>
        <p className="text-xs text-slate-500">
          Skor Publish Readiness yang menentukan apakah artikel langsung terbit, masuk review, atau ditolak.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Auto Publish (≥)', key: 'autoPublishThreshold' as const, color: 'text-green-700', bg: 'bg-green-50 border-green-200'   },
            { label: 'Masuk Review (≥)', key: 'reviewThreshold'      as const, color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200' },
            { label: 'Ditolak (≤)',      key: 'rejectThreshold'      as const, color: 'text-red-700',    bg: 'bg-red-50 border-red-200'       },
          ].map(({ label, key, color, bg }) => (
            <div key={key} className={cn('rounded-lg p-3 border', bg)}>
              <label className={cn('block text-xs font-semibold mb-2', color)}>{label}</label>
              <input
                type="number"
                min={0} max={100}
                value={settings[key] as number}
                onChange={e => update(key, Number(e.target.value))}
                className={cn('w-full border rounded-lg px-3 py-2 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-[var(--navy)] bg-white', color)}
              />
            </div>
          ))}
        </div>
        <div className="text-xs text-slate-500 bg-slate-50 rounded-lg p-3 border border-border">
          <strong>Cara baca:</strong> Skor ≥ {settings.autoPublishThreshold} → langsung terbit.
          Skor {settings.reviewThreshold}–{settings.autoPublishThreshold - 1} → antrian review.
          Skor ≤ {settings.rejectThreshold} → otomatis ditolak.
        </div>
      </section>

      {/* Automation */}
      <section className="bg-white border border-border rounded-xl p-5 space-y-4">
        <h2 className="font-serif font-bold text-base text-slate-800 flex items-center gap-2 border-b border-border pb-3">
          <Zap className="w-4 h-4 text-[var(--navy)]" />
          Jadwal Otomasi Harian
        </h2>

        <div className="flex items-center gap-3">
          <button
            onClick={() => update('dailyRunEnabled', !settings.dailyRunEnabled)}
            className={cn('w-11 h-6 rounded-full transition-colors relative shrink-0',
              settings.dailyRunEnabled ? 'bg-[var(--navy)]' : 'bg-slate-200'
            )}
          >
            <span className={cn(
              'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
              settings.dailyRunEnabled ? 'translate-x-5' : 'translate-x-0.5'
            )} />
          </button>
          <span className="text-sm font-medium text-slate-700">Aktifkan run harian otomatis</span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {['Pagi (Run 1)', 'Siang (Run 2)', 'Sore (Run 3)'].map((label, i) => (
            <div key={i}>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
              <input
                type="time"
                value={settings.dailyRunTimes[i] || ''}
                onChange={e => {
                  const times = [...settings.dailyRunTimes]
                  times[i] = e.target.value
                  update('dailyRunTimes', times)
                }}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--navy)] text-slate-800"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => update('breakingNewsEnabled', !settings.breakingNewsEnabled)}
            className={cn('w-11 h-6 rounded-full transition-colors relative shrink-0',
              settings.breakingNewsEnabled ? 'bg-[var(--red)]' : 'bg-slate-200'
            )}
          >
            <span className={cn(
              'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
              settings.breakingNewsEnabled ? 'translate-x-5' : 'translate-x-0.5'
            )} />
          </button>
          <span className="text-sm font-medium text-slate-700">
            Aktifkan mode Breaking News (run di luar jadwal)
          </span>
        </div>
      </section>

      {/* Notifications — UI only, no backend yet */}
      <section className="bg-white border border-border rounded-xl p-5 space-y-3">
        <h2 className="font-serif font-bold text-base text-slate-800 flex items-center gap-2 border-b border-border pb-3">
          <Bell className="w-4 h-4 text-[var(--navy)]" />
          Notifikasi
        </h2>
        {[
          { label: 'Notifikasi email saat workflow selesai',   defaultOn: true  },
          { label: 'Alert jika ada artikel gagal di-generate', defaultOn: true  },
          { label: 'Ringkasan harian ke email redaktur',       defaultOn: false },
          { label: 'Peringatan duplikasi konten',              defaultOn: true  },
        ].map(({ label, defaultOn }) => (
          <div key={label} className="flex items-center justify-between py-1">
            <span className="text-sm text-slate-700">{label}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked={defaultOn} className="sr-only peer" />
              <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--navy)]" />
            </label>
          </div>
        ))}
        <p className="text-xs text-slate-400 pt-1">
          Pengaturan notifikasi akan tersedia setelah integrasi email dikonfigurasi.
        </p>
      </section>

      {/* Save button bottom */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors bg-[var(--navy)] text-white hover:bg-[var(--navy-light)] disabled:opacity-50"
        >
          {saving
            ? <><RefreshCw className="w-4 h-4 animate-spin" /> Menyimpan…</>
            : <><Save className="w-4 h-4" /> Simpan Perubahan</>}
        </button>
      </div>
    </div>
  )
}
