// ============================================
// KabarKini — POST /api/workflow/run-daily
// Trigger the full daily automation pipeline
// Protected: requires x-api-key header in prod
// ============================================

import { NextRequest, NextResponse } from 'next/server'
import { runDailyPipeline } from '@/lib/workflow/pipeline'

export async function POST(req: NextRequest) {
  // Basic auth protection in production
  const apiKey = req.headers.get('x-api-key')
  const expectedKey = process.env.WORKFLOW_API_KEY

  if (expectedKey && apiKey !== expectedKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const {
      runType = 'daily_main',
      maxArticles = 8,
      autoPublishThreshold = 85,
      reviewThreshold = 70,
    } = body

    const result = await runDailyPipeline({
      runType,
      maxArticles,
      autoPublishThreshold,
      reviewThreshold,
    })

    return NextResponse.json({
      success: true,
      runId: result.runId,
      summary: {
        sourcesIngested: result.sourcesIngested,
        topicsClustered: result.topicsClustered,
        articlesGenerated: result.articlesGenerated,
        articlesPublished: result.articlesPublished,
        articlesInReview: result.articlesInReview,
        articlesRejected: result.articlesRejected,
        errors: result.errors.length,
      },
      articles: result.articles.map((a) => ({
        title: a.title,
        slug: a.slug,
        status: a.status,
        publishReadinessScore: a.publishReadinessScore,
        category: a.category,
      })),
      logs: result.logs,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

// GET is used by Vercel Cron Jobs (they send GET requests)
export async function GET(req: NextRequest) {
  // Vercel Cron sends Authorization: Bearer <CRON_SECRET>
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  // In production, validate the cron secret
  if (process.env.NODE_ENV === 'production' && cronSecret) {
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    const result = await runDailyPipeline({
      runType: 'daily_main',
      maxArticles: 8,
      autoPublishThreshold: 85,
      reviewThreshold: 70,
    })

    return NextResponse.json({
      success: true,
      triggered: 'cron_get',
      runId: result.runId,
      articlesPublished: result.articlesPublished,
      articlesInReview: result.articlesInReview,
      errors: result.errors.length,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
