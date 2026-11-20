/**
 * Lotes de preço do ebook (decisão do Wander, 20/11/2026): AUTOMÁTICOS, pela
 * contagem de vendas do próprio Stripe (concluídas, pagas e não reembolsadas,
 * metadata project=ebook-ia). Sem link que trave e sem virada manual.
 *
 *   n < 25        → Lote 1 (€ 12,90 / R$ 47)
 *   25 ≤ n < 75   → Lote 2 (€ 17,90 / R$ 67)
 *   n ≥ 75        → Lote 3 (€ 25,90 / R$ 97)
 *
 * Os limites são contados só no Stripe e podem estourar por 1 ou 2 vendas em
 * compras simultâneas (aceito pelo Wander). Funções puras: testáveis.
 */
export const LOT_THRESHOLDS = [25, 75] as const

/** IDs dos prices (live por padrão; EBOOK_LOT_PRICES="p1,p2,p3" sobrescreve, ex. em teste). */
export function lotPrices(env: Record<string, string | undefined> = process.env): [string, string, string] {
  const fromEnv = (env.EBOOK_LOT_PRICES ?? '').split(',').map((s) => s.trim()).filter(Boolean)
  if (fromEnv.length === 3) return fromEnv as [string, string, string]
  return [
    'price_1UdvDlIaeL9KflSkdXEAaJ9j', // Lote 1
    'price_1UdxA8IaeL9KflSkyXD7iU5i', // Lote 2
    'price_1UdxAAIaeL9KflSkQFMDuAKy', // Lote 3
  ]
}

/** Lote (1, 2 ou 3) para n vendas válidas. */
export function lotForCount(n: number): 1 | 2 | 3 {
  if (!Number.isFinite(n) || n < LOT_THRESHOLDS[0]) return 1
  if (n < LOT_THRESHOLDS[1]) return 2
  return 3
}

/** Uma venda conta se a sessão está concluída e paga, é do ebook e não teve reembolso. */
export function countsAsSale(s: {
  status?: string | null
  payment_status?: string | null
  project?: string | null
  refunded?: boolean
  amountRefunded?: number | null
}): boolean {
  return (
    s.status === 'complete' &&
    s.payment_status === 'paid' &&
    s.project === 'ebook-ia' &&
    !s.refunded &&
    !(s.amountRefunded && s.amountRefunded > 0)
  )
}
