// app/api/users/route.ts
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { transformUserRow } from '@/lib/supabase/transform'

export async function GET() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .order('created_at')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const users = (data ?? []).map((row: Record<string, unknown>) => transformUserRow(row))
  return NextResponse.json({ users })
}
