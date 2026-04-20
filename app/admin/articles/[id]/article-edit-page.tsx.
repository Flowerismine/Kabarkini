'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import {
  ArrowLeft, Save, CheckCircle, AlertCircle, Loader2, Image as ImageIcon, X, Sparkles, RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ArticleStatus } from '@/types'

interface ArticleForm {
  title:          string
  excerpt:        string
  metaTitle:      string
  metaDesc:       string
  focusKw:        string
  body:           string
  coverImageUrl:  string
  categoryId:     string
  status:         ArticleStatus
  scheduledAt:    string
  isBreaking:     boolean
  isFeatured:     boolean
  isTrending:     boolean
  selectedTagIds: string[]
}

const EMPTY_FORM: ArticleForm = {
  title: '', excerpt: '', metaTitle: '', metaDesc: '', focusKw: '',
  body: '', coverImageUrl: '', categoryId: '', status: 'draft',
  scheduledAt: '', isBreaking: false, isFeatured: false, isTrending: false,
  selectedTagIds: [],
}

interface Category { id: string; name: string; color: string }
interface Tag      { id: string; name: string; slug: string  }

export default function EditArticlePage() {
  const router   = useRouter()
  const params   = useParams()
  const articleId = params?.id as string

  const [form, setForm]             = useState<ArticleForm>(EMPTY_FORM)
  const [activeTab, setActiveTab]   = useState<'content' | 'seo'>('content')
  const [saveState, setSaveState]   = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [errorMsg, setErrorMsg]     = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags]             = useState<Tag[]>([])
  const [imagePreview, setImagePreview] = useState(false)
  const [loading, setLoading]       = useState(true)

  // AI Rewrite state
  const [rewriting, setRewriting]   = useState(false)
  const [rewriteError, setRewriteError] = useState('')
  const editorRef = useRef<HTMLDivElement>(null)

  const isNew = !articleId || articleId === 'new'

  // Sync contentEditable → form.body
  const handleEditorInput = useCallback(() => {
    if (editorRef.current) {
      set('body', editorRef.current.innerHTML)
    }
  }, [])

  // Sync form.body → contentEditable on load (only when not focused)
  useEffect(() => {
    if (editorRef.current && !editorRef.current.contains(document.activeElement)) {
      if (editorRef.current.innerHTML !== form.body) {
        editorRef.current.innerHTML = form.body
      }
    }
  }, [form.body])

  const execCmd = (cmd: string, value?: string) => {
    editorRef.current?.focus()
    document.execCommand(cmd, false, value)
    handleEditorInput()
  }


  // Load article data if editing
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [catRes, tagRes] = await Promise.all([
          fetch('/api/categories').then(r => r.json()),
          fetch('/api/tags').then(r => r.json()).catch(() => ({ tags: [] })),
        ])
        setCategories(catRes.categories ?? [])
        setTags(tagRes.tags ?? [])

        if (!isNew) {
          const artRes = await fetch(`/api/articles/${articleId}`)
          if (!artRes.ok) throw new Error('Artikel tidak ditemukan')
          const { article, tagIds } = await artRes.json()

          setForm({
            title:          article.title          ?? '',
            excerpt:        article.excerpt         ?? '',
            metaTitle:      article.metaTitle       ?? '',
            metaDesc:       article.metaDescription ?? '',
            focusKw:        article.focusKeyword    ?? '',
            body:           article.articleText     ?? '',
            coverImageUrl:  article.coverImageUrl   ?? '',
            categoryId:     article.category?.id    ?? '',
            status:         article.status          ?? 'draft',
            scheduledAt:    article.scheduledAt     ?? '',
            isBreaking:     article.isBreaking      ?? false,
            isFeatured:     article.isFeatured      ?? false,
            isTrending:     article.isTrending      ?? false,
            selectedTagIds: tagIds                  ?? [],
          })
        }
      } catch (e) {
        setErrorMsg(e instanceof Error ? e.message : 'Gagal memuat artikel')
        setSaveState('error')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [articleId, isNew])

  const set = <K extends keyof ArticleForm>(key: K, value: ArticleForm[K]) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const toggleTag = (tagId: string) =>
    set('selectedTagIds',
      form.selectedTagIds.includes(tagId)
        ? form.selectedTagIds.filter(id => id !== tagId)
        : [...form.selectedTagIds, tagId]
    )

  // ── AI Rewrite ──────────────────────────────────────────────
  const handleAiRewrite = async () => {
    if (!form.title && !form.body) {
      setRewriteError('Judul atau isi artikel harus ada terlebih dahulu.')
      return
    }
    setRewriting(true)
    setRewriteError('')

    try {
      const res = await fetch('/api/articles/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title:   form.title,
          body:    form.body,
          excerpt: form.excerpt,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `Error ${res.status}`)
      if (!data.body) throw new Error('Respons AI kosong')

      set('body', data.body)
    } catch (e) {
      setRewriteError(e instanceof Error ? e.message : 'Gagal menghubungi AI')
    } finally {
      setRewriting(false)
    }
  }

  // ── Save ────────────────────────────────────────────────────
  const validate = (): string | null => {
    if (!form.title.trim()) return 'Judul tidak boleh kosong.'
    if (!form.categoryId)   return 'Pilih kategori terlebih dahulu.'
    if (form.status === 'scheduled' && !form.scheduledAt)
      return 'Waktu jadwal wajib diisi jika status Terjadwal.'
    return null
  }

  const handleSave = async () => {
    const err = validate()
    if (err) { setErrorMsg(err); setSaveState('error'); return }
    setSaveState('saving')
    setErrorMsg('')

    const payload = {
      title:           form.title.trim(),
      excerpt:         form.excerpt.trim(),
      metaTitle:       form.metaTitle.trim() || form.title.trim(),
      metaDescription: form.metaDesc.trim(),
      focusKeyword:    form.focusKw.trim(),
      articleText:     editorRef.current?.innerText?.trim() ?? form.body.trim(),
      articleHtml:     form.body.trim(),
      coverImageUrl:   form.coverImageUrl.trim(),
      categoryId:      form.categoryId,
      tagIds:          form.selectedTagIds,
      status:          form.status,
      scheduledAt:     form.scheduledAt || null,
      isBreaking:      form.isBreaking,
      isFeatured:      form.isFeatured,
      isTrending:      form.isTrending,
    }

    try {
      const res = isNew
        ? await fetch('/api/articles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await fetch(`/api/articles/${articleId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })

      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d?.error || `HTTP ${res.status}`)
      }

      setSaveState('saved')
      setTimeout(() => router.push('/admin/articles'), 1000)
    } catch (e: unknown) {
      setSaveState('error')
      setErrorMsg(e instanceof Error ? e.message : 'Terjadi kesalahan saat menyimpan.')
    }
  }

  // ── Render ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        <span className="ml-3 text-slate-500">Memuat artikel...</span>
      </div>
    )
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
              {form.title || (isNew ? 'Artikel Baru' : 'Edit Artikel')}
            </h1>
            <p className="text-xs text-slate-500">
              {form.status === 'draft' ? 'Draft'
                : form.status === 'review' ? 'Menunggu Review'
                : form.status === 'published' ? 'Terbit'
                : form.status}
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

              {/* Cover Image */}
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
                  Masukkan URL gambar langsung. Disarankan ukuran 1200×630px.{' '}
                  Contoh sumber gratis:{' '}
                  <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="text-[var(--navy)] hover:underline">Unsplash</a>,{' '}
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

              {/* Body + AI Rewrite */}
              <div className="bg-white rounded-xl border border-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Isi Artikel</label>
                    <span className="text-xs text-muted-foreground ml-3">
                      {form.body.trim() ? form.body.trim().split(/\s+/).length : 0} kata
                    </span>
                  </div>

                  {/* AI Rewrite Button */}
                  <button
                    onClick={handleAiRewrite}
                    disabled={rewriting}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 transition-colors disabled:opacity-60"
                  >
                    {rewriting
                      ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Sedang menulis ulang...</>
                      : <><Sparkles className="w-3.5 h-3.5" /> AI Rewrite</>
                    }
                  </button>
                </div>

                {rewriteError && (
                  <div className="mb-3 flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {rewriteError}
                  </div>
                )}

                {rewriting && (
                  <div className="mb-3 flex items-center gap-2 p-3 bg-violet-50 border border-violet-200 rounded-lg text-xs text-violet-700">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    AI sedang menulis ulang artikel berdasarkan judul dan konten yang ada...
                  </div>
                )}

                {/* Toolbar */}
                <div className="flex flex-wrap gap-1 mb-2 p-2 bg-slate-50 border border-border rounded-lg">
                  <button type="button" onMouseDown={e => { e.preventDefault(); execCmd('bold') }}
                    className="px-2.5 py-1 text-xs font-bold border border-border rounded hover:bg-white transition-colors">B</button>
                  <button type="button" onMouseDown={e => { e.preventDefault(); execCmd('italic') }}
                    className="px-2.5 py-1 text-xs italic border border-border rounded hover:bg-white transition-colors">I</button>
                  <button type="button" onMouseDown={e => { e.preventDefault(); execCmd('underline') }}
                    className="px-2.5 py-1 text-xs underline border border-border rounded hover:bg-white transition-colors">U</button>
                  <div className="w-px bg-border mx-1" />
                  <button type="button" onMouseDown={e => { e.preventDefault(); execCmd('formatBlock', 'h2') }}
                    className="px-2.5 py-1 text-xs font-semibold border border-border rounded hover:bg-white transition-colors">H2</button>
                  <button type="button" onMouseDown={e => { e.preventDefault(); execCmd('formatBlock', 'h3') }}
                    className="px-2.5 py-1 text-xs font-semibold border border-border rounded hover:bg-white transition-colors">H3</button>
                  <button type="button" onMouseDown={e => { e.preventDefault(); execCmd('formatBlock', 'p') }}
                    className="px-2.5 py-1 text-xs border border-border rounded hover:bg-white transition-colors">¶ P</button>
                  <div className="w-px bg-border mx-1" />
                  <button type="button" onMouseDown={e => { e.preventDefault(); execCmd('insertUnorderedList') }}
                    className="px-2.5 py-1 text-xs border border-border rounded hover:bg-white transition-colors">• List</button>
                  <button type="button" onMouseDown={e => { e.preventDefault(); execCmd('insertOrderedList') }}
                    className="px-2.5 py-1 text-xs border border-border rounded hover:bg-white transition-colors">1. List</button>
                </div>

                {/* ContentEditable Editor */}
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={handleEditorInput}
                  className="rich-editor"
                  data-placeholder="Tulis isi artikel di sini..."
                />
                {!form.body && (
                  <style>{`.rich-editor:empty:before { content: attr(data-placeholder); color: #94a3b8; pointer-events: none; }`}</style>
                )}
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
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Status Publikasi</h3>
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
                    <span className="text-sm text-foreground group-hover:text-[var(--navy)] transition-colors">{cat.name}</span>
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
                { label: 'Breaking News',    key: 'isBreaking' as const },
                { label: 'Artikel Unggulan', key: 'isFeatured' as const },
                { label: 'Sedang Trending',  key: 'isTrending' as const },
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
