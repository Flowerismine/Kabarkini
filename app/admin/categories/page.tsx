'use client'

import { useState, useEffect } from 'react'
import {
  FolderOpen, Plus, Pencil, Trash2, ExternalLink,
  BarChart3, CheckCircle, AlertCircle, X, Clock,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Category {
  id: string; name: string; slug: string
  color: string; description: string
  liveCount: number; totalCount: number
}

interface Toast { msg: string; type: 'success' | 'error' }

const toSlug = (s: string) =>
  s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-')

const BLANK_FORM = { name: '', slug: '', color: '#374151', description: '' }

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [totalArticles, setTotalArticles] = useState(0)
  const [loading, setLoading]     = useState(true)
  const [toast, setToast]         = useState<Toast | null>(null)
  const [acting, setActing]       = useState<string | null>(null)

  // Form state (shared add / edit)
  const [showForm, setShowForm]   = useState(false)
  const [editId, setEditId]       = useState<string | null>(null)
  const [form, setForm]           = useState(BLANK_FORM)
  const [saving, setSaving]       = useState(false)

  const showToast = (msg: string, type: Toast['type'] = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const loadCategories = () => {
    setLoading(true)
    fetch('/api/categories')
      .then(r => r.json())
      .then(d => {
        setCategories(d.categories ?? [])
        const total = (d.categories ?? []).reduce((s: number, c: Category) => s + c.totalCount, 0)
        setTotalArticles(total)
      })
      .catch(() => showToast('Gagal memuat kategori', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadCategories() }, []) // eslint-disable-line

  const openAdd = () => {
    setEditId(null)
    setForm(BLANK_FORM)
    setShowForm(true)
  }

  const openEdit = (cat: Category) => {
    setEditId(cat.id)
    setForm({ name: cat.name, slug: cat.slug, color: cat.color, description: cat.description })
    setShowForm(true)
  }

  const handleNameChange = (val: string) => {
    setForm(f => ({
      ...f,
      name: val,
      // Auto-generate slug only when adding (not editing)
      ...(!editId && { slug: toSlug(val) }),
    }))
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      showToast('Nama dan slug wajib diisi', 'error'); return
    }
    setSaving(true)
    try {
      const url    = editId ? `/api/categories/${editId}` : '/api/categories'
      const method = editId ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      showToast(editId ? 'Kategori berhasil diperbarui' : 'Kategori berhasil ditambahkan')
      setShowForm(false)
      loadCategories()
    } catch (e: unknown) {
      showToast((e as Error).message || 'Gagal menyimpan', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus kategori "${name}"?\nSemua artikel di kategori ini harus dipindahkan terlebih dahulu.`)) return
    setActing(id)
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      showToast('Kategori berhasil dihapus')
      loadCategories()
    } catch (e: unknown) {
      showToast((e as Error).message || 'Gagal menghapus', 'error')
    } finally {
      setActing(null)
    }
  }

  const publishedTotal = categories.reduce((s, c) => s + c.liveCount, 0)
  const maxLive = Math.max(...categories.map(c => c.liveCount), 1)

  return (
    <div className="p-6 space-y-6">
      {/* Toast */}
      {toast && (
        <div className={cn(
          'fixed top-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2',
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        )}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Add / Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-slate-800">
                {editId ? 'Edit Kategori' : 'Tambah Kategori'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Nama</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => handleNameChange(e.target.value)}
                  placeholder="Contoh: Politik"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--navy)]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={e => setForm(f => ({ ...f, slug: toSlug(e.target.value) }))}
                  placeholder="politik"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--navy)]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Warna</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={form.color}
                    onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                    className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={form.color}
                    onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--navy)]"
                  />
                  <div className="w-10 h-10 rounded-lg border border-slate-200" style={{ backgroundColor: form.color }} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Deskripsi (opsional)</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Deskripsi singkat kategori..."
                  rows={2}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--navy)]"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-[var(--navy)] hover:bg-[var(--navy-light)] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? 'Menyimpan…' : (editId ? 'Simpan Perubahan' : 'Tambah Kategori')}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-800 flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-[var(--navy)]" />
            Manajemen Kategori
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {categories.length} kategori aktif — kelola nama, slug, warna, dan deskripsi
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[var(--navy)] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[var(--navy-light)] transition-colors"
        >
          <Plus className="w-4 h-4" /> Tambah Kategori
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Kategori',       value: categories.length                    },
          { label: 'Total Artikel',        value: totalArticles                        },
          { label: 'Artikel Terbit',       value: publishedTotal                       },
          { label: 'Rata-rata/Kategori',   value: categories.length > 0 ? Math.round(totalArticles / categories.length) : 0 },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold font-serif text-[var(--navy)]">{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Clock className="w-6 h-6 text-slate-300 animate-spin mx-auto mb-2" />
            <p className="text-sm text-slate-400">Memuat kategori…</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Kategori</th>
                <th className="px-4 py-3 text-left">Slug</th>
                <th className="px-4 py-3 text-left">Warna</th>
                <th className="px-4 py-3 text-center">Terbit</th>
                <th className="px-4 py-3 text-center">Total</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="font-semibold text-slate-800">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{cat.slug}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded border border-slate-200" style={{ backgroundColor: cat.color }} />
                      <span className="font-mono text-xs text-slate-500">{cat.color}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-bold text-green-700">{cat.liveCount}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-bold text-slate-700">{cat.totalCount}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <Link
                        href={`/kategori/${cat.slug}`}
                        target="_blank"
                        className="p-1.5 text-slate-400 hover:text-[var(--navy)] transition-colors rounded"
                        title="Lihat di website"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => openEdit(cat)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors rounded"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        disabled={acting === cat.id}
                        className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded disabled:opacity-40"
                        title="Hapus"
                      >
                        {acting === cat.id
                          ? <Clock className="w-3.5 h-3.5 animate-spin" />
                          : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Distribution chart */}
      <div className="bg-white border border-border rounded-xl p-5">
        <h2 className="font-serif font-bold text-base text-slate-800 mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[var(--navy)]" />
          Distribusi Artikel per Kategori
        </h2>
        <div className="space-y-3">
          {[...categories].sort((a, b) => b.liveCount - a.liveCount).map((cat) => (
            <div key={cat.id} className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-700 w-28 shrink-0">{cat.name}</span>
              <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${(cat.liveCount / maxLive) * 100}%`, backgroundColor: cat.color }}
                />
              </div>
              <span className="text-sm font-bold text-slate-700 w-8 text-right">{cat.liveCount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
