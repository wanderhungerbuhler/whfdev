import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

import { requireAdmin } from '@/lib/admin-guard'
import { db } from '@/lib/db/client'
import { payments, proposals } from '@/lib/db/schema'
import { ensureDepositPayment, listPayments } from '@/lib/payments'

export const runtime = 'nodejs'

type Ctx = { params: { id: string } }

export async function GET(_req: Request, { params }: Ctx) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response
  return NextResponse.json({ payments: await listPayments(params.id) })
}

/**
 * Cria uma cobrança adicional (marco) ou garante a linha do sinal.
 * body: { kind: 'deposit' } | { kind: 'milestone', amountCents, description }
 */
export async function POST(req: Request, { params }: Ctx) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  const [proposal] = await db
    .select()
    .from(proposals)
    .where(eq(proposals.id, params.id))
    .limit(1)
  if (!proposal) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const body = (await req.json().catch(() => ({}))) as {
    kind?: string
    amountCents?: number
    description?: string
  }

  if (body.kind === 'deposit') {
    const p = await ensureDepositPayment(proposal)
    if (!p) {
      return NextResponse.json(
        { error: 'define o valor total da proposta primeiro' },
        { status: 400 },
      )
    }
    return NextResponse.json({ payment: p }, { status: 201 })
  }

  const amount = Number(body.amountCents)
  if (!Number.isInteger(amount) || amount < 50) {
    return NextResponse.json(
      { error: 'amountCents must be an integer ≥ 50' },
      { status: 400 },
    )
  }
  const description = String(body.description ?? '').trim().slice(0, 140)
  if (!description) {
    return NextResponse.json({ error: 'description is required' }, { status: 400 })
  }

  const [created] = await db
    .insert(payments)
    .values({
      proposalId: proposal.id,
      kind: 'milestone',
      description,
      amountCents: amount,
      currency: proposal.currency,
      status: 'pending',
    })
    .returning()

  return NextResponse.json({ payment: created }, { status: 201 })
}
