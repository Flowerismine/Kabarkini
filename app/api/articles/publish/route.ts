// ============================================
// KabarKini — POST /api/articles/publish
// Publish or schedule an article
// ============================================

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { articleId, action, scheduledAt } = body

    if (!articleId) {
      return NextResponse.json({ error: 'articleId is required' }, { status: 400 })
    }

    if (!['publish', 'schedule', 'unpublish', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'action must be: publish | schedule | unpublish | reject' },
        { status: 400 }
      )
    }

    // In production: update article status in Supabase
    // const supabase = createServerClient(...)
    // await supabase.from('articles').update({ status, scheduled_at }).eq('id', articleId)

    const result = {
      articleId,
      action,
      status:
        action === 'publish'
          ? 'published'
          : action === 'schedule'
          ? 'scheduled'
          : action === 'unpublish'
          ? 'draft'
          : 'rejected',
      scheduledAt: action === 'schedule' ? scheduledAt : null,
      timestamp: new Date().toISOString(),
    }

    // After publish: trigger sitemap + RSS revalidation
    if (action === 'publish') {
      // In production: call revalidatePath or update feeds
    }

    return NextResponse.json({ success: true, ...result })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
