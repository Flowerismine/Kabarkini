// app/api/categories/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { transformCategoryRow } from '@/lib/supabase/transform'

// GET /api/categories
export async function GET() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Enrich with article counts
  const ids = (data ?? []).map((c: Record<string, unknown>) => c.id as string)
  const countMap: Record<string, { live: number; total: number }> = {}
  if (ids.length > 0) {
    const { data: arts } = await supabase
      .from('articles')
      .select('category_id, status')
      .in('category_id', ids)
    ;(arts ?? []).forEach((a: Record<string, unknown>) => {
      const cid = a.category_id as string
      if (!countMap[cid]) countMap[cid] = { live: 0, total: 0 }
      countMap[cid].total++
      if (a.status === 'published') countMap[cid].live++
    })
  }

  const categories = (data ?? []).map((row: Record<string, unknown>) => ({
    ...transformCategoryRow(row),
    liveCount:  countMap[row.id as string]?.live  ?? 0,
    totalCount: countMap[row.id as string]?.total ?? 0,
  }))

  return NextResponse.json({ categories })
}

// POST /api/categories — create
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))

  if (!body.name || !body.slug) {
    return NextResponse.json({ error: 'name dan slug wajib diisi' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('categories')
    .insert({
      name:        body.name,
      slug:        body.slug,
      color:       body.color       || '#374151',
      description: body.description || '',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ category: transformCategoryRow(data) }, { status: 201 })
}
