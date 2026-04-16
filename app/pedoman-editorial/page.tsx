import type { Metadata } from 'next'
import Link from 'next/link'
import { Newspaper, CheckCircle2, ChevronRight, Shield, Zap, Eye, Users } from 'lucide-react'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { BreakingTicker } from '@/components/layout/breaking-ticker'

export const metadata: Metadata = {
  title: 'Pedoman Editorial | KabarKini',
  description: 'Standar dan pedoman editorial KabarKini — bagaimana kami memilih, memverifikasi, dan menerbitkan berita.',
  alternates: { canonical: 'https://kabarkini.id/pedoman-editorial' },
}

const principles = [
  {
    icon: Shield,
    title: 'Akurasi & Verifikasi',
    desc: 'Setiap fakta diverifikasi dari minimal dua sumber terpercaya. Sistem AI kami melakukan cross-check otomatis sebelum artikel dihasilkan.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Users,
    title: 'Independensi Editorial',
    desc: 'Redaksi KabarKini beroperasi secara independen dari kepentingan iklan dan pemilik bisnis. Tidak ada artikel sponsor yang dibuat menyerupai berita editorial.',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    icon: Eye,
    title: 'Transparansi',
    desc: 'Semua artikel mencantumkan sumber referensi, status verifikasi, dan label jelas apakah konten dihasilkan AI atau ditulis oleh editor manusia.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    icon: Zap,
    title: 'Koreksi Cepat',
    desc: 'Kesalahan faktual yang dilaporkan akan dikoreksi dalam waktu 4 jam. Setiap koreksi dicatat secara transparan di artikel yang bersangkutan.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
]

const pipelineSteps = [
  { step: '01', title: 'Pemantauan Sumber', desc: 'Sistem memantau 12+ sumber berita terpercaya setiap hari untuk mengidentifikasi isu-isu penting.' },
  { step: '02', title: 'Klasterisasi Topik', desc: 'Isu-isu terkait dikelompokkan dan diberi skor relevansi berdasarkan frekuensi penyebutan dan signifikansi.' },
  { step: '03', title: 'Seleksi Topik', desc: 'Topik dengan skor tertinggi dipilih untuk diproses lebih lanjut. Topik sensitif mendapat review manual.' },
  { step: '04', title: 'Ekstraksi Fakta', desc: 'Fakta-fakta kunci diekstraksi dari semua sumber dan dilakukan cross-check untuk memastikan konsistensi.' },
  { step: '05', title: 'Penulisan AI', desc: 'Artikel dihasilkan oleh model bahasa yang dirancang khusus untuk jurnalisme faktual dengan gaya penulisan berita Indonesia.' },
  { step: '06', title: 'Quality Gate', desc: 'Skor kualitas dihitung: originalitas, keterbacaan, SEO, konsistensi fakta, dan risiko duplikasi.' },
  { step: '07', title: 'Review Editor', desc: 'Artikel dengan skor di bawah ambang batas atau topik sensitif masuk antrian review editor manusia.' },
  { step: '08', title: 'Publikasi & Pengindeksan', desc: 'Artikel yang lolos quality gate dipublikasikan dan diindeks ke Google News, sitemap XML, dan RSS feed.' },
]

export default function PedomanEditorialPage() {
  return (
    <>
      <SiteHeader />
      <BreakingTicker />
      <main className="max-w-4xl mx-auto px-4 py-10" id="main-content">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link href="/" className="hover:text-[var(--navy)] transition-colors">Beranda</Link>
          <ChevronRight className="w-3 h-3" aria-hidden="true" />
          <span className="text-foreground">Pedoman Editorial</span>
        </nav>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
          <div className="w-12 h-12 bg-[var(--navy)]/10 rounded-xl flex items-center justify-center shrink-0">
            <Newspaper className="w-6 h-6 text-[var(--navy)]" aria-hidden="true" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Pedoman Editorial</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Standar, nilai, dan proses yang memandu setiap keputusan redaksional KabarKini
            </p>
          </div>
        </div>

        {/* Mission statement */}
        <div className="bg-[var(--navy)] text-white rounded-xl p-6 mb-10">
          <h2 className="font-serif text-xl font-bold mb-3">Misi Redaksi KabarKini</h2>
          <p className="text-slate-200 leading-relaxed">
            Menyajikan informasi yang akurat, cepat, dan mudah dipahami kepada masyarakat Indonesia,
            dengan menggabungkan kekuatan teknologi AI dan pengawasan editorial manusia untuk memastikan
            standar jurnalisme yang tinggi di era digital.
          </p>
        </div>

        {/* Core principles */}
        <section className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Prinsip Inti Redaksi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {principles.map((p) => {
              const Icon = p.icon
              return (
                <div key={p.title} className={`rounded-xl border border-border p-5 ${p.bg}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className={`w-5 h-5 ${p.color}`} aria-hidden="true" />
                    <h3 className="font-serif font-bold text-foreground">{p.title}</h3>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{p.desc}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Pipeline */}
        <section className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Pipeline Editorial AI</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Setiap artikel melalui 8 tahap proses editorial sebelum dipublikasikan.
          </p>
          <div className="space-y-3">
            {pipelineSteps.map((s, i) => (
              <div
                key={s.step}
                className="flex items-start gap-4 bg-white border border-border rounded-xl p-4 hover:border-[var(--navy)]/30 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-[var(--navy)] text-white text-sm font-bold flex items-center justify-center shrink-0 font-mono">
                  {s.step}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-sm">{s.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{s.desc}</p>
                </div>
                {i < pipelineSteps.length - 1 && (
                  <div className="w-0.5 h-full bg-slate-100 ml-4 hidden" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Standards detail */}
        <section className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Standar Konten</h2>
          <div className="bg-white border border-border rounded-xl divide-y divide-border">
            {[
              {
                title: 'Sumber dan Kutipan',
                content: 'Setiap klaim faktual harus didukung setidaknya satu sumber yang dapat diverifikasi. Sumber resmi pemerintah, lembaga negara, dan media terverifikasi diprioritaskan. Kutipan langsung harus akurat dan tidak diambil di luar konteks.',
              },
              {
                title: 'Pemisahan Berita dan Opini',
                content: 'Berita faktual dan opini/analisis dipisahkan secara jelas dengan label yang tegas. Artikel analisis dan komentar diberi label "Analisis" atau "Opini" dan tidak dicampur dengan konten berita faktual.',
              },
              {
                title: 'Isu Sensitif',
                content: 'Pemberitaan tentang isu SARA, bencana, kriminalitas, dan politik selalu mempertimbangkan dampak sosial. Konten yang berpotensi merugikan pihak tertentu mendapat review berlapis sebelum dipublikasikan.',
              },
              {
                title: 'Label AI vs Editor Manusia',
                content: 'Artikel yang dihasilkan sistem AI diberi label "AI News Desk". Artikel yang ditulis atau direvisi secara substansial oleh editor manusia mencantumkan nama editor. Label ini memastikan transparansi penuh kepada pembaca.',
              },
              {
                title: 'Konflik Kepentingan',
                content: 'KabarKini tidak menerima pembayaran untuk peliputan positif (advertorial). Jika ada hubungan komersial dengan subjek berita, hal tersebut akan diungkapkan secara eksplisit dalam artikel.',
              },
            ].map((item) => (
              <div key={item.title} className="p-5">
                <h3 className="font-semibold text-foreground text-sm mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" aria-hidden="true" />
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed pl-6">{item.content}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Correction policy */}
        <section className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Kebijakan Koreksi</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-sm text-amber-900 leading-relaxed space-y-3">
            <p>
              KabarKini berkomitmen melakukan koreksi dengan cepat dan transparan. Ketika kesalahan
              faktual ditemukan atau dilaporkan:
            </p>
            <ul className="space-y-2 pl-4">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                Koreksi dilakukan dalam 4 jam untuk fakta kritis
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                Catatan koreksi ditambahkan di bagian bawah artikel yang diperbarui
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                Artikel tidak dihapus kecuali ada alasan hukum yang kuat
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                Pelapor koreksi akan mendapat konfirmasi melalui email
              </li>
            </ul>
            <p className="pt-1">
              Untuk melaporkan kesalahan faktual:{' '}
              <Link href="/kontak" className="font-semibold underline hover:text-amber-700 transition-colors">
                Formulir Koreksi
              </Link>{' '}
              atau koreksi@kabarkini.id
            </p>
          </div>
        </section>

        {/* Related */}
        <div className="bg-slate-50 rounded-xl border border-border p-5">
          <h3 className="font-serif font-bold text-sm text-foreground mb-3">Halaman Hukum Lainnya</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Kebijakan Privasi', href: '/kebijakan-privasi' },
              { label: 'Disclaimer', href: '/disclaimer' },
              { label: 'Syarat & Ketentuan', href: '/syarat-ketentuan' },
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
      </main>
      <SiteFooter />
    </>
  )
}
