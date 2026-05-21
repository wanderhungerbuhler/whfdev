'use client'

import { useCallback, useRef, useState } from 'react'

export type AttachmentDTO = {
  id: string
  filename: string
  mimeType: string
  sizeBytes: number
}

type Props = {
  proposalId: string
  initial: AttachmentDTO[]
  /** Notify parent when the list changes — used to refresh email preview. */
  onChange?: (next: AttachmentDTO[]) => void
  /** Notify parent when an attachment is selected for preview. */
  onSelect?: (att: AttachmentDTO) => void
  selectedId?: string | null
}

const MAX_PER_FILE = 25 * 1024 * 1024 // 25MB

export function AttachmentsPanel({
  proposalId,
  initial,
  onChange,
  onSelect,
  selectedId,
}: Props) {
  const [items, setItems] = useState<AttachmentDTO[]>(initial)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function update(next: AttachmentDTO[]) {
    setItems(next)
    onChange?.(next)
  }

  const uploadOne = useCallback(
    async (file: File): Promise<AttachmentDTO> => {
      if (file.size > MAX_PER_FILE) {
        throw new Error(
          `${file.name} é maior que ${formatBytes(MAX_PER_FILE)} (limite por arquivo)`,
        )
      }

      // 1) Ask our API for a signed upload URL
      const urlRes = await fetch(
        `/api/admin/proposals/${proposalId}/attachments/upload-url`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
          }),
        },
      )
      const urlData = await urlRes.json()
      if (!urlRes.ok) throw new Error(urlData.error ?? 'erro ao gerar URL')

      // 2) PUT the file directly to Supabase Storage
      const putRes = await fetch(urlData.signedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
          'x-upsert': 'false',
        },
      })
      if (!putRes.ok) {
        throw new Error(`upload falhou (HTTP ${putRes.status})`)
      }

      // 3) Register in our DB
      const regRes = await fetch(
        `/api/admin/proposals/${proposalId}/attachments`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            mimeType: file.type || 'application/octet-stream',
            sizeBytes: file.size,
            storagePath: urlData.path,
          }),
        },
      )
      const regData = await regRes.json()
      if (!regRes.ok) throw new Error(regData.error ?? 'erro ao registrar')

      return {
        id: regData.id,
        filename: file.name,
        mimeType: file.type || 'application/octet-stream',
        sizeBytes: file.size,
      }
    },
    [proposalId],
  )

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return
    setBusy(true)
    setError(null)
    try {
      const uploaded: AttachmentDTO[] = []
      for (const file of Array.from(fileList)) {
        try {
          const att = await uploadOne(file)
          uploaded.push(att)
        } catch (err) {
          setError((err as Error).message)
        }
      }
      if (uploaded.length > 0) {
        const next = [...items, ...uploaded]
        update(next)
      }
    } finally {
      setBusy(false)
    }
  }

  async function remove(att: AttachmentDTO) {
    if (!confirm(`Remover ${att.filename}?`)) return
    setBusy(true)
    try {
      const res = await fetch(
        `/api/admin/proposals/${proposalId}/attachments/${att.id}`,
        { method: 'DELETE' },
      )
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'erro ao remover')
        return
      }
      update(items.filter((i) => i.id !== att.id))
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="rounded-2xl border border-rule-soft bg-canvas-elev p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-coral">
          Anexos · {items.length}
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="rounded-full border border-rule-soft px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-soft transition hover:border-rule hover:text-ink disabled:opacity-50"
        >
          + Adicionar
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files)
          e.target.value = ''
        }}
      />

      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          handleFiles(e.dataTransfer.files)
        }}
        onClick={() => inputRef.current?.click()}
        className={`mb-3 cursor-pointer rounded-lg border-2 border-dashed px-4 py-6 text-center text-xs transition ${
          dragOver
            ? 'border-coral bg-coral/5 text-coral'
            : 'border-rule-soft text-ink-muted hover:border-rule hover:text-ink-soft'
        }`}
      >
        {busy
          ? 'Enviando…'
          : 'Arraste arquivos aqui ou clique para selecionar'}
        <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
          PDF · imagens · qualquer arquivo até {formatBytes(MAX_PER_FILE)}
        </div>
      </div>

      {error && (
        <div className="mb-3 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-xs text-ink-muted">Nenhum anexo ainda.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-rule-soft">
          {items.map((att) => {
            const isSelected = selectedId === att.id
            return (
              <li
                key={att.id}
                className={`flex items-center gap-3 py-2 ${
                  isSelected ? 'bg-canvas -mx-2 px-2' : ''
                }`}
              >
                <span className="text-base">
                  {iconFor(att.filename, att.mimeType)}
                </span>
                <button
                  type="button"
                  onClick={() => onSelect?.(att)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="truncate text-sm text-ink">{att.filename}</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
                    {formatBytes(att.sizeBytes)} · {att.mimeType}
                  </p>
                </button>
                <a
                  href={`/api/admin/proposals/${proposalId}/attachments/${att.id}`}
                  download={att.filename}
                  className="rounded p-1.5 text-ink-dim transition hover:text-ink"
                  title="Baixar"
                >
                  ↓
                </a>
                <button
                  type="button"
                  onClick={() => remove(att)}
                  disabled={busy}
                  className="rounded p-1.5 text-ink-dim transition hover:text-red-400 disabled:opacity-30"
                  aria-label="Remover"
                  title="Remover"
                >
                  ×
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

function iconFor(filename: string, mimeType: string): string {
  if (/^image\//.test(mimeType)) return '🖼️'
  if (mimeType === 'application/pdf' || /\.pdf$/i.test(filename)) return '📄'
  if (/\.(docx?|odt)$/i.test(filename)) return '📝'
  if (/\.(xlsx?|csv|ods)$/i.test(filename)) return '📊'
  return '📎'
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}
