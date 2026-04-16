// ============================================
// KabarKini — Date Formatting Utilities
// ============================================

export function formatDistanceToNow(dateString: string | undefined): string {
  if (!dateString) return 'Baru saja'

  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSeconds < 60) return 'Baru saja'
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`
  if (diffHours < 24) return `${diffHours} jam lalu`
  if (diffDays === 1) return 'Kemarin'
  if (diffDays < 7) return `${diffDays} hari lalu`

  return formatDate(dateString)
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
    timeZoneName: 'short',
  })
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  })
}
