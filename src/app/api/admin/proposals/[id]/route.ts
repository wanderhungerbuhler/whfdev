import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

import { requireAdmin } from '@/lib/admin-guard'
import { db } from '@/lib/db/client'
import { attachments, proposals } from '@/lib/db/schema'
import { removeObject } from '@/lib/supabase/storage'

export const runtime = 'nodejs'

type Ctx = { params: { id: string } }

export async function GET(_req: Request, { params }: Ctx) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  const [row] = await db
    .select()
    .from(proposals)
    .where(eq(proposals.id, params.id))
    .limit(1)

  if (!row) return NextResponse.json({ error: 'not found' }, { status: 404 })
  return NextResponse.json({ proposal: row })
}

export async function PATCH(req: Request, { params }: Ctx) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  const body = await req.json()

  const patch: Record<string, unknown> = { updatedAt: new Date() }

  if (body.clientName !== undefined) patch.clientName = body.clientName
  if (body.clientEmail !== undefined) patch.clientEmail = body.clientEmail
  if (body.emailSubject !== undefined) patch.emailSubject = body.emailSubject
  if (body.emailBody !== undefined) patch.emailBody = body.emailBody
  if (body.status !== undefined) patch.status = body.status

  await db.update(proposals).set(patch).where(eq(proposals.id, params.id))
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  // Best-effort cleanup of Storage objects before removing the proposal row.
  const files = await db
    .select({ storagePath: attachments.storagePath })
    .from(attachments)
    .where(eq(attachments.proposalId, params.id))
  for (const f of files) {
    try {
      await removeObject(f.storagePath)
    } catch {
      // ignore — DB row cascade-deletes anyway
    }
  }

  await db.delete(proposals).where(eq(proposals.id, params.id))
  return NextResponse.json({ ok: true })
}
