'use client'

import { useState } from 'react'
import { Mail, MessageCircle, AlertTriangle, Newspaper, Send, CheckCircle } from 'lucide-react'

const CONTACT_TOPICS = [
  { id: 'koreksi', label: 'Koreksi Faktual', icon: AlertTriangle },
  { id: 'editorial', label: 'Pertanyaan Editorial', icon: Newspaper },
  { id: 'kerjasama', label: 'Kerjasama Media', icon: Newspaper },
  { id: 'teknis', label: 'Laporan Teknis', icon: MessageCircle },
  { id: 'lainnya', label: 'Lainnya', icon: Mail },
]

export function ContactForm() {
  const [topic, setTopic] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-10 text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h2 className="font-serif font-bold text-xl text-foreground mb-2">Pesan Terkirim!</h2>
        <p className="text-muted-foreground text-sm">
          Terima kasih telah menghubungi kami. Tim redaksi akan merespons ke{' '}
          <strong>{form.email}</strong> dalam waktu singkat.
        </p>
        <button
          onClick={() => {
            setSubmitted(false)
            setForm({ name: '', email: '', subject: '', message: '' })
          }}
          className="mt-6 text-sm font-semibold text-[var(--navy)] hover:text-[var(--navy-light)] transition-colors underline"
        >
          Kirim pesan lain
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-border rounded-xl p-6 space-y-5">
      <h2 className="font-serif font-bold text-base text-foreground border-b border-border pb-3">
        Formulir Kontak
      </h2>

      {/* Topic picker */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-2">Topik Pesan</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {CONTACT_TOPICS.map((t) => (
            <button
              type="button"
              key={t.id}
              onClick={() => setTopic(t.id)}
              className={`text-left p-3 rounded-lg border text-sm transition-colors ${
                topic === t.id
                  ? 'border-[var(--navy)] bg-[var(--navy)]/5 text-[var(--navy)]'
                  : 'border-border text-slate-600 hover:border-slate-300'
              }`}
            >
              <span className="font-semibold">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Name & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5" htmlFor="name">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Nama Anda"
            className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--navy)] text-slate-800"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5" htmlFor="email">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="email@anda.com"
            className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--navy)] text-slate-800"
          />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5" htmlFor="subject">
          Subjek <span className="text-red-500">*</span>
        </label>
        <input
          id="subject"
          type="text"
          required
          value={form.subject}
          onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
          placeholder="Topik pesan Anda"
          className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--navy)] text-slate-800"
        />
      </div>

      {/* Message */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5" htmlFor="message">
          Pesan <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          placeholder="Tulis pesan Anda di sini..."
          className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--navy)] text-slate-800 resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-[var(--navy)] text-white font-semibold py-3 rounded-lg hover:bg-[var(--navy-light)] transition-colors"
      >
        <Send className="w-4 h-4" />
        Kirim Pesan
      </button>
    </form>
  )
}
