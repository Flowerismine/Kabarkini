// lib/supabase/server.ts
// Server-side Supabase clients
// - createServerClient → Server Components, API Routes, middleware (respects RLS)
// - createAdminClient  → API Routes yang butuh bypass RLS (pakai service_role)

import { createServerClient as _createServerClient, type CookieOptions } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import type { Database } from './types'

// ── Server Component / Route Handler client (respects RLS) ──
export async function createServerClient() {
  const cookieStore = await cookies()

  return _createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll dipanggil dari Server Component → abaikan
          }
        },
      },
    }
  )
}

// ── Admin client (bypass RLS — HANYA di server/API routes) ──
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,   // JANGAN expose ke browser
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
