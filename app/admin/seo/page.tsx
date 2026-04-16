'use client'

import { useState } from 'react'
import {
  Search,
  Globe,
  FileText,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const SEO_CHECKLIST = [
  { id: 1, item: 'XML Sitemap tersedia di /sitemap.xml', status: 'ok' },
  { id: 2, item: 'News Sitemap tersedia di /news-sitemap.xml', status: 'ok' },
  { id: 3, item: 'robots.txt terkonfigurasi dengan benar', status: 'ok' },
  { id: 4, item: 'RSS Feed tersedia di /rss', status: 'ok' },
  { id: 5, item: 'Canonical URL terpasang di semua artikel', status: 'ok' },
  { id: 6, item: 'Open Graph meta tags aktif', status: 'ok' },
  { id: 7, item: 'Twitter Card meta tags aktif', status: 'ok' },
  { id: 8, item: 'JSON-LD NewsArticle schema aktif', status: 'ok' },
  { id: 9, item: 'Breadcrumb schema aktif', status: 'ok' },
  { id: 10, item: 'Meta description panjang optimal (140-160 char)', status: 'warning' },
  { id: 11, item: 'Semua gambar memiliki alt text', status: 'ok' },
  { id: 12, item: 'URL bersih tanpa parameter berlebihan', status: 'ok' },
  { id: 13, item: 'Halaman kategori terindeks dengan benar', status: 'ok' },
  { id: 14, item: 'Halaman admin di-noindex', status: 'ok' },
  { id: 15, item: 'Pagination SEO-friendly', status: 'ok' },
]

const SEO_ISSUES = [
  { id: 1, type: 'warning', article: 'BI Naikkan Suku Bunga Acuan 25 Basis Poin...', issue: 'Meta description terlalu pendek (< 120 karakter)', action: 'Edit' },
  { id: 2, type: 'info', article: 'Timnas Indonesia Lolos ke Semifinal...', issue: 'Alt text gambar belum diisi', action: 'Edit' },
]

export default function AdminSeoPage() {
  const [siteName, setSiteName] = useState('KabarKini')
  const [siteUrl, setSiteUrl] = useState('https://kabarkini.id')
  const [defaultDesc, setDefaultDesc] = useState('Portal berita digital Indonesia terpercaya. Berita terkini, analisis mendalam, dan isu-isu panas nasional setiap hari.')
  const [googleVerify, setGoogleVerify] = useState('')
  const [gaId, setGaId] = useState('')
  const [autoSchema, setAutoSchema] = useState(true)
  const [autoCanonical, setAutoCanonical] = useState(true)
  const [autoSitemap, setAutoSitemap] = useState(true)
  const [newsSitemap, setNewsSitemap] = useState(true)
  const [rssEnabled, setRssEnabled] = useState(true)

  const okCount = SEO_CHECKLIST.filter((c) => c.status === 'ok').length
  const warnCount = SEO_CHECKLIST.filter((c) => c.status === 'warning').length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-serif font-bold text-slate-800">SEO Settings</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Pengaturan teknis SEO, sitemap, schema, dan meta tags
          </p>
        </div>
        <button className="flex items-center gap-2 text-sm bg-[var(--navy)] text-white px-4 py-2 rounded-lg hover:bg-[var(--navy-light)] transition-colors font-semibold">
          Simpan Semua Perubahan
        </button>
      </div>

      {/* SEO Health Score */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-700 flex items-center gap-2">
            <Search className="w-4 h-4 text-[var(--navy)]" />
            SEO Health Check
          </h2>
          <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-[var(--navy)]">
            <RefreshCw className="w-3.5 h-3.5" />
            Cek ulang
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className="text-center bg-green-50 rounded-xl p-4 border border-green-100">
            <p className="text-3xl font-bold text-green-600">{okCount}</p>
            <p className="text-xs text-green-700 font-medium mt-0.5">Lulus</p>
          </div>
          <div className="text-center bg-yellow-50 rounded-xl p-4 border border-yellow-100">
            <p className="text-3xl font-bold text-yellow-600">{warnCount}</p>
            <p className="text-xs text-yellow-700 font-medium mt-0.5">Peringatan</p>
          </div>
          <div className="text-center bg-slate-50 rounded-xl p-4 border border-slate-100">
            <p className="text-3xl font-bold text-slate-700">
              {Math.round((okCount / SEO_CHECKLIST.length) * 100)}%
            </p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Skor SEO</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {SEO_CHECKLIST.map((item) => (
            <div
              key={item.id}
              className={cn(
                'flex items-center gap-2.5 p-2.5 rounded-lg text-sm',
                item.status === 'ok' ? 'bg-green-50' : 'bg-yellow-50'
              )}
            >
              {item.status === 'ok' ? (
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />
              )}
              <span
                className={cn(
                  'text-xs',
                  item.status === 'ok' ? 'text-green-800' : 'text-yellow-800'
                )}
              >
                {item.item}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic settings */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h2 className="font-semibold text-slate-700 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[var(--navy)]" />
            Pengaturan Dasar
          </h2>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1.5">Nama Situs</label>
            <input
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--navy)]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1.5">URL Situs</label>
            <input
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--navy)]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1.5">
              Default Meta Description
            </label>
            <textarea
              value={defaultDesc}
              onChange={(e) => setDefaultDesc(e.target.value)}
              rows={3}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--navy)] resize-none"
            />
            <p className="text-xs text-slate-400 mt-1 text-right">{defaultDesc.length}/160 karakter</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1.5">
              Google Site Verification
            </label>
            <input
              value={googleVerify}
              onChange={(e) => setGoogleVerify(e.target.value)}
              placeholder="google-site-verification=..."
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--navy)]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1.5">
              Google Analytics ID
            </label>
            <input
              value={gaId}
              onChange={(e) => setGaId(e.target.value)}
              placeholder="G-XXXXXXXXXX"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--navy)]"
            />
          </div>
        </div>

        {/* Technical toggles */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[var(--navy)]" />
              Fitur Teknis SEO
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Schema JSON-LD NewsArticle otomatis', value: autoSchema, setter: setAutoSchema, desc: 'Generate schema di tiap artikel' },
                { label: 'Canonical URL otomatis', value: autoCanonical, setter: setAutoCanonical, desc: 'Pasang canonical tag di semua halaman' },
                { label: 'XML Sitemap otomatis diperbarui', value: autoSitemap, setter: setAutoSitemap, desc: 'Update sitemap saat artikel baru terbit' },
                { label: 'Google News Sitemap', value: newsSitemap, setter: setNewsSitemap, desc: 'Tersedia di /news-sitemap.xml' },
                { label: 'RSS Feed', value: rssEnabled, setter: setRssEnabled, desc: 'Tersedia di /rss' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
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

          {/* Feed links */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-700 mb-3 text-sm">Link SEO Aktif</h2>
            <div className="space-y-2">
              {[
                { label: 'XML Sitemap', url: '/sitemap.xml' },
                { label: 'News Sitemap', url: '/news-sitemap.xml' },
                { label: 'RSS Feed', url: '/rss' },
                { label: 'robots.txt', url: '/robots.txt' },
              ].map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group"
                >
                  <span className="text-sm text-slate-700">{link.label}</span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 group-hover:text-[var(--navy)]">
                    <span className="font-mono">{link.url}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* SEO Issues */}
          {SEO_ISSUES.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <h2 className="font-semibold text-amber-800 mb-3 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Isu SEO yang Perlu Diperhatikan
              </h2>
              <div className="space-y-2">
                {SEO_ISSUES.map((issue) => (
                  <div key={issue.id} className="bg-white rounded-lg p-3 border border-amber-100">
                    <p className="text-xs font-medium text-slate-700 line-clamp-1">{issue.article}</p>
                    <p className="text-xs text-amber-700 mt-0.5">{issue.issue}</p>
                    <button className="text-xs text-[var(--navy)] font-semibold mt-1 hover:underline">
                      {issue.action} →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
