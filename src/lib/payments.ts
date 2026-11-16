import 'server-only'

import { and, eq } from 'drizzle-orm'
import type Stripe from 'stripe'

import { db } from '@/lib/db/client'
import {
  type Payment,
  payments,
  type Proposal,
  proposals,
} from '@/lib/db/schema'
import { FROM_EMAIL, REPLY_TO, resend } from '@/lib/email/resend'
import { stripe } from '@/lib/stripe'

/** Base pública do site (www, porque o apex redireciona). */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.whfdev.com'

export type ProposalLocale = 'pt-PT' | 'pt-BR' | 'en' | 'fr'
export const PROPOSAL_LOCALES: ProposalLocale[] = ['pt-PT', 'pt-BR', 'en', 'fr']
export const CURRENCIES = ['eur', 'usd'] as const

export function normalizeLocale(l: string | null | undefined): ProposalLocale {
  return (PROPOSAL_LOCALES as string[]).includes(l ?? '')
    ? (l as ProposalLocale)
    : 'pt-PT'
}

export function formatMoney(
  cents: number,
  currency: string,
  locale: string = 'pt-PT',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency.toUpperCase(),
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100)
}

export function depositCents(
  p: Pick<Proposal, 'totalAmountCents' | 'depositPercent'>,
): number | null {
  if (!p.totalAmountCents || p.totalAmountCents <= 0) return null
  const pct = Math.min(100, Math.max(1, p.depositPercent || 40))
  return Math.round((p.totalAmountCents * pct) / 100)
}

export function publicProposalUrl(token: string): string {
  return `${SITE_URL}/p/${token}`
}

/* ---------- textos ---------- */

const LABELS: Record<
  ProposalLocale,
  { deposit: (pct: number) => string; milestone: string; proposal: string }
> = {
  'pt-PT': {
    deposit: (pct) => `Sinal de ${pct}%`,
    milestone: 'Pagamento',
    proposal: 'Proposta WHFDEV',
  },
  'pt-BR': {
    deposit: (pct) => `Sinal de ${pct}%`,
    milestone: 'Pagamento',
    proposal: 'Proposta WHFDEV',
  },
  en: {
    deposit: (pct) => `${pct}% deposit`,
    milestone: 'Payment',
    proposal: 'WHFDEV proposal',
  },
  fr: {
    deposit: (pct) => `Acompte de ${pct}%`,
    milestone: 'Paiement',
    proposal: 'Proposition WHFDEV',
  },
}

export function paymentLabel(payment: Payment, proposal: Proposal): string {
  const t = LABELS[normalizeLocale(proposal.locale)]
  if (payment.kind === 'deposit') return t.deposit(proposal.depositPercent)
  return payment.description?.trim() || t.milestone
}

const STRIPE_LOCALE: Record<
  ProposalLocale,
  Stripe.Checkout.SessionCreateParams.Locale
> = { 'pt-PT': 'pt', 'pt-BR': 'pt-BR', en: 'en', fr: 'fr' }

/* ---------- pagamentos ---------- */

export async function listPayments(proposalId: string): Promise<Payment[]> {
  return db
    .select()
    .from(payments)
    .where(eq(payments.proposalId, proposalId))
    .orderBy(payments.createdAt)
}

/** Garante a linha do sinal (cria se ainda não existir). null = sem valor. */
export async function ensureDepositPayment(
  proposal: Proposal,
): Promise<Payment | null> {
  const amount = depositCents(proposal)
  if (!amount) return null

  const [existing] = await db
    .select()
    .from(payments)
    .where(
      and(eq(payments.proposalId, proposal.id), eq(payments.kind, 'deposit')),
    )
    .limit(1)

  if (existing) {
    // Valor/percentagem mudaram depois de criado e ainda não foi pago: atualiza.
    if (
      existing.status !== 'paid' &&
      (existing.amountCents !== amount || existing.currency !== proposal.currency)
    ) {
      const [updated] = await db
        .update(payments)
        .set({ amountCents: amount, currency: proposal.currency, updatedAt: new Date() })
        .where(eq(payments.id, existing.id))
        .returning()
      return updated
    }
    return existing
  }

  const [created] = await db
    .insert(payments)
    .values({
      proposalId: proposal.id,
      kind: 'deposit',
      amountCents: amount,
      currency: proposal.currency,
      status: 'pending',
    })
    .returning()
  return created
}

/**
 * Cria uma Checkout Session do Stripe para um pagamento e devolve o URL.
 * As sessões expiram em 24h, por isso são criadas no momento do clique.
 */
