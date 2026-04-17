// app/api/categories/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { transformCategoryRow } from '@/lib/supabase/transform'

// PATCH /api/categories/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json().catch(() => ({}))
  const supabase = createAdminClient()

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (body.name        !== undefined) updates.name        = body.name
  if (body.slug        !== undefined) updates.slug        = body.slug
  if (body.color       !== undefined) updates.color       = body.color
  if (body.description !== undefined) updates.description = body.description

  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ category: transformCategoryRow(data) })
}

// DELETE /api/categories/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createAdminClient()

  // Guard: reject if category still has articles
  const { count } = await supabase
    .from('articles')
    .select('id', { count: 'exact', head: true })
    .eq('category_id', params.id)

  if ((count ?? 0) > 0) {
    return NextResponse.json(
      { error: `Tidak bisa dihapus — masih ada ${count} artikel di kategori ini.` },
      { status: 409 }
    )
  }

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
