// app/api/settings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// GET /api/settings
export async function GET() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Camel-case the response
  return NextResponse.json({
    settings: {
      siteName:              data.site_name,
      tagline:               data.tagline,
      siteUrl:               data.site_url,
      adminEmail:            data.admin_email,
      articlesPerPage:       data.articles_per_page,
      autoPublishThreshold:  data.auto_publish_threshold,
      reviewThreshold:       data.review_threshold,
      rejectThreshold:       data.reject_threshold,
      dailyRunEnabled:       data.daily_run_enabled,
      dailyRunTimes:         data.daily_run_times,
      breakingNewsEnabled:   data.breaking_news_enabled,
      wordpressConfig:       data.wordpress_config,
      updatedAt:             data.updated_at,
    },
  })
}

// PATCH /api/settings
// Body: any subset of settings fields (camelCase)
export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const supabase = createAdminClient()

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }

  // Map camelCase → snake_case
  const fieldMap: Record<string, string> = {
    siteName:             'site_name',
    tagline:              'tagline',
    siteUrl:              'site_url',
    adminEmail:           'admin_email',
    articlesPerPage:      'articles_per_page',
    autoPublishThreshold: 'auto_publish_threshold',
    reviewThreshold:      'review_threshold',
    rejectThreshold:      'reject_threshold',
    dailyRunEnabled:      'daily_run_enabled',
    dailyRunTimes:        'daily_run_times',
    breakingNewsEnabled:  'breaking_news_enabled',
    wordpressConfig:      'wordpress_config',
  }

  Object.entries(fieldMap).forEach(([camel, snake]) => {
    if (body[camel] !== undefined) updates[snake] = body[camel]
  })

  const { data, error } = await supabase
    .from('site_settings')
    .update(updates)
    .eq('id', 1)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, updatedAt: data.updated_at })
}
