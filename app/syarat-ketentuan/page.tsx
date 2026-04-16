import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, ChevronRight } from 'lucide-react'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { BreakingTicker } from '@/components/layout/breaking-ticker'

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan | KabarKini',
  description: 'Syarat dan Ketentuan penggunaan portal berita KabarKini.',
  alternates: { canonical: 'https://kabarkini.id/syarat-ketentuan' },
}

const sections = [
  {
    id: 'penerimaan',
    title: '1. Penerimaan Syarat',
    content: `Dengan mengakses atau menggunakan situs KabarKini (kabarkini.id), Anda menyatakan telah membaca, memahami, dan menyetujui Syarat & Ketentuan ini secara keseluruhan. Jika Anda tidak menyetujui salah satu ketentuan di bawah ini, harap tidak menggunakan situs kami.`,
  },
  {
    id: 'layanan',
    title: '2. Deskripsi Layanan',
    content: `KabarKini adalah portal berita digital yang menyediakan konten berita, analisis, dan informasi seputar isu-isu nasional Indonesia. Layanan kami mencakup:
• Artikel berita yang diproduksi oleh sistem AI dengan pengawasan editor manusia
• Newsletter harian yang dikirimkan kepada pelanggan
• Mesin pencari konten internal
• RSS feed untuk agregator berita

Kami berhak mengubah, menangguhkan, atau menghentikan layanan apa pun kapan saja tanpa pemberitahuan sebelumnya.`,
  },
  {
    id: 'penggunaan',
    title: '3. Ketentuan Penggunaan',
    content: `Pengguna dilarang keras:
• Mereproduksi, mendistribusikan, atau mengeksploitasi konten KabarKini untuk tujuan komersial tanpa izin tertulis
• Menggunakan bot, scraper, atau alat otomatis untuk mengekstrak konten secara massal
• Mencoba merusak, mengganggu, atau mendapatkan akses tidak sah ke sistem kami
• Menyebarkan konten yang melanggar hukum, memfitnah, atau mengandung kebencian
• Menggunakan identitas palsu atau menyamar sebagai orang lain

Pelanggaran ketentuan ini dapat mengakibatkan pemblokiran akses dan/atau tindakan hukum.`,
  },
  {
    id: 'kekayaan-intelektual',
    title: '4. Kekayaan Intelektual',
    content: `Seluruh konten di KabarKini — termasuk teks, grafis, logo, dan tampilan situs — adalah milik KabarKini atau pemberi lisensinya dan dilindungi oleh Undang-Undang Hak Cipta Indonesia. 

Anda diizinkan mengutip hingga dua paragraf dari artikel kami dengan syarat mencantumkan atribusi lengkap: nama publikasi "KabarKini" dan tautan aktif ke artikel asli. Reproduksi lebih lanjut memerlukan izin tertulis dari redaksi.`,
  },
  {
    id: 'newsletter',
    title: '5. Layanan Newsletter',
    content: `Dengan berlangganan newsletter KabarKini, Anda menyetujui menerima email berkala dari kami. Anda dapat berhenti berlangganan kapan saja melalui tautan "berhenti berlangganan" yang tersedia di setiap email. Kami tidak akan mengirimkan spam atau menjual alamat email Anda kepada pihak ketiga.`,
  },
  {
    id: 'iklan',
    title: '6. Konten Iklan',
    content: `KabarKini menampilkan iklan dari Google AdSense dan mitra periklanan lainnya. Konten iklan sepenuhnya dikendalikan oleh jaringan iklan, bukan oleh redaksi kami. Penampilan iklan tidak berarti KabarKini mendukung produk atau layanan yang diiklankan.`,
  },
  {
    id: 'batasan-tanggung-jawab',
    title: '7. Batasan Tanggung Jawab',
    content: `KabarKini tidak bertanggung jawab atas kerugian apa pun yang timbul dari penggunaan situs ini, termasuk namun tidak terbatas pada kerugian finansial, reputasi, atau peluang bisnis yang hilang akibat ketidakakuratan konten. Penggunaan situs sepenuhnya atas risiko pengguna.`,
  },
  {
    id: 'perubahan-syarat',
    title: '8. Perubahan Syarat',
    content: `Kami berhak memperbarui Syarat & Ketentuan ini kapan saja. Versi terbaru akan dipublikasikan di halaman ini dengan tanggal pembaruan. Penggunaan berkelanjutan atas situs kami setelah perubahan dianggap sebagai persetujuan atas syarat yang diperbarui.`,
  },
  {
    id: 'hukum-berlaku',
    title: '9. Hukum yang Berlaku',
    content: `Syarat & Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia. Segala sengketa yang timbul dari penggunaan situs ini akan diselesaikan melalui pengadilan yang berwenang di Jakarta, Indonesia.`,
  },
]

export default function SyaratKetentuanPage() {
  return (
    <>
      <SiteHeader />
      <BreakingTicker />
      <main className="max-w-4xl mx-auto px-4 py-10" id="main-content">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link href="/" className="hover:text-[var(--navy)] transition-colors">Beranda</Link>
          <ChevronRight className="w-3 h-3" aria-hidden="true" />
          <span className="text-foreground">Syarat & Ketentuan</span>
        </nav>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6 text-blue-600" aria-hidden="true" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Syarat & Ketentuan</h1>
            <p className="text-sm text-muted-foreground mt-1">Terakhir diperbarui: 15 Januari 2025</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* TOC */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-border rounded-xl p-4">
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                Daftar Isi
              </h2>
              <ul className="space-y-1.5">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="text-xs text-slate-600 hover:text-[var(--navy)] transition-colors block leading-relaxed"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Content */}
          <article className="lg:col-span-3 space-y-7">
            {sections.map((s) => (
              <section key={s.id} id={s.id}>
                <h2 className="font-serif text-lg font-bold text-foreground mb-3">{s.title}</h2>
                <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line bg-white rounded-xl border border-border p-5">
                  {s.content}
                </div>
              </section>
            ))}

            {/* Related */}
            <div className="bg-slate-50 rounded-xl border border-border p-5 mt-8">
              <h3 className="font-serif font-bold text-sm text-foreground mb-3">Halaman Hukum Lainnya</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Kebijakan Privasi', href: '/kebijakan-privasi' },
                  { label: 'Disclaimer', href: '/disclaimer' },
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
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
