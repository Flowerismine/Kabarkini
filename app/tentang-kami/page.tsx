import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { BreakingTicker } from '@/components/layout/breaking-ticker'
import { Newspaper, Shield, Zap, Users, Globe, Award } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tentang Kami',
  description: 'KabarKini adalah portal berita digital Indonesia yang menggabungkan teknologi AI dengan standar jurnalisme berkualitas tinggi.',
}

export default function TentangKamiPage() {
  return (
    <>
      <SiteHeader />
      <BreakingTicker />
      <main className="max-w-4xl mx-auto px-4 py-12" id="main-content">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1 mb-4">
            <span className="font-serif text-4xl font-bold text-[var(--navy)]">Kabar</span>
            <span className="font-serif text-4xl font-bold text-[var(--red)]">Kini</span>
          </div>
          <p className="text-xl text-muted-foreground mt-2 font-medium">
            Fakta Cepat. Analisis Tepat.
          </p>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto leading-relaxed">
            KabarKini adalah portal berita digital Indonesia yang lahir dari keyakinan bahwa jurnalisme
            berkualitas tinggi dan teknologi modern bisa berjalan beriringan. Kami hadir untuk menjadi
            sumber informasi terpercaya bagi jutaan pembaca Indonesia yang membutuhkan berita akurat,
            cepat, dan mudah dipahami.
          </p>
        </div>

        {/* Mission pillars */}
        <section className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-foreground text-center mb-8">
            Pilar Utama KabarKini
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Newspaper,
                title: 'Jurnalisme Bertanggung Jawab',
                desc: 'Setiap artikel diproduksi berdasarkan fakta yang telah diverifikasi dari minimal dua sumber terpercaya. Kami tidak menerbitkan asumsi atau spekulasi tanpa dasar.',
              },
              {
                icon: Zap,
                title: 'Kecepatan Berbasis AI',
                desc: 'Sistem AI kami memantau sumber berita prioritas setiap hari untuk mengidentifikasi isu terpenting dan menghasilkan artikel yang informatif dengan cepat.',
              },
              {
                icon: Shield,
                title: 'Verifikasi Ketat',
                desc: 'Pipeline editorial kami mencakup cross-check sumber, scoring kualitas otomatis, dan review manual untuk isu-isu sensitif sebelum artikel dipublikasikan.',
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="bg-white rounded-xl border border-border p-6 text-center">
                  <div className="w-12 h-12 bg-[var(--navy)]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-[var(--navy)]" />
                  </div>
                  <h3 className="font-serif font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* About the newsroom */}
        <section className="prose prose-slate max-w-none mb-12">
          <h2 className="font-serif text-xl font-bold text-foreground mb-4">
            Tentang Ruang Redaksi Kami
          </h2>
          <div className="bg-white rounded-xl border border-border p-6 space-y-4 text-slate-700 leading-relaxed">
            <p>
              KabarKini mengoperasikan <strong>AI Newsroom</strong> — sebuah sistem editorial hybrid yang
              menggabungkan kecerdasan buatan dengan pengawasan editor manusia. Sistem AI kami bekerja
              24 jam untuk memantau lebih dari 12 sumber berita terpercaya, mengidentifikasi topik
              paling relevan, dan menghasilkan draf artikel yang kemudian ditinjau oleh tim editor kami
              sebelum dipublikasikan.
            </p>
            <p>
              Kami mengutamakan sumber-sumber berita kredibel seperti ANTARA, Kompas.com, Tempo.co,
              Liputan6.com, serta sumber resmi pemerintah seperti Bank Indonesia, BMKG, KPU, OJK, dan
              lembaga-lembaga negara lainnya. Untuk setiap artikel, sistem kami mencatat dan
              menampilkan semua sumber referensi secara transparan.
            </p>
            <p>
              Artikel yang dihasilkan sistem AI KabarKini selalu ditandai dengan label{' '}
              <strong>"AI News Desk"</strong> dan disertai catatan editorial yang jelas. Artikel yang
              melalui review editor manusia juga dicantumkan nama editornya untuk akuntabilitas penuh.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { value: '224+', label: 'Artikel Terbit' },
            { value: '12', label: 'Sumber Aktif' },
            { value: '8', label: 'Kategori Berita' },
            { value: '3x', label: 'Update Harian' },
          ].map((stat) => (
            <div key={stat.label} className="bg-[var(--navy)] text-white rounded-xl p-4 text-center">
              <p className="text-2xl font-bold font-serif">{stat.value}</p>
              <p className="text-xs text-slate-300 mt-1">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* Contact CTA */}
        <section className="bg-slate-50 rounded-xl border border-border p-8 text-center">
          <h2 className="font-serif font-bold text-xl text-foreground mb-2">Hubungi Kami</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Untuk koreksi faktual, kerjasama media, atau pertanyaan editorial, silakan hubungi tim
            redaksi kami.
          </p>
          <Link
            href="/kontak"
            className="inline-flex items-center gap-2 bg-[var(--navy)] text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-[var(--navy-light)] transition-colors text-sm"
          >
            Halaman Kontak
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
