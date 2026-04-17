// app/api/workflow/runs/route.ts
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// GET /api/workflow/runs — last 20 runs with their logs
export async function GET() {
  const supabase = createAdminClient()

  const { data: runs, error } = await supabase
    .from('workflow_runs')
    .select('*')
    .order('started_at', { ascending: false })
    .limit(20)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Fetch logs for all runs in one query
  const runIds = (runs ?? []).map((r: Record<string, unknown>) => r.id as string)
  const { data: allLogs } = runIds.length > 0
    ? await supabase
        .from('workflow_logs')
        .select('*')
        .in('workflow_run_id', runIds)
        .order('timestamp', { ascending: true })
    : { data: [] }

  // Group logs by run_id
  const logsByRun: Record<string, unknown[]> = {}
  ;(allLogs ?? []).forEach((log: Record<string, unknown>) => {
    const rid = log.workflow_run_id as string
    if (!logsByRun[rid]) logsByRun[rid] = []
    logsByRun[rid].push(log)
  })

  const result = (runs ?? []).map((run: Record<string, unknown>) => ({
    id:                run.id,
    runType:           run.run_type,
    status:            run.status,
    startedAt:         run.started_at,
    completedAt:       run.completed_at,
    sourcesIngested:   run.sources_ingested,
    topicsClustered:   run.topics_clustered,
    articlesGenerated: run.articles_generated,
    articlesPublished: run.articles_published,
    articlesReviewed:  run.articles_reviewed,
    articlesRejected:  run.articles_rejected,
    errors:            run.errors,
    logs: (logsByRun[run.id as string] ?? []).map((l: unknown) => {
      const log = l as Record<string, unknown>
      return {
        step:      log.step,
        message:   log.message,
        level:     log.level,
        timestamp: log.timestamp,
      }
    }),
  }))

  return NextResponse.json({ runs: result })
}
