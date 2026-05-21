import { asc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

import { requireAdmin } from '@/lib/admin-guard'
import { db } from '@/lib/db/client'
import { attachments, proposals } from '@/lib/db/schema'
import { defaultMessageFor, renderEmail } from '@/lib/email/proposal-email'

export const runtime = 'nodejs'

type Ctx = { params: { id: string } }

async function render(
  proposalId: string,
  subjectInput: string | null | undefined,
  messageInput: string | null | undefined,
): Promise<Response> {
  const [row] = await db
    .select()
    .from(proposals)
    .where(eq(proposals.id, proposalId))
    .limit(1)
  if (!row) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const atts = await db
    .select({ filename: attachments.filename })
    .from(attachments)
    .where(eq(attachments.proposalId, proposalId))
    .orderBy(asc(attachments.position), asc(attachments.createdAt))

  const subject =
    subjectInput ?? row.emailSubject ?? `Proposta WHFDEV — ${row.clientName}`
  const message =
    messageInput ?? row.emailBody ?? defaultMessageFor(row.clientName, 'pt-PT')

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

export async function GET(req: Request, { params }: Ctx) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  const url = new URL(req.url)
  return render(
    params.id,
    url.searchParams.get('subject'),
    url.searchParams.get('message'),
  )
}

export async function POST(req: Request, { params }: Ctx) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  const body = (await req.json().catch(() => ({}))) as {
    subject?: string | null
    message?: string | null
  }
  return render(params.id, body.subject, body.message)
}
