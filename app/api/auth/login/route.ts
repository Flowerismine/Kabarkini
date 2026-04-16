import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createSessionToken } from '@/lib/auth-tokens'

const SESSION_COOKIE = 'admin_session'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email dan password wajib diisi.' },
        { status: 400 }
      )
    }

    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        {
          message:
            'Admin credentials belum dikonfigurasi. Set ADMIN_EMAIL dan ADMIN_PASSWORD di environment variables.',
        },
        { status: 503 }
      )
    }

    const emailMatch = email.toLowerCase() === adminEmail.toLowerCase()
    const passwordMatch = password === adminPassword

    if (!emailMatch || !passwordMatch) {
      // Delay 400–600ms untuk mencegah timing attack & brute-force
      await new Promise((r) => setTimeout(r, 400 + Math.random() * 200))
      return NextResponse.json(
        { message: 'Email atau password tidak valid.' },
        { status: 401 }
      )
    }

    // ✅ Buat signed session token (HMAC-SHA256)
    const token = await createSessionToken(email, 'admin')

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE, token, {
      httpOnly: true,                                      // Tidak bisa dibaca JS di browser
      secure: process.env.NODE_ENV === 'production',       // HTTPS only di production
      sameSite: 'lax',                                     // Proteksi CSRF
      path: '/admin',
      maxAge: 60 * 60 * 8,                                 // 8 jam (sama dengan token expiry)
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan server.'
    return NextResponse.json({ message }, { status: 500 })
  }
}

export async function DELETE() {
  // Logout: hapus session cookie
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/admin',
    maxAge: 0,
  })
  return NextResponse.json({ success: true })
}
