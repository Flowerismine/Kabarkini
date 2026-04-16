/**
 * auth-tokens.ts
 * HMAC-SHA256 signed session tokens — works in Edge Runtime & Node.js
 * No external dependencies. Uses the Web Crypto API (SubtleCrypto).
 *
 * Token format: base64url(payload).base64url(hmac_signature)
 */

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000 // 8 hours

// ── Helpers ────────────────────────────────────────────────────────────────

function toBase64Url(input: ArrayBuffer | Uint8Array): string {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

function fromBase64Url(b64url: string): Uint8Array {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(b64)
  return Uint8Array.from(raw, (c) => c.charCodeAt(0))
}

async function getSigningKey(): Promise<CryptoKey> {
  const secret = process.env.SESSION_SECRET
  if (!secret || secret.length < 32) {
    throw new Error(
      'SESSION_SECRET tidak ditemukan atau terlalu pendek. ' +
        'Set minimal 32 karakter acak di environment variables.'
    )
  }
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

// ── Public API ─────────────────────────────────────────────────────────────

export interface SessionPayload {
  email: string
  role: string
  iat: number // issued at (ms)
  exp: number // expires at (ms)
}

/**
 * Create a signed session token for a given email/role.
 */
export async function createSessionToken(
  email: string,
  role = 'admin'
): Promise<string> {
  const payload: SessionPayload = {
    email,
    role,
    iat: Date.now(),
    exp: Date.now() + SESSION_DURATION_MS,
  }

  // Encode payload as base64url
  const payloadJson = JSON.stringify(payload)
  const payloadB64 = toBase64Url(new TextEncoder().encode(payloadJson))

  // Sign the encoded payload
  const key = await getSigningKey()
  const sig = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(payloadB64)
  )

  return `${payloadB64}.${toBase64Url(sig)}`
}

/**
 * Verify a session token. Returns the payload if valid, null otherwise.
 * Checks: signature validity + expiry.
 */
export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const dotIndex = token.lastIndexOf('.')
    if (dotIndex === -1) return null

    const payloadB64 = token.slice(0, dotIndex)
    const sigB64 = token.slice(dotIndex + 1)

    if (!payloadB64 || !sigB64) return null

    // Verify signature first (constant-time via SubtleCrypto)
    const key = await getSigningKey()
    const sigBytes = fromBase64Url(sigB64)
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      new TextEncoder().encode(payloadB64)
    )

    if (!isValid) return null

    // Decode and parse payload
    const payloadJson = new TextDecoder().decode(fromBase64Url(payloadB64))
    const payload: SessionPayload = JSON.parse(payloadJson)

    // Check expiry
    if (payload.exp < Date.now()) return null

    return payload
  } catch {
    return null
  }
}
