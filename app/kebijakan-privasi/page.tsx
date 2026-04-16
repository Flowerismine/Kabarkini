import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, ChevronRight } from 'lucide-react'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { BreakingTicker } from '@/components/layout/breaking-ticker'

export const metadata: Metadata = {
  title: 'Kebijakan Privasi | KabarKini',
  description: 'Kebijakan Privasi KabarKini — bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.',
  alternates: { canonical: 'https://kabarkini.id/kebijakan-privasi' },
}

const sections = [
  {
    id: 'pendahuluan',
    title: '1. Pendahuluan',
    content: `KabarKini ("kami", "situs kami") berkomitmen menjaga privasi setiap pengunjung dan pengguna portal berita ini. Kebijakan Privasi ini menjelaskan jenis data yang kami kumpulkan, tujuan penggunaannya, serta hak-hak Anda sebagai pengguna. Dengan mengakses KabarKini, Anda menyetujui praktik-praktik yang dijelaskan dalam kebijakan ini.`,
  },
  {
    id: 'data-dikumpulkan',
    title: '2. Data yang Kami Kumpulkan',
    content: `Kami mengumpulkan dua kategori data:

a) Data yang diberikan secara langsung: Nama dan alamat email yang Anda masukkan saat berlangganan newsletter atau mengirim formulir kontak.

b) Data teknis yang dikumpulkan secara otomatis: Alamat IP (disamarkan), jenis peramban, sistem operasi, halaman yang dikunjungi, durasi kunjungan, dan sumber referral. Data ini dikumpulkan melalui cookies dan teknologi serupa untuk tujuan analitik.`,
  },
  {
    id: 'penggunaan-data',
    title: '3. Cara Kami Menggunakan Data',
    content: `Data yang kami kumpulkan digunakan untuk:

• Mengirimkan newsletter dan pembaruan editorial kepada pelanggan
• Menganalisis pola konsumsi konten guna meningkatkan kualitas berita
• Mengelola dan mengoptimalkan performa situs
• Menanggapi pertanyaan, koreksi, atau laporan dari pengguna
• Menampilkan iklan yang relevan melalui Google AdSense (data anonim)
• Mematuhi kewajiban hukum yang berlaku di Indonesia`,
  },
  {
    id: 'cookies',
    title: '4. Penggunaan Cookies',
    content: `KabarKini menggunakan cookies esensial untuk operasional situs dan cookies analitik untuk memahami cara pengguna berinteraksi dengan konten kami. Kami menggunakan Google Analytics untuk analitik dengan IP anonymization diaktifkan. Google AdSense juga menempatkan cookies untuk menampilkan iklan yang relevan.

Anda dapat menonaktifkan cookies melalui pengaturan peramban Anda, namun hal ini mungkin memengaruhi fungsionalitas situs.`,
  },
  {
    id: 'berbagi-data',
    title: '5. Pembagian Data dengan Pihak Ketiga',
    content: `Kami tidak menjual, menyewakan, atau memperjualbelikan data pribadi Anda kepada pihak ketiga mana pun. Data dapat dibagikan hanya kepada:

• Penyedia layanan teknis (hosting, email, analitik) yang terikat perjanjian kerahasiaan
• Otoritas hukum Indonesia apabila diwajibkan oleh undang-undang yang berlaku
• Mitra platform iklan (Google) dalam bentuk data agregat anonim`,
  },
  {
    id: 'keamanan',
    title: '6. Keamanan Data',
    content: `Kami menerapkan langkah-langkah keamanan teknis dan organisasional yang memadai untuk melindungi data Anda dari akses tidak sah, pengungkapan, pengubahan, atau penghancuran. Koneksi situs ini dilindungi dengan enkripsi SSL/TLS. Meski demikian, tidak ada metode transmisi data melalui internet yang 100% aman.`,
  },
  {
    id: 'hak-pengguna',
    title: '7. Hak-Hak Anda',
    content: `Sesuai dengan peraturan perlindungan data yang berlaku, Anda memiliki hak untuk:

• Mengakses data pribadi yang kami miliki tentang Anda
• Meminta koreksi data yang tidak akurat
• Meminta penghapusan data Anda
• Berhenti berlangganan newsletter kapan saja melalui tautan "berhenti berlangganan" di setiap email
• Mengajukan keberatan atas pemrosesan data untuk tujuan pemasaran

Untuk menggunakan hak-hak ini, hubungi kami di: privasi@kabarkini.id`,
  },
  {
    id: 'retensi',
    title: '8. Periode Penyimpanan Data',
    content: `Data email newsletter disimpan selama Anda masih berlangganan dan dihapus dalam 30 hari setelah permintaan penghapusan. Data analitik disimpan selama maksimal 26 bulan. Data formulir kontak disimpan selama 12 bulan.`,
  },
  {
    id: 'perubahan',
    title: '9. Perubahan Kebijakan',
    content: `Kami dapat memperbarui Kebijakan Privasi ini sewaktu-waktu. Perubahan signifikan akan diinformasikan melalui pemberitahuan di halaman utama situs atau melalui email kepada pelanggan. Tanggal pembaruan terakhir selalu tercantum di bagian bawah halaman ini.`,
  },
  {
    id: 'kontak',
    title: '10. Hubungi Kami',
    content: `Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami:

Email: privasi@kabarkini.id
Formulir: kabarkini.id/kontak
Alamat: Jakarta, Indonesia`,
  },
]

export default function KebijakanPrivasiPage() {
  return (
    <>
      <SiteHeader />
      <BreakingTicker />
      <main className="max-w-4xl mx-auto px-4 py-10" id="main-content">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link href="/" className="hover:text-[var(--navy)] transition-colors">Beranda</Link>
          <ChevronRight className="w-3 h-3" aria-hidden="true" />
          <span className="text-foreground">Kebijakan Privasi</span>
        </nav>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
          <div className="w-12 h-12 bg-[var(--navy)]/10 rounded-xl flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-[var(--navy)]" aria-hidden="true" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Kebijakan Privasi</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Terakhir diperbarui: 15 Januari 2025
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
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
          <article className="lg:col-span-3 space-y-8">
            {sections.map((s) => (
              <section key={s.id} id={s.id}>
                <h2 className="font-serif text-lg font-bold text-foreground mb-3">{s.title}</h2>
                <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line bg-white rounded-xl border border-border p-5">
                  {s.content}
                </div>
              </section>
            ))}

            {/* Related pages */}
            <div className="bg-slate-50 rounded-xl border border-border p-5 mt-8">
              <h3 className="font-serif font-bold text-sm text-foreground mb-3">Halaman Hukum Lainnya</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Disclaimer', href: '/disclaimer' },
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
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
