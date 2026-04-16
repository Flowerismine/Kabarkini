import { NextRequest, NextResponse } from 'next/server'
import { verifySessionToken } from '@/lib/auth-tokens'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Hanya protect /admin routes (kecuali /admin/login itu sendiri)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const session = req.cookies.get('admin_session')

    // ✅ Verifikasi kriptografis: cek tanda tangan + expiry token
    const payload = session ? await verifySessionToken(session.value) : null

    if (!payload) {
      // Token tidak ada, tidak valid, atau sudah expired → redirect ke login
      const loginUrl = new URL('/admin/login', req.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
