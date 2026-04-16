import type { Metadata } from 'next'
import { Mail, MessageCircle, AlertTriangle, Newspaper } from 'lucide-react'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { BreakingTicker } from '@/components/layout/breaking-ticker'
import { ContactForm } from '@/components/news/contact-form'

export const metadata: Metadata = {
  title: 'Hubungi Kami',
  description:
    'Hubungi tim redaksi KabarKini untuk koreksi faktual, pertanyaan editorial, kerjasama media, atau laporan teknis.',
}

export default function KontakPage() {
  return (
    <>
      <SiteHeader />
      <BreakingTicker />
      <main className="max-w-4xl mx-auto px-4 py-12" id="main-content">
        <div className="mb-10">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-3">Hubungi Kami</h1>
          <p className="text-muted-foreground leading-relaxed">
            Kami menghargai setiap masukan, koreksi, dan pertanyaan dari pembaca. Tim redaksi kami
            berkomitmen merespons semua pesan dalam waktu 1–2 hari kerja.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact info sidebar */}
          <aside className="space-y-5">
            <div className="bg-[var(--navy)] text-white rounded-xl p-5">
              <h2 className="font-serif font-bold text-base mb-4">Kontak Langsung</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 shrink-0 mt-0.5 text-slate-300" />
                  <div>
                    <p className="font-semibold">Redaksi</p>
                    <a
                      href="mailto:redaksi@kabarkini.id"
                      className="text-slate-300 hover:text-white transition-colors"
                    >
                      redaksi@kabarkini.id
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-slate-300" />
                  <div>
                    <p className="font-semibold">Koreksi Faktual</p>
                    <a
                      href="mailto:koreksi@kabarkini.id"
                      className="text-slate-300 hover:text-white transition-colors"
                    >
                      koreksi@kabarkini.id
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Newspaper className="w-4 h-4 shrink-0 mt-0.5 text-slate-300" />
                  <div>
                    <p className="font-semibold">Kerjasama Media</p>
                    <a
                      href="mailto:partner@kabarkini.id"
                      className="text-slate-300 hover:text-white transition-colors"
                    >
                      partner@kabarkini.id
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-4 h-4 shrink-0 mt-0.5 text-slate-300" />
                  <div>
                    <p className="font-semibold">Laporan Teknis</p>
                    <a
                      href="mailto:teknis@kabarkini.id"
                      className="text-slate-300 hover:text-white transition-colors"
                    >
                      teknis@kabarkini.id
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-border rounded-xl p-5">
              <h2 className="font-serif font-bold text-sm text-foreground mb-3">Waktu Respons</h2>
              <div className="space-y-2 text-sm text-muted-foreground">
                {[
                  { label: 'Koreksi faktual', time: '4 jam' },
                  { label: 'Pertanyaan editorial', time: '1–2 hari' },
                  { label: 'Kerjasama media', time: '3–5 hari' },
                  { label: 'Laporan teknis', time: '24 jam' },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between">
                    <span>{row.label}</span>
                    <span className="font-semibold text-foreground">{row.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Contact form (client component) */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
