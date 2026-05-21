import { asc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

import { requireAdmin } from '@/lib/admin-guard'
import { db } from '@/lib/db/client'
import { attachments, proposals, sends } from '@/lib/db/schema'
import { defaultMessageFor, renderEmail } from '@/lib/email/proposal-email'
import { FROM_EMAIL, REPLY_TO, resend } from '@/lib/email/resend'
import { downloadAsBuffer } from '@/lib/supabase/storage'

export const runtime = 'nodejs'
export const maxDuration = 60

type Ctx = { params: { id: string } }

export async function POST(req: Request, { params }: Ctx) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  if (!resend) {
    return NextResponse.json(
      { error: 'RESEND_API_KEY is not configured' },
      { status: 500 },
    )
  }

  const body = await req.json().catch(() => ({}) as Record<string, unknown>)

  const [row] = await db
    .select()
    .from(proposals)
    .where(eq(proposals.id, params.id))
    .limit(1)
  if (!row) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const toEmail = (body.to as string | undefined) ?? row.clientEmail
  if (!toEmail) {
    return NextResponse.json(
      { error: 'recipient email is required (set clientEmail or pass "to")' },
      { status: 400 },
    )
  }

  const subject =
    (body.subject as string | undefined) ??
    row.emailSubject ??
    `Proposta WHFDEV — ${row.clientName}`
  const message =
    (body.message as string | undefined) ??
    row.emailBody ??
    defaultMessageFor(row.clientName, 'pt-PT')

  // Load attachments and pull each file from Supabase Storage.
  const atts = await db
    .select()
    .from(attachments)
    .where(eq(attachments.proposalId, params.id))
    .orderBy(asc(attachments.position), asc(attachments.createdAt))

  let attachmentPayload: { filename: string; content: Buffer }[] = []
  try {
    attachmentPayload = await Promise.all(
      atts.map(async (a) => ({
        filename: a.filename,
        content: await downloadAsBuffer(a.storagePath),
      })),
    )
  } catch (err) {
    return NextResponse.json(
      { error: `failed to load attachments: ${(err as Error).message}` },
      { status: 500 },
    )
  }

  const { html, text } = renderEmail({
    clientName: row.clientName,
    subject,
    message,
    attachmentFilenames: atts.map((a) => a.filename),
  })

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      replyTo: REPLY_TO,
      subject,
      html,
      text,
      attachments: attachmentPayload,
    })

    if (result.error) {
      await db.insert(sends).values({
        proposalId: params.id,
        toEmail,
        subject,
        bodyHtml: html,
        bodyText: text,
        status: 'failed',
        error: result.error.message,
      })
      return NextResponse.json(
        { error: result.error.message },
        { status: 502 },
      )
    }

    const resendId = result.data?.id ?? null

    await db.insert(sends).values({
      proposalId: params.id,
      toEmail,
      subject,
      bodyHtml: html,
      bodyText: text,
      resendId,
      status: 'sent',
    })

    await db
      .update(proposals)
      .set({
        status: 'sent',
        clientEmail: toEmail,
        emailSubject: subject,
        emailBody: message,
        updatedAt: new Date(),
      })
      .where(eq(proposals.id, params.id))

    return NextResponse.json({ ok: true, resendId })
  } catch (err) {
    const message2 = (err as Error).message
    await db.insert(sends).values({
      proposalId: params.id,
      toEmail,
      subject,
      bodyHtml: html,
      bodyText: text,
      status: 'failed',
      error: message2,
    })
    return NextResponse.json({ error: message2 }, { status: 500 })
  }
}
