import { asc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

import { requireAdmin } from '@/lib/admin-guard'
import { db } from '@/lib/db/client'
import { attachments, proposals } from '@/lib/db/schema'
import { defaultMessageFor, renderEmail } from '@/lib/email/proposal-email'

export const runtime = 'nodejs'

type Ctx = { params: { id: string } }

export async function GET(req: Request, { params }: Ctx) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  const url = new URL(req.url)
  const subjectQ = url.searchParams.get('subject')
  const messageQ = url.searchParams.get('message')

  const [row] = await db
    .select()
    .from(proposals)
    .where(eq(proposals.id, params.id))
    .limit(1)
  if (!row) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const atts = await db
    .select({ filename: attachments.filename })
    .from(attachments)
    .where(eq(attachments.proposalId, params.id))
    .orderBy(asc(attachments.position), asc(attachments.createdAt))

  const subject =
    subjectQ ?? row.emailSubject ?? `Proposta WHFDEV — ${row.clientName}`
  const message =
    messageQ ?? row.emailBody ?? defaultMessageFor(row.clientName, 'pt-PT')

  const { html } = renderEmail({
    clientName: row.clientName,
    subject,
    message,
    attachmentFilenames: atts.map((a) => a.filename),
  })

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}
