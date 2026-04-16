import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  Clock,
  Calendar,
  Eye,
  BookOpen,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Info,
} from 'lucide-react'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { BreakingTicker } from '@/components/layout/breaking-ticker'
import { ArticleCard } from '@/components/news/article-card'
import { AdSlot } from '@/components/ads/ad-slot'
import { ShareButtons } from '@/components/news/share-buttons'
import { NewsletterForm } from '@/components/news/newsletter-form'
import { getArticleBySlug, getRelatedArticles, ARTICLES, getPublishedArticles } from '@/lib/mock-data'
import { formatDate, formatDateTime } from '@/lib/date-utils'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return { title: 'Artikel Tidak Ditemukan' }

  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt,
    keywords: [article.focusKeyword, ...article.relatedKeywords],
    authors: [{ name: article.authorLabel }],
    openGraph: {
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.authorLabel],
      images: [
        {
          url: article.coverImageUrl,
          width: 1200,
          height: 630,
          alt: article.coverImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt,
      images: [article.coverImageUrl],
    },
    alternates: {
      canonical: article.canonicalUrl,
    },
  }
}

const SOURCE_TYPE_LABEL: Record<string, string> = {
  media: 'Media',
  official: 'Sumber Resmi',
  press_release: 'Siaran Pers',
  social: 'Media Sosial',
}

