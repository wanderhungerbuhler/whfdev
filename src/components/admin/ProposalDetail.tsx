'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import { type AttachmentDTO,AttachmentsPanel } from './AttachmentsPanel'
import { RichTextEditor } from './RichTextEditor'

type Send = {
  id: string
  toEmail: string
  subject: string
  status: string
  error: string | null
  resendId: string | null
  sentAt: string
}

type Props = {
  proposalId: string
  clientEmail: string | null
  emailSubject: string | null
  emailBody: string | null
  status: string
  attachments: AttachmentDTO[]
  history: Send[]
}

type PreviewKind = 'email' | 'attachment'

export function ProposalDetail({
  proposalId,
  clientEmail: initialClientEmail,
  emailSubject: initialSubject,
  emailBody: initialBody,
  status,
  attachments: initialAttachments,
  history,
}: Props) {
  const router = useRouter()

  const [attachments, setAttachments] =
    useState<AttachmentDTO[]>(initialAttachments)
  const [previewKind, setPreviewKind] = useState<PreviewKind>('email')
  const [selectedAttId, setSelectedAttId] = useState<string | null>(
    initialAttachments[0]?.id ?? null,
  )

  const [recipient, setRecipient] = useState(initialClientEmail ?? '')
  const [subject, setSubject] = useState(initialSubject ?? '')
  const [body, setBody] = useState(initialBody ?? '')

  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [sendOk, setSendOk] = useState<string | null>(null)
  const [previewBust, setPreviewBust] = useState(0)

  const [emailHtml, setEmailHtml] = useState<string>('')
  const [emailLoading, setEmailLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    const handle = setTimeout(async () => {
      setEmailLoading(true)
      try {
        const res = await fetch(
          `/api/admin/proposals/${proposalId}/email-preview`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              subject: subject || null,
              message: body || null,
            }),
          },
        )
        const html = await res.text()
        if (!cancelled) setEmailHtml(html)
      } finally {
        if (!cancelled) setEmailLoading(false)
      }
    }, 250)
    return () => {
      cancelled = true
      clearTimeout(handle)
    }
  }, [proposalId, subject, body, previewBust])

  const selectedAtt = useMemo(
    () => attachments.find((a) => a.id === selectedAttId) ?? null,
    [attachments, selectedAttId],
  )

  async function saveDraft() {
    await fetch(`/api/admin/proposals/${proposalId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientEmail: recipient || null,
        emailSubject: subject || null,
        emailBody: body || null,
      }),
    })
    setPreviewBust((v) => v + 1)
    router.refresh()
  }

  async function send() {
    setSendError(null)
    setSendOk(null)
    if (!recipient) {
      setSendError('Informa o e-mail do destinatário antes de enviar.')
      return
    }
    if (attachments.length === 0) {
      const ok = confirm(
        'Você não anexou nenhum arquivo. Enviar mesmo assim só com o texto?',
      )
      if (!ok) return
    }
    setSending(true)
    try {
      await saveDraft()
      const res = await fetch(`/api/admin/proposals/${proposalId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: recipient,
          subject: subject || undefined,
          message: body || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSendError(data.error ?? 'falha no envio')
        return
      }
      setSendOk(
        `Enviado · Resend ID ${data.resendId ?? '(n/a)'}. Acompanha o status em resend.com.`,
      )
      router.refresh()
    } finally {
      setSending(false)
    }
  }

  const canSend = !!recipient && status !== 'sending'

  const hasBeenSent = history.some((h) => h.status === 'sent')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    if (!deleteOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !deleting) setDeleteOpen(false)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [deleteOpen, deleting])

  async function confirmDelete() {
    setDeleting(true)
    setDeleteError(null)
    try {
      const res = await fetch(`/api/admin/proposals/${proposalId}`, {
        method: 'DELETE',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setDeleteError(data.error ?? 'Falha ao apagar a proposta.')
        return
      }
      router.push('/admin')
      router.refresh()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.4fr]">
      {/* LEFT */}
      <aside className="flex flex-col gap-5">
        {/* Send controls */}
        <section className="rounded-2xl border border-rule-soft bg-canvas-elev p-5">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-coral">
            Envio
          </p>
          <label className="mb-3 flex flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
              Destinatário
            </span>
            <input
              type="email"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="rita@cliente.com"
              className="rounded-md border border-rule-soft bg-canvas px-3 py-2 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-coral focus:ring-2 focus:ring-coral/30"
            />
          </label>
          <label className="mb-3 flex flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
              Assunto
            </span>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Proposta WHFDEV — …"
              className="rounded-md border border-rule-soft bg-canvas px-3 py-2 text-sm text-ink placeholder:text-ink-dim outline-none focus:border-coral focus:ring-2 focus:ring-coral/30"
            />
          </label>
          <div className="mb-4 flex flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
              Mensagem
            </span>
            <RichTextEditor
              value={body}
              onChange={setBody}
              placeholder="Olá [nome], em anexo segue…"
            />
          </div>

          {sendError && (
            <div className="mb-3 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {sendError}
            </div>
          )}
          {sendOk && (
            <div className="mb-3 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
              {sendOk}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={saveDraft}
              className="rounded-full border border-rule-soft px-4 py-2 text-sm text-ink-soft transition hover:border-rule hover:text-ink"
            >
              Salvar rascunho
            </button>
            <button
              type="button"
              onClick={send}
              disabled={!canSend || sending}
              className="rounded-full bg-coral px-5 py-2.5 text-sm font-medium text-white transition hover:bg-coral-soft disabled:opacity-50"
            >
              {sending
                ? 'Enviando…'
                : `Enviar para ${recipient || 'destinatário'}`}
            </button>
            <p className="text-[11px] text-ink-muted">
              Todos os anexos abaixo vão junto. Tracking de open/click no
              painel do Resend.
            </p>

            <div className="mt-4 border-t border-rule-soft pt-4">
              <button
                type="button"
                onClick={() => {
                  setDeleteError(null)
                  setDeleteOpen(true)
                }}
                disabled={deleting}
                title="Apagar proposta e todos os anexos"
                className="w-full rounded-full border border-red-500/40 px-4 py-2 text-xs font-medium text-red-300 transition hover:border-red-500 hover:bg-red-500/10 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {deleting ? 'Apagando…' : 'Apagar proposta'}
              </button>
            </div>
          </div>
        </section>

        <AttachmentsPanel
          proposalId={proposalId}
          initial={attachments}
          selectedId={selectedAttId}
          onChange={(next) => {
            setAttachments(next)
            // se o selecionado foi removido, escolhe outro
            if (selectedAttId && !next.find((a) => a.id === selectedAttId)) {
              setSelectedAttId(next[0]?.id ?? null)
              if (!next[0]) setPreviewKind('email')
            }
            setPreviewBust((v) => v + 1)
          }}
          onSelect={(att) => {
            setSelectedAttId(att.id)
            setPreviewKind('attachment')
          }}
        />

        {/* Histórico */}
        <section className="rounded-2xl border border-rule-soft bg-canvas-elev p-5">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-coral">
            Histórico
          </p>
          {history.length === 0 ? (
            <p className="text-sm text-ink-muted">Nenhum envio ainda.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-rule-soft">
              {history.map((h) => (
                <li key={h.id} className="py-2.5 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-sm text-ink">{h.toEmail}</span>
                    <span
                      className={`rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] ${
                        h.status === 'sent'
                          ? 'border-emerald-500/40 text-emerald-400'
                          : 'border-red-500/40 text-red-300'
                      }`}
                    >
                      {h.status}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-ink-soft">
                    {h.subject}
                  </p>
                  <div className="mt-0.5 flex items-center justify-between gap-2">
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
                      {h.sentAt.slice(0, 16).replace('T', ' ')}
                    </p>
                    {h.resendId && (
                      <a
                        href={`https://resend.com/emails/${h.resendId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[10px] uppercase tracking-[0.12em] text-coral hover:underline"
                      >
                        Resend →
                      </a>
                    )}
                  </div>
                  {h.error && (
                    <p className="mt-1 text-xs text-red-300">{h.error}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </aside>

      {/* RIGHT — preview */}
      <main className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1 rounded-full border border-rule-soft bg-canvas-elev p-1">
            <TabButton
              active={previewKind === 'email'}
              onClick={() => setPreviewKind('email')}
            >
              E-mail
            </TabButton>
            <TabButton
              active={previewKind === 'attachment'}
              onClick={() => {
                if (selectedAttId) setPreviewKind('attachment')
              }}
              disabled={!selectedAttId}
            >
              Anexo
              {selectedAtt && (
                <span className="ml-2 normal-case tracking-normal text-ink-dim">
                  {selectedAtt.filename.length > 22
                    ? `${selectedAtt.filename.slice(0, 20)}…`
                    : selectedAtt.filename}
                </span>
              )}
            </TabButton>
          </div>
          <button
            type="button"
            onClick={() => setPreviewBust((v) => v + 1)}
            className="rounded-full border border-rule-soft px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-soft transition hover:border-rule hover:text-ink"
            title="Atualizar preview"
          >
            ↻ Atualizar
          </button>
          {previewKind === 'attachment' && selectedAtt && (
            <a
              href={`/api/admin/proposals/${proposalId}/attachments/${selectedAtt.id}`}
              download={selectedAtt.filename}
              className="rounded-full border border-rule-soft px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-soft transition hover:border-rule hover:text-ink"
            >
              ↓ Baixar
            </a>
          )}
        </div>

        <div className="aspect-[1/1.35] w-full overflow-hidden rounded-2xl border border-rule-soft bg-canvas-elev">
          {previewKind === 'email' ? (
            emailHtml ? (
              <iframe
                srcDoc={emailHtml}
                title="E-mail preview"
                className="h-full w-full bg-white"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-white text-xs text-ink-muted">
                {emailLoading ? 'Carregando preview…' : 'Sem preview.'}
              </div>
            )
          ) : selectedAtt ? (
            <AttachmentPreview
              proposalId={proposalId}
              attachment={selectedAtt}
              bust={previewBust}
            />
          ) : (
            <EmptyPreview />
          )}
        </div>
      </main>

      {deleteOpen && (
        <DeleteProposalModal
          hasBeenSent={hasBeenSent}
          sendCount={history.length}
          deleting={deleting}
          error={deleteError}
          onCancel={() => {
            if (!deleting) setDeleteOpen(false)
          }}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  )
}

function DeleteProposalModal({
  hasBeenSent,
  sendCount,
  deleting,
  error,
  onCancel,
  onConfirm,
}: {
  hasBeenSent: boolean
  sendCount: number
  deleting: boolean
  error: string | null
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-proposal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Fechar"
        onClick={onCancel}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition"
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-rule-soft bg-canvas-elev shadow-2xl">
        <div className="border-b border-rule-soft px-6 py-5">
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                hasBeenSent ? 'bg-red-500/15 text-red-300' : 'bg-coral/15 text-coral'
              }`}
            >
              !
            </span>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
              {hasBeenSent ? 'Ação destrutiva' : 'Confirmação'}
            </p>
          </div>
          <h2
            id="delete-proposal-title"
            className="text-lg font-semibold text-ink"
          >
            Apagar esta proposta?
          </h2>
        </div>

        <div className="px-6 py-5 text-sm text-ink-soft">
          {hasBeenSent ? (
            <>
              <p className="mb-3 text-ink">
                Esta proposta já foi enviada ao cliente{' '}
                <span className="text-ink-muted">
                  ({sendCount} {sendCount === 1 ? 'envio' : 'envios'} no
                  histórico)
                </span>
                .
              </p>
              <p>
                Apagar vai remover o registro de envio, todos os anexos no
                Storage e a proposta. O e-mail já entregue ao cliente não é
                afetado, mas o tracking do Resend deixa de aparecer aqui.
              </p>
            </>
          ) : (
            <p>
              Todos os anexos serão removidos do Storage. Esta ação não pode ser
              desfeita.
            </p>
          )}

          {error && (
            <div className="mt-4 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {error}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-rule-soft bg-canvas/40 px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-full border border-rule-soft px-4 py-2 text-sm text-ink-soft transition hover:border-rule hover:text-ink disabled:opacity-40"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="rounded-full bg-red-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? 'Apagando…' : 'Apagar definitivamente'}
          </button>
        </div>
      </div>
    </div>
  )
}

function AttachmentPreview({
  proposalId,
  attachment,
  bust,
}: {
  proposalId: string
  attachment: AttachmentDTO
  bust: number
}) {
  const src = `/api/admin/proposals/${proposalId}/attachments/${attachment.id}?v=${bust}`
  const isImage = /^image\//.test(attachment.mimeType)
  const isPdf =
    attachment.mimeType === 'application/pdf' ||
    /\.pdf$/i.test(attachment.filename)

  if (isPdf) {
    return (
      <iframe
        key={src}
        src={src}
        title={attachment.filename}
        className="h-full w-full bg-white"
      />
    )
  }
  if (isImage) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-canvas p-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={src}
          src={src}
          alt={attachment.filename}
          className="max-h-full max-w-full object-contain"
        />
      </div>
    )
  }
  // Generic — show metadata + download
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-canvas p-6 text-center">
      <span className="text-4xl">📎</span>
      <p className="text-sm text-ink">{attachment.filename}</p>
      <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted">
        {attachment.mimeType}
      </p>
      <a
        href={src}
        download={attachment.filename}
        className="mt-3 inline-flex items-center gap-2 rounded-full bg-coral px-4 py-2 text-sm text-white"
      >
        ↓ Baixar
      </a>
    </div>
  )
}

function EmptyPreview() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-canvas text-center text-sm text-ink-muted">
      <p>Nenhum anexo selecionado.</p>
      <p className="text-xs">Suba arquivos no painel à esquerda.</p>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  disabled,
  children,
}: {
  active: boolean
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] transition disabled:cursor-not-allowed disabled:opacity-40 ${
        active ? 'bg-coral text-white' : 'text-ink-soft hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}
