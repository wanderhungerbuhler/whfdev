import 'server-only'

import type Stripe from 'stripe'

import { createDownloadToken, downloadUrl, thankYouUrl } from '@/lib/ebook-download'
import { ebookDeliveryEmail, ebookGeoRefundEmail } from '@/lib/email/ebook-email'
import { FROM_EMAIL, REPLY_TO, resend } from '@/lib/email/resend'
import { stripe } from '@/lib/stripe'

/**
 * Ebook "Seus primeiros agentes de IA" (projeto ebook-ia, 20/11/2026).
 *
 * Regra de preço por país (decisão do Wander: BLOQUEAR E DEVOLVER): o preço em
 * BRL é só para o Brasil. Pagamento em BRL com CARTÃO emitido fora do Brasil
 * (VPN/país trocado) → não entrega, reembolsa tudo (metadata.reason =
 * geo_price_mismatch) e manda e-mail educado com um link que cria um Checkout
 * só em EUR. Pix e cartões BR seguem normais; EUR/USD não são afetados.
 *
 * A entrega do PDF (link assinado de 72 h) liga-se quando houver EBOOK_PDF_PATH.
 */
export const EBOOK_PROJECT = 'ebook-ia'
export const GEO_REFUND_REASON = 'geo_price_mismatch'

export type GeoDecision = 'deliver' | 'refund_geo'

/** Decisão pura (testável): moeda + método + país do emissor do cartão. */
export function geoDecision(input: {
  currency: string | null | undefined
  paymentMethodType: string | null | undefined
  cardCountry: string | null | undefined
}): GeoDecision {
  const currency = (input.currency ?? '').toLowerCase()
  if (currency !== 'brl') return 'deliver'
  if (input.paymentMethodType !== 'card') return 'deliver' // Pix e outros
  const country = (input.cardCountry ?? '').toUpperCase()
  return country === 'BR' ? 'deliver' : 'refund_geo'
}

export function isEbookSession(
  session: Stripe.Checkout.Session,
  pi?: Stripe.PaymentIntent | null,
): boolean {
  return (
    session.metadata?.project === EBOOK_PROJECT ||
    pi?.metadata?.project === EBOOK_PROJECT
  )
}

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.whfdev.com').replace(/\/$/, '')
}

/** URL que cria na hora um Checkout só em EUR (nunca um 2.º link público). */
export function eurCheckoutUrl(): string {
  return `${siteUrl()}/api/ebook/checkout-eur`
}

/** Cria um Checkout Session em EUR para o ebook (link do e-mail de devolução). */
export async function createEurCheckoutSession(email?: string | null) {
  const price = process.env.EBOOK_PRICE_ID
  if (!price) throw new Error('EBOOK_PRICE_ID is not configured')
  return stripe().checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price, quantity: 1 }],
    currency: 'eur',
    adaptive_pricing: { enabled: false },
    customer_email: email || undefined,
    customer_creation: 'always',
    metadata: { project: EBOOK_PROJECT, forced_currency: 'eur' },
    payment_intent_data: {
      statement_descriptor_suffix: 'AGENTES IA',
      metadata: { project: EBOOK_PROJECT, forced_currency: 'eur' },
    },
    success_url: `${siteUrl()}/?ebook=obrigado&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl()}/`,
  })
}

export type EbookResult =
  | { action: 'not_ebook' }
  | { action: 'not_paid' }
  | { action: 'refunded_geo'; refundId: string; alreadyRefunded: boolean; emailSent: boolean }
  | { action: 'deliver_pending_pdf' }
  | { action: 'delivered'; emailSent: boolean }

/**
 * Trata um Checkout Session pago do ebook. Idempotente: se o PaymentIntent já
 * tiver reembolso geo, não reembolsa nem manda e-mail de novo; o e-mail usa a
 * Idempotency-Key do Resend (por sessão).
 */
