// app/api/wordpress/sync/route.ts
import { NextRequest, NextResponse } from 'next/server'
import {
  syncArticleToWordPress,
  batchSyncToWordPress,
  testWordPressConnection,
  type WordPressConfig,
} from '@/lib/workflow/wordpress-sync'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, article, articleId, config } = body

    if (!config?.siteUrl || !config?.username || !config?.applicationPassword) {
      return NextResponse.json(
        { error: 'WordPress config (siteUrl, username, applicationPassword) wajib diisi' },
        { status: 400 }
      )
    }

    const wpConfig: WordPressConfig = {
      siteUrl:             config.siteUrl.replace(/\/$/, ''), // trim trailing slash
      username:            config.username,
      applicationPassword: config.applicationPassword,
      postStatus:          config.postStatus          || 'publish',
      categoryMapping:     config.categoryMapping     || {},
      sendFeaturedImage:   config.sendFeaturedImage   ?? true,
      sendSeoFields:       config.sendSeoFields       ?? true,
      autoRetryOnFail:     config.autoRetryOnFail     ?? true,
    }

    // ── Test koneksi ─────────────────────────────────────────
    if (action === 'test') {
      const result = await testWordPressConnection(wpConfig)
      return NextResponse.json(result)
    }

    // ── Sync 1 artikel (by object) ───────────────────────────
    if (action === 'sync' && article) {
      const result = await syncArticleToWordPress(article, wpConfig)
      return NextResponse.json(result)
    }

    // ── Retry 1 artikel (by id dari Supabase) ────────────────
    if (action === 'retry' && articleId) {
      const supabase = createAdminClient()
      const { data: row } = await supabase
        .from('articles_with_category')
        .select('*')
        .eq('id', articleId)
        .single()

      if (!row) return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 })

      const result = await syncArticleToWordPress(
        {
          id:              row.id,
          title:           row.title,
          slug:            row.slug,
          excerpt:         row.excerpt || '',
          articleHtml:     row.article_html || '',
          category:        row.category_slug || '',
          tags:            [],
          coverImageUrl:   row.cover_image_url || undefined,
          coverImageAlt:   row.cover_image_alt || undefined,
          metaTitle:       row.meta_title || undefined,
          metaDescription: row.meta_description || undefined,
          focusKeyword:    row.focus_keyword || undefined,
          publishedAt:     row.published_at || undefined,
        },
        wpConfig
      )
      return NextResponse.json(result)
    }

    // ── Sync semua artikel published ──────────────────────────
    if (action === 'sync_all') {
      const supabase = createAdminClient()

      const { data: rows, error } = await supabase
        .from('articles_with_category')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(50) // max 50 per sync untuk hindari timeout

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      const articles = (rows ?? []).map((row: Record<string, unknown>) => ({
        id:              row.id as string,
        title:           row.title as string,
        slug:            row.slug as string,
        excerpt:         (row.excerpt as string) || '',
        articleHtml:     (row.article_html as string) || '',
        category:        (row.category_slug as string) || '',
        tags:            [] as string[],
        coverImageUrl:   (row.cover_image_url as string) || undefined,
        coverImageAlt:   (row.cover_image_alt as string) || undefined,
        metaTitle:       (row.meta_title as string) || undefined,
        metaDescription: (row.meta_description as string) || undefined,
        focusKeyword:    (row.focus_keyword as string) || undefined,
        publishedAt:     (row.published_at as string) || undefined,
      }))

      const results = await batchSyncToWordPress(articles, wpConfig)

      const successCount = results.filter(r => r.success).length
      const failCount    = results.filter(r => !r.success).length

      return NextResponse.json({
        success: true,
        total:   results.length,
        successCount,
        failCount,
        results,
      })
    }

    return NextResponse.json(
      { error: 'action harus: test | sync | sync_all | retry' },
      { status: 400 }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
