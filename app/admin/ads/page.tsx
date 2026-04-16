'use client'

import { useState } from 'react'
import { MonitorPlay, ToggleLeft, ToggleRight, Info, DollarSign, Eye, Smartphone, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'

type AdSlotConfig = {
  id: string
  name: string
  position: string
  description: string
  dimensions: string
  enabled: boolean
  adCode: string
  placement: 'header' | 'in_content' | 'sidebar' | 'footer' | 'mobile'
  preview: string
}

const INITIAL_SLOTS: AdSlotConfig[] = [
  {
    id: 'header',
    name: 'Header Leaderboard',
    position: 'Atas halaman, bawah header',
    description: 'Slot iklan paling premium. Terlihat pertama kali.',
    dimensions: '728x90 (Desktop) / 320x50 (Mobile)',
    enabled: true,
    adCode: '<!-- Google AdSense Header -->',
    placement: 'header',
    preview: '728x90',
  },
  {
    id: 'in_content_1',
    name: 'In-Content Ad 1',
    position: 'Di dalam artikel, setelah intro',
    description: 'Slot in-content pertama, tingkat klik tinggi.',
    dimensions: '336x280 atau 300x250',
    enabled: true,
    adCode: '<!-- Google AdSense In-Content 1 -->',
    placement: 'in_content',
    preview: '336x280',
  },
  {
    id: 'in_content_2',
    name: 'In-Content Ad 2',
    position: 'Di dalam artikel, sebelum penutup',
    description: 'Slot in-content kedua untuk pendapatan tambahan.',
    dimensions: '336x280 atau 300x250',
    enabled: true,
    adCode: '<!-- Google AdSense In-Content 2 -->',
    placement: 'in_content',
    preview: '336x280',
  },
  {
    id: 'sidebar',
    name: 'Sidebar Ad Desktop',
    position: 'Sidebar kanan, sticky saat scroll',
    description: 'Tampil di halaman artikel dan homepage (desktop only).',
    dimensions: '300x600 atau 300x250',
    enabled: true,
    adCode: '<!-- Google AdSense Sidebar -->',
    placement: 'sidebar',
    preview: '300x250',
  },
  {
    id: 'footer',
    name: 'Footer Ad',
    position: 'Bawah halaman sebelum footer',
    description: 'Slot setelah konten utama, untuk pembaca yang scroll ke bawah.',
    dimensions: '728x90 atau 320x50',
    enabled: false,
    adCode: '',
    placement: 'footer',
    preview: '728x90',
  },
  {
    id: 'mobile_sticky',
    name: 'Mobile Sticky Ad',
    position: 'Sticky di bawah layar (mobile only)',
    description: 'Banner sticky yang mengikuti scroll di perangkat mobile.',
    dimensions: '320x50',
    enabled: false,
    adCode: '',
    placement: 'mobile',
    preview: '320x50',
  },
]

const PLACEMENT_ICONS: Record<string, React.ElementType> = {
  header: Monitor,
  in_content: Eye,
  sidebar: Monitor,
  footer: Monitor,
  mobile: Smartphone,
}

export default function AdminAdsPage() {
  const [slots, setSlots] = useState<AdSlotConfig[]>(INITIAL_SLOTS)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [publisherId, setPublisherId] = useState('ca-pub-XXXXXXXXXXXXXXXXX')

  const toggleSlot = (id: string) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    )
  }

  const updateAdCode = (id: string, code: string) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, adCode: code } : s))
    )
  }

  const activeSlots = slots.filter((s) => s.enabled).length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-serif font-bold text-slate-800">Pengaturan Iklan & Monetisasi</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Kelola slot iklan AdSense dan konfigurasi monetisasi situs
          </p>
        </div>
        <button className="flex items-center gap-2 text-sm bg-[var(--navy)] text-white px-4 py-2 rounded-lg hover:bg-[var(--navy-light)] transition-colors font-semibold">
          Simpan Perubahan
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Slot', value: slots.length, color: 'text-slate-700' },
          { label: 'Slot Aktif', value: activeSlots, color: 'text-green-600' },
          { label: 'Slot Nonaktif', value: slots.length - activeSlots, color: 'text-slate-400' },
          { label: 'AdSense Status', value: 'Terhubung', color: 'text-green-600' },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <p className={cn('text-2xl font-bold', item.color)}>{item.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Publisher ID */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-[var(--navy)]" />
          Google AdSense Publisher ID
        </h2>
        <div className="flex items-center gap-3">
          <input
            value={publisherId}
            onChange={(e) => setPublisherId(e.target.value)}
            className="flex-1 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--navy)]"
            placeholder="ca-pub-XXXXXXXXXXXXXXXXX"
          />
          <button className="bg-green-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap">
            Verifikasi
          </button>
        </div>
        <div className="flex items-start gap-2 mt-3 bg-blue-50 rounded-lg p-3">
          <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
          <p className="text-xs text-blue-700">
            Masukkan Publisher ID dari akun Google AdSense Anda. ID ini digunakan untuk semua slot iklan di situs ini. Pastikan domain sudah diverifikasi di akun AdSense Anda.
          </p>
        </div>
      </div>

      {/* AdSense readiness checklist */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <MonitorPlay className="w-4 h-4 text-[var(--navy)]" />
          AdSense Readiness Checklist
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {[
            { item: 'Halaman "Tentang Kami" tersedia', ok: true },
            { item: 'Halaman "Kontak" tersedia', ok: true },
            { item: 'Halaman "Kebijakan Privasi" tersedia', ok: true },
            { item: 'Halaman "Disclaimer" tersedia', ok: true },
            { item: 'Konten orisinal, bukan copy-paste', ok: true },
            { item: 'Artikel minimal 500 kata rata-rata', ok: true },
            { item: 'Tidak ada konten dewasa / kekerasan', ok: true },
            { item: 'Navigasi bersih dan mudah digunakan', ok: true },
            { item: 'Layout tidak menipu klik (click-bait layout)', ok: true },
            { item: 'Gambar tidak melanggar hak cipta', ok: true },
            { item: 'CLS (Layout Shift) minimal di area iklan', ok: true },
            { item: 'Iklan tidak menutupi konten utama', ok: true },
          ].map((c, i) => (
            <div
              key={i}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs',
                c.ok ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              )}
            >
              <div className={cn('w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-white', c.ok ? 'bg-green-500' : 'bg-red-500')}>
                {c.ok ? '✓' : '✗'}
              </div>
              {c.item}
            </div>
          ))}
        </div>
      </div>

      {/* Slot configurations */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-700 flex items-center gap-2">
            <MonitorPlay className="w-4 h-4 text-[var(--navy)]" />
            Konfigurasi Slot Iklan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Aktifkan/nonaktifkan slot dan tempel kode AdSense untuk setiap posisi
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {slots.map((slot) => {
            const Icon = PLACEMENT_ICONS[slot.placement] || Monitor
            const isSelected = selectedSlot === slot.id
            return (
              <div key={slot.id}>
                <div
                  className={cn(
                    'flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors',
                    isSelected && 'bg-slate-50'
                  )}
                  onClick={() => setSelectedSlot(isSelected ? null : slot.id)}
                >
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-700">{slot.name}</p>
                      <span
                        className={cn(
                          'text-[10px] font-bold px-1.5 py-0.5 rounded',
                          slot.enabled
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-500'
                        )}
                      >
                        {slot.enabled ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{slot.position}</p>
                    <p className="text-xs text-slate-400">{slot.dimensions}</p>
                  </div>

                  {/* Visual preview tag */}
                  <div className="hidden md:block shrink-0">
                    <div className="bg-slate-100 border border-dashed border-slate-300 rounded text-[9px] text-slate-400 px-2 py-1 text-center font-mono">
                      {slot.preview}
                    </div>
                  </div>

                  {/* Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleSlot(slot.id)
                    }}
                    className="shrink-0"
                  >
                    {slot.enabled ? (
                      <ToggleRight className="w-8 h-8 text-green-500" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-slate-300" />
                    )}
                  </button>
                </div>

                {/* Expanded code editor */}
                {isSelected && (
                  <div className="px-5 pb-4 bg-slate-50 border-t border-slate-100 pt-4">
                    <p className="text-xs font-semibold text-slate-600 mb-2">{slot.description}</p>
                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                      Kode AdSense untuk slot ini
                    </label>
                    <textarea
                      value={slot.adCode}
                      onChange={(e) => updateAdCode(slot.id, e.target.value)}
                      placeholder="Tempel kode <ins class='adsbygoogle'> dari Google AdSense..."
                      className="w-full font-mono text-xs border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--navy)] resize-none min-h-[80px] bg-white"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      Salin kode unit iklan dari Google AdSense &gt; Iklan &gt; Unit Iklan &gt; per slot.
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