export async function handleEbookSession(
  session: Stripe.Checkout.Session,
): Promise<EbookResult> {
  const piId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id
  if (!piId) return { action: 'not_ebook' }

  const pi = await stripe().paymentIntents.retrieve(piId, {
    expand: ['latest_charge'],
  })
  if (!isEbookSession(session, pi)) return { action: 'not_ebook' }
  if (pi.status !== 'succeeded') return { action: 'not_paid' }

  const charge = pi.latest_charge as Stripe.Charge | null
  const details = charge?.payment_method_details
  const decision = geoDecision({
    currency: pi.currency,
    paymentMethodType: details?.type,
    cardCountry: details?.card?.country,
  })

  if (decision === 'refund_geo') {
    const existing = await stripe().refunds.list({ payment_intent: pi.id, limit: 10 })
    const prior = existing.data.find((r) => r.metadata?.reason === GEO_REFUND_REASON)
    const refund =
      prior ??
      (await stripe().refunds.create(
        {
          payment_intent: pi.id,
          reason: 'requested_by_customer',
          metadata: {
            reason: GEO_REFUND_REASON,
            project: EBOOK_PROJECT,
            card_country: details?.card?.country ?? '',
            checkout_session: session.id,
          },
        },
        { idempotencyKey: `ebook-geo-refund-${pi.id}` },
      ))

    let emailSent = false
    const to = session.customer_details?.email ?? session.customer_email
    if (to && resend && !prior) {
      const { subject, html, text } = ebookGeoRefundEmail({ eurUrl: eurCheckoutUrl() })
      const r = await resend.emails.send(
        { from: FROM_EMAIL, to, replyTo: REPLY_TO, subject, html, text },
        { idempotencyKey: `ebook-geo-${session.id}` },
      )
      emailSent = !r.error
      if (r.error) console.error('[ebook] e-mail geo falhou', r.error)
    }
    console.log(
      `[ebook] geo_price_mismatch session=${session.id} pi=${pi.id} card=${details?.card?.country} refund=${refund.id} email=${emailSent}`,
    )
    return { action: 'refunded_geo', refundId: refund.id, alreadyRefunded: !!prior, emailSent }
  }

  // Entrega: e-mail com link assinado (72 h). Sem EBOOK_BLOB_PATH/secret: pendente.
  if (!process.env.EBOOK_BLOB_PATH || !process.env.EBOOK_DOWNLOAD_SECRET) {
    console.log(`[ebook] pago session=${session.id} pi=${pi.id}: entrega pendente (PDF não configurado)`)
    return { action: 'deliver_pending_pdf' }
  }
  const to = session.customer_details?.email ?? session.customer_email
  let emailSent = false
  if (to && resend) {
    const { subject, html, text } = ebookDeliveryEmail({
      downloadUrl: downloadUrl(createDownloadToken(session.id)),
      renewUrl: thankYouUrl(session.id),
    })
    const r = await resend.emails.send(
      { from: FROM_EMAIL, to, replyTo: REPLY_TO, subject, html, text },
      { idempotencyKey: `ebook-deliver-${session.id}` },
    )
    emailSent = !r.error
    if (r.error) {
      console.error('[ebook] e-mail de entrega falhou', r.error)
      throw new Error('ebook delivery email failed') // 500 → o Stripe tenta de novo
    }
  }
  console.log(`[ebook] entregue session=${session.id} pi=${pi.id} email=${emailSent}`)
  return { action: 'delivered', emailSent }
}

/**
 * Pode baixar? Sessão do ebook, paga, sem reembolso e sem bloqueio geo.
 * Usado pelo download e pela página de obrigado (gerar novo link).
 */
export async function canDownload(sessionId: string): Promise<boolean> {
  const session = await stripe().checkout.sessions.retrieve(sessionId)
  if (session.payment_status !== 'paid') return false
  const piId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id
  if (!piId) return false
  const pi = await stripe().paymentIntents.retrieve(piId, { expand: ['latest_charge'] })
  if (!isEbookSession(session, pi) || pi.status !== 'succeeded') return false
  const charge = pi.latest_charge as Stripe.Charge | null
  if (!charge || charge.refunded || (charge.amount_refunded ?? 0) > 0) return false
  const d = charge.payment_method_details
  return geoDecision({ currency: pi.currency, paymentMethodType: d?.type, cardCountry: d?.card?.country }) === 'deliver'
}
