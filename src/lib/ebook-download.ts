import 'server-only'

import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * Link de download do ebook: token assinado (HMAC-SHA256 com
 * EBOOK_DOWNLOAD_SECRET) = sessão do Checkout + validade. O PDF fica num Blob
 * PRIVADO da Vercel (EBOOK_BLOB_PATH) e só sai por /api/ebook/download.
 */
export const DOWNLOAD_TTL_SECONDS = 72 * 3600

function secret(): string {
  const s = process.env.EBOOK_DOWNLOAD_SECRET
  if (!s || s.length < 32) throw new Error('EBOOK_DOWNLOAD_SECRET is not configured')
  return s
}

const b64 = (s: string) => Buffer.from(s).toString('base64url')
const sign = (payload: string) => createHmac('sha256', secret()).update(payload).digest('base64url')

export function createDownloadToken(sessionId: string, now = Date.now()): string {
  const exp = Math.floor(now / 1000) + DOWNLOAD_TTL_SECONDS
  const payload = b64(`${sessionId}.${exp}`)
  return `${payload}.${sign(payload)}`
}

export function verifyDownloadToken(
  token: string | null | undefined,
  now = Date.now(),
): { ok: true; sessionId: string; exp: number } | { ok: false; reason: 'invalid' | 'expired' } {
  if (!token) return { ok: false, reason: 'invalid' }
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return { ok: false, reason: 'invalid' }
  const expected = Buffer.from(sign(payload))
  const given = Buffer.from(sig)
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    return { ok: false, reason: 'invalid' }
  }
  const [sessionId, expStr] = Buffer.from(payload, 'base64url').toString().split('.')
  const exp = Number(expStr)
  if (!sessionId || !Number.isFinite(exp)) return { ok: false, reason: 'invalid' }
  if (exp * 1000 < now) return { ok: false, reason: 'expired' }
  return { ok: true, sessionId, exp }
}

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.whfdev.com').replace(/\/$/, '')
}

export function downloadUrl(token: string): string {
  return `${siteUrl()}/api/ebook/download?t=${encodeURIComponent(token)}`
}

/** Página de obrigado / "gerar novo link" (verifica o pagamento no Stripe). */
export function thankYouUrl(sessionId: string): string {
  return `${siteUrl()}/api/ebook/obrigado?session_id=${encodeURIComponent(sessionId)}`
}
