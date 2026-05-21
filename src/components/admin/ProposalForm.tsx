'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Mode = 'create' | 'edit'

type Props = {
  mode: Mode
  proposalId?: string
  initial?: {
    clientName?: string
    clientEmail?: string | null
    emailSubject?: string | null
    emailBody?: string | null
  }
}

export function ProposalForm({ mode, proposalId, initial }: Props) {
  const router = useRouter()
  const [clientName, setClientName] = useState(initial?.clientName ?? '')
  const [clientEmail, setClientEmail] = useState(initial?.clientEmail ?? '')
  const [subject, setSubject] = useState(initial?.emailSubject ?? '')
  const [body, setBody] = useState(initial?.emailBody ?? '')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

      <Section eyebrow="02 · E-mail de envio">
        <p className="mb-4 text-xs text-ink-dim">
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
          <Textarea
            value={body}
            onChange={setBody}
            placeholder="Olá [nome], em anexo segue a nossa proposta…"
            rows={10}
          />
        </Field>
      </Section>

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-full border border-rule-soft bg-canvas-elev/90 px-5 py-3 backdrop-blur">
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-dim">
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
      <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-muted">
        {label}
        {required && <span className="text-coral">*</span>}
      </span>
      {children}
    </label>
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

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full resize-y rounded-md border border-rule-soft bg-canvas px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-dim outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/30"
    />
  )
}
