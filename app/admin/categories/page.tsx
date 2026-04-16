'use client'

import { useState } from 'react'
import { FolderOpen, Plus, Pencil, Trash2, ExternalLink, BarChart3 } from 'lucide-react'
import { CATEGORIES, ARTICLES } from '@/lib/mock-data'
import Link from 'next/link'

export default function CategoriesPage() {
  const [editing, setEditing] = useState<string | null>(null)

  const categoriesWithCount = CATEGORIES.map((cat) => ({
    ...cat,
    liveCount: ARTICLES.filter((a) => a.category.id === cat.id && a.status === 'published').length,
    totalCount: ARTICLES.filter((a) => a.category.id === cat.id).length,
  }))

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-800 flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-[var(--navy)]" />
            Manajemen Kategori
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {CATEGORIES.length} kategori aktif — kelola nama, slug, warna, dan deskripsi
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[var(--navy)] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[var(--navy-light)] transition-colors">
          <Plus className="w-4 h-4" />
          Tambah Kategori
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Kategori', value: CATEGORIES.length },
          { label: 'Total Artikel',  value: ARTICLES.length },
          { label: 'Artikel Terbit', value: ARTICLES.filter((a) => a.status === 'published').length },
          { label: 'Rata-rata/Kategori', value: Math.round(ARTICLES.length / CATEGORIES.length) },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold font-serif text-[var(--navy)]">{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Category list */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
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
            {categoriesWithCount.map((cat) => (
              <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="font-semibold text-slate-800">{cat.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{cat.slug}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded border border-slate-200"
                      style={{ backgroundColor: cat.color }}
                    />
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
                      onClick={() => setEditing(cat.id)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors rounded"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Distribution chart */}
      <div className="bg-white border border-border rounded-xl p-5">
        <h2 className="font-serif font-bold text-base text-slate-800 mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[var(--navy)]" />
          Distribusi Artikel per Kategori
        </h2>
        <div className="space-y-3">
          {categoriesWithCount
            .sort((a, b) => b.liveCount - a.liveCount)
            .map((cat) => {
              const max = Math.max(...categoriesWithCount.map((c) => c.liveCount))
              const pct = max > 0 ? (cat.liveCount / max) * 100 : 0
              return (
                <div key={cat.id} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-700 w-28 shrink-0">{cat.name}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: cat.color }}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-700 w-8 text-right">{cat.liveCount}</span>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
