import { NextResponse } from 'next/server'

import { createEurCheckoutSession } from '@/lib/ebook'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/ebook/checkout-eur: cria na hora um Checkout do ebook SÓ em EUR
 * (link do e-mail de devolução geo). Desligado enquanto EBOOK_SALES_OPEN != 1.
 */
export async function GET() {
  if (process.env.EBOOK_SALES_OPEN !== '1') {
    return new NextResponse('Em breve. O guia ainda não está à venda.', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
    })
  }
  try {
    const session = await createEurCheckoutSession()
    return NextResponse.redirect(session.url!, { status: 303, headers: { 'Cache-Control': 'no-store' } })
  } catch (err) {
    console.error('[ebook checkout-eur]', err)
    return new NextResponse('Erro ao abrir o pagamento. Tente de novo.', { status: 500 })
  }
}
