'use client'

import { useState, useEffect } from 'react'
import {
  Rss, CheckCircle, XCircle, AlertCircle,
  RefreshCw, Info, Clock, Send, Save,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────
interface SyncResult {
  articleId: string
  success: boolean
  wpPostId?: number
  error?: string
  timestamp: string
  articleTitle?: string
}
interface Toast { msg: string; type: 'success' | 'error' | 'info' }

// ── Category mapping default ───────────────────────────────────
const DEFAULT_CATEGORIES: Record<string, { kk: string; wpId: string }> = {
  politik:       { kk: 'Politik',       wpId: '3'  },
  hukum:         { kk: 'Hukum',         wpId: '7'  },
  ekonomi:       { kk: 'Ekonomi',       wpId: '4'  },
  teknologi:     { kk: 'Teknologi',     wpId: '8'  },
  sosial:        { kk: 'Sosial',        wpId: '5'  },
  olahraga:      { kk: 'Olahraga',      wpId: '9'  },
  internasional: { kk: 'Internasional', wpId: '6'  },
  viral:         { kk: 'Viral',         wpId: '10' },
}

export default function AdminWordPressPage() {
  // Config state
  const [wpEnabled,          setWpEnabled]          = useState(false)
  const [siteUrl,            setSiteUrl]            = useState('')
  const [username,           setUsername]           = useState('')
  const [appPassword,        setAppPassword]        = useState('')
  const [postStatus,         setPostStatus]         = useState<'publish' | 'draft'>('publish')
  const [autoRetry,          setAutoRetry]          = useState(true)
  const [sendFeaturedImage,  setSendFeaturedImage]  = useState(true)
  const [sendSeoFields,      setSendSeoFields]      = useState(true)
  const [categoryMap,        setCategoryMap]        = useState<Record<string, string>>(
    Object.fromEntries(Object.entries(DEFAULT_CATEGORIES).map(([k, v]) => [k, v.wpId]))
  )

  // UI state
  const [connectionStatus,   setConnectionStatus]   = useState<'idle' | 'success' | 'error'>('idle')
  const [connectionMsg,      setConnectionMsg]      = useState('')
  const [isTesting,          setIsTesting]          = useState(false)
  const [isSaving,           setIsSaving]           = useState(false)
  const [isSyncing,          setIsSyncing]          = useState(false)
  const [syncResults,        setSyncResults]        = useState<SyncResult[]>([])
  const [toast,              setToast]              = useState<Toast | null>(null)

  const showToast = (msg: string, type: Toast['type'] = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4000)
  }

  // ── Build config object ────────────────────────────────────
  const buildConfig = () => ({
    siteUrl,
    username,
    applicationPassword: appPassword,
    postStatus,
    categoryMapping: Object.fromEntries(
      Object.entries(categoryMap).map(([k, v]) => [k, Number(v)])
    ),
    sendFeaturedImage,
    sendSeoFields,
    autoRetryOnFail: autoRetry,
  })

  // ── Load settings on mount ─────────────────────────────────
  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(({ settings }) => {
        if (!settings) return
        const wp = settings.wordpressConfig || {}
        if (wp.siteUrl)             setSiteUrl(wp.siteUrl)
        if (wp.username)            setUsername(wp.username)
        if (wp.applicationPassword) setAppPassword(wp.applicationPassword)
        if (wp.postStatus)          setPostStatus(wp.postStatus)
        if (wp.categoryMapping) {
          setCategoryMap(
            Object.fromEntries(
              Object.entries(wp.categoryMapping).map(([k, v]) => [k, String(v)])
            )
          )
        }
        if (wp.sendFeaturedImage !== undefined) setSendFeaturedImage(wp.sendFeaturedImage)
        if (wp.sendSeoFields     !== undefined) setSendSeoFields(wp.sendSeoFields)
        if (wp.autoRetryOnFail   !== undefined) setAutoRetry(wp.autoRetryOnFail)
        if (wp.enabled           !== undefined) setWpEnabled(wp.enabled)
      })
      .catch(() => {/* gunakan defaults */})
  }, [])

  // ── Simpan konfigurasi ─────────────────────────────────────
  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          wordpressConfig: { ...buildConfig(), enabled: wpEnabled },
        }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      showToast('Konfigurasi WordPress berhasil disimpan')
    } catch (e: unknown) {
      showToast((e as Error).message || 'Gagal menyimpan', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  // ── Test koneksi ───────────────────────────────────────────
  const handleTestConnection = async () => {
    if (!siteUrl || !username || !appPassword) {
      showToast('Isi URL, Username, dan App Password terlebih dahulu', 'error')
      return
    }
    setIsTesting(true)
    setConnectionStatus('idle')
    try {
      const res = await fetch('/api/wordpress/sync', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action: 'test', config: buildConfig() }),
      })
      const d = await res.json()
      if (d.success) {
        setConnectionStatus('success')
        setConnectionMsg(d.siteTitle ? `Terhubung sebagai: ${d.siteTitle}` : 'Terhubung!')
      } else {
        setConnectionStatus('error')
        setConnectionMsg(d.error || 'Koneksi gagal')
      }
    } catch {
      setConnectionStatus('error')
      setConnectionMsg('Gagal menghubungi server')
    } finally {
      setIsTesting(false)
    }
  }

  // ── Sync semua artikel ─────────────────────────────────────
  const handleSyncAll = async () => {
    if (!siteUrl || !username || !appPassword) {
      showToast('Isi konfigurasi WordPress terlebih dahulu', 'error')
      return
    }
    setIsSyncing(true)
    showToast('Memulai sinkronisasi semua artikel terbit…', 'info')
    try {
      const res = await fetch('/api/wordpress/sync', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action: 'sync_all', config: buildConfig() }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      setSyncResults(d.results ?? [])
      showToast(`Sinkronisasi selesai — ${d.successCount} berhasil, ${d.failCount} gagal`)
    } catch (e: unknown) {
      showToast((e as Error).message || 'Gagal sinkronisasi', 'error')
    } finally {
      setIsSyncing(false)
    }
  }

  // ── Retry 1 artikel ────────────────────────────────────────
  const handleRetry = async (articleId: string) => {
    try {
      const res = await fetch('/api/wordpress/sync', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action: 'retry', articleId, config: buildConfig() }),
      })
      const d = await res.json()
      if (d.success) {
        setSyncResults(prev =>
          prev.map(r => r.articleId === articleId ? { ...r, success: true, wpPostId: d.wpPostId, error: undefined } : r)
        )
        showToast('Artikel berhasil di-retry')
      } else {
        showToast(d.error || 'Retry gagal', 'error')
      }
    } catch {
      showToast('Gagal menghubungi server', 'error')
    }
  }

  // ── Retry semua yang gagal ─────────────────────────────────
  const handleRetryAll = async () => {
    const failed = syncResults.filter(r => !r.success)
    for (const r of failed) await handleRetry(r.articleId)
  }

  const successCount = syncResults.filter(r => r.success).length
  const failCount    = syncResults.filter(r => !r.success).length

  return (
    <div className="p-6 space-y-6">
      {/* Toast */}
      {toast && (
        <div className={cn(
          'fixed top-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2',
          toast.type === 'success' ? 'bg-green-600 text-white'
          : toast.type === 'error' ? 'bg-red-600 text-white'
          : 'bg-blue-600 text-white'
        )}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4" />
          : toast.type === 'error'  ? <AlertCircle className="w-4 h-4" />
          : <RefreshCw className="w-4 h-4 animate-spin" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-serif font-bold text-slate-800">WordPress Bridge</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Mirror artikel yang terbit ke situs WordPress secara otomatis
          </p>
        </div>
        <div className="flex items-center gap-3">
          {wpEnabled && (
            <button
              onClick={handleSyncAll}
              disabled={isSyncing}
              className="flex items-center gap-2 bg-[var(--navy)] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[var(--navy-light)] transition-colors disabled:opacity-50"
            >
              {isSyncing
                ? <><RefreshCw className="w-4 h-4 animate-spin" /> Menyinkronkan…</>
                : <><Send className="w-4 h-4" /> Sync Sekarang</>}
            </button>
          )}
          <div className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border',
            wpEnabled
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-slate-100 text-slate-500 border-slate-200'
          )}>
            <span className={cn('w-2 h-2 rounded-full', wpEnabled ? 'bg-green-500' : 'bg-slate-400')} />
            {wpEnabled ? 'Bridge Aktif' : 'Bridge Nonaktif'}
          </div>
        </div>
      </div>

      {/* Enable toggle */}
      <div className={cn(
        'flex items-center justify-between p-5 rounded-xl border-2 transition-all',
        wpEnabled ? 'border-green-200 bg-green-50' : 'border-slate-200 bg-white'
      )}>
        <div>
          <h2 className="font-semibold text-slate-700">Aktifkan WordPress Bridge</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Setiap artikel yang terbit di KabarKini akan otomatis dikirim ke WordPress.
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Jika tidak diaktifkan, sistem tetap berjalan penuh di Next.js tanpa masalah.
          </p>
        </div>
        <button
          onClick={() => setWpEnabled(!wpEnabled)}
          className={cn(
            'w-12 h-6 rounded-full transition-colors relative shrink-0 ml-4',
            wpEnabled ? 'bg-green-500' : 'bg-slate-300'
          )}
        >
          <span className={cn(
            'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform',
            wpEnabled ? 'translate-x-6' : 'translate-x-0.5'
          )} />
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
                  onChange={e => setSiteUrl(e.target.value)}
                  placeholder="https://yourblog.com"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--navy)]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Username WordPress</label>
                <input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
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
                  onChange={e => setAppPassword(e.target.value)}
                  placeholder="xxxx xxxx xxxx xxxx xxxx xxxx"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--navy)]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="flex items-center gap-2 bg-[var(--navy)] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[var(--navy-light)] transition-colors disabled:opacity-50"
                >
                  {isTesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  {isTesting ? 'Menguji...' : 'Test Koneksi'}
                </button>

                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSaving ? 'Menyimpan...' : 'Simpan Config'}
                </button>

                {connectionStatus === 'success' && (
                  <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    {connectionMsg}
                  </span>
                )}
                {connectionStatus === 'error' && (
                  <span className="flex items-center gap-1.5 text-red-600 text-sm font-medium">
                    <XCircle className="w-4 h-4" />
                    {connectionMsg}
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
                  { label: 'Kirim Featured Image',          value: sendFeaturedImage, setter: setSendFeaturedImage },
                  { label: 'Kirim SEO Fields (Yoast/RankMath)', value: sendSeoFields, setter: setSendSeoFields      },
                  { label: 'Auto-Retry jika Gagal',         value: autoRetry,         setter: setAutoRetry          },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-700 font-medium">{item.label}</p>
                    <button
                      onClick={() => item.setter(!item.value)}
                      className={cn('w-10 h-5 rounded-full transition-colors relative shrink-0',
                        item.value ? 'bg-green-500' : 'bg-slate-300'
                      )}
                    >
                      <span className={cn(
                        'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform',
                        item.value ? 'translate-x-5' : 'translate-x-0.5'
                      )} />
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
              {Object.entries(DEFAULT_CATEGORIES).map(([slug, { kk }]) => (
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
                      onChange={e => setCategoryMap(prev => ({ ...prev, [slug]: e.target.value }))}
                      placeholder="WP ID"
                      className="w-16 border border-slate-200 rounded px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-[var(--navy)]"
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              Isi dengan Category ID dari WordPress Admin &gt; Posts &gt; Categories.
            </p>
          </div>

          {/* Sync results */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <h2 className="font-semibold text-slate-700 text-sm">Log Sinkronisasi</h2>
                {syncResults.length > 0 && (
                  <>
                    <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded">
                      {successCount} berhasil
                    </span>
                    {failCount > 0 && (
                      <span className="text-xs text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded">
                        {failCount} gagal
                      </span>
                    )}
                  </>
                )}
              </div>
              {failCount > 0 && (
                <button
                  onClick={handleRetryAll}
                  className="flex items-center gap-1.5 text-xs text-[var(--navy)] hover:underline font-medium"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Coba Ulang Semua Gagal
                </button>
              )}
            </div>

            {syncResults.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-slate-400">
                {isSyncing
                  ? <><RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />Menyinkronkan artikel…</>
                  : 'Tekan "Sync Sekarang" untuk mulai sinkronisasi.'}
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {syncResults.map((log, i) => (
                  <div key={i} className="flex items-start gap-4 px-5 py-3.5">
                    <div className="shrink-0 mt-0.5">
                      {log.success
                        ? <CheckCircle className="w-4 h-4 text-green-500" />
                        : <AlertCircle className="w-4 h-4 text-red-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 line-clamp-1">
                        {log.articleTitle || log.articleId}
                      </p>
                      <p className={cn('text-xs mt-0.5',
                        log.success ? 'text-green-700' : 'text-red-600'
                      )}>
                        {log.success ? `Post berhasil dipublikasikan di WordPress` : log.error}
                      </p>
                    </div>
                    <div className="shrink-0 text-right text-xs text-slate-400">
                      {log.wpPostId && <p className="font-mono mb-0.5">WP ID: {log.wpPostId}</p>}
                      <p className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(log.timestamp).toLocaleTimeString('id-ID')}
                      </p>
                    </div>
                    {!log.success && (
                      <button
                        onClick={() => handleRetry(log.articleId)}
                        className="shrink-0 flex items-center gap-1 text-xs text-[var(--navy)] hover:underline"
                      >
                        <Send className="w-3 h-3" />
                        Retry
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {!wpEnabled && (
        <div className="bg-slate-50 rounded-xl border border-dashed border-slate-300 p-10 text-center">
          <Rss className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-serif font-semibold text-slate-500 text-lg">WordPress Bridge Nonaktif</h3>
          <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
            Aktifkan WordPress Bridge di atas untuk mulai mengonfigurasi sinkronisasi otomatis.
          </p>
          <p className="text-xs text-slate-400 mt-2">
            KabarKini tetap berjalan penuh sebagai website mandiri tanpa WordPress.
          </p>
        </div>
      )}
    </div>
  )
}
