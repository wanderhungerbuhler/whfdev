import { eq } from 'drizzle-orm'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ProposalForm } from '@/components/admin/ProposalForm'
import { requireAdminPage } from '@/lib/admin-guard'
import { db } from '@/lib/db/client'
import { proposals } from '@/lib/db/schema'

export const dynamic = 'force-dynamic'

export default async function EditProposalPage({
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

  return (
    <div>
      <div className="mb-8">
        <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          <Link href={`/admin/proposals/${row.id}`} className="hover:text-ink">
            ← {row.clientName}
          </Link>{' '}
          · Editar
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Editar proposta
        </h1>
      </div>
      <ProposalForm
        mode="edit"
        proposalId={row.id}
        initial={{
          clientName: row.clientName,
          clientEmail: row.clientEmail,
          emailSubject: row.emailSubject,
          emailBody: row.emailBody,
        }}
      />
    </div>
  )
}
