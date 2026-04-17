'use client'

import { useState, useEffect } from 'react'
import {
  UserPlus, Shield, Edit3, Trash2, Mail,
  Clock, CheckCircle, XCircle, Search, Key,
  AlertCircle, X, Save,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type UserRole   = 'superadmin' | 'editor' | 'reviewer' | 'writer'
type UserStatus = 'active' | 'inactive' | 'suspended'

interface AdminUser {
  id: string; name: string; email: string
  role: UserRole; status: UserStatus
  lastLogin: string | null
  articlesPublished: number; articlesReviewed: number
  createdAt: string
}

interface Toast { msg: string; type: 'success' | 'error' }

const ROLE_CONFIG: Record<UserRole, { label: string; color: string }> = {
  superadmin: { label: 'Super Admin', color: 'bg-red-100 text-red-700 border-red-200'     },
  editor:     { label: 'Editor',      color: 'bg-blue-100 text-blue-700 border-blue-200'  },
  reviewer:   { label: 'Reviewer',    color: 'bg-amber-100 text-amber-700 border-amber-200'},
  writer:     { label: 'Penulis',     color: 'bg-green-100 text-green-700 border-green-200'},
}

const STATUS_CONFIG: Record<UserStatus, { label: string; icon: React.ElementType; color: string }> = {
  active:    { label: 'Aktif',        icon: CheckCircle, color: 'text-green-600'  },
  inactive:  { label: 'Tidak Aktif',  icon: Clock,       color: 'text-slate-400'  },
  suspended: { label: 'Diblokir',     icon: XCircle,     color: 'text-red-500'    },
}

const BLANK_INVITE = { email: '', role: '' as UserRole | '', name: '' }

export default function AdminUsersPage() {
  const [users, setUsers]               = useState<AdminUser[]>([])
  const [loading, setLoading]           = useState(true)
  const [search, setSearch]             = useState('')
  const [toast, setToast]               = useState<Toast | null>(null)
  const [acting, setActing]             = useState<string | null>(null)

  // Invite form
  const [showInvite, setShowInvite]     = useState(false)
  const [invite, setInvite]             = useState(BLANK_INVITE)
  const [sending, setSending]           = useState(false)

  // Edit modal
  const [editUser, setEditUser]         = useState<AdminUser | null>(null)
  const [editForm, setEditForm]         = useState({ name: '', role: '' as UserRole, status: '' as UserStatus })
  const [editSaving, setEditSaving]     = useState(false)

  const showToast = (msg: string, type: Toast['type'] = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const loadUsers = () => {
    setLoading(true)
    fetch('/api/users')
      .then(r => r.json())
      .then(d => setUsers(d.users ?? []))
      .catch(() => showToast('Gagal memuat pengguna', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadUsers() }, []) // eslint-disable-line

  const filtered = users.filter(
    u =>
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleInvite = async () => {
    if (!invite.email || !invite.role) {
      showToast('Email dan role wajib diisi', 'error'); return
    }
    setSending(true)
    try {
      const res = await fetch('/api/users/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invite),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      showToast(`Undangan dikirim ke ${invite.email}`)
      setInvite(BLANK_INVITE)
      setShowInvite(false)
      loadUsers()
    } catch (e: unknown) {
      showToast((e as Error).message || 'Gagal mengirim undangan', 'error')
    } finally {
      setSending(false)
    }
  }

  const openEdit = (user: AdminUser) => {
    setEditUser(user)
    setEditForm({ name: user.name, role: user.role, status: user.status })
  }

  const handleEditSave = async () => {
    if (!editUser) return
    setEditSaving(true)
    try {
      const res = await fetch(`/api/users/${editUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      showToast('Pengguna berhasil diperbarui')
      setEditUser(null)
      loadUsers()
    } catch (e: unknown) {
      showToast((e as Error).message || 'Gagal memperbarui', 'error')
    } finally {
      setEditSaving(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus akun "${name}"?\nTindakan ini tidak dapat dibatalkan.`)) return
    setActing(id)
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      showToast('Pengguna berhasil dihapus')
      setUsers(prev => prev.filter(u => u.id !== id))
    } catch (e: unknown) {
      showToast((e as Error).message || 'Gagal menghapus', 'error')
    } finally {
      setActing(null)
    }
  }

  return (
    <div className="p-6 space-y-5">
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

      {/* Edit modal */}
      {editUser && (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-slate-800">Edit Pengguna</h3>
              <button onClick={() => setEditUser(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Nama</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--navy)]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Role</label>
                <select
                  value={editForm.role}
                  onChange={e => setEditForm(f => ({ ...f, role: e.target.value as UserRole }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--navy)]"
                >
                  {Object.entries(ROLE_CONFIG).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={e => setEditForm(f => ({ ...f, status: e.target.value as UserStatus }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--navy)]"
                >
                  {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleEditSave}
                disabled={editSaving}
                className="flex-1 flex items-center justify-center gap-2 bg-[var(--navy)] hover:bg-[var(--navy-light)] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                {editSaving ? 'Menyimpan…' : 'Simpan'}
              </button>
              <button
                onClick={() => setEditUser(null)}
                className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-serif font-bold text-slate-800">Pengguna & Roles</h1>
          <p className="text-sm text-slate-500 mt-0.5">Kelola akun editor, reviewer, dan penulis newsroom.</p>
        </div>
        <button
          onClick={() => setShowInvite(!showInvite)}
          className="flex items-center gap-2 text-sm bg-[var(--navy)] text-white px-4 py-2 rounded-lg hover:bg-[var(--navy-light)] transition-colors font-semibold"
        >
          <UserPlus className="w-4 h-4" /> Undang Pengguna
        </button>
      </div>

      {/* Invite form */}
      {showInvite && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-600" /> Undang Anggota Baru
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Nama (opsional)"
              value={invite.name}
              onChange={e => setInvite(f => ({ ...f, name: e.target.value }))}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--navy)] bg-white"
            />
            <input
              type="email"
              placeholder="Alamat email *"
              value={invite.email}
              onChange={e => setInvite(f => ({ ...f, email: e.target.value }))}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--navy)] bg-white"
            />
            <select
              value={invite.role}
              onChange={e => setInvite(f => ({ ...f, role: e.target.value as UserRole }))}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--navy)] bg-white"
            >
              <option value="">Pilih Role *</option>
              {Object.entries(ROLE_CONFIG).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={handleInvite}
                disabled={sending}
                className="flex-1 bg-[var(--navy)] text-white text-sm px-4 py-2 rounded-lg hover:bg-[var(--navy-light)] transition-colors font-medium disabled:opacity-50"
              >
                {sending ? 'Mengirim…' : 'Kirim Undangan'}
              </button>
              <button
                onClick={() => { setShowInvite(false); setInvite(BLANK_INVITE) }}
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
          { label: 'Total Pengguna',      value: users.length                                                          },
          { label: 'Aktif',               value: users.filter(u => u.status === 'active').length                       },
          { label: 'Editor & Reviewer',   value: users.filter(u => ['editor', 'reviewer'].includes(u.role)).length     },
          { label: 'AI Bots',             value: users.filter(u => u.role === 'writer' && u.name.includes('Bot')).length},
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

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Clock className="w-6 h-6 text-slate-300 animate-spin mx-auto mb-2" />
            <p className="text-sm text-slate-400">Memuat pengguna…</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Pengguna', 'Role', 'Status', 'Kontribusi', 'Login Terakhir', 'Aksi'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide first:px-5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((user) => {
                const StatusIcon = STATUS_CONFIG[user.status].icon
                const busy = acting === user.id
                return (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                          style={{ backgroundColor: `hsl(${user.id.charCodeAt(0) * 40 % 360}, 55%, 45%)` }}
                        >
                          {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
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
                        ROLE_CONFIG[user.role]?.color
                      )}>
                        <Shield className="w-3 h-3" />
                        {ROLE_CONFIG[user.role]?.label}
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
                        {user.articlesReviewed > 0  && <div>{user.articlesReviewed} artikel direview</div>}
                        {user.articlesPublished === 0 && user.articlesReviewed === 0 && <span className="text-slate-300">—</span>}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500">
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                        : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEdit(user)}
                          className="p-1.5 text-slate-400 hover:text-[var(--navy)] hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Reset Password"
                          onClick={() => showToast('Fitur reset password akan segera tersedia')}
                        >
                          <Key className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          disabled={busy}
                          className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                          title="Hapus"
                        >
                          {busy ? <Clock className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Role permission matrix — unchanged from original */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[var(--navy)]" /> Matriks Izin Role
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
                { label: 'Menulis artikel',           roles: ['superadmin', 'editor', 'writer']                   },
                { label: 'Mereview artikel',          roles: ['superadmin', 'editor', 'reviewer']                  },
                { label: 'Menerbitkan artikel',       roles: ['superadmin', 'editor']                              },
                { label: 'Mengelola kategori & tag',  roles: ['superadmin']                                        },
                { label: 'Mengelola sumber',          roles: ['superadmin', 'editor']                              },
                { label: 'Mengatur workflow AI',      roles: ['superadmin']                                        },
                { label: 'Mengelola pengguna',        roles: ['superadmin']                                        },
                { label: 'Mengatur iklan & SEO',      roles: ['superadmin']                                        },
              ].map((perm) => (
                <tr key={perm.label} className="hover:bg-slate-50/50">
                  <td className="py-2 pr-4 text-slate-600">{perm.label}</td>
                  {Object.keys(ROLE_CONFIG).map((role) => (
                    <td key={role} className="py-2 px-3 text-center">
                      {perm.roles.includes(role)
                        ? <CheckCircle className="w-3.5 h-3.5 text-green-500 mx-auto" />
                        : <XCircle    className="w-3.5 h-3.5 text-slate-200 mx-auto" />}
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
