import { asc, desc, eq } from 'drizzle-orm'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ProposalDetail } from '@/components/admin/ProposalDetail'
import { requireAdminPage } from '@/lib/admin-guard'
import { db } from '@/lib/db/client'
import { attachments, proposals, sends } from '@/lib/db/schema'

export const dynamic = 'force-dynamic'

export default async function ProposalPage({
  params,
}: {
  params: { id: string }
}) {
  await requireAdminPage()

  const [row] = await db
    .select()
    .from(proposals)
    .where(eq(proposals.id, params.id))
    .limit(1)
  if (!row) notFound()

  const attRows = await db
    .select({
      id: attachments.id,
      filename: attachments.filename,
      mimeType: attachments.mimeType,
      sizeBytes: attachments.sizeBytes,
    })
    .from(attachments)
    .where(eq(attachments.proposalId, params.id))
    .orderBy(asc(attachments.position), asc(attachments.createdAt))

  const history = await db
    .select({
      id: sends.id,
      toEmail: sends.toEmail,
      subject: sends.subject,
      status: sends.status,
      resendId: sends.resendId,
      error: sends.error,
      sentAt: sends.sentAt,
    })
    .from(sends)
    .where(eq(sends.proposalId, params.id))
    .orderBy(desc(sends.sentAt))
    .limit(50)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">
            <Link href="/admin" className="hover:text-ink">
              ← Propostas
            </Link>{' '}
            · {row.id.slice(0, 8)}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-ink">
            {row.clientName}
          </h1>
          {row.clientEmail && (
            <p className="mt-1 font-mono text-sm text-ink-dim">
              {row.clientEmail}
            </p>
          )}
        </div>
        <Link
          href={`/admin/proposals/${row.id}/edit`}
          className="rounded-full border border-rule-soft px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-soft transition hover:border-rule hover:text-ink"
        >
          Editar
        </Link>
      </div>

      <ProposalDetail
        proposalId={row.id}
        clientEmail={row.clientEmail}
        emailSubject={row.emailSubject}
        emailBody={row.emailBody}
        status={row.status}
        attachments={attRows}
        history={history.map((h) => ({
          id: h.id,
          toEmail: h.toEmail,
          subject: h.subject,
          status: h.status,
          resendId: h.resendId,
          error: h.error,
          sentAt: h.sentAt.toISOString(),
        }))}
      />
    </div>
  )
}
