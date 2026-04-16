'use client'

import { useState } from 'react'
import { Tag, Plus, Pencil, Trash2, Search } from 'lucide-react'
import { TAGS } from '@/lib/mock-data'

export default function TagsPage() {
  const [search, setSearch] = useState('')
  const filtered = TAGS.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-800 flex items-center gap-2">
            <Tag className="w-6 h-6 text-[var(--navy)]" />
            Manajemen Tag
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">{TAGS.length} tag aktif di sistem</p>
        </div>
        <button className="flex items-center gap-2 bg-[var(--navy)] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[var(--navy-light)] transition-colors">
          <Plus className="w-4 h-4" />
          Tambah Tag
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Cari tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--navy)]"
        />
      </div>

      {/* Tag cloud visual */}
      <div className="bg-white border border-border rounded-xl p-5">
        <h2 className="font-serif font-bold text-sm text-slate-700 mb-4 border-b border-border pb-3">
          Tag Cloud
        </h2>
        <div className="flex flex-wrap gap-2">
          {filtered.map((tag) => {
            const size = tag.articleCount && tag.articleCount > 25 ? 'text-base' : tag.articleCount && tag.articleCount > 15 ? 'text-sm' : 'text-xs'
            return (
              <span
                key={tag.id}
                className={`${size} font-semibold bg-slate-100 hover:bg-[var(--navy)] hover:text-white text-slate-700 px-3 py-1.5 rounded-full cursor-pointer transition-colors`}
              >
                #{tag.name}
                <span className="ml-1.5 text-[10px] opacity-60">{tag.articleCount}</span>
              </span>
            )
          })}
        </div>
      </div>

      {/* Tag table */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
              <th className="px-4 py-3 text-left">Nama Tag</th>
              <th className="px-4 py-3 text-left">Slug</th>
              <th className="px-4 py-3 text-center">Jumlah Artikel</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((tag) => (
              <tr key={tag.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-semibold text-slate-800">#{tag.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{tag.slug}</td>
                <td className="px-4 py-3 text-center">
                  <span className="font-bold text-[var(--navy)]">{tag.articleCount}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors rounded" title="Edit">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded" title="Hapus">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-sm">
            Tidak ada tag yang cocok dengan pencarian ini
          </div>
        )}
      </div>
    </div>
  )
}
