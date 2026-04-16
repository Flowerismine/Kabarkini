import type { Metadata } from 'next'
import Link from 'next/link'
import { AlertTriangle, ChevronRight } from 'lucide-react'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { BreakingTicker } from '@/components/layout/breaking-ticker'

export const metadata: Metadata = {
  title: 'Disclaimer | KabarKini',
  description: 'Pernyataan disclaimer KabarKini mengenai batasan tanggung jawab atas konten berita dan informasi yang dipublikasikan.',
  alternates: { canonical: 'https://kabarkini.id/disclaimer' },
}

export default function DisclaimerPage() {
  return (
    <>
      <SiteHeader />
      <BreakingTicker />
      <main className="max-w-4xl mx-auto px-4 py-10" id="main-content">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link href="/" className="hover:text-[var(--navy)] transition-colors">Beranda</Link>
          <ChevronRight className="w-3 h-3" aria-hidden="true" />
          <span className="text-foreground">Disclaimer</span>
        </nav>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-amber-600" aria-hidden="true" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Disclaimer</h1>
            <p className="text-sm text-muted-foreground mt-1">Terakhir diperbarui: 15 Januari 2025</p>
          </div>
        </div>

        <div className="space-y-6 text-slate-700 text-sm leading-relaxed">

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <p className="font-semibold text-amber-800 mb-2">Pernyataan Umum</p>
            <p className="text-amber-900">
              Seluruh konten yang dipublikasikan di KabarKini (kabarkini.id) disediakan untuk tujuan
              informasi umum semata. Meskipun kami berupaya keras memastikan keakuratan dan
              keterbaruan informasi, KabarKini tidak memberikan jaminan, tersurat maupun tersirat,
              atas kelengkapan, ketepatan waktu, keandalan, atau kesesuaian konten untuk tujuan apa pun.
            </p>
          </div>

          <article className="bg-white border border-border rounded-xl p-6 space-y-5">
            <section>
              <h2 className="font-serif text-lg font-bold text-foreground mb-3">
                1. Konten Berbasis AI
              </h2>
              <p>
                Sebagian artikel di KabarKini diproduksi menggunakan sistem penulisan berbasis kecerdasan
                buatan (AI) yang diawasi oleh editor manusia. Meskipun sistem kami dirancang untuk menghasilkan
                konten yang akurat dan faktual berdasarkan sumber-sumber terpercaya, teknologi AI dapat
                menghasilkan ketidakakuratan, ambiguitas, atau interpretasi yang tidak sempurna.
              </p>
              <p className="mt-3">
                Artikel yang dihasilkan AI ditandai dengan label <strong>&ldquo;AI News Desk&rdquo;</strong> dan
                semua sumber referensi dicantumkan secara transparan. Pembaca didorong untuk memverifikasi
                informasi penting dari sumber primer sebelum mengambil keputusan berdasarkan konten kami.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-lg font-bold text-foreground mb-3">
                2. Bukan Nasihat Profesional
              </h2>
              <p>
                Konten di KabarKini tidak dimaksudkan sebagai nasihat hukum, keuangan, medis, investasi,
                atau profesional dalam bidang apa pun. Informasi ekonomi, pasar keuangan, atau kebijakan
                yang kami laporkan bersifat informatif dan bukan rekomendasi investasi. Untuk keputusan
                penting, selalu konsultasikan dengan profesional yang berkompeten.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-lg font-bold text-foreground mb-3">
                3. Tautan Eksternal
              </h2>
              <p>
                KabarKini dapat memuat tautan ke situs web pihak ketiga untuk keperluan referensi dan
                verifikasi. Kami tidak bertanggung jawab atas konten, kebijakan privasi, atau praktik
                situs web eksternal tersebut. Pencantuman tautan tidak berarti kami mendukung atau
                merekomendasikan situs bersangkutan.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-lg font-bold text-foreground mb-3">
                4. Hak Cipta dan Pengutipan
              </h2>
              <p>
                Seluruh konten orisinal KabarKini dilindungi hak cipta. Diizinkan mengutip maksimal dua
                paragraf dari setiap artikel dengan menyertakan atribusi lengkap berupa nama penulis,
                nama publikasi (KabarKini), dan tautan aktif ke artikel asli. Reproduksi lengkap atau
                sebagian besar artikel tanpa izin tertulis dilarang keras dan dapat dikenai tindakan hukum.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-lg font-bold text-foreground mb-3">
                5. Koreksi dan Pembaruan
              </h2>
              <p>
                KabarKini berkomitmen melakukan koreksi sesegera mungkin apabila ditemukan kesalahan
                faktual. Setiap artikel yang dikoreksi akan mencantumkan catatan koreksi yang transparan
                di bagian bawah artikel. Pembaca dapat melaporkan ketidakakuratan melalui halaman{' '}
                <Link href="/kontak" className="text-[var(--navy)] underline hover:text-[var(--red)]">
                  Kontak
                </Link>{' '}
                atau email koreksi@kabarkini.id.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-lg font-bold text-foreground mb-3">
                6. Batasan Tanggung Jawab
              </h2>
              <p>
                KabarKini, tim redaksi, dan mitra teknologinya tidak bertanggung jawab atas kerugian,
                kerusakan, atau konsekuensi apa pun yang timbul dari penggunaan atau ketidakmampuan
                menggunakan konten di situs ini. Ini mencakup, namun tidak terbatas pada, kerugian
                langsung, tidak langsung, atau konsekuensial.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-lg font-bold text-foreground mb-3">
                7. Hukum yang Berlaku
              </h2>
              <p>
                Disclaimer ini tunduk pada dan ditafsirkan sesuai dengan hukum yang berlaku di Indonesia.
                Segala sengketa yang timbul diselesaikan melalui jalur hukum yang berlaku di Indonesia.
              </p>
            </section>
          </article>

          {/* Related */}
          <div className="bg-slate-50 rounded-xl border border-border p-5">
            <h3 className="font-serif font-bold text-sm text-foreground mb-3">Halaman Hukum Lainnya</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Kebijakan Privasi', href: '/kebijakan-privasi' },
                { label: 'Syarat & Ketentuan', href: '/syarat-ketentuan' },
                { label: 'Pedoman Editorial', href: '/pedoman-editorial' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold text-[var(--navy)] hover:text-[var(--red)] transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