export async function createCheckoutForPayment(
  payment: Payment,
  proposal: Proposal,
): Promise<string> {
  if (payment.status === 'paid') throw new Error('payment already paid')

  const locale = normalizeLocale(proposal.locale)
  const label = paymentLabel(payment, proposal)
  const pageUrl = publicProposalUrl(proposal.publicToken)

  const session = await stripe().checkout.sessions.create({
    mode: 'payment',
    locale: STRIPE_LOCALE[locale],
    customer_email: proposal.clientEmail ?? undefined,
    client_reference_id: payment.id,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: payment.currency,
          unit_amount: payment.amountCents,
          product_data: {
            name: `${label} · ${LABELS[locale].proposal}`,
            description: proposal.emailSubject ?? proposal.clientName,
          },
        },
      },
    ],
    metadata: {
      proposalId: proposal.id,
      paymentId: payment.id,
      kind: payment.kind,
    },
    payment_intent_data: {
      description: `WHFDEV · ${proposal.clientName} · ${label}`,
      metadata: { proposalId: proposal.id, paymentId: payment.id },
    },
    billing_address_collection: 'auto',
    success_url: `${pageUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${pageUrl}?canceled=1`,
  })

  await db
    .update(payments)
    .set({
      stripeCheckoutSessionId: session.id,
      status: payment.status === 'failed' ? 'pending' : payment.status,
      updatedAt: new Date(),
    })
    .where(eq(payments.id, payment.id))

  if (!session.url) throw new Error('Stripe did not return a Checkout URL')
  return session.url
}

type FulfillResult =
  | { ok: true; payment: Payment; alreadyPaid: boolean }
  | { ok: false; reason: string }

/**
 * Confirma um pagamento a partir da Checkout Session. Idempotente: é chamado
 * pelo webhook e também pela página pública quando o cliente regressa do
 * Stripe, para o estado aparecer de imediato.
 */
export async function fulfillCheckoutSession(
  sessionOrId: string | Stripe.Checkout.Session,
): Promise<FulfillResult> {
  const session =
    typeof sessionOrId === 'string'
      ? await stripe().checkout.sessions.retrieve(sessionOrId, {
          expand: ['payment_intent.payment_method'],
        })
      : sessionOrId

  const paymentId = session.metadata?.paymentId ?? session.client_reference_id
  if (!paymentId) return { ok: false, reason: 'session without paymentId' }

  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.id, paymentId))
    .limit(1)
  if (!payment) return { ok: false, reason: `payment ${paymentId} not found` }

  const pi =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : (session.payment_intent?.id ?? null)
  const pm =
    typeof session.payment_intent === 'object' &&
    session.payment_intent &&
    typeof session.payment_intent.payment_method === 'object'
      ? (session.payment_intent.payment_method?.type ?? null)
      : null

  if (session.payment_status === 'paid') {
    if (payment.status === 'paid') return { ok: true, payment, alreadyPaid: true }

    const now = new Date()
    const [updated] = await db
      .update(payments)
      .set({
        status: 'paid',
        paidAt: now,
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: pi,
        stripePaymentMethod: pm,
        updatedAt: now,
      })
      .where(eq(payments.id, payment.id))
      .returning()

    const [proposal] = await db
      .select()
      .from(proposals)
      .where(eq(proposals.id, payment.proposalId))
      .limit(1)

    if (proposal && payment.kind === 'deposit' && proposal.status !== 'accepted') {
      await db
        .update(proposals)
        .set({ status: 'accepted', acceptedAt: now, updatedAt: now })
        .where(eq(proposals.id, proposal.id))
    }

    if (proposal) await notifyPaid(updated, proposal)
    return { ok: true, payment: updated, alreadyPaid: false }
  }

  // Sessão concluída mas ainda sem fundos (Multibanco, débito SEPA, …)
  if (session.status === 'complete' && payment.status !== 'paid') {
    const [updated] = await db
      .update(payments)
      .set({
        status: 'processing',
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: pi,
        stripePaymentMethod: pm,
        updatedAt: new Date(),
      })
      .where(eq(payments.id, payment.id))
      .returning()
    return { ok: true, payment: updated, alreadyPaid: false }
  }

  return { ok: true, payment, alreadyPaid: payment.status === 'paid' }
}

/** Pagamento assíncrono falhou (ex.: referência Multibanco expirada). */
export async function markPaymentFailed(session: Stripe.Checkout.Session) {
  const paymentId = session.metadata?.paymentId ?? session.client_reference_id
  if (!paymentId) return
  await db
    .update(payments)
    .set({ status: 'failed', updatedAt: new Date() })
    .where(and(eq(payments.id, paymentId), eq(payments.status, 'processing')))
}

async function notifyPaid(payment: Payment, proposal: Proposal) {
  if (!resend) return
  const to = process.env.CONTACT_TO_EMAIL ?? 'talkto@whfdev.com'
  const amount = formatMoney(payment.amountCents, payment.currency, 'pt-PT')
  const label = paymentLabel(payment, proposal)
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      replyTo: REPLY_TO,
      subject: `💶 Pagamento recebido · ${proposal.clientName} · ${amount}`,
      text: [
        `Cliente: ${proposal.clientName}${proposal.clientEmail ? ` <${proposal.clientEmail}>` : ''}`,
        `Pagamento: ${label} — ${amount}${payment.stripePaymentMethod ? ` (${payment.stripePaymentMethod})` : ''}`,
        `Proposta: ${proposal.emailSubject ?? '—'}`,
        '',
        `Admin: ${SITE_URL}/admin/proposals/${proposal.id}`,
        payment.stripePaymentIntentId
          ? `Stripe: https://dashboard.stripe.com/payments/${payment.stripePaymentIntentId}`
          : '',
      ]
        .filter(Boolean)
        .join('\n'),
    })
  } catch (err) {
    console.error('[payments] notify failed', err)
  }
}
