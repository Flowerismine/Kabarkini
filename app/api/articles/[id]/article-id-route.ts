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

  const { data: tagRows } = await supabase
    .from('article_tags')
    .select('tag_id')
    .eq('article_id', id)

  return NextResponse.json({
    article: transformArticleRow(row, sources ?? []),
    tagIds: (tagRows ?? []).map((r: { tag_id: string }) => r.tag_id),
  })
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

  if (body.title          !== undefined) updates.title           = body.title
  if (body.excerpt        !== undefined) updates.excerpt         = body.excerpt
  if (body.articleText    !== undefined) updates.article_text    = body.articleText
  if (body.articleHtml    !== undefined) updates.article_html    = body.articleHtml
  if (body.coverImageUrl  !== undefined) updates.cover_image_url = body.coverImageUrl
  if (body.metaTitle      !== undefined) updates.meta_title      = body.metaTitle
  if (body.metaDescription!== undefined) updates.meta_description= body.metaDescription
  if (body.focusKeyword   !== undefined) updates.focus_keyword   = body.focusKeyword
  if (body.categoryId     !== undefined) updates.category_id     = body.categoryId
  if (body.isBreaking     !== undefined) updates.is_breaking     = body.isBreaking
  if (body.isFeatured     !== undefined) updates.is_featured     = body.isFeatured
  if (body.isTrending     !== undefined) updates.is_trending     = body.isTrending
  if (body.status) {
    updates.status = body.status
    if (body.status === 'published') updates.published_at = new Date().toISOString()
    if (body.status === 'scheduled' && body.scheduledAt) updates.scheduled_at = body.scheduledAt
  }

  const { data, error } = await supabase
    .from('articles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Update tags jika dikirim
  if (Array.isArray(body.tagIds)) {
    await supabase.from('article_tags').delete().eq('article_id', id)
    if (body.tagIds.length > 0) {
      await supabase.from('article_tags').insert(
        body.tagIds.map((tag_id: string) => ({ article_id: id, tag_id }))
      )
    }
  }

  return NextResponse.json({ article: data })
}

// DELETE /api/articles/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createAdminClient()
  const { error } = await supabase.from('articles').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
