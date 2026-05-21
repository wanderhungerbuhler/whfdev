import { desc,eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

import { requireAdmin } from '@/lib/admin-guard'
import { db } from '@/lib/db/client'
import { sends } from '@/lib/db/schema'

export const runtime = 'nodejs'

type Ctx = { params: { id: string } }

export async function GET(_req: Request, { params }: Ctx) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  const rows = await db
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

  return NextResponse.json({ sends: rows })
}
