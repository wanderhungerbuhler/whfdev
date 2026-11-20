import { NextResponse } from 'next/server'

import { createLotCheckoutSession } from '@/lib/ebook-checkout'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * URL estável de compra do ebook: https://www.whfdev.com/ebook/comprar
 * Cria NA HORA uma Checkout Session com o price do lote vigente (automático,
 * pela contagem de vendas do Stripe; ver src/lib/ebook-lots.ts) e responde 303.
 * À prova de falha: se a criação falhar, cai no Payment Link de contingência
 * (EBOOK_FALLBACK_URL, padrão Lote 1), nunca mostra erro.
 */
const FALLBACK = 'https://buy.stripe.com/4gMdR99wV7WS0jwc3X8N202'
const PASS = /^(utm_[a-z]+|prefilled_email|client_reference_id)$/

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams
  const utm: Record<string, string> = {}
  q.forEach((v, k) => {
    if (/^utm_[a-z]+$/.test(k)) utm[k] = v.slice(0, 200)
  })
  const headers = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' }
  if (process.env.EBOOK_SALES_OPEN === '1') {
    try {
      const session = await createLotCheckoutSession({ utm, email: q.get('prefilled_email') })
      if (session.url) return NextResponse.redirect(session.url, { status: 303, headers })
    } catch (err) {
      console.error('[ebook] /ebook/comprar: criação da sessão falhou, usando o link de contingência', err)
    }
  }
  const fb = new URL(process.env.EBOOK_FALLBACK_URL || FALLBACK)
  q.forEach((v, k) => {
    if (PASS.test(k)) fb.searchParams.set(k, v)
  })
  return NextResponse.redirect(fb.toString(), { status: 307, headers })
}
