// app/api/articles/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { transformArticleRow } from '@/lib/supabase/transform'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status   = searchParams.get('status')   || 'all'
  const page     = Math.max(1, parseInt(searchParams.get('page')     || '1'))
  const pageSize = Math.max(1, Math.min(50, parseInt(searchParams.get('pageSize') || '10')))
  const search   = searchParams.get('search')   || ''
  const category = searchParams.get('category') || ''

  const supabase = createAdminClient()

  let query = supabase
    .from('articles_with_category')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (status !== 'all') query = query.eq('status', status)
  if (search)           query = query.or(`title.ilike.%${search}%,focus_keyword.ilike.%${search}%`)
  if (category)         query = query.eq('category_slug', category)

  const from = (page - 1) * pageSize
  query = query.range(from, from + pageSize - 1)

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Batch-fetch source counts
  const ids = (data ?? []).map((a: Record<string, unknown>) => a.id as string)
  const sourceCounts: Record<string, number> = {}
  if (ids.length > 0) {
    const { data: srcData } = await supabase
      .from('article_sources')
      .select('article_id')
      .in('article_id', ids)
    ;(srcData ?? []).forEach((r: Record<string, unknown>) => {
      const aid = r.article_id as string
      sourceCounts[aid] = (sourceCounts[aid] || 0) + 1
    })
  }

  const articles = (data ?? []).map((row: Record<string, unknown>) =>
    transformArticleRow(row, [], sourceCounts[row.id as string] ?? 0)
  )

  return NextResponse.json({ articles, total: count ?? 0, page, pageSize })
}
