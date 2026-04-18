// app/api/articles/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { transformArticleRow } from '@/lib/supabase/transform'

// GET /api/articles/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: row, error } = await supabase
    .from('articles_with_category')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !row) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data: sources } = await supabase
    .from('article_sources')
    .select('*')
    .eq('article_id', id)

  return NextResponse.json({ article: transformArticleRow(row, sources ?? []) })
}

// PATCH /api/articles/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const supabase = createAdminClient()

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }

  if (body.status) {
    updates.status = body.status
    if (body.status === 'published') {
      updates.published_at = new Date().toISOString()
    }
    if (body.status === 'scheduled' && body.scheduledAt) {
      updates.scheduled_at = body.scheduledAt
    }
  }

  const { data, error } = await supabase
    .from('articles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ article: data })
}

// DELETE /api/articles/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
