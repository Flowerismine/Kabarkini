import type { Metadata } from 'next'
import { Globe, CheckCircle, ExternalLink, Newspaper } from 'lucide-react'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { BreakingTicker } from '@/components/layout/breaking-ticker'

export const metadata: Metadata = {
  title:       'Sumber Berita',
  description: 'Daftar lengkap sumber berita terpercaya yang digunakan KabarKini dalam proses pengumpulan dan verifikasi informasi.',
}

const SOURCES = [
  // Tier 1 — Primer
  {
    tier: 1 as const,
    name: 'ANTARA News',
    url:  'https://www.antaranews.com',
    type: 'Kantor Berita Nasional',
    trustScore: 95,
    desc: 'Kantor berita resmi Indonesia, sumber primer untuk berita domestik.',
    logo: 'ANTARA',
  },
  {
    tier: 1 as const,
    name: 'Kompas.com',
    url:  'https://www.kompas.com',
    type: 'Media Nasional',
    trustScore: 92,
    desc: 'Media online terbesar Indonesia dengan standar editorial ketat.',
    logo: 'KOMPAS',
  },
  {
    tier: 1 as const,
    name: 'CNN Indonesia',
    url:  'https://www.cnnindonesia.com',
    type: 'Media Nasional',
    trustScore: 90,
    desc: 'Berita nasional dan internasional dengan tim redaksi profesional.',
    logo: 'CNN ID',
  },
  {
    tier: 1 as const,
    name: 'Tempo.co',
    url:  'https://www.tempo.co',
    type: 'Media Nasional',
    trustScore: 90,
    desc: 'Jurnalisme investigatif dan laporan mendalam berkualitas tinggi.',
    logo: 'TEMPO',
  },
  // Tier 2 — Sekunder
  {
    tier: 2 as const,
    name: 'Detik.com',
    url:  'https://www.detik.com',
    type: 'Portal Berita',
    trustScore: 88,
    desc: 'Portal berita terbesar dengan cakupan luas dan update cepat.',
    logo: 'detik',
  },
  {
    tier: 2 as const,
    name: 'Republika',
    url:  'https://www.republika.co.id',
    type: 'Media Nasional',
    trustScore: 87,
    desc: 'Media dengan fokus perspektif Islam dan berita nasional.',
    logo: 'REP',
  },
  {
    tier: 2 as const,
    name: 'Bisnis.com',
    url:  'https://www.bisnis.com',
    type: 'Media Bisnis',
    trustScore: 88,
    desc: 'Referensi utama berita ekonomi dan bisnis Indonesia.',
    logo: 'BISNIS',
  },
  {
    tier: 2 as const,
    name: 'Liputan6.com',
    url:  'https://www.liputan6.com',
    type: 'Portal Berita',
    trustScore: 85,
    desc: 'Berita terkini dari berbagai penjuru Indonesia.',
    logo: 'L6',
  },
  // Tier 3 — Official
  {
    tier: 3 as const,
    name: 'Kementerian Komunikasi',
    url:  'https://www.kominfo.go.id',
    type: 'Sumber Resmi Pemerintah',
    trustScore: 99,
    desc: 'Siaran pers dan pengumuman resmi dari Kemenkominfo.',
    logo: 'GOV',
  },
  {
    tier: 3 as const,
    name: 'Bank Indonesia',
    url:  'https://www.bi.go.id',
    type: 'Sumber Resmi Pemerintah',
    trustScore: 99,
    desc: 'Data resmi kebijakan moneter dan ekonomi Indonesia.',
    logo: 'BI',
  },
  {
    tier: 3 as const,
    name: 'OJK',
    url:  'https://www.ojk.go.id',
    type: 'Sumber Resmi Pemerintah',
    trustScore: 99,
    desc: 'Regulasi dan pengumuman sektor keuangan dari OJK.',
    logo: 'OJK',
  },
]

const TIER_CONFIG = {
  1: { label: 'Tier 1 — Primer',   desc: 'Sumber utama berbobot tinggi, selalu diprioritaskan',   color: 'text-[var(--navy)]',  bg: 'bg-[var(--navy)]/5 border-[var(--navy)]/20'   },
  2: { label: 'Tier 2 — Sekunder', desc: 'Sumber pendukung dengan reputasi baik',                  color: 'text-blue-700',       bg: 'bg-blue-50 border-blue-200'                    },
  3: { label: 'Tier 3 — Resmi',    desc: 'Sumber resmi pemerintah, bobot verifikasi tertinggi',    color: 'text-slate-600',      bg: 'bg-slate-50 border-slate-200'                  },
}

export default function SumberPage() {
  const grouped = {
    1: SOURCES.filter(s => s.tier === 1),
    2: SOURCES.filter(s => s.tier === 2),
    3: SOURCES.filter(s => s.tier === 3),
  } as Record<1|2|3, typeof SOURCES>

  return (
    <>
      <SiteHeader />
      <BreakingTicker />
      <main className="max-w-5xl mx-auto px-4 py-10" id="main-content">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <Globe className="w-8 h-8 text-[var(--navy)]" />
            <h1 className="font-serif text-3xl font-bold text-foreground">Sumber Berita</h1>
          </div>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            KabarKini menggunakan sistem pipeline AI yang mengambil dan memverifikasi berita dari sumber-sumber terpercaya berikut.
            Setiap artikel diverifikasi dari minimal 2 sumber berbeda sebelum diterbitkan.
          </p>
        </div>

        {/* Editorial standards */}
        <div className="bg-[var(--navy)]/5 border border-[var(--navy)]/20 rounded-xl p-5 mb-10">
          <h2 className="font-serif font-bold text-base text-foreground mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[var(--navy)]" /> Standar Verifikasi Kami
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Cross-check Minimal 2 Sumber', desc: 'Setiap fakta dikonfirmasi dari setidaknya dua sumber berbeda.' },
              { label: 'Skor Kepercayaan Dinamis',      desc: 'Setiap sumber dinilai 0–100 berdasarkan rekam jejak akurasi.'  },
              { label: 'Prioritas Sumber Resmi',        desc: 'Pernyataan pemerintah dan lembaga resmi mendapat bobot tertinggi.' },
            ].map(item => (
              <div key={item.label} className="bg-white rounded-lg p-4 border border-border">
                <p className="text-sm font-semibold text-foreground mb-1">{item.label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Source tiers */}
        {([1, 2, 3] as const).map(tier => (
          <section key={tier} className="mb-10">
            <div className={`rounded-xl border p-5 mb-4 ${TIER_CONFIG[tier].bg}`}>
              <h2 className={`font-serif font-bold text-base ${TIER_CONFIG[tier].color}`}>{TIER_CONFIG[tier].label}</h2>
              <p className="text-xs text-muted-foreground mt-1">{TIER_CONFIG[tier].desc}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {grouped[tier].map(src => (
                <div key={src.name} className="bg-white rounded-xl border border-border p-5 flex items-start gap-4 hover:shadow-sm transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-slate-600 text-center leading-tight">{src.logo}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-foreground text-sm">{src.name}</h3>
                        <p className="text-xs text-muted-foreground">{src.type}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Newspaper className="w-3 h-3 text-slate-400" />
                        <span className="text-xs font-bold text-foreground">{src.trustScore}/100</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{src.desc}</p>
                    <a href={src.url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[var(--navy)] hover:underline mt-2 font-medium">
                      <ExternalLink className="w-3 h-3" /> Kunjungi
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
      <SiteFooter />
    </>
  )
}
