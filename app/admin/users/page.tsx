'use client'

import { useState } from 'react'
import {
  UserPlus,
  Shield,
  Edit3,
  Trash2,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Key,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type UserRole = 'superadmin' | 'admin' | 'editor' | 'reviewer' | 'writer'
type UserStatus = 'active' | 'inactive' | 'suspended'

interface AdminUser {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  lastLogin: string
  articlesPublished: number
  articlesReviewed: number
  createdAt: string
}

const MOCK_USERS: AdminUser[] = [
  {
    id: 'u1',
    name: 'Budi Santoso',
    email: 'budi@kabarkini.id',
    role: 'superadmin',
    status: 'active',
    lastLogin: '2026-04-15T08:30:00Z',
    articlesPublished: 0,
    articlesReviewed: 142,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'u2',
    name: 'Siti Rahayu',
    email: 'siti@kabarkini.id',
    role: 'editor',
    status: 'active',
    lastLogin: '2026-04-15T07:15:00Z',
    articlesPublished: 58,
    articlesReviewed: 97,
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'u3',
    name: 'AI News Bot',
    email: 'bot@kabarkini.id',
    role: 'writer',
    status: 'active',
    lastLogin: '2026-04-15T06:30:00Z',
    articlesPublished: 432,
    articlesReviewed: 0,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'u4',
    name: 'Agus Permana',
    email: 'agus@kabarkini.id',
    role: 'reviewer',
    status: 'active',
    lastLogin: '2026-04-14T18:00:00Z',
    articlesPublished: 0,
    articlesReviewed: 67,
    createdAt: '2026-02-01T00:00:00Z',
  },
  {
    id: 'u5',
    name: 'Diana Putri',
    email: 'diana@kabarkini.id',
    role: 'writer',
    status: 'inactive',
    lastLogin: '2026-03-01T10:00:00Z',
    articlesPublished: 12,
    articlesReviewed: 0,
    createdAt: '2026-02-15T00:00:00Z',
  },
]

const ROLE_CONFIG: Record<UserRole, { label: string; color: string }> = {
  superadmin: { label: 'Super Admin', color: 'bg-red-100 text-red-700 border-red-200' },
  admin: { label: 'Admin', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  editor: { label: 'Editor', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  reviewer: { label: 'Reviewer', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  writer: { label: 'Penulis', color: 'bg-green-100 text-green-700 border-green-200' },
}

const STATUS_CONFIG: Record<UserStatus, { label: string; icon: React.ElementType; color: string }> = {
  active: { label: 'Aktif', icon: CheckCircle, color: 'text-green-600' },
  inactive: { label: 'Tidak Aktif', icon: Clock, color: 'text-slate-400' },
  suspended: { label: 'Diblokir', icon: XCircle, color: 'text-red-500' },
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState('')
  const [showInviteForm, setShowInviteForm] = useState(false)

  const filtered = MOCK_USERS.filter(
    (u) =>
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-serif font-bold text-slate-800">Pengguna & Roles</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Kelola akun editor, reviewer, dan penulis newsroom.
          </p>
        </div>
        <button
          onClick={() => setShowInviteForm(!showInviteForm)}
          className="flex items-center gap-2 text-sm bg-[var(--navy)] text-white px-4 py-2 rounded-lg hover:bg-[var(--navy-light)] transition-colors font-semibold"
        >
          <UserPlus className="w-4 h-4" />
          Undang Pengguna
        </button>
      </div>

      {/* Invite form */}
      {showInviteForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-600" />
            Undang Anggota Baru
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="email"
              placeholder="Alamat email..."
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--navy)] bg-white"
            />
            <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--navy)] bg-white">
              <option value="">Pilih Role</option>
              {Object.entries(ROLE_CONFIG).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button className="flex-1 bg-[var(--navy)] text-white text-sm px-4 py-2 rounded-lg hover:bg-[var(--navy-light)] transition-colors font-medium">
                Kirim Undangan
              </button>
              <button
                onClick={() => setShowInviteForm(false)}
                className="px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Pengguna', value: MOCK_USERS.length },
          { label: 'Aktif', value: MOCK_USERS.filter((u) => u.status === 'active').length },
          { label: 'Editor & Reviewer', value: MOCK_USERS.filter((u) => ['editor', 'reviewer'].includes(u.role)).length },
          { label: 'AI Bots', value: MOCK_USERS.filter((u) => u.role === 'writer' && u.name.includes('Bot')).length },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-2xl font-bold text-slate-800">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 max-w-md">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Cari nama atau email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-sm text-slate-700 flex-1 focus:outline-none bg-transparent"
        />
      </div>

      {/* Users table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Pengguna</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Kontribusi</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Login Terakhir</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((user) => {
              const StatusIcon = STATUS_CONFIG[user.status].icon
              return (
                <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar initials */}
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                        style={{ backgroundColor: `hsl(${user.id.charCodeAt(1) * 40}, 60%, 45%)` }}
                      >
                        {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-700">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={cn(
                      'inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded border',
                      ROLE_CONFIG[user.role].color
                    )}>
                      <Shield className="w-3 h-3" />
                      {ROLE_CONFIG[user.role].label}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={cn('flex items-center gap-1 text-xs font-semibold', STATUS_CONFIG[user.status].color)}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {STATUS_CONFIG[user.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs text-slate-500">
                    <div className="space-y-0.5">
                      {user.articlesPublished > 0 && <div>{user.articlesPublished} artikel terbit</div>}
                      {user.articlesReviewed > 0 && <div>{user.articlesReviewed} artikel direview</div>}
                      {user.articlesPublished === 0 && user.articlesReviewed === 0 && <span className="text-slate-300">—</span>}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-xs text-slate-500">
                    {new Date(user.lastLogin).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                    })}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <button className="p-1.5 text-slate-400 hover:text-[var(--navy)] hover:bg-slate-100 rounded-lg transition-colors" title="Edit">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Reset Password">
                        <Key className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Role permission matrix */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[var(--navy)]" />
          Matriks Izin Role
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-2 pr-4 text-left text-slate-500 font-semibold">Izin</th>
                {Object.entries(ROLE_CONFIG).map(([key, val]) => (
                  <th key={key} className="py-2 px-3 text-center text-slate-600 font-semibold">{val.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { label: 'Menulis artikel', roles: ['superadmin', 'admin', 'editor', 'writer'] },
                { label: 'Mereview artikel', roles: ['superadmin', 'admin', 'editor', 'reviewer'] },
                { label: 'Menerbitkan artikel', roles: ['superadmin', 'admin', 'editor'] },
                { label: 'Mengelola kategori & tag', roles: ['superadmin', 'admin'] },
                { label: 'Mengelola sumber', roles: ['superadmin', 'admin', 'editor'] },
                { label: 'Mengatur workflow AI', roles: ['superadmin', 'admin'] },
                { label: 'Mengelola pengguna', roles: ['superadmin'] },
                { label: 'Mengatur iklan & SEO', roles: ['superadmin', 'admin'] },
              ].map((perm) => (
                <tr key={perm.label} className="hover:bg-slate-50/50">
                  <td className="py-2 pr-4 text-slate-600">{perm.label}</td>
                  {Object.keys(ROLE_CONFIG).map((role) => (
                    <td key={role} className="py-2 px-3 text-center">
                      {perm.roles.includes(role) ? (
                        <CheckCircle className="w-3.5 h-3.5 text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-slate-200 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
