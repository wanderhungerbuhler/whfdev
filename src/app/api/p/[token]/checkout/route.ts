import { and, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

import { db } from '@/lib/db/client'
import { payments, proposals } from '@/lib/db/schema'
import {
  createCheckoutForPayment,
  ensureDepositPayment,
  publicProposalUrl,
} from '@/lib/payments'
import { isStripeConfigured } from '@/lib/stripe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Ctx = { params: { token: string } }

/**
 * Página pública → POST (form) → Checkout do Stripe.
 * Sem JavaScript: devolve um redirect 303 para o URL da sessão.
 */
export async function POST(req: Request, { params }: Ctx) {
  const [proposal] = await db
    .select()
    .from(proposals)
    .where(eq(proposals.publicToken, params.token))
    .limit(1)
  if (!proposal) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const back = publicProposalUrl(proposal.publicToken)
  if (!isStripeConfigured()) {
    return NextResponse.redirect(`${back}?error=config`, 303)
  }

  let paymentId: string | null = null
  const contentType = req.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    const body = (await req.json().catch(() => ({}))) as { paymentId?: string }
    paymentId = body.paymentId ?? null
  } else {
    const form = await req.formData().catch(() => null)
    paymentId = (form?.get('paymentId') as string | null) ?? null
  }

  try {
    const payment = paymentId
      ? (
          await db
            .select()
            .from(payments)
            .where(
              and(eq(payments.id, paymentId), eq(payments.proposalId, proposal.id)),
            )
            .limit(1)
        )[0]
      : await ensureDepositPayment(proposal)

    if (!payment) return NextResponse.redirect(`${back}?error=missing`, 303)
    if (payment.status === 'paid') return NextResponse.redirect(back, 303)

    const url = await createCheckoutForPayment(payment, proposal)
    return NextResponse.redirect(url, 303)
  } catch (err) {
    console.error('[public checkout]', err)
    return NextResponse.redirect(`${back}?error=stripe`, 303)
  }
}
