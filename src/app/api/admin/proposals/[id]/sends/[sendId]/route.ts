import { and, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

import { requireAdmin } from '@/lib/admin-guard'
import { db } from '@/lib/db/client'
import { sends } from '@/lib/db/schema'

export const runtime = 'nodejs'

type Ctx = { params: { id: string; sendId: string } }

export async function DELETE(_req: Request, { params }: Ctx) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  // Scope the delete by proposalId too — defensive against ID guessing
  // across proposals.
  const result = await db
    .delete(sends)
    .where(and(eq(sends.id, params.sendId), eq(sends.proposalId, params.id)))
    .returning({ id: sends.id })

  if (result.length === 0) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}
