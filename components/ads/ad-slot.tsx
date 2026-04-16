'use client'

interface AdSlotProps {
  position: 'header' | 'in_content_1' | 'in_content_2' | 'sidebar' | 'footer' | 'mobile_sticky'
  className?: string
  label?: string
}

const AD_DIMENSIONS: Record<AdSlotProps['position'], { width: number; height: number; label: string }> = {
  header: { width: 728, height: 90, label: 'Leaderboard 728×90' },
  in_content_1: { width: 336, height: 280, label: 'In-Content 336×280' },
  in_content_2: { width: 336, height: 280, label: 'In-Content 336×280' },
  sidebar: { width: 300, height: 250, label: 'Sidebar 300×250' },
  footer: { width: 728, height: 90, label: 'Footer 728×90' },
  mobile_sticky: { width: 320, height: 50, label: 'Mobile Sticky 320×50' },
}

export function AdSlot({ position, className = '', label }: AdSlotProps) {
  const dims = AD_DIMENSIONS[position]
  const displayLabel = label || dims.label

  // In production, this would render actual AdSense code
  // The container must maintain fixed dimensions to prevent CLS
  return (
    <div
      className={`ad-slot w-full overflow-hidden ${className}`}
      style={{ minHeight: dims.height }}
      aria-label="Iklan"
      role="complementary"
    >
      <div
        className="mx-auto flex flex-col items-center justify-center gap-1"
        style={{ width: dims.width, maxWidth: '100%', height: dims.height }}
      >
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Iklan</span>
        <span className="text-[9px] text-muted-foreground">{displayLabel}</span>
      </div>
    </div>
  )
}
