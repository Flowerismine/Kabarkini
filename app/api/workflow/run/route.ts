// app/api/workflow/run/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// POST /api/workflow/run — trigger a new workflow run
// Body: { runType: 'daily_main'|'breaking'|'manual', topics?: string }
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const runType = body.runType || 'manual'

  const supabase = createAdminClient()

  // 1. Create workflow_run record
  const { data: run, error } = await supabase
    .from('workflow_runs')
    .insert({
      run_type: runType,
      status:   'running',
      started_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // 2. Insert initial log
  await supabase.from('workflow_logs').insert({
    workflow_run_id: run.id,
    step:    'Workflow',
    message: `Run ${runType} dimulai${body.topics ? ` — topik: ${body.topics}` : ''}`,
    level:   'info',
  })

  // 3. Kick off the actual AI pipeline (fire-and-forget to /api/articles/generate)
  //    Using absolute URL so it works in both dev and prod
  const baseUrl = req.nextUrl.origin
  fetch(`${baseUrl}/api/articles/generate`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ runId: run.id, runType, topics: body.topics || '' }),
  }).catch(() => {
    // Log failure but don't block the response
    supabase.from('workflow_logs').insert({
      workflow_run_id: run.id,
      step:    'Workflow',
      message: 'Gagal menghubungi pipeline /api/articles/generate',
      level:   'error',
    })
  })

  return NextResponse.json({ runId: run.id, status: 'running' }, { status: 201 })
}

// GET /api/workflow/run?id=xxx — poll run status + latest logs
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id diperlukan' }, { status: 400 })

  const supabase = createAdminClient()

  const { data: run, error } = await supabase
    .from('workflow_runs')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !run) return NextResponse.json({ error: 'Run tidak ditemukan' }, { status: 404 })

  const { data: logs } = await supabase
    .from('workflow_logs')
    .select('*')
    .eq('workflow_run_id', id)
    .order('timestamp', { ascending: true })

  return NextResponse.json({ run, logs: logs ?? [] })
}
