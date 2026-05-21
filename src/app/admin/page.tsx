import { desc } from 'drizzle-orm'
import Link from 'next/link'

import { requireAdminPage } from '@/lib/admin-guard'
import { db } from '@/lib/db/client'
import { proposals } from '@/lib/db/schema'

export const dynamic = 'force-dynamic'

const STATUS_CLASS: Record<string, string> = {
  draft: 'bg-canvas-elev text-ink-soft border-rule-soft',
  sent: 'bg-coral/15 text-coral border-coral/40',
  accepted: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40',
  declined: 'bg-rule text-ink-dim border-rule',
}

export default async function AdminHome() {
  await requireAdminPage()

  const rows = await db
    .select({
      id: proposals.id,
      clientName: proposals.clientName,
      clientEmail: proposals.clientEmail,
      status: proposals.status,
      updatedAt: proposals.updatedAt,
    })
    .from(proposals)
    .orderBy(desc(proposals.createdAt))
    .limit(100)

  return (
    <div>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">
            Painel · Propostas
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-ink">
            {rows.length === 0
              ? 'Nenhuma proposta ainda'
              : `${rows.length} proposta${rows.length === 1 ? '' : 's'}`}
          </h1>
        </div>
        <Link
          href="/admin/proposals/new"
          className="inline-flex items-center gap-2 rounded-full bg-coral px-5 py-2.5 text-sm font-medium text-white transition hover:bg-coral-soft"
        >
          + Nova proposta
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-rule bg-canvas-elev px-8 py-16 text-center">
          <p className="mb-2 text-ink">Bora começar?</p>
          <p className="mb-6 text-sm text-ink-soft">
            Cria a primeira proposta, faz preview do PDF e do e-mail, e envia
            direto daqui.
          </p>
          <Link
            href="/admin/proposals/new"
            className="inline-flex items-center gap-2 rounded-full bg-coral px-5 py-2.5 text-sm font-medium text-white transition hover:bg-coral-soft"
          >
            Criar proposta
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-rule-soft overflow-hidden rounded-2xl border border-rule-soft bg-canvas-elev">
          {rows.map((p) => (
            <li key={p.id}>
              <Link
                href={`/admin/proposals/${p.id}`}
                className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-canvas"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-3">
                    <span className="truncate text-[15px] font-medium text-ink">
                      {p.clientName}
                    </span>
                    <span
                      className={`rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] ${
                        STATUS_CLASS[p.status] ?? STATUS_CLASS.draft
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <p className="truncate font-mono text-[11px] text-ink-dim">
                    {p.clientEmail ?? '—'}
                  </p>
                </div>
                <div className="text-right font-mono text-[11px] uppercase tracking-[0.12em] text-ink-dim">
                  {p.updatedAt.toISOString().slice(0, 10)}
                  <span className="ml-3 text-coral">→</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
