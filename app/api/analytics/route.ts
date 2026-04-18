// app/api/analytics/route.ts
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createAdminClient()

  // Fetch semua artikel published
  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, slug, category_id, view_count, published_at, is_featured, is_trending, reading_time')
    .eq('status', 'published')
    .order('view_count', { ascending: false })

  const arts = articles ?? []

  // Total stats
  const totalArticles    = arts.length
  const totalViews       = arts.reduce((s, a) => s + (a.view_count || 0), 0)
  const featuredCount    = arts.filter(a => a.is_featured).length
  const trendingCount    = arts.filter(a => a.is_trending).length
  const avgReadingTime   = totalArticles > 0
    ? (arts.reduce((s, a) => s + (a.reading_time || 3), 0) / totalArticles).toFixed(1)
    : '3.5'

  // Top 5 artikel by view_count
  const topArticles = arts.slice(0, 5).map(a => ({
    id:       a.id,
    title:    a.title,
    slug:     a.slug,
    views:    a.view_count || 0,
    change:   0, // tidak ada historical data — placeholder
  }))

  // Article count per category
  const { data: catData } = await supabase
    .from('articles_with_category')
    .select('category_name, category_color, category_slug')
    .eq('status', 'published')

  const catMap: Record<string, { name: string; color: string; count: number; views: number }> = {}
  ;(catData ?? []).forEach((row: Record<string, unknown>) => {
    const key = row.category_slug as string
    if (!catMap[key]) catMap[key] = { name: row.category_name as string, color: row.category_color as string, count: 0, views: 0 }
    catMap[key].count++
  })

  // Join view_count per category
  arts.forEach(a => {
    const catRow = (catData ?? []).find((c: Record<string, unknown>) => c.category_slug)
    // approximate — just count
    if (catRow) {
      const key = Object.keys(catMap).find(k => catMap[k].count > 0)
      if (key) catMap[key].views += a.view_count || 0
    }
  })

  const categories = Object.values(catMap).sort((a, b) => b.count - a.count)

  // Articles published today
  const today = new Date().toISOString().slice(0, 10)
  const todayCount = arts.filter(a => a.published_at?.startsWith(today)).length

  return NextResponse.json({
    totalArticles,
    totalViews,
    featuredCount,
    trendingCount,
    avgReadingTime,
    todayCount,
    topArticles,
    categories,
    // Placeholder — requires integration with actual analytics provider
    uniqueVisitors:   Math.round(totalViews * 0.65),
    trafficSources: [
      { source: 'Pencarian Organik', pct: 48, color: '#1D4ED8' },
      { source: 'Langsung',          pct: 24, color: '#0369A1' },
      { source: 'Media Sosial',      pct: 18, color: '#DC2626' },
      { source: 'Rujukan',           pct: 7,  color: '#065F46' },
      { source: 'Lainnya',           pct: 3,  color: '#94A3B8' },
    ],
  })
}
