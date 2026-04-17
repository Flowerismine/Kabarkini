// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { transformUserRow } from '@/lib/supabase/transform'

// PATCH /api/users/[id] — update role / status / name
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json().catch(() => ({}))
  const supabase = createAdminClient()

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (body.name   !== undefined) updates.name   = body.name
  if (body.role   !== undefined) updates.role   = body.role
  if (body.status !== undefined) updates.status = body.status

  const { data, error } = await supabase
    .from('admin_users')
    .update(updates)
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ user: transformUserRow(data) })
}

// DELETE /api/users/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createAdminClient()

  // Delete from auth (cascades to admin_users via FK)
  const { error } = await supabase.auth.admin.deleteUser(params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
