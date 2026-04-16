// Cron: 0 5 * * * UTC = 12:00 WIB
// Triggered by Vercel Cron as GET request
import { NextRequest, NextResponse } from 'next/server'
import { runDailyPipeline } from '@/lib/workflow/pipeline'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (process.env.NODE_ENV === 'production' && cronSecret) {
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }
  try {
    const result = await runDailyPipeline({
      runType: 'daily_noon',
      maxArticles: 8,
      autoPublishThreshold: 85,
      reviewThreshold: 70,
    })
    return NextResponse.json({ success: true, run: 'noon_12:00_WIB', runId: result.runId, articlesPublished: result.articlesPublished })
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 })
  }
}
