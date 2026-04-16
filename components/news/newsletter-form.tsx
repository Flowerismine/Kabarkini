'use client'

import { useState } from 'react'

interface NewsletterFormProps {
  variant?: 'default' | 'footer'
}

export function NewsletterForm({ variant = 'default' }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      setEmail('')
    }, 800)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-4">
        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-white font-semibold text-sm">Berhasil! Cek inbox Anda untuk konfirmasi.</p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-slate-400 text-xs hover:text-slate-300 transition-colors underline"
        >
          Daftar email lain
        </button>
      </div>
    )
  }

  const inputClass =
    variant === 'footer'
      ? 'flex-1 md:w-72 px-4 py-2.5 rounded-md bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--red)]'
      : 'flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-white/50'

  const btnClass =
    variant === 'footer'
      ? 'bg-[var(--red)] hover:bg-red-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-md text-sm transition-colors whitespace-nowrap'
      : 'bg-[var(--red)] hover:bg-red-700 disabled:opacity-60 text-white font-bold px-6 py-3 rounded-lg text-sm transition-colors whitespace-nowrap'

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex gap-2 ${variant === 'footer' ? 'flex-row' : 'flex-col sm:flex-row mt-6'}`}
      noValidate
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Alamat email
      </label>
      <input
        id="newsletter-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email Anda..."
        required
        className={inputClass}
      />
      <button
        type="submit"
        disabled={loading || !email}
        className={btnClass}
      >
        {loading ? 'Memproses...' : 'Berlangganan Gratis'}
      </button>
    </form>
  )
}
