'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export type PaymentDTO = {
  id: string
  kind: string
  description: string | null
  amountCents: number
  currency: string
  status: string
  stripePaymentIntentId: string | null
  stripePaymentMethod: string | null
  paidAt: string | null
  createdAt: string
}

type Props = {
  proposalId: string
  publicUrl: string
  currency: string
  totalAmountCents: number | null
  depositPercent: number
  stripeConfigured: boolean
  initial: PaymentDTO[]
}

const STATUS: Record<string, { label: string; cls: string }> = {
  paid: { label: 'pago', cls: 'border-emerald-500/40 text-emerald-400' },
  processing: { label: 'a processar', cls: 'border-amber-500/40 text-amber-300' },
  failed: { label: 'falhou', cls: 'border-red-500/40 text-red-300' },
  pending: { label: 'por pagar', cls: 'border-rule text-ink-muted' },
}

function money(cents: number, currency: string) {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(cents / 100)
}

export function PaymentsPanel({
  proposalId,
  publicUrl,
  currency,
  totalAmountCents,
  depositPercent,
  stripeConfigured,
  initial,
}: Props) {
  const router = useRouter()
  const [items, setItems] = useState<PaymentDTO[]>(initial)
  const [copied, setCopied] = useState(false)
  const [desc, setDesc] = useState('')
  const [amount, setAmount] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deposit = items.find((p) => p.kind === 'deposit') ?? null
  const extras = items.filter((p) => p.kind !== 'deposit')
  const depositCents =
    totalAmountCents && totalAmountCents > 0
      ? Math.round((totalAmountCents * depositPercent) / 100)
      : null

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(publicUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      prompt('Copia o link:', publicUrl)
    }
  }

  async function refresh() {
    const res = await fetch(`/api/admin/proposals/${proposalId}/payments`)
    if (res.ok) {
      const data = await res.json()
      setItems(data.payments)
    }
    router.refresh()
  }

  async function addMilestone() {
    setError(null)
    const cents = Math.round(Number(amount.replace(',', '.')) * 100)
    if (!desc.trim() || !Number.isFinite(cents) || cents < 50) {
      setError('Descrição e valor (mínimo 0,50) são obrigatórios.')
      return
    }
    setBusy(true)
    try {
      const res = await fetch(`/api/admin/proposals/${proposalId}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'milestone',
          description: desc.trim(),
          amountCents: cents,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error ?? 'Falha ao criar cobrança.')
        return
      }
      setDesc('')
      setAmount('')
      await refresh()
    } finally {
      setBusy(false)
    }
  }

  async function remove(id: string) {
    if (!confirm('Apagar esta cobrança? O cliente deixa de a ver na página.')) return
    const res = await fetch(`/api/admin/proposals/${proposalId}/payments/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      alert(data.error ?? 'Falha ao apagar.')
      return
    }
    await refresh()
  }

  return (
    <section className="rounded-2xl border border-rule-soft bg-canvas-elev p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-coral">
          Pagamentos · Stripe
        </p>
        {!stripeConfigured && (
          <span className="rounded-full border border-amber-500/40 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-amber-300">
            chave em falta
          </span>
        )}
      </div>

      {/* Link público */}
      <div className="mb-4 flex flex-col gap-1.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
          Página do cliente
        </span>
        <div className="flex items-center gap-2">
          <input
            readOnly
            value={publicUrl}
            onFocus={(e) => e.currentTarget.select()}
            className="min-w-0 flex-1 truncate rounded-md border border-rule-soft bg-canvas/60 px-3 py-2 font-mono text-[11px] text-ink-soft outline-none"
          />
          <button
            type="button"
            onClick={copyLink}
            className="shrink-0 rounded-full border border-rule-soft px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft transition hover:border-rule hover:text-ink"
          >
            {copied ? 'Copiado ✓' : 'Copiar'}
          </button>
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full border border-rule-soft px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft transition hover:border-rule hover:text-ink"
          >
            Abrir ↗
          </a>
        </div>
        <p className="text-[11px] text-ink-muted">
          Vai no botão do e-mail. Mostra os anexos e o pagamento do sinal.
        </p>
      </div>

      {/* Sinal */}
      <div className="rounded-xl border border-rule-soft bg-canvas/40 p-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
              Sinal ({depositPercent}%)
            </p>
            <p className="mt-0.5 text-lg font-semibold tracking-tight text-ink">
              {depositCents ? money(depositCents, currency) : '—'}
            </p>
            {totalAmountCents ? (
              <p className="text-[11px] text-ink-muted">
                de {money(totalAmountCents, currency)} no total
              </p>
            ) : (
              <p className="text-[11px] text-ink-muted">
                Define o valor total em &quot;Editar&quot; para ativar.
              </p>
            )}
          </div>
          <PaymentStatus p={deposit} />
        </div>
        {deposit?.stripePaymentIntentId && (
          <a
            href={`https://dashboard.stripe.com/payments/${deposit.stripePaymentIntentId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block font-mono text-[10px] uppercase tracking-[0.12em] text-coral hover:underline"
          >
            Ver no Stripe →
          </a>
        )}
      </div>

      {/* Cobranças adicionais */}
      <div className="mt-4 border-t border-rule-soft pt-4">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
          Cobranças adicionais
        </p>
        {extras.length === 0 ? (
          <p className="mb-3 text-xs text-ink-muted">
            Nenhuma. Usa para marcos: &quot;Entrega da fase 2&quot;, &quot;Saldo
            final&quot;…
          </p>
        ) : (
          <ul className="mb-3 flex flex-col divide-y divide-rule-soft">
            {extras.map((p) => (
              <li key={p.id} className="group flex items-center justify-between gap-2 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm text-ink">{p.description}</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
                    {money(p.amountCents, p.currency)}
                    {p.paidAt ? ` · ${p.paidAt.slice(0, 10)}` : ''}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <PaymentStatus p={p} />
                  {p.stripePaymentIntentId && (
                    <a
                      href={`https://dashboard.stripe.com/payments/${p.stripePaymentIntentId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[10px] uppercase tracking-[0.12em] text-coral hover:underline"
                    >
                      Stripe →
                    </a>
                  )}
                  {p.status !== 'paid' && (
                    <button
                      type="button"
                      onClick={() => remove(p.id)}
                      className="rounded p-1 text-ink-dim opacity-0 transition hover:text-red-400 group-hover:opacity-100"
                      title="Apagar cobrança"
                      aria-label="Apagar cobrança"
                    >
                      ×
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Descrição (ex.: Fase 2 — entrega)"
            className="min-w-0 flex-1 rounded-md border border-rule-soft bg-canvas px-3 py-2 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-coral focus:ring-2 focus:ring-coral/30"
          />
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`Valor (${currency.toUpperCase()})`}
            inputMode="decimal"
            className="w-full rounded-md border border-rule-soft bg-canvas px-3 py-2 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-coral focus:ring-2 focus:ring-coral/30 sm:w-36"
          />
          <button
            type="button"
            onClick={addMilestone}
            disabled={busy}
            className="rounded-full border border-rule-soft px-4 py-2 text-sm text-ink-soft transition hover:border-rule hover:text-ink disabled:opacity-50"
          >
            {busy ? 'A criar…' : '+ Cobrança'}
          </button>
        </div>
        {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
      </div>
    </section>
  )
}

function PaymentStatus({ p }: { p: PaymentDTO | null }) {
  const s = STATUS[p?.status ?? 'pending'] ?? STATUS.pending
  return (
    <span
      className={`shrink-0 rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] ${s.cls}`}
      title={p?.stripePaymentMethod ?? undefined}
    >
      {s.label}
      {p?.stripePaymentMethod ? ` · ${p.stripePaymentMethod.replace('_', ' ')}` : ''}
    </span>
  )
}
