import 'server-only'

import type Stripe from 'stripe'

import { EBOOK_PROJECT } from '@/lib/ebook'
import { countsAsSale, lotForCount, lotPrices } from '@/lib/ebook-lots'
import { stripe } from '@/lib/stripe'

/**
 * Checkout automático do ebook por lote (ver src/lib/ebook-lots.ts).
 * À prova de falha: contagem com cache de 60 s; se a Stripe falhar, usa o
 * último lote conhecido (ou o Lote 1) e registra [ebook] no log.
 */
const CACHE_MS = 60_000
let cache: { n: number; at: number } | null = null
let lastKnownLot: 1 | 2 | 3 | null = null

/** n = vendas concluídas, pagas e não reembolsadas do ebook (só Stripe). */
export async function countValidSales(): Promise<number> {
  let n = 0
  let startingAfter: string | undefined
  for (let page = 0; page < 50; page++) {
    const res: Stripe.ApiList<Stripe.Checkout.Session> = await stripe().checkout.sessions.list({
      status: 'complete',
      limit: 100,
      starting_after: startingAfter,
      expand: ['data.payment_intent.latest_charge'],
    })
    for (const s of res.data) {
      const pi = typeof s.payment_intent === 'object' ? s.payment_intent : null
      const charge = pi && typeof pi.latest_charge === 'object' ? (pi.latest_charge as Stripe.Charge | null) : null
      const project = s.metadata?.project ?? pi?.metadata?.project ?? null
      if (
        countsAsSale({
          status: s.status,
          payment_status: s.payment_status,
          project,
          refunded: charge?.refunded ?? false,
          amountRefunded: charge?.amount_refunded ?? 0,
        })
      ) n++
    }
    if (!res.has_more || res.data.length === 0) break
    startingAfter = res.data[res.data.length - 1].id
  }
  return n
}

/** Lote vigente, com cache e fallback. Nunca lança. */
export async function currentLot(now = Date.now()): Promise<{ lot: 1 | 2 | 3; n: number | null; source: 'cache' | 'stripe' | 'fallback' }> {
  if (cache && now - cache.at < CACHE_MS) return { lot: lotForCount(cache.n), n: cache.n, source: 'cache' }
  try {
    const n = await countValidSales()
    cache = { n, at: now }
    lastKnownLot = lotForCount(n)
    return { lot: lastKnownLot, n, source: 'stripe' }
  } catch (err) {
    console.error('[ebook] contagem de vendas falhou; usando lote', lastKnownLot ?? 1, err)
    return { lot: lastKnownLot ?? 1, n: null, source: 'fallback' }
  }
}

const SUBMIT_NOTICE =
  'Produto digital: o PDF é enviado por e-mail logo após a confirmação do pagamento. Ao comprar, você pede o acesso imediato e reconhece que perde o direito de arrependimento de 14 dias depois de receber o arquivo.'

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.whfdev.com').replace(/\/$/, '')
}

/**
 * Cria a Checkout Session do lote vigente. `forceCurrency` (ex. 'eur') é usado
 * no link do e-mail de devolução geo. `utm` vira metadata (Session e PI).
 */
export async function createLotCheckoutSession(opts: {
  utm?: Record<string, string>
  email?: string | null
  forceCurrency?: 'eur'
} = {}) {
  const { lot, n, source } = await currentLot()
  const price = lotPrices()[lot - 1]
  const meta: Record<string, string> = { project: EBOOK_PROJECT, lote: String(lot), ...(opts.utm ?? {}) }
  if (opts.forceCurrency) meta.forced_currency = opts.forceCurrency
  const session = await stripe().checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price, quantity: 1 }],
    ...(opts.forceCurrency
      ? { currency: opts.forceCurrency, adaptive_pricing: { enabled: false } }
      : { adaptive_pricing: { enabled: true } }),
    customer_email: opts.email || undefined,
    customer_creation: 'always',
    custom_text: { submit: { message: SUBMIT_NOTICE } },
    metadata: meta,
    payment_intent_data: {
      statement_descriptor_suffix: 'AGENTES IA',
      metadata: meta,
    },
    success_url: `${siteUrl()}/api/ebook/obrigado?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl()}/`,
  })
  console.log(`[ebook] checkout lote=${lot} n=${n ?? '?'} fonte=${source} session=${session.id}`)
  return session
}
