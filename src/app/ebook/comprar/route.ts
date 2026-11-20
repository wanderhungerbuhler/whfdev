import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * URL estável de compra do ebook: https://www.whfdev.com/ebook/comprar
 * Redireciona (307, sem cache) para o Payment Link do LOTE VIGENTE
 * (EBOOK_BUY_URL). Virada de lote = trocar EBOOK_BUY_URL (+ EBOOK_PRICE_ID) e
 * redeploy, só com autorização do Wander. Repassa a query (utm_*, prefilled_email).
 */
const LOTE1 = 'https://buy.stripe.com/4gMdR99wV7WS0jwc3X8N202'

export async function GET(req: Request) {
  const target = new URL(process.env.EBOOK_BUY_URL || LOTE1)
  const incoming = new URL(req.url).searchParams
  for (const [k, v] of incoming) {
    if (/^(utm_[a-z]+|prefilled_email|client_reference_id|locale)$/.test(k)) target.searchParams.set(k, v)
  }
  return NextResponse.redirect(target.toString(), {
    status: 307,
    headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' },
  })
}
