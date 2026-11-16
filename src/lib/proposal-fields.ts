import { CURRENCIES, PROPOSAL_LOCALES } from '@/lib/payments'

type MoneyPatch = {
  totalAmountCents?: number | null
  depositPercent?: number
  currency?: string
  locale?: string
}

/**
 * Valida os campos de valor/sinal/moeda/idioma vindos do painel.
 * Só devolve as chaves presentes no body (PATCH parcial).
 */
export function parseMoneyFields(
  body: Record<string, unknown>,
): MoneyPatch | { error: string } {
  const out: MoneyPatch = {}

  if (body.totalAmountCents !== undefined) {
    const v = body.totalAmountCents
    if (v === null || v === '') out.totalAmountCents = null
    else {
      const n = Number(v)
      if (!Number.isInteger(n) || n < 0 || n > 100_000_000_00) {
        return { error: 'totalAmountCents must be a non-negative integer (cents)' }
      }
      out.totalAmountCents = n === 0 ? null : n
    }
  }

  if (body.depositPercent !== undefined) {
    const n = Number(body.depositPercent)
    if (!Number.isInteger(n) || n < 1 || n > 100) {
      return { error: 'depositPercent must be an integer between 1 and 100' }
    }
    out.depositPercent = n
  }

  if (body.currency !== undefined) {
    const c = String(body.currency).toLowerCase()
    if (!(CURRENCIES as readonly string[]).includes(c)) {
      return { error: `currency must be one of ${CURRENCIES.join(', ')}` }
    }
    out.currency = c
  }

  if (body.locale !== undefined) {
    const l = String(body.locale)
    if (!(PROPOSAL_LOCALES as string[]).includes(l)) {
      return { error: `locale must be one of ${PROPOSAL_LOCALES.join(', ')}` }
    }
    out.locale = l
  }

  return out
}
