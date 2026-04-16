'use client'

import { useState } from 'react'
import { Settings, Globe, Shield, Bell, Zap, Save, RefreshCw } from 'lucide-react'

const DEFAULT_SETTINGS = {
  siteName: 'KabarKini',
  tagline: 'Fakta Cepat. Analisis Tepat.',
  siteUrl: 'https://kabarkini.id',
  adminEmail: 'redaksi@kabarkini.id',
  articlesPerPage: 12,
  autoPublishThreshold: 85,
  reviewThreshold: 70,
  rejectThreshold: 69,
  dailyRunEnabled: true,
  dailyRunTimes: ['06:30', '12:00', '18:00'],
  breakingNewsEnabled: true,
}

export default function SettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const update = (key: string, value: string | number | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl">
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
          className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${
            saved
              ? 'bg-green-600 text-white'
              : 'bg-[var(--navy)] text-white hover:bg-[var(--navy-light)]'
          }`}
        >
          <Save className="w-4 h-4" />
          {saved ? 'Tersimpan!' : 'Simpan Perubahan'}
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
            { label: 'Nama Situs', key: 'siteName', type: 'text' },
            { label: 'Tagline', key: 'tagline', type: 'text' },
            { label: 'URL Situs', key: 'siteUrl', type: 'url' },
            { label: 'Email Redaksi', key: 'adminEmail', type: 'email' },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
              <input
                type={type}
                value={settings[key as keyof typeof settings] as string}
                onChange={(e) => update(key, e.target.value)}
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
            onChange={(e) => update('articlesPerPage', Number(e.target.value))}
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
            { label: 'Auto Publish (>=)', key: 'autoPublishThreshold', color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
            { label: 'Masuk Review (>=)', key: 'reviewThreshold', color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200' },
            { label: 'Ditolak (<=)', key: 'rejectThreshold', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
          ].map(({ label, key, color, bg }) => (
            <div key={key} className={`rounded-lg p-3 border ${bg}`}>
              <label className={`block text-xs font-semibold ${color} mb-2`}>{label}</label>
              <input
                type="number"
                min={0} max={100}
                value={settings[key as keyof typeof settings] as number}
                onChange={(e) => update(key, Number(e.target.value))}
                className={`w-full border rounded-lg px-3 py-2 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-[var(--navy)] ${color} bg-white`}
              />
            </div>
          ))}
        </div>
        <div className="text-xs text-slate-500 bg-slate-50 rounded-lg p-3 border border-border">
          <strong>Cara baca:</strong> Artikel dengan skor &ge; {settings.autoPublishThreshold} akan langsung terbit.
          Skor {settings.reviewThreshold}–{settings.autoPublishThreshold - 1} masuk antrian review manual.
          Skor &le; {settings.rejectThreshold} otomatis ditolak dan bisa di-regenerate.
        </div>
      </section>

      {/* Automation schedule */}
      <section className="bg-white border border-border rounded-xl p-5 space-y-4">
        <h2 className="font-serif font-bold text-base text-slate-800 flex items-center gap-2 border-b border-border pb-3">
          <Zap className="w-4 h-4 text-[var(--navy)]" />
          Jadwal Otomasi Harian
        </h2>
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.dailyRunEnabled}
              onChange={(e) => update('dailyRunEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--navy)]" />
          </label>
          <span className="text-sm font-medium text-slate-700">Aktifkan run harian otomatis</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {['Pagi (Run 1)', 'Siang (Run 2)', 'Sore (Run 3)'].map((label, i) => (
            <div key={i}>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
              <input
                type="time"
                value={settings.dailyRunTimes[i]}
                onChange={(e) => {
                  const times = [...settings.dailyRunTimes]
                  times[i] = e.target.value
                  update('dailyRunTimes', times as unknown as string)
                }}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--navy)] text-slate-800"
              />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.breakingNewsEnabled}
              onChange={(e) => update('breakingNewsEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--red)]" />
          </label>
          <span className="text-sm font-medium text-slate-700">
            Aktifkan mode Breaking News (run di luar jadwal)
          </span>
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-white border border-border rounded-xl p-5 space-y-3">
        <h2 className="font-serif font-bold text-base text-slate-800 flex items-center gap-2 border-b border-border pb-3">
          <Bell className="w-4 h-4 text-[var(--navy)]" />
          Notifikasi
        </h2>
        {[
          { label: 'Notifikasi email saat workflow selesai', defaultOn: true },
          { label: 'Alert jika ada artikel gagal di-generate', defaultOn: true },
          { label: 'Ringkasan harian ke email redaktur', defaultOn: false },
          { label: 'Peringatan duplikasi konten', defaultOn: true },
        ].map(({ label, defaultOn }) => (
          <div key={label} className="flex items-center justify-between py-1">
            <span className="text-sm text-slate-700">{label}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked={defaultOn} className="sr-only peer" />
              <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--navy)]" />
            </label>
          </div>
        ))}
      </section>
    </div>
  )
}
