import type { Metadata } from 'next'
import { Globe, CheckCircle, ExternalLink, Newspaper } from 'lucide-react'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { BreakingTicker } from '@/components/layout/breaking-ticker'
import { SAMPLE_SOURCES } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: 'Sumber Berita',
  description: 'Daftar lengkap sumber berita terpercaya yang digunakan KabarKini dalam proses pengumpulan dan verifikasi informasi.',
}

const TIER_CONFIG = {
  1: { label: 'Tier 1 — Primer', desc: 'Sumber utama berbobot tinggi, selalu diprioritaskan', color: 'text-[var(--navy)]', bg: 'bg-[var(--navy)]/5 border-[var(--navy)]/20' },
  2: { label: 'Tier 2 — Sekunder', desc: 'Sumber pendukung dengan reputasi baik', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  3: { label: 'Tier 3 — Tersier', desc: 'Sumber pelengkap, selalu diverifikasi silang', color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200' },
}

export default function SumberPage() {
  const grouped = {
    1: SAMPLE_SOURCES.filter((s) => s.tier === 1),
    2: SAMPLE_SOURCES.filter((s) => s.tier === 2),
    3: SAMPLE_SOURCES.filter((s) => s.tier === 3),
  }

  const activeCount = SAMPLE_SOURCES.filter((s) => s.status === 'active').length

  return (
    <>
      <SiteHeader />
      <BreakingTicker />
      <main className="max-w-4xl mx-auto px-4 py-12" id="main-content">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <Globe className="w-7 h-7 text-[var(--navy)]" />
            <h1 className="font-serif text-3xl font-bold text-foreground">Sumber Berita Kami</h1>
          </div>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            Transparansi adalah inti dari jurnalisme kami. Berikut adalah daftar lengkap sumber berita
            yang digunakan KabarKini dalam proses pengumpulan, verifikasi, dan penulisan artikel.
            Setiap artikel selalu mencantumkan sumber referensinya secara eksplisit.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Sumber Aktif', value: activeCount },
            { label: 'Tier Prioritas', value: 3 },
            { label: 'Update per Hari', value: '3×' },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-border rounded-xl p-4 text-center">
              <p className="text-2xl font-bold font-serif text-[var(--navy)]">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Editorial policy note */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-10 flex gap-4">
          <Newspaper className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800 mb-1">Kebijakan Sumber</p>
            <p className="text-sm text-amber-700 leading-relaxed">
              KabarKini hanya menggunakan sumber yang memiliki rekam jejak editorial yang jelas dan
              bertanggung jawab. Kami tidak menggunakan blog pribadi, akun media sosial anonim, atau
              sumber tanpa editor sebagai referensi utama. Semua fakta kritis diverifikasi dari
              minimal dua sumber independen sebelum dipublikasikan.
            </p>
          </div>
        </div>

        {/* Sources by tier */}
        <div className="space-y-8">
          {([1, 2, 3] as const).map((tier) => {
            const cfg = TIER_CONFIG[tier]
            const sources = grouped[tier]
            if (sources.length === 0) return null

            return (
              <section key={tier}>
                <div className={`rounded-xl border p-5 ${cfg.bg} mb-4`}>
                  <h2 className={`font-serif font-bold text-lg ${cfg.color}`}>{cfg.label}</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">{cfg.desc}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sources.map((source) => (
                    <div
                      key={source.id}
                      className="bg-white border border-border rounded-xl p-4 flex items-start gap-4 hover:border-[var(--navy)]/30 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                        <Globe className="w-5 h-5 text-slate-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-semibold text-slate-800 text-sm">{source.name}</span>
                          {source.status === 'active' && (
                            <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{source.category}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {source.categories?.map((cat: string) => (
                            <span key={cat} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                      {source.url && (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-[var(--navy)] transition-colors shrink-0"
                          aria-label={`Kunjungi ${source.name}`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
