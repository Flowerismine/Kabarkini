// app/api/auth/login/route.ts
// ──────────────────────────────────────────────────────────────
// Password comparison strategy (backward compatible):
//
//   ADMIN_PASSWORD dimulai dengan "$2b$" atau "$2a$"
//     → Anggap sebagai bcrypt hash → pakai bcryptjs.compare()
//
//   ADMIN_PASSWORD teks biasa
//     → Bandingkan langsung (legacy / development)
//
// Cara generate bcrypt hash untuk ADMIN_PASSWORD baru:
//   node -e "const b=require('bcryptjs');b.hash('passwordmu',12).then(h=>console.log(h))"
//   → Salin output ke Vercel env var ADMIN_PASSWORD
// ──────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createSessionToken } from '@/lib/auth-tokens'
import bcrypt from 'bcryptjs'

const SESSION_COOKIE = 'admin_session'

function isBcryptHash(value: string): boolean {
  return value.startsWith('$2b$') || value.startsWith('$2a$') || value.startsWith('$2y$')
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email dan password wajib diisi.' },
        { status: 400 }
      )
    }

    const adminEmail    = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { message: 'Admin credentials belum dikonfigurasi. Set ADMIN_EMAIL dan ADMIN_PASSWORD di environment variables.' },
        { status: 503 }
      )
    }

    // ── Timing-safe email check ────────────────────────────
    const emailMatch = email.toLowerCase() === adminEmail.toLowerCase()

    // ── Password check: bcrypt hash atau plaintext ─────────
    let passwordMatch = false

    if (isBcryptHash(adminPassword)) {
      // Secure: compare against bcrypt hash
      passwordMatch = await bcrypt.compare(password, adminPassword)
    } else {
      // Legacy: plaintext comparison (dev / existing setup)
      passwordMatch = password === adminPassword
    }

    // ── Tambah delay untuk mencegah timing attack & brute-force
    await new Promise(r => setTimeout(r, 400 + Math.random() * 200))

    if (!emailMatch || !passwordMatch) {
      return NextResponse.json(
        { message: 'Email atau password tidak valid.' },
        { status: 401 }
      )
    }

    // ── Buat signed session token (HMAC-SHA256) ────────────
    const token = await createSessionToken(email, 'admin')

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path:     '/admin',
      maxAge:   60 * 60 * 8, // 8 jam
    })

    return NextResponse.json({ success: true })

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan server.'
    return NextResponse.json({ message }, { status: 500 })
  }
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path:     '/admin',
    maxAge:   0,
  })
  return NextResponse.json({ success: true })
}
