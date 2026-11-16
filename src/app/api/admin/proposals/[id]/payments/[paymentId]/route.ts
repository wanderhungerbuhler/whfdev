import { and, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

import { requireAdmin } from '@/lib/admin-guard'
import { db } from '@/lib/db/client'
import { payments } from '@/lib/db/schema'

export const runtime = 'nodejs'

type Ctx = { params: { id: string; paymentId: string } }

/** Remove uma cobrança ainda não paga. Pagamentos pagos ficam no histórico. */
export async function DELETE(_req: Request, { params }: Ctx) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  const [row] = await db
    .select()
    .from(payments)
    .where(
      and(eq(payments.id, params.paymentId), eq(payments.proposalId, params.id)),
    )
    .limit(1)
  if (!row) return NextResponse.json({ error: 'not found' }, { status: 404 })
  if (row.status === 'paid') {
    return NextResponse.json(
      { error: 'pagamentos concluídos não podem ser apagados' },
      { status: 409 },
    )
  }

  await db.delete(payments).where(eq(payments.id, row.id))
  return NextResponse.json({ ok: true })
}
