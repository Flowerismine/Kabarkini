'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  Globe,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Star,
  Zap,
} from 'lucide-react'
import { ARTICLES, CATEGORIES, TAGS } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const SCORE_COLOR = (score: number) =>
  score >= 85 ? 'text-green-600 bg-green-50 border-green-200' :
  score >= 70 ? 'text-yellow-600 bg-yellow-50 border-yellow-200' :
  'text-red-600 bg-red-50 border-red-200'

export default function ArticleEditorPage() {
  const params = useParams()
  const article = ARTICLES.find((a) => a.id === params.id) || ARTICLES[0]

  const [title, setTitle] = useState(article.title)
  const [excerpt, setExcerpt] = useState(article.excerpt)
  const [metaTitle, setMetaTitle] = useState(article.metaTitle)
  const [metaDesc, setMetaDesc] = useState(article.metaDescription)
  const [focusKw, setFocusKw] = useState(article.focusKeyword)
  const [body, setBody] = useState(article.articleText)
  const [selectedCategory, setSelectedCategory] = useState(article.category.id)
  const [status, setStatus] = useState(article.status)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'scores' | 'sources'>('content')

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const scores = [
    { label: 'Orisinalitas', value: article.originalityScore, key: 'originality' },
    { label: 'Keterbacaan', value: article.readabilityScore, key: 'readability' },
    { label: 'SEO', value: article.seoScore, key: 'seo' },
    { label: 'Konsistensi Fakta', value: article.factualConsistencyScore, key: 'factual' },
    { label: 'Risiko Duplikasi', value: 100 - article.duplicationRiskScore, key: 'dup', inverted: true },
    { label: 'Kesiapan Publish', value: article.publishReadinessScore, key: 'readiness' },
  ]

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="bg-white border-b border-border px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/articles"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Kembali ke daftar artikel"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Editor Artikel</p>
            <h1 className="font-semibold text-sm text-foreground line-clamp-1">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Status badge */}
          <span className={cn(
            'text-xs font-semibold px-2.5 py-1 rounded-full border',
            status === 'published' ? 'bg-green-50 text-green-700 border-green-200' :
            status === 'review' ? 'bg-amber-50 text-amber-700 border-amber-200' :
            status === 'scheduled' ? 'bg-blue-50 text-blue-700 border-blue-200' :
            'bg-slate-50 text-slate-600 border-slate-200'
          )}>
            {status === 'published' ? 'Terpublikasi' :
             status === 'review' ? 'Menunggu Review' :
             status === 'scheduled' ? 'Terjadwal' : 'Draft'}
          </span>

          <a
            href={`/${article.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs border border-border px-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </a>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 text-xs bg-[var(--navy)] text-white px-4 py-1.5 rounded-lg hover:bg-[var(--navy-light)] transition-colors"
          >
            {saved ? (
              <><CheckCircle className="w-3.5 h-3.5" /> Tersimpan</>
            ) : (
              <><Save className="w-3.5 h-3.5" /> Simpan</>
            )}
          </button>

          {status !== 'published' && (
            <button
              onClick={() => setStatus('published')}
              className="flex items-center gap-1.5 text-xs bg-[var(--red)] text-white px-4 py-1.5 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              Publish
            </button>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Main editor */}
          <div className="xl:col-span-2 space-y-5">

            {/* Tabs */}
            <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
              {(['content', 'seo', 'scores', 'sources'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'text-xs font-semibold px-4 py-1.5 rounded-md transition-colors capitalize',
                    activeTab === tab
                      ? 'bg-white text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {tab === 'content' ? 'Konten' :
                   tab === 'seo' ? 'SEO' :
                   tab === 'scores' ? 'Skor AI' : 'Sumber'}
                </button>
              ))}
            </div>

            {/* Content tab */}
            {activeTab === 'content' && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-border p-5">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Judul Utama
                  </label>
                  <textarea
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    rows={2}
                    className="w-full text-xl font-serif font-bold border-0 outline-none resize-none text-foreground leading-snug"
                    placeholder="Judul artikel..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">{title.length} karakter</p>
                </div>

                <div className="bg-white rounded-xl border border-border p-5">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Dek / Excerpt
                  </label>
                  <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    rows={3}
                    className="w-full text-sm border border-border rounded-lg p-3 outline-none resize-none focus:border-[var(--navy)] transition-colors"
                    placeholder="Dek singkat artikel..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">{excerpt.length} karakter (ideal: 120–160)</p>
                </div>

                <div className="bg-white rounded-xl border border-border p-5">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Isi Artikel
                    </label>
                    <span className="text-xs text-muted-foreground">{body.split(' ').length} kata</span>
                  </div>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={20}
                    className="w-full text-sm border border-border rounded-lg p-4 outline-none resize-none focus:border-[var(--navy)] transition-colors font-sans leading-relaxed"
                    placeholder="Isi artikel..."
                  />
                </div>

                {/* Key points */}
                <div className="bg-white rounded-xl border border-border p-5">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Poin-Poin Utama
                  </label>
                  <ul className="space-y-2">
                    {article.bulletPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="w-5 h-5 rounded-full bg-[var(--navy)] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <input
                          defaultValue={point}
                          className="flex-1 text-sm border border-border rounded px-2.5 py-1.5 outline-none focus:border-[var(--navy)] transition-colors"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* SEO tab */}
            {activeTab === 'seo' && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-border p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Meta Title
                    </label>
                    <input
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      className="w-full text-sm border border-border rounded-lg px-3 py-2 outline-none focus:border-[var(--navy)] transition-colors"
                    />
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-muted-foreground">{metaTitle.length} karakter</p>
                      <p className={cn('text-xs font-medium', metaTitle.length <= 60 ? 'text-green-600' : 'text-red-500')}>
                        {metaTitle.length <= 60 ? 'Panjang optimal' : 'Terlalu panjang'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Meta Description
                    </label>
                    <textarea
                      value={metaDesc}
                      onChange={(e) => setMetaDesc(e.target.value)}
                      rows={3}
                      className="w-full text-sm border border-border rounded-lg px-3 py-2 outline-none resize-none focus:border-[var(--navy)] transition-colors"
                    />
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-muted-foreground">{metaDesc.length} karakter</p>
                      <p className={cn('text-xs font-medium', metaDesc.length >= 120 && metaDesc.length <= 160 ? 'text-green-600' : 'text-amber-500')}>
                        {metaDesc.length >= 120 && metaDesc.length <= 160 ? 'Panjang optimal' : 'Ideal: 120–160 karakter'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Kata Kunci Utama
                    </label>
                    <input
                      value={focusKw}
                      onChange={(e) => setFocusKw(e.target.value)}
                      className="w-full text-sm border border-border rounded-lg px-3 py-2 outline-none focus:border-[var(--navy)] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Kata Kunci Terkait
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {article.relatedKeywords.map((kw, i) => (
                        <span key={i} className="text-xs bg-muted border border-border px-2.5 py-1 rounded-full">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Slug URL
                    </label>
                    <div className="flex items-center gap-2 text-sm border border-border rounded-lg px-3 py-2 bg-muted">
                      <span className="text-muted-foreground">kabarkini.id/</span>
                      <span className="font-mono text-foreground">{article.slug}</span>
                    </div>
                  </div>
                </div>

                {/* SERP preview */}
                <div className="bg-white rounded-xl border border-border p-5">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Preview Google SERP
                  </h3>
                  <div className="border border-border rounded-lg p-4 bg-white">
                    <p className="text-[#1a0dab] text-lg hover:underline cursor-pointer line-clamp-1">{metaTitle}</p>
                    <p className="text-[#006621] text-sm mt-0.5">https://kabarkini.id/{article.slug}</p>
                    <p className="text-[#545454] text-sm mt-1 line-clamp-2">{metaDesc}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Scores tab */}
            {activeTab === 'scores' && (
              <div className="bg-white rounded-xl border border-border p-5 space-y-5">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-[var(--red)]" aria-hidden="true" />
                  <h2 className="font-semibold text-foreground">Skor Kualitas AI</h2>
                </div>

                {scores.map(({ label, value, key, inverted }) => (
                  <div key={key}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm font-medium text-foreground">{label}</span>
                      <span className={cn('text-xs font-bold px-2 py-0.5 rounded border', SCORE_COLOR(value))}>
                        {inverted ? `Risiko: ${100 - value}%` : `${value}/100`}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          value >= 85 ? 'bg-green-500' : value >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        )}
                        style={{ width: `${value}%` }}
                        role="progressbar"
                        aria-valuenow={value}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={label}
                      />
                    </div>
                  </div>
                ))}

                {/* Publish readiness summary */}
                <div className={cn(
                  'rounded-xl p-4 border mt-4 flex items-center gap-3',
                  article.publishReadinessScore >= 85 ? 'bg-green-50 border-green-200' :
                  article.publishReadinessScore >= 70 ? 'bg-amber-50 border-amber-200' :
                  'bg-red-50 border-red-200'
                )}>
                  {article.publishReadinessScore >= 85 ? (
                    <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                  )}
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      {article.publishReadinessScore >= 85 ? 'Siap Dipublikasikan' :
                       article.publishReadinessScore >= 70 ? 'Perlu Review Editor' :
                       'Tidak Disarankan Publish'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Skor kesiapan: {article.publishReadinessScore}/100
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Sources tab */}
            {activeTab === 'sources' && (
              <div className="bg-white rounded-xl border border-border p-5">
                <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  Sumber Referensi
                  <span className="text-xs bg-muted border border-border px-2 py-0.5 rounded-full font-normal">
                    {article.sources.length} sumber
                  </span>
                </h2>
                <div className="space-y-3">
                  {article.sources.map((source) => (
                    <div key={source.id} className="flex items-start gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className={cn(
                        'text-xs font-bold uppercase px-2 py-0.5 rounded mt-0.5 shrink-0',
                        source.type === 'official' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      )}>
                        {source.type === 'official' ? 'Resmi' : 'Media'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground">{source.name}</p>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[var(--navy)] hover:underline truncate block"
                        >
                          {source.url}
                        </a>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-semibold text-foreground">{source.trustScore}/100</p>
                        <p className="text-[10px] text-muted-foreground">Trust Score</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right panel */}
          <aside className="xl:col-span-1 space-y-4">
            {/* Status control */}
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Status Publikasi
              </h3>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
                className="w-full text-sm border border-border rounded-lg px-3 py-2 outline-none focus:border-[var(--navy)] bg-white"
              >
                <option value="draft">Draft</option>
                <option value="review">Kirim ke Review</option>
                <option value="scheduled">Jadwalkan</option>
                <option value="published">Publish Sekarang</option>
              </select>

              {status === 'scheduled' && (
                <div className="mt-3">
                  <label className="block text-xs text-muted-foreground mb-1.5">Waktu Jadwal</label>
                  <input
                    type="datetime-local"
                    className="w-full text-sm border border-border rounded-lg px-3 py-2 outline-none focus:border-[var(--navy)]"
                  />
                </div>
              )}

              <button
                onClick={handleSave}
                className="w-full mt-3 bg-[var(--navy)] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[var(--navy-light)] transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" aria-hidden="true" />
                {saved ? 'Tersimpan!' : 'Simpan Perubahan'}
              </button>
            </div>

            {/* Category */}
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Kategori
              </h3>
              <div className="space-y-1.5">
                {CATEGORIES.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      value={cat.id}
                      checked={selectedCategory === cat.id}
                      onChange={() => setSelectedCategory(cat.id)}
                      className="accent-[var(--navy)]"
                    />
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} aria-hidden="true" />
                    <span className="text-sm text-foreground group-hover:text-[var(--navy)] transition-colors">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Tag
              </h3>
              <div className="flex flex-wrap gap-2">
                {TAGS.map((tag) => (
                  <label key={tag.id} className="cursor-pointer">
                    <input type="checkbox" className="sr-only" defaultChecked={article.tags.some((t) => t.id === tag.id)} />
                    <span className={cn(
                      'text-xs px-2.5 py-1 rounded-full border transition-colors select-none',
                      article.tags.some((t) => t.id === tag.id)
                        ? 'bg-[var(--navy)] text-white border-[var(--navy)]'
                        : 'bg-muted text-muted-foreground border-border hover:border-[var(--navy)]'
                    )}>
                      {tag.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Flags */}
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Flag Artikel
              </h3>
              <div className="space-y-2.5">
                {[
                  { label: 'Breaking News', key: 'isBreaking', value: article.isBreaking },
                  { label: 'Artikel Unggulan', key: 'isFeatured', value: article.isFeatured },
                  { label: 'Sedang Trending', key: 'isTrending', value: article.isTrending },
                ].map(({ label, key, value }) => (
                  <label key={key} className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-foreground">{label}</span>
                    <div className={cn(
                      'w-10 h-5 rounded-full relative transition-colors',
                      value ? 'bg-[var(--navy)]' : 'bg-muted border border-border'
                    )}>
                      <div className={cn(
                        'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all',
                        value ? 'left-5' : 'left-0.5'
                      )} />
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Alternative titles */}
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-yellow-500" aria-hidden="true" />
                Judul Alternatif AI
              </h3>
              <div className="space-y-2">
                {article.alternativeTitles.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => setTitle(t)}
                    className="w-full text-left text-xs border border-border rounded-lg p-2.5 hover:bg-[var(--navy)] hover:text-white hover:border-[var(--navy)] transition-colors leading-snug"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
