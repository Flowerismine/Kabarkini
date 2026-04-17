// app/api/articles/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { transformArticleRow } from '@/lib/supabase/transform'

// GET /api/articles/[id] — full article with sources
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createAdminClient()

  const { data: row, error } = await supabase
    .from('articles_with_category')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !row) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data: sources } = await supabase
    .from('article_sources')
    .select('*')
    .eq('article_id', params.id)

  return NextResponse.json({ article: transformArticleRow(row, sources ?? []) })
}

// PATCH /api/articles/[id] — update status / schedule / etc.
// Body: { status?, scheduledAt?, editorNote? }
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json().catch(() => ({}))
  const supabase = createAdminClient()

  // Build update payload
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
  if (body.editorNote !== undefined) {
    // Store editor note — extend if you add a column; for now skip silently
  }

  const { data, error } = await supabase
    .from('articles')
    .update(updates)
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ article: data })
}

// DELETE /api/articles/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
