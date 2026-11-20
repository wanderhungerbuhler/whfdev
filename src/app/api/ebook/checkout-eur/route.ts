import { NextResponse } from 'next/server'

import { createLotCheckoutSession } from '@/lib/ebook-checkout'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/ebook/checkout-eur: link do e-mail de devolução geo. Cria na hora um
 * Checkout SÓ em EUR, no lote vigente. Desligado enquanto EBOOK_SALES_OPEN != 1.
 */
export async function GET() {
  if (process.env.EBOOK_SALES_OPEN !== '1') {
    return new NextResponse('Em breve. O guia ainda não está à venda.', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
    })
  }
  try {
    const session = await createLotCheckoutSession({ forceCurrency: 'eur' })
    return NextResponse.redirect(session.url!, { status: 303, headers: { 'Cache-Control': 'no-store' } })
  } catch (err) {
    console.error('[ebook checkout-eur]', err)
    return NextResponse.redirect('https://www.whfdev.com/ebook/comprar', { status: 307 })
  }
}
