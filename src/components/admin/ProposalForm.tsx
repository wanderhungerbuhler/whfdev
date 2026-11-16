'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { RichTextEditor } from './RichTextEditor'

type Mode = 'create' | 'edit'

type Props = {
  mode: Mode
  proposalId?: string
  initial?: {
    clientName?: string
    clientEmail?: string | null
    emailSubject?: string | null
    emailBody?: string | null
    totalAmountCents?: number | null
    depositPercent?: number
    currency?: string
    locale?: string
  }
}

const CURRENCY_OPTIONS = [
  { value: 'eur', label: 'EUR €' },
  { value: 'usd', label: 'USD $' },
]
const LOCALE_OPTIONS = [
  { value: 'pt-PT', label: 'Português (PT)' },
  { value: 'pt-BR', label: 'Português (BR)' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
]

function centsToInput(cents: number | null | undefined): string {
  if (!cents) return ''
  return (cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)
}

function inputToCents(v: string): number | null {
  const clean = v.replace(/\s/g, '').replace(',', '.')
  if (!clean) return null
  const n = Number(clean)
  if (!Number.isFinite(n) || n < 0) return null
  return Math.round(n * 100)
}

export function ProposalForm({ mode, proposalId, initial }: Props) {
  const router = useRouter()
  const [clientName, setClientName] = useState(initial?.clientName ?? '')
  const [clientEmail, setClientEmail] = useState(initial?.clientEmail ?? '')
  const [subject, setSubject] = useState(initial?.emailSubject ?? '')
  const [body, setBody] = useState(initial?.emailBody ?? '')
  const [total, setTotal] = useState(centsToInput(initial?.totalAmountCents))
  const [depositPercent, setDepositPercent] = useState(
    String(initial?.depositPercent ?? 40),
  )
  const [currency, setCurrency] = useState(initial?.currency ?? 'eur')
  const [locale, setLocale] = useState(initial?.locale ?? 'pt-PT')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalCents = inputToCents(total)
  const pct = Math.min(100, Math.max(1, Number(depositPercent) || 40))
  const depositPreview =
    totalCents && totalCents > 0
      ? new Intl.NumberFormat(locale === 'en' ? 'en-GB' : locale, {
          style: 'currency',
          currency: currency.toUpperCase(),
        }).format(Math.round((totalCents * pct) / 100) / 100)
      : null

  async function submit(thenOpen: boolean) {
    setError(null)
    setSaving(true)
    try {
      const url =
        mode === 'create'
          ? '/api/admin/proposals'
          : `/api/admin/proposals/${proposalId}`
      const method = mode === 'create' ? 'POST' : 'PATCH'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          clientEmail: clientEmail || null,
          emailSubject: subject || null,
          emailBody: body || null,
          totalAmountCents: totalCents,
          depositPercent: pct,
          currency,
          locale,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'erro ao salvar')
        return
      }
      const id = data.id ?? proposalId
      router.refresh()
      if (thenOpen && id) router.push(`/admin/proposals/${id}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <Section eyebrow="01 · Cliente">
        <Grid2>
          <Field label="Nome" required>
            <Input
              value={clientName}
              onChange={setClientName}
              placeholder="Rita, Acme, …"
            />
          </Field>
          <Field label="E-mail">
            <Input
              type="email"
              value={clientEmail}
              onChange={setClientEmail}
              placeholder="contato@cliente.com"
            />
          </Field>
        </Grid2>
      </Section>

      <Section eyebrow="02 · Valor e pagamento (Stripe)">
        <p className="mb-2 text-xs text-ink-muted">
          Com um valor total, o e-mail e a página pública ganham o botão
          &quot;Aceitar e pagar sinal&quot;. O cliente paga por cartão, MB WAY
          ou Multibanco e a proposta passa a <em>accepted</em> sozinha.
          Deixa em branco para enviar sem pagamento.
        </p>
        <Grid2>
          <Field label={`Valor total (${currency.toUpperCase()})`}>
            <Input
              type="text"
              value={total}
              onChange={setTotal}
              placeholder="ex.: 12500"
            />
          </Field>
          <Field label="Sinal (%)">
            <Input
              type="number"
              value={depositPercent}
              onChange={setDepositPercent}
              placeholder="40"
            />
          </Field>
          <Field label="Moeda">
            <Select
              value={currency}
              onChange={setCurrency}
              options={CURRENCY_OPTIONS}
            />
          </Field>
          <Field label="Idioma do cliente">
            <Select
              value={locale}
              onChange={setLocale}
              options={LOCALE_OPTIONS}
            />
          </Field>
        </Grid2>
        {depositPreview && (
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">
            Sinal a cobrar: <span className="text-coral">{depositPreview}</span>
          </p>
        )}
      </Section>

      <Section eyebrow="03 · E-mail de envio">
        <p className="mb-4 text-xs text-ink-muted">
          Texto que o cliente vai ler. Os anexos (PDF da proposta, imagens
          extras) você sobe depois de salvar.
        </p>
        <Field label="Assunto">
          <Input
            value={subject}
            onChange={setSubject}
            placeholder="Proposta WHFDEV — …"
          />
        </Field>
        <Field label="Mensagem">
          <RichTextEditor
            value={body}
            onChange={setBody}
            placeholder="Olá [nome], em anexo segue a nossa proposta…"
          />
        </Field>
      </Section>

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-full border border-rule-soft bg-canvas-elev/90 px-5 py-3 backdrop-blur">
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted">
          {proposalId ? `Editando · ${proposalId.slice(0, 8)}` : 'Rascunho local'}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => submit(false)}
            disabled={saving || !clientName}
            className="rounded-full border border-rule-soft px-4 py-2 text-sm text-ink-soft transition hover:border-rule hover:text-ink disabled:opacity-50"
          >
            {saving ? 'Salvando…' : 'Salvar rascunho'}
          </button>
          <button
            type="button"
            onClick={() => submit(true)}
            disabled={saving || !clientName}
            className="rounded-full bg-coral px-5 py-2 text-sm font-medium text-white transition hover:bg-coral-soft disabled:opacity-50"
          >
            Salvar & abrir anexos →
          </button>
        </div>
      </div>
    </div>
  )
}

/* ---------- helpers ---------- */

function Section({
  eyebrow,
  children,
}: {
  eyebrow: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-rule-soft bg-canvas-elev p-6 sm:p-8">
      <div className="mb-5 border-b border-rule-soft pb-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-coral">
          {eyebrow}
        </p>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  )
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
        {label}
        {required && <span className="text-coral">*</span>}
      </span>
      {children}
    </label>
  )
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-rule-soft bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/30"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

function Input({
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-md border border-rule-soft bg-canvas px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-dim outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/30"
    />
  )
}

