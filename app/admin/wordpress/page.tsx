'use client'

import { useState } from 'react'
import {
  Rss,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Info,
  Clock,
  Send,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const SYNC_LOGS = [
  { id: 1, articleTitle: 'DPR Sahkan RUU Perampasan Aset, Koruptor Wajib Kembalikan...', status: 'success', wpPostId: 1842, time: '2026-04-15T06:48:00Z', message: 'Post berhasil dipublikasikan di WordPress' },
  { id: 2, articleTitle: 'BI Naikkan Suku Bunga Acuan 25 Basis Poin, Rupiah Menguat...', status: 'success', wpPostId: 1843, time: '2026-04-15T07:18:00Z', message: 'Post berhasil dipublikasikan di WordPress' },
  { id: 3, articleTitle: 'Pemerintah Luncurkan Program AI Nasional, Anggaran Rp 8 Triliun...', status: 'failed', wpPostId: null, time: '2026-04-15T08:03:00Z', message: 'Error: Timeout saat mengirim featured image. Retry dalam 5 menit.' },
  { id: 4, articleTitle: 'Sidang MK: Gugatan UU Pemilu Dicabut, Sistem Proporsional...', status: 'success', wpPostId: 1845, time: '2026-04-14T14:35:00Z', message: 'Post berhasil dipublikasikan di WordPress' },
]

const CATEGORY_MAPPING: Record<string, { kk: string; wpId: string }> = {
  politik: { kk: 'Politik', wpId: '3' },
  hukum: { kk: 'Hukum', wpId: '7' },
  ekonomi: { kk: 'Ekonomi', wpId: '4' },
  teknologi: { kk: 'Teknologi', wpId: '8' },
  sosial: { kk: 'Sosial', wpId: '5' },
  olahraga: { kk: 'Olahraga', wpId: '9' },
  internasional: { kk: 'Internasional', wpId: '6' },
  viral: { kk: 'Viral', wpId: '10' },
}

export default function AdminWordPressPage() {
  const [wpEnabled, setWpEnabled] = useState(false)
  const [siteUrl, setSiteUrl] = useState('')
  const [username, setUsername] = useState('')
  const [appPassword, setAppPassword] = useState('')
  const [postStatus, setPostStatus] = useState<'publish' | 'draft'>('publish')
  const [autoRetry, setAutoRetry] = useState(true)
  const [sendFeaturedImage, setSendFeaturedImage] = useState(true)
  const [sendSeoFields, setSendSeoFields] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [isTesting, setIsTesting] = useState(false)
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>(
    Object.fromEntries(Object.entries(CATEGORY_MAPPING).map(([k, v]) => [k, v.wpId]))
  )

  const testConnection = () => {
    setIsTesting(true)
    setTimeout(() => {
      setConnectionStatus(siteUrl && username && appPassword ? 'success' : 'error')
      setIsTesting(false)
    }, 1500)
  }

  const successCount = SYNC_LOGS.filter((l) => l.status === 'success').length
  const failCount = SYNC_LOGS.filter((l) => l.status === 'failed').length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-serif font-bold text-slate-800">WordPress Bridge</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Mirror artikel yang terbit ke situs WordPress secara otomatis
          </p>
        </div>
        <div
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border',
            wpEnabled
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-slate-100 text-slate-500 border-slate-200'
          )}
        >
          <span className={cn('w-2 h-2 rounded-full', wpEnabled ? 'bg-green-500' : 'bg-slate-400')} />
          {wpEnabled ? 'Bridge Aktif' : 'Bridge Nonaktif'}
        </div>
      </div>

      {/* Enable toggle */}
      <div
        className={cn(
          'flex items-center justify-between p-5 rounded-xl border-2 transition-all',
          wpEnabled ? 'border-green-200 bg-green-50' : 'border-slate-200 bg-white'
        )}
      >
        <div>
          <h2 className="font-semibold text-slate-700">Aktifkan WordPress Bridge</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Jika diaktifkan, setiap artikel yang terbit di KabarKini akan otomatis dikirim ke WordPress.
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Jika tidak diaktifkan, sistem tetap berjalan penuh di Next.js + database tanpa masalah.
          </p>
        </div>
        <button
          onClick={() => setWpEnabled(!wpEnabled)}
          className={cn(
            'w-12 h-6 rounded-full transition-colors relative shrink-0 ml-4',
            wpEnabled ? 'bg-green-500' : 'bg-slate-300'
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform',
              wpEnabled ? 'translate-x-6' : 'translate-x-0.5'
            )}
          />
        </button>
      </div>

      {wpEnabled && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Connection settings */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <h2 className="font-semibold text-slate-700 flex items-center gap-2">
                <Rss className="w-4 h-4 text-[var(--navy)]" />
                Koneksi WordPress
              </h2>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">URL Situs WordPress</label>
                <input
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  placeholder="https://yourblog.com"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--navy)]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Username WordPress</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--navy)]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                  Application Password
                  <a
                    href="https://make.wordpress.org/core/2020/11/05/application-passwords-integration-guide/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-[var(--navy)] hover:underline font-normal"
                  >
                    (cara mendapatkan ↗)
                  </a>
                </label>
                <input
                  type="password"
                  value={appPassword}
                  onChange={(e) => setAppPassword(e.target.value)}
                  placeholder="xxxx xxxx xxxx xxxx xxxx xxxx"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--navy)]"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={testConnection}
                  disabled={isTesting}
                  className="flex items-center gap-2 bg-[var(--navy)] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[var(--navy-light)] transition-colors disabled:opacity-50"
                >
                  {isTesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  {isTesting ? 'Menguji...' : 'Test Koneksi'}
                </button>

                {connectionStatus === 'success' && (
                  <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Terhubung!
                  </span>
                )}
                {connectionStatus === 'error' && (
                  <span className="flex items-center gap-1.5 text-red-600 text-sm font-medium">
                    <XCircle className="w-4 h-4" />
                    Koneksi gagal
                  </span>
                )}
              </div>
            </div>

            {/* Sync options */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <h2 className="font-semibold text-slate-700">Opsi Sinkronisasi</h2>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Status Post di WordPress</label>
                <div className="flex items-center gap-2">
                  {(['publish', 'draft'] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setPostStatus(opt)}
                      className={cn(
                        'flex-1 py-2 rounded-lg text-sm font-medium border transition-colors',
                        postStatus === opt
                          ? 'bg-[var(--navy)] text-white border-[var(--navy)]'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      )}
                    >
                      {opt === 'publish' ? 'Langsung Publish' : 'Simpan Draft'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Kirim Featured Image', value: sendFeaturedImage, setter: setSendFeaturedImage },
                  { label: 'Kirim SEO Fields (Yoast/RankMath)', value: sendSeoFields, setter: setSendSeoFields },
                  { label: 'Auto-Retry jika Gagal', value: autoRetry, setter: setAutoRetry },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-700 font-medium">{item.label}</p>
                    <button
                      onClick={() => item.setter(!item.value)}
                      className={cn(
                        'w-10 h-5 rounded-full transition-colors relative shrink-0',
                        item.value ? 'bg-green-500' : 'bg-slate-300'
                      )}
                    >
                      <span
                        className={cn(
                          'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform',
                          item.value ? 'translate-x-5' : 'translate-x-0.5'
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Category mapping */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-700 mb-4">Pemetaan Kategori KabarKini → WordPress</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(CATEGORY_MAPPING).map(([slug, { kk }]) => (
                <div key={slug} className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600">{kk}</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded font-mono flex-1 text-center">
                      KK: {slug}
                    </span>
                    <span className="text-slate-400">→</span>
                    <input
                      type="number"
                      value={categoryMap[slug] || ''}
                      onChange={(e) =>
                        setCategoryMap((prev) => ({ ...prev, [slug]: e.target.value }))
                      }
                      placeholder="WP ID"
                      className="w-16 border border-slate-200 rounded px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-[var(--navy)]"
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              Isi dengan Category ID dari WordPress. Lihat di WordPress Admin &gt; Posts &gt; Categories.
            </p>
          </div>

          {/* Sync logs */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="font-semibold text-slate-700 text-sm">Log Sinkronisasi</h2>
                <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded">
                  {successCount} berhasil
                </span>
                {failCount > 0 && (
                  <span className="text-xs text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded">
                    {failCount} gagal
                  </span>
                )}
              </div>
              <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[var(--navy)]">
                <RefreshCw className="w-3.5 h-3.5" />
                Coba Ulang Gagal
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {SYNC_LOGS.map((log) => (
                <div key={log.id} className="flex items-start gap-4 px-5 py-3.5">
                  <div className="shrink-0 mt-0.5">
                    {log.status === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 line-clamp-1">{log.articleTitle}</p>
                    <p
                      className={cn(
                        'text-xs mt-0.5',
                        log.status === 'success' ? 'text-green-700' : 'text-red-600'
                      )}
                    >
                      {log.message}
                    </p>
                  </div>
                  <div className="shrink-0 text-right text-xs text-slate-400">
                    {log.wpPostId && (
                      <p className="font-mono mb-0.5">WP ID: {log.wpPostId}</p>
                    )}
                    <p className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(log.time).toLocaleTimeString('id-ID')}
                    </p>
                  </div>
                  {log.status === 'failed' && (
                    <button className="shrink-0 flex items-center gap-1 text-xs text-[var(--navy)] hover:underline">
                      <Send className="w-3 h-3" />
                      Retry
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {!wpEnabled && (
        <div className="bg-slate-50 rounded-xl border border-dashed border-slate-300 p-10 text-center">
          <Rss className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-serif font-semibold text-slate-500 text-lg">WordPress Bridge Nonaktif</h3>
          <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
            Aktifkan WordPress Bridge di atas untuk mulai mengonfigurasi sinkronisasi otomatis artikel ke situs WordPress Anda.
          </p>
          <p className="text-xs text-slate-400 mt-2">
            KabarKini tetap berjalan penuh sebagai website mandiri tanpa WordPress.
          </p>
        </div>
      )}
    </div>
  )
}
