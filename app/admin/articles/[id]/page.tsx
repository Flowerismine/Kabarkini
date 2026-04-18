'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, Save, CheckCircle, AlertCircle, Loader2, Image as ImageIcon, X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ArticleStatus } from '@/types'

interface NewArticleForm {
  title:          string
  excerpt:        string
  metaTitle:      string
  metaDesc:       string
  focusKw:        string
  body:           string
  coverImageUrl:  string  // ← baru
  categoryId:     string
  status:         ArticleStatus
  scheduledAt:    string
  isBreaking:     boolean
  isFeatured:     boolean
  isTrending:     boolean
  selectedTagIds: string[]
}

const INITIAL_FORM: NewArticleForm = {
  title:          '',
  excerpt:        '',
  metaTitle:      '',
  metaDesc:       '',
  focusKw:        '',
  body:           '',
  coverImageUrl:  '',
  categoryId:     '',
  status:         'draft',
  scheduledAt:    '',
  isBreaking:     false,
  isFeatured:     false,
  isTrending:     false,
  selectedTagIds: [],
}

interface Category { id: string; name: string; color: string }
interface Tag      { id: string; name: string; slug: string  }

export default function NewArticlePage() {
  const router = useRouter()
  const [form, setForm]         = useState<NewArticleForm>(INITIAL_FORM)
  const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content')
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags]         = useState<Tag[]>([])
  const [imagePreview, setImagePreview] = useState(false)

  // Load categories + tags from Supabase on mount
  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(d => setCategories(d.categories ?? []))
      .catch(() => {})

    // Tags — fallback ke empty jika belum ada API
    fetch('/api/tags').then(r => r.json()).then(d => setTags(d.tags ?? [])).catch(() => {})
  }, [])

  const set = <K extends keyof NewArticleForm>(key: K, value: NewArticleForm[K]) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const toggleTag = (tagId: string) =>
    set('selectedTagIds',
      form.selectedTagIds.includes(tagId)
        ? form.selectedTagIds.filter(id => id !== tagId)
        : [...form.selectedTagIds, tagId]
    )

  const validate = (): string | null => {
    if (!form.title.trim())   return 'Judul tidak boleh kosong.'
    if (!form.categoryId)     return 'Pilih kategori terlebih dahulu.'
    if (form.status === 'scheduled' && !form.scheduledAt)
      return 'Waktu jadwal wajib diisi jika status Terjadwal.'
    return null
  }

  const handleSave = async () => {
    const validationError = validate()
    if (validationError) {
      setErrorMsg(validationError)
      setSaveState('error')
      return
    }
    setSaveState('saving')
    setErrorMsg('')

    try {
      const res = await fetch('/api/articles', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title:           form.title.trim(),
          excerpt:         form.excerpt.trim(),
          metaTitle:       form.metaTitle.trim() || form.title.trim(),
          metaDescription: form.metaDesc.trim(),
          focusKeyword:    form.focusKw.trim(),
          articleText:     form.body.trim(),
          coverImageUrl:   form.coverImageUrl.trim(),
          categoryId:      form.categoryId,
          tagIds:          form.selectedTagIds,
          status:          form.status,
          scheduledAt:     form.scheduledAt || null,
          isBreaking:      form.isBreaking,
          isFeatured:      form.isFeatured,
          isTrending:      form.isTrending,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || `HTTP ${res.status}`)
      }

      const data = await res.json()
      setSaveState('saved')
      setTimeout(() => {
        if (data.article?.id) {
          router.push('/admin/articles')
        }
      }, 1000)
    } catch (err: unknown) {
      setSaveState('error')
      setErrorMsg(err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/articles" className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-slate-800">
              {form.title || 'Artikel Baru'}
            </h1>
            <p className="text-xs text-slate-500">
              {form.status === 'draft' ? 'Draft' : form.status === 'review' ? 'Menunggu Review' : form.status === 'published' ? 'Terbit' : form.status}
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saveState === 'saving' || saveState === 'saved'}
          className="flex items-center gap-2 bg-[var(--navy)] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[var(--navy-light)] transition-colors disabled:opacity-60"
        >
          {saveState === 'saving' ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</>
          : saveState === 'saved'  ? <><CheckCircle className="w-4 h-4" /> Tersimpan!</>
          : <><Save className="w-4 h-4" /> Simpan Artikel</>}
        </button>
      </div>

      {/* Error banner */}
      {saveState === 'error' && errorMsg && (
        <div className="mx-6 mt-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ── Main column ── */}
        <div className="xl:col-span-2 space-y-4">
          {/* Tabs */}
          <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
            {(['content', 'seo'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'text-xs font-semibold px-4 py-1.5 rounded-md transition-colors',
                  activeTab === tab
                    ? 'bg-white text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {tab === 'content' ? 'Konten' : 'SEO'}
              </button>
            ))}
          </div>

          {activeTab === 'content' && (
            <div className="space-y-4">
              {/* Judul */}
              <div className="bg-white rounded-xl border border-border p-5">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Judul Utama <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                  rows={2}
                  className="w-full text-xl font-serif font-bold border-0 outline-none resize-none text-foreground leading-snug"
                  placeholder="Tulis judul artikel..."
                />
                <p className="text-xs text-muted-foreground mt-1">{form.title.length} karakter</p>
              </div>

              {/* Cover Image — BARU */}
              <div className="bg-white rounded-xl border border-border p-5">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Foto Cover (URL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={form.coverImageUrl}
                    onChange={e => { set('coverImageUrl', e.target.value); setImagePreview(false) }}
                    placeholder="https://example.com/foto.jpg"
                    className="flex-1 text-sm border border-border rounded-lg px-3 py-2 outline-none focus:border-[var(--navy)] transition-colors"
                  />
                  {form.coverImageUrl && (
                    <button
                      onClick={() => setImagePreview(!imagePreview)}
                      className="px-3 py-2 text-xs border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                    >
                      {imagePreview ? 'Sembunyikan' : 'Preview'}
                    </button>
                  )}
                  {form.coverImageUrl && (
                    <button
                      onClick={() => { set('coverImageUrl', ''); setImagePreview(false) }}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {imagePreview && form.coverImageUrl && (
                  <div className="mt-3 rounded-lg overflow-hidden border border-slate-200">
                    <img
                      src={form.coverImageUrl}
                      alt="Preview cover"
                      className="w-full h-48 object-cover"
                      onError={() => setImagePreview(false)}
                    />
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Masukkan URL gambar langsung. Disarankan ukuran 1200×630px.
                  Contoh sumber gratis: <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="text-[var(--navy)] hover:underline">Unsplash</a>,{' '}
                  <a href="https://pexels.com" target="_blank" rel="noopener noreferrer" className="text-[var(--navy)] hover:underline">Pexels</a>
                </p>
              </div>

              {/* Excerpt */}
              <div className="bg-white rounded-xl border border-border p-5">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Dek / Excerpt</label>
                <textarea
                  value={form.excerpt}
                  onChange={e => set('excerpt', e.target.value)}
                  rows={3}
                  className="w-full text-sm border border-border rounded-lg p-3 outline-none resize-none focus:border-[var(--navy)] transition-colors"
                  placeholder="Ringkasan singkat artikel (120–160 karakter ideal)..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {form.excerpt.length} karakter (ideal: 120–160)
                </p>
              </div>

              {/* Body */}
              <div className="bg-white rounded-xl border border-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Isi Artikel</label>
                  <span className="text-xs text-muted-foreground">
                    {form.body.trim() ? form.body.trim().split(/\s+/).length : 0} kata
                  </span>
                </div>
                <textarea
                  value={form.body}
                  onChange={e => set('body', e.target.value)}
                  rows={20}
                  className="w-full text-sm border border-border rounded-lg p-4 outline-none resize-none focus:border-[var(--navy)] transition-colors font-sans leading-relaxed"
                  placeholder="Tulis isi artikel di sini..."
                />
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-border p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Meta Title</label>
                  <input
                    value={form.metaTitle}
                    onChange={e => set('metaTitle', e.target.value)}
                    placeholder="Biarkan kosong untuk menggunakan judul artikel"
                    className="w-full text-sm border border-border rounded-lg px-3 py-2 outline-none focus:border-[var(--navy)] transition-colors"
                  />
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-muted-foreground">{form.metaTitle.length} karakter</p>
                    {form.metaTitle.length > 0 && (
                      <p className={cn('text-xs font-medium', form.metaTitle.length <= 60 ? 'text-green-600' : 'text-red-500')}>
                        {form.metaTitle.length <= 60 ? 'Panjang optimal' : 'Terlalu panjang'}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Meta Description</label>
                  <textarea
                    value={form.metaDesc}
                    onChange={e => set('metaDesc', e.target.value)}
                    rows={3}
                    placeholder="Deskripsi untuk mesin pencari (120–160 karakter)..."
                    className="w-full text-sm border border-border rounded-lg px-3 py-2 outline-none resize-none focus:border-[var(--navy)] transition-colors"
                  />
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-muted-foreground">{form.metaDesc.length} karakter</p>
                    {form.metaDesc.length > 0 && (
                      <p className={cn('text-xs font-medium', form.metaDesc.length >= 120 && form.metaDesc.length <= 160 ? 'text-green-600' : 'text-amber-500')}>
                        {form.metaDesc.length >= 120 && form.metaDesc.length <= 160 ? 'Panjang optimal' : 'Ideal: 120–160 karakter'}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Kata Kunci Utama</label>
                  <input
                    value={form.focusKw}
                    onChange={e => set('focusKw', e.target.value)}
                    placeholder="Contoh: kebijakan ekonomi 2026"
                    className="w-full text-sm border border-border rounded-lg px-3 py-2 outline-none focus:border-[var(--navy)] transition-colors"
                  />
                </div>
              </div>

              {(form.metaTitle || form.title) && (
                <div className="bg-white rounded-xl border border-border p-5">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Preview Google SERP</h3>
                  <div className="border border-border rounded-lg p-4 bg-white">
                    <p className="text-[#1a0dab] text-lg hover:underline cursor-pointer line-clamp-1">{form.metaTitle || form.title}</p>
                    <p className="text-[#006621] text-sm mt-0.5">https://kabarkini.id/...</p>
                    <p className="text-[#545454] text-sm mt-1 line-clamp-2">{form.metaDesc || form.excerpt || 'Meta description akan muncul di sini.'}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <aside className="xl:col-span-1 space-y-4">
          {/* Status */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Status Publikasi
            </h3>
            <select
              value={form.status}
              onChange={e => set('status', e.target.value as ArticleStatus)}
              className="w-full text-sm border border-border rounded-lg px-3 py-2 outline-none focus:border-[var(--navy)] bg-white"
            >
              <option value="draft">Draft</option>
              <option value="review">Kirim ke Review</option>
              <option value="scheduled">Jadwalkan</option>
              <option value="published">Publish Sekarang</option>
            </select>

            {form.status === 'scheduled' && (
              <div className="mt-3">
                <label className="block text-xs text-muted-foreground mb-1.5">
                  Waktu Jadwal <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={e => set('scheduledAt', e.target.value)}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 outline-none focus:border-[var(--navy)]"
                />
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={saveState === 'saving' || saveState === 'saved'}
              className="w-full mt-3 bg-[var(--navy)] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[var(--navy-light)] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {saveState === 'saving' ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</>
              : saveState === 'saved'  ? <><CheckCircle className="w-4 h-4" /> Tersimpan!</>
              : <><Save className="w-4 h-4" /> Simpan Artikel</>}
            </button>
          </div>

          {/* Kategori */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Kategori <span className="text-red-500">*</span>
            </h3>
            {categories.length === 0 ? (
              <p className="text-xs text-slate-400">Memuat kategori...</p>
            ) : (
              <div className="space-y-1.5">
                {categories.map(cat => (
                  <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      value={cat.id}
                      checked={form.categoryId === cat.id}
                      onChange={() => set('categoryId', cat.id)}
                      className="accent-[var(--navy)]"
                    />
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm text-foreground group-hover:text-[var(--navy)] transition-colors">
                      {cat.name}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Tag</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => {
                  const selected = form.selectedTagIds.includes(tag.id)
                  return (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className={cn(
                        'text-xs px-2.5 py-1 rounded-full border transition-colors select-none',
                        selected
                          ? 'bg-[var(--navy)] text-white border-[var(--navy)]'
                          : 'bg-muted text-muted-foreground border-border hover:border-[var(--navy)]'
                      )}
                    >
                      {tag.name}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Flags */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Flag Artikel</h3>
            <div className="space-y-2.5">
              {([
                { label: 'Breaking News',     key: 'isBreaking' as const },
                { label: 'Artikel Unggulan',  key: 'isFeatured' as const },
                { label: 'Sedang Trending',   key: 'isTrending' as const },
              ]).map(({ label, key }) => (
                <label key={key} className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-foreground">{label}</span>
                  <button
                    onClick={() => set(key, !form[key])}
                    className={cn('w-10 h-5 rounded-full relative transition-colors',
                      form[key] ? 'bg-[var(--navy)]' : 'bg-muted border border-border'
                    )}
                    role="switch"
                    aria-checked={!!form[key]}
                  >
                    <div className={cn('absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all',
                      form[key] ? 'left-5' : 'left-0.5'
                    )} />
                  </button>
                </label>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
