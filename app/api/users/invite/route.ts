// app/api/users/invite/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))

  if (!body.email || !body.role) {
    return NextResponse.json({ error: 'email dan role wajib diisi' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // 1. Invite via Supabase Auth (sends magic link email)
  const { data: authData, error: authError } = await supabase.auth.admin.inviteUserByEmail(
    body.email,
    { data: { role: body.role, name: body.name || '' } }
  )

  if (authError) return NextResponse.json({ error: authError.message }, { status: 500 })

  // 2. Create admin_users profile row
  const userId = authData?.user?.id
  if (userId) {
    await supabase.from('admin_users').upsert({
      id:     userId,
      name:   body.name  || body.email.split('@')[0],
      email:  body.email,
      role:   body.role,
      status: 'active',
    })
  }

  return NextResponse.json({ success: true, userId })
}
