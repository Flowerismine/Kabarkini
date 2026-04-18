import Link from 'next/link'
import { Rss } from 'lucide-react'
import { NewsletterForm } from '@/components/news/newsletter-form'

// Kategori hardcode — sama dengan seed data, tidak perlu fetch
const FOOTER_CATEGORIES = [
  { name: 'Politik',       slug: 'politik'       },
  { name: 'Hukum',         slug: 'hukum'         },
  { name: 'Ekonomi',       slug: 'ekonomi'       },
  { name: 'Teknologi',     slug: 'teknologi'     },
  { name: 'Sosial',        slug: 'sosial'        },
  { name: 'Olahraga',      slug: 'olahraga'      },
  { name: 'Internasional', slug: 'internasional' },
  { name: 'Viral',         slug: 'viral'         },
]

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[var(--navy)] text-white mt-16">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-xl font-bold text-white">Langganan Newsletter KabarKini</h3>
            <p className="text-slate-300 text-sm mt-1">
              Dapatkan rangkuman berita terpenting langsung di inbox Anda setiap pagi.
            </p>
          </div>
          <div className="w-full md:w-auto">
            <NewsletterForm variant="footer" />
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="font-serif text-2xl font-bold text-white">Kabar</span>
              <span className="font-serif text-2xl font-bold text-red-400">Kini</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Portal berita digital Indonesia terpercaya. Meliput isu-isu panas nasional dengan
              akurasi tinggi, kecepatan penerbitan, dan standar editorial yang ketat.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <Link href="/rss" className="flex items-center gap-1.5 text-orange-400 hover:text-orange-300 text-sm transition-colors">
                <Rss className="w-4 h-4" /> RSS Feed
              </Link>
            </div>
          </div>

          {/* Kategori */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Kategori</h4>
            <ul className="space-y-2">
              {FOOTER_CATEGORIES.map(cat => (
                <li key={cat.slug}>
                  <Link href={`/kategori/${cat.slug}`} className="text-slate-400 hover:text-white text-sm transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tautan */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Tautan</h4>
            <ul className="space-y-2">
              {[
                { label: 'Beranda',      href: '/'        },
                { label: 'Trending',     href: '/trending'},
                { label: 'Arsip Berita', href: '/arsip'   },
                { label: 'Peta Situs',   href: '/peta-situs'},
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Informasi</h4>
            <ul className="space-y-2">
              {[
                { label: 'Tentang Kami',       href: '/tentang-kami'      },
                { label: 'Kontak',             href: '/kontak'             },
                { label: 'Kebijakan Privasi',  href: '/kebijakan-privasi' },
                { label: 'Syarat & Ketentuan', href: '/syarat-ketentuan'  },
                { label: 'Disclaimer',         href: '/disclaimer'         },
                { label: 'Pedoman Editorial',  href: '/pedoman-editorial'  },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-xs">&copy; {year} KabarKini. Hak cipta dilindungi undang-undang.</p>
          <p className="text-slate-600 text-xs">Seluruh konten merupakan karya editorial orisinal. Dilarang mengutip tanpa menyebut sumber.</p>
        </div>
      </div>
    </footer>
  )
}
