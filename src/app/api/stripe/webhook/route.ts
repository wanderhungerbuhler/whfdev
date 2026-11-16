import { NextResponse } from 'next/server'
import type Stripe from 'stripe'

import { fulfillCheckoutSession, markPaymentFailed } from '@/lib/payments'
import { stripe } from '@/lib/stripe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Webhook do Stripe. Eventos subscritos:
 *  - checkout.session.completed            (cartão, MB WAY: pago na hora)
 *  - checkout.session.async_payment_succeeded (Multibanco, SEPA: pago depois)
 *  - checkout.session.async_payment_failed
 * A assinatura é verificada com STRIPE_WEBHOOK_SECRET sobre o corpo bruto.
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json(
      { error: 'STRIPE_WEBHOOK_SECRET is not configured' },
      { status: 500 },
    )
  }

  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'missing signature' }, { status: 400 })
  }

  const rawBody = await req.text()
  let event: Stripe.Event
  try {
    event = stripe().webhooks.constructEvent(rawBody, signature, secret)
  } catch (err) {
    return NextResponse.json(
      { error: `invalid signature: ${(err as Error).message}` },
      { status: 400 },
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object as Stripe.Checkout.Session
        await fulfillCheckoutSession(session.id)
        break
      }
      case 'checkout.session.async_payment_failed': {
        await markPaymentFailed(event.data.object as Stripe.Checkout.Session)
        break
      }
      default:
        break
    }
  } catch (err) {
    console.error('[stripe webhook]', event.type, err)
    // 500 → o Stripe volta a tentar
    return NextResponse.json({ error: 'handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
