'use client'

import { useState } from 'react'
import { Share2, Link2, Check } from 'lucide-react'

interface ShareButtonsProps {
  url: string
  title: string
  compact?: boolean
}

export function ShareButtons({ url, title, compact = false }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs bg-sky-500 text-white px-3 py-1.5 rounded-md hover:bg-sky-600 transition-colors font-medium"
          aria-label="Bagikan ke Twitter"
        >
          Twitter/X
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors font-medium"
          aria-label="Bagikan ke Facebook"
        >
          Facebook
        </a>
        <a
          href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 transition-colors font-medium"
          aria-label="Bagikan ke WhatsApp"
        >
          WhatsApp
        </a>
        <button
          onClick={handleCopy}
          className="text-xs bg-muted text-muted-foreground px-3 py-1.5 rounded-md hover:bg-border transition-colors flex items-center gap-1 font-medium"
          aria-label="Salin tautan"
        >
          {copied ? <Check className="w-3 h-3 text-green-600" /> : <Link2 className="w-3 h-3" />}
          {copied ? 'Tersalin!' : 'Salin'}
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-3 py-5 border-t border-b border-border">
      <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
        <Share2 className="w-4 h-4" aria-hidden="true" />
        Bagikan:
      </span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-semibold bg-[#1DA1F2] text-white px-4 py-2 rounded-full hover:bg-[#1a91da] transition-colors"
        aria-label="Bagikan ke Twitter/X"
      >
        Twitter / X
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-semibold bg-[#1877F2] text-white px-4 py-2 rounded-full hover:bg-[#166fe5] transition-colors"
        aria-label="Bagikan ke Facebook"
      >
        Facebook
      </a>
      <a
        href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-semibold bg-[#25D366] text-white px-4 py-2 rounded-full hover:bg-[#1fbc59] transition-colors"
        aria-label="Bagikan ke WhatsApp"
      >
        WhatsApp
      </a>
      <a
        href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-semibold bg-[#2CA5E0] text-white px-4 py-2 rounded-full hover:bg-[#2090c9] transition-colors"
        aria-label="Bagikan ke Telegram"
      >
        Telegram
      </a>
      <button
        onClick={handleCopy}
        className="text-xs font-semibold bg-muted text-foreground px-4 py-2 rounded-full hover:bg-[var(--navy)] hover:text-white transition-colors flex items-center gap-1.5 ml-auto"
        aria-label="Salin tautan artikel"
      >
        {copied ? (
          <><Check className="w-3.5 h-3.5 text-green-500" aria-hidden="true" /> Tersalin!</>
        ) : (
          <><Link2 className="w-3.5 h-3.5" aria-hidden="true" /> Salin Tautan</>
        )}
      </button>
    </div>
  )
}
