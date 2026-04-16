'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, LogIn, AlertCircle, Shield } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Email dan password wajib diisi.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (res.ok) {
        window.location.href = '/admin'
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.message ?? 'Email atau password tidak valid. Coba lagi.')
        setLoading(false)
      }
    } catch {
      setError('Terjadi kesalahan jaringan. Coba lagi.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--navy)] flex items-center justify-center p-4">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Top bar */}
          <div className="bg-[var(--red)] px-8 py-5 text-white text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Shield className="w-5 h-5" aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-widest opacity-80">
                Admin Access
              </span>
            </div>
            <h1 className="font-serif text-2xl font-bold">KabarKini</h1>
            <p className="text-sm opacity-80 mt-0.5">Newsroom Control Panel</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <h2 className="text-lg font-semibold text-foreground mb-1">Masuk ke Dashboard</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Gunakan akun editor atau admin untuk mengakses panel redaksi.
            </p>

            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-5">
                <AlertCircle
                  className="w-4 h-4 text-red-500 mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kabarkini.id"
                  autoComplete="email"
                  required
                  className="w-full border border-border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[var(--navy)] focus:ring-2 focus:ring-[var(--navy)]/10 transition-colors"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    className="w-full border border-border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[var(--navy)] focus:ring-2 focus:ring-[var(--navy)]/10 transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPass ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showPass ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember + forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-muted-foreground">
                  <input type="checkbox" className="w-3.5 h-3.5 accent-[var(--navy)]" />
                  Ingat saya
                </label>
                <button
                  type="button"
                  className="text-[var(--navy)] hover:underline text-xs font-medium"
                >
                  Lupa password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--navy)] hover:bg-[var(--navy-light)] disabled:opacity-60 text-white font-bold py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                      aria-hidden="true"
                    />
                    Memverifikasi...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" aria-hidden="true" />
                    Masuk
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="px-8 pb-6 text-center">
            <Link
              href="/"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              &larr; Kembali ke situs utama
            </Link>
          </div>
        </div>

        {/* Brand tag */}
        <p className="text-center text-slate-500 text-xs mt-5">
          &copy; {new Date().getFullYear()} KabarKini &mdash; Fakta Cepat. Analisis Tepat.
        </p>
      </div>
    </div>
  )
}
