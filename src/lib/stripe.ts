import 'server-only'

import Stripe from 'stripe'

/**
 * Cliente Stripe (server-only), inicializado de forma preguiçosa para o
 * `next build` não falhar sem a env var. Usa uma chave RESTRITA por projeto
 * (Developers → API keys → Restricted keys) com permissões mínimas:
 * Checkout Sessions: write · Payment Intents: read · Payment Methods: read.
 */
let cached: Stripe | null = null

export function stripe(): Stripe {
  if (cached) return cached
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not configured (see .env.example)')
  }
  cached = new Stripe(key, {
    appInfo: { name: 'WHFDEV proposals', url: 'https://www.whfdev.com' },
  })
  return cached
}

export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY
}