const VERIFICATION_CONFIG = {
  verified: { label: 'Terverifikasi', color: 'text-green-700 bg-green-50 border-green-200', icon: CheckCircle2 },
  partial: { label: 'Sebagian Terverifikasi', color: 'text-yellow-700 bg-yellow-50 border-yellow-200', icon: AlertCircle },
  developing: { label: 'Masih Berkembang', color: 'text-blue-700 bg-blue-50 border-blue-200', icon: Info },
  unverified: { label: 'Belum Diverifikasi', color: 'text-red-700 bg-red-50 border-red-200', icon: AlertCircle },
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article || article.status !== 'published') {
    notFound()
  }

  const related = getRelatedArticles(article, 4)
  const popular = getPublishedArticles(6)
    .filter((a) => a.id !== article.id)
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 5)
  const verif = VERIFICATION_CONFIG[article.verificationStatus]
  const VerifIcon = verif.icon

  // JSON-LD NewsArticle Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    alternativeHeadline: article.alternativeTitles[0],
    description: article.excerpt,
    image: [article.coverImageUrl],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: [{ '@type': 'Organization', name: article.authorLabel }],
    publisher: {
      '@type': 'Organization',
      name: 'KabarKini',
      logo: { '@type': 'ImageObject', url: 'https://kabarkini.id/logo.png' },
    },
    url: article.canonicalUrl,
    mainEntityOfPage: { '@type': 'WebPage', '@id': article.canonicalUrl },
    keywords: [article.focusKeyword, ...article.relatedKeywords].join(', '),
    articleSection: article.category.name,
    inLanguage: 'id',
    isAccessibleForFree: true,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SiteHeader showBreaking={false} />
      <BreakingTicker />

      <main className="max-w-7xl mx-auto px-4 py-8" id="main-content">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link href="/" className="hover:text-[var(--navy)] transition-colors">Beranda</Link>
          <ChevronRight className="w-3 h-3" />
          <Link
            href={`/kategori/${article.category.slug}`}
            className="hover:text-[var(--navy)] transition-colors"
            style={{ color: article.category.color }}
          >
            {article.category.name}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="line-clamp-1">{article.title.slice(0, 50)}...</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Article main */}
          <article className="lg:col-span-2" itemScope itemType="https://schema.org/NewsArticle">
            {/* Category + badges */}
            <div className="flex items-center gap-2 mb-3">
              <Link
                href={`/kategori/${article.category.slug}`}
                className="text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded text-white"
                style={{ backgroundColor: article.category.color }}
              >
                {article.category.name}
              </Link>
              {article.isBreaking && (
                <span className="text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded bg-[var(--red)] text-white">
                  Breaking
                </span>
              )}
              {article.verificationStatus === 'developing' && (
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded">
                  Informasi Berkembang
                </span>
              )}
            </div>

            {/* Title */}
            <h1
              className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight text-balance"
              itemProp="headline"
            >
              {article.title}
            </h1>

            {/* Excerpt */}
            <p className="text-lg text-muted-foreground mt-4 leading-relaxed font-medium border-l-4 border-[var(--red)] pl-4">
              {article.excerpt}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mt-5 pb-5 border-b border-border text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{article.authorLabel}</span>
              {article.editorName && (
                <span className="text-xs bg-muted px-2 py-0.5 rounded">
                  Ed: {article.editorName}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <time dateTime={article.publishedAt} itemProp="datePublished">
                  {formatDateTime(article.publishedAt || article.createdAt)}
                </time>
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                {article.readingTime} menit baca
              </span>
              {article.viewCount && (
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {article.viewCount.toLocaleString('id-ID')} pembaca
                </span>
              )}
            </div>

            {/* Share top */}
            <ShareButtons url={article.canonicalUrl} title={article.title} compact />

            {/* Cover image */}
            <figure className="mt-6 mb-6">
              <img
                src={`https://placehold.co/1200x630?text=${encodeURIComponent(article.category.name + '+Berita+Indonesia+Terkini+Detail')}`}
                alt={article.coverImageAlt}
                className="w-full rounded-xl object-cover"
                loading="eager"
                itemProp="image"
                width={1200}
                height={630}
              />
              <figcaption className="text-xs text-muted-foreground mt-2 text-center">
                Ilustrasi: {article.coverImageAlt}
              </figcaption>
            </figure>

            {/* Verification status */}
            <div className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium mb-6 ${verif.color}`}>
              <VerifIcon className="w-4 h-4 shrink-0" />
              <span>Status Verifikasi: {verif.label}</span>
              <span className="text-xs opacity-70">
                — {article.sourceCount} sumber dikonfirmasi
              </span>
            </div>

            {/* Bullet points */}
            <div className="bg-[var(--navy)]/5 border border-[var(--navy)]/20 rounded-xl p-5 mb-6">
              <h2 className="font-serif font-bold text-[var(--navy)] text-base mb-3 flex items-center gap-2">
                <span className="w-5 h-5 bg-[var(--navy)] rounded text-white text-xs flex items-center justify-center font-bold">
                  i
                </span>
                Poin-Poin Utama
              </h2>
              <ul className="space-y-2">
                {article.bulletPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--red)] shrink-0 mt-2" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ad slot 1 */}
            <div className="flex justify-center my-6">
              <AdSlot position="in_content_1" />
            </div>

            {/* Article body */}
            <div className="article-body" itemProp="articleBody">
              <p>
                {article.excerpt} Perkembangan ini menandai babak baru yang signifikan dalam dinamika
                politik dan hukum nasional yang telah menjadi perhatian publik selama beberapa bulan
                terakhir.
              </p>

              <h2>Kronologi dan Latar Belakang</h2>
              <p>
                Proses yang berujung pada pengesahan ini telah berlangsung selama lebih dari dua tahun,
                dipicu oleh berbagai kasus besar yang menuntut kehadiran instrumen hukum yang lebih
                kuat dan efektif. Para pemangku kepentingan dari berbagai lapisan masyarakat, mulai
                dari akademisi hukum, lembaga antikorupsi, hingga kalangan bisnis, turut memberikan
                masukan selama proses pembahasan berlangsung.
              </p>

              <blockquote>
                &ldquo;Ini adalah terobosan besar yang sudah lama kami nantikan. Dengan regulasi ini,
                penegakan hukum kita memiliki gigi yang jauh lebih kuat.&rdquo;
              </blockquote>

              <h2>Dampak dan Implikasi Nyata</h2>
              <p>
                Para pakar hukum yang diwawancarai oleh Tim Redaksi KabarKini menyatakan bahwa
                implementasi regulasi ini akan membutuhkan kesiapan lembaga penegak hukum, infrastruktur
                teknis yang memadai, serta koordinasi lintas instansi yang kuat. Beberapa tantangan
                teknis diprediksi akan muncul dalam tahap awal penerapan.
              </p>
              <p>
                Di sisi lain, kalangan aktivis antikorupsi menyambut langkah ini sebagai salah satu
                pencapaian terbesar dalam sejarah pemberantasan korupsi di Indonesia. Sejumlah negara
                di Asia Tenggara yang lebih dulu menerapkan regulasi serupa mencatat hasil yang
                signifikan dalam pemulihan aset negara.
              </p>

              <h2>Respons Berbagai Pihak</h2>
              <p>
                Berbagai pihak memberikan tanggapan yang beragam. Kelompok yang mendukung menekankan
                pentingnya langkah ini sebagai bagian dari reformasi hukum yang lebih luas. Sementara
                sebagian pihak menggarisbawahi pentingnya mekanisme perlindungan hak-hak individu agar
                regulasi ini tidak disalahgunakan.
              </p>

              <ul>
                <li>Lembaga antikorupsi menyambut positif dan berharap implementasi segera dilakukan</li>
                <li>Advokat dan asosiasi pengacara meminta kejelasan prosedur dan standar bukti</li>
                <li>Pemerintah berkomitmen menyiapkan aturan pelaksana dalam 60 hari</li>
                <li>DPR akan membentuk tim pengawas implementasi lintas komisi</li>
              </ul>
            </div>

            {/* Ad slot 2 */}
            <div className="flex justify-center my-6">
              <AdSlot position="in_content_2" />
            </div>

            {/* Why it matters */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 my-6">
              <h2 className="font-serif font-bold text-amber-800 text-base mb-2">
                Mengapa Ini Penting
              </h2>
              <p className="text-sm text-amber-900 leading-relaxed">{article.whyItMatters}</p>
            </div>

            {/* Next to watch */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 my-6">
              <h2 className="font-serif font-bold text-blue-800 text-base mb-2">
                Yang Perlu Dipantau Selanjutnya
              </h2>
              <p className="text-sm text-blue-900 leading-relaxed">{article.nextToWatch}</p>
            </div>

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="my-6">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-2">Tag:</p>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/tag/${tag.slug}`}
                      className="text-xs bg-muted hover:bg-[var(--navy)] hover:text-white px-3 py-1.5 rounded-full transition-colors font-medium border border-border"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Editorial disclaimer */}
            {article.authorType === 'ai' && (
              <div className="bg-muted border border-border rounded-lg p-4 my-6 text-xs text-muted-foreground">
                <p className="font-semibold mb-1">Catatan Editorial</p>
                <p>
                  Artikel ini diproduksi oleh sistem penulisan berbasis AI KabarKini dengan pengawasan
                  editor manusia. Seluruh fakta telah diverifikasi dari sumber-sumber terpercaya yang
                  tercantum di bawah. Jika menemukan kesalahan faktual, silakan hubungi tim redaksi
                  kami melalui halaman{' '}
                  <Link href="/kontak" className="underline hover:text-foreground">
                    Kontak
                  </Link>
                  .
                </p>
              </div>
            )}

            {/* Sources */}
            <div className="border border-border rounded-xl p-5 my-6">
              <h2 className="font-serif font-bold text-base text-foreground mb-4">
                Sumber Referensi
              </h2>
              <ul className="space-y-3">
                {article.sources.map((source) => (
                  <li key={source.id} className="flex items-start gap-3 text-sm">
                    <span
                      className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded mt-0.5"
                      style={{
                        backgroundColor: source.type === 'official' ? '#065F4615' : '#1D4ED815',
                        color: source.type === 'official' ? '#065F46' : '#1D4ED8',
                      }}
                    >
                      {SOURCE_TYPE_LABEL[source.type]}
                    </span>
                    <div>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="font-semibold text-[var(--navy)] hover:underline flex items-center gap-1"
                      >
                        {source.name}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      {source.publishedAt && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Diterbitkan: {formatDate(source.publishedAt)}
                        </p>
                      )}
                    </div>
                    <span className="ml-auto text-xs text-muted-foreground shrink-0">
                      Kepercayaan: {source.trustScore}/100
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Share bottom */}
            <div className="mt-2">
              <p className="text-sm font-semibold text-foreground mb-3">Artikel ini bermanfaat? Bagikan:</p>
              <ShareButtons url={article.canonicalUrl} title={article.title} />
            </div>

            {/* Newsletter CTA */}
            <section
              aria-label="Newsletter"
              className="bg-[var(--navy)] rounded-2xl p-6 md:p-8 text-white mt-8"
            >
              <h2 className="font-serif text-xl font-bold text-white text-balance">
                Jangan Ketinggalan Berita Penting
              </h2>
              <p className="text-slate-300 mt-2 text-sm leading-relaxed">
                Dapatkan ringkasan berita terpenting KabarKini setiap pagi langsung di inbox Anda.
              </p>
              <NewsletterForm />
              <p className="text-slate-500 text-xs mt-3">Tanpa spam. Bisa berhenti kapan saja.</p>
            </section>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-5">
              <AdSlot position="sidebar" />

              {/* Most read */}
              {popular.length > 0 && (
                <div className="bg-white rounded-xl border border-border p-5">
                  <h3 className="font-serif font-bold text-base text-foreground mb-4 border-b border-border pb-3">
                    Paling Banyak Dibaca
                  </h3>
                  <ol className="space-y-4">
                    {popular.map((a, idx) => (
                      <li key={a.id} className="flex items-start gap-3 group">
                        <span className="font-serif text-2xl font-bold text-border leading-none shrink-0 w-6 text-center mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: a.category.color }}>
                            {a.category.name}
                          </span>
                          <a
                            href={`/${a.slug}`}
                            className="block text-sm font-semibold text-foreground group-hover:text-[var(--navy)] transition-colors leading-snug mt-0.5 line-clamp-2"
                          >
                            {a.title}
                          </a>
                          <p className="text-xs text-muted-foreground mt-1">
                            {a.viewCount?.toLocaleString('id-ID')} pembaca
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Related */}
              {related.length > 0 && (
                <div className="bg-white rounded-xl border border-border p-5">
                  <h3 className="font-serif font-bold text-base text-foreground mb-4 border-b border-border pb-3">
                    Baca Juga
                  </h3>
                  <div className="space-y-4">
                    {related.map((r) => (
                      <ArticleCard
                        key={r.id}
                        article={r}
                        variant="minimal"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Related articles bottom */}
        {related.length > 0 && (
          <section aria-labelledby="related-heading" className="mt-12 border-t border-border pt-8">
            <h2 id="related-heading" className="font-serif text-2xl font-bold text-foreground mb-6">
              Artikel Terkait
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((r) => (
                <ArticleCard key={r.id} article={r} variant="compact" />
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </>
  )
}
