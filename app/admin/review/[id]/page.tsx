'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  MessageSquare,
  Eye,
  Send,
  AlertTriangle,
} from 'lucide-react'
import { ARTICLES } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export default function ReviewDetailPage() {
  const params = useParams()
  const article = ARTICLES.find((a) => a.id === params.id) || ARTICLES.find((a) => a.status === 'review') || ARTICLES[0]

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-white border-b border-border px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/review"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Kembali ke Review Queue"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <p className="text-xs text-muted-foreground">Review Artikel</p>
            <h1 className="font-semibold text-sm text-foreground line-clamp-1">{article.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/admin/articles/${article.id}`}
            className="flex items-center gap-1.5 text-xs border border-border px-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Buka Editor
          </Link>
          <button className="flex items-center gap-1.5 text-xs bg-red-600 text-white px-4 py-1.5 rounded-lg hover:bg-red-700 transition-colors">
            <XCircle className="w-3.5 h-3.5" />
            Tolak
          </button>
          <button className="flex items-center gap-1.5 text-xs bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700 transition-colors">
            <CheckCircle className="w-3.5 h-3.5" />
            Setujui & Publish
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Article preview */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded uppercase text-white"
                style={{ backgroundColor: article.category.color }}
              >
                {article.category.name}
              </span>
              <span className="text-xs text-muted-foreground">{article.readingTime} mnt baca</span>
              <span className="text-xs text-muted-foreground">{article.wordCount} kata</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground leading-tight mb-3">
              {article.title}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-5 border-l-4 border-[var(--red)] pl-4 italic">
              {article.excerpt}
            </p>
            <div className="prose prose-sm max-w-none text-foreground leading-relaxed whitespace-pre-line text-sm border-t border-border pt-5">
              {article.articleText}
            </div>
          </div>
        </div>

        {/* Review panel */}
        <div className="lg:col-span-1 space-y-4">
          {/* Quality scores */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="font-semibold text-sm text-foreground mb-4">Skor Kualitas</h3>
            {[
              { label: 'Orisinalitas', value: article.originalityScore },
              { label: 'Keterbacaan', value: article.readabilityScore },
              { label: 'SEO', value: article.seoScore },
              { label: 'Fakta', value: article.factualConsistencyScore },
              { label: 'Kesiapan', value: article.publishReadinessScore },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <span className="text-xs text-muted-foreground w-20 shrink-0">{label}</span>
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full',
                      value >= 85 ? 'bg-green-500' : value >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                    )}
                    style={{ width: `${value}%` }}
                  />
                </div>
                <span className={cn(
                  'text-xs font-bold w-8 text-right',
                  value >= 85 ? 'text-green-600' : value >= 70 ? 'text-yellow-600' : 'text-red-600'
                )}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Sources */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="font-semibold text-sm text-foreground mb-3">
              Sumber ({article.sources.length})
            </h3>
            <div className="space-y-2">
              {article.sources.map((src) => (
                <div key={src.id} className="text-xs flex items-center gap-2">
                  <span className={cn(
                    'px-1.5 py-0.5 rounded font-semibold',
                    src.type === 'official' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  )}>
                    {src.type === 'official' ? 'Resmi' : 'Media'}
                  </span>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--navy)] hover:underline truncate"
                  >
                    {src.name}
                  </a>
                  <span className="ml-auto shrink-0 text-muted-foreground">{src.trustScore}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Issues / notes */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Catatan Review
            </h3>
            <textarea
              rows={4}
              placeholder="Tulis catatan untuk penulis (opsional)..."
              className="w-full text-xs border border-border rounded-lg p-3 outline-none resize-none focus:border-[var(--navy)] transition-colors"
            />
            <button className="mt-2 flex items-center gap-1.5 text-xs bg-muted border border-border text-foreground px-3 py-1.5 rounded-lg hover:bg-border transition-colors">
              <Send className="w-3 h-3" />
              Kirim ke Penulis
            </button>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border border-border p-5 space-y-2">
            <button className="w-full flex items-center justify-center gap-2 text-sm font-semibold bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition-colors">
              <CheckCircle className="w-4 h-4" />
              Setujui &amp; Publish
            </button>
            <button className="w-full flex items-center justify-center gap-2 text-sm font-semibold border border-border text-foreground py-2.5 rounded-lg hover:bg-muted transition-colors">
              <Eye className="w-4 h-4" />
              Minta Revisi
            </button>
            <button className="w-full flex items-center justify-center gap-2 text-sm font-semibold border border-red-200 text-red-600 py-2.5 rounded-lg hover:bg-red-50 transition-colors">
              <XCircle className="w-4 h-4" />
              Tolak Artikel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
