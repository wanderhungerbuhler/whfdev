import { desc } from 'drizzle-orm'
import { NextResponse } from 'next/server'

import { requireAdmin } from '@/lib/admin-guard'
import { db } from '@/lib/db/client'
import { proposals } from '@/lib/db/schema'

export const runtime = 'nodejs'

export async function GET() {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  const rows = await db
    .select({
      id: proposals.id,
      clientName: proposals.clientName,
      clientEmail: proposals.clientEmail,
      status: proposals.status,
      createdAt: proposals.createdAt,
      updatedAt: proposals.updatedAt,
    })
    .from(proposals)
    .orderBy(desc(proposals.createdAt))
    .limit(200)

  return NextResponse.json({ proposals: rows })
}

export async function POST(req: Request) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  const body = await req.json().catch(() => ({}) as Record<string, unknown>)
  const clientName = String(body.clientName ?? '').trim()
  if (!clientName) {
    return NextResponse.json(
      { error: 'clientName is required' },
      { status: 400 },
    )
  }

  const [inserted] = await db
    .insert(proposals)
    .values({
      clientName,
      clientEmail: (body.clientEmail as string | null) ?? null,
      emailSubject: (body.emailSubject as string | null) ?? null,
      emailBody: (body.emailBody as string | null) ?? null,
      status: 'draft',
      createdBy: guard.session.user.id,
    })
    .returning({ id: proposals.id })

  return NextResponse.json({ id: inserted.id }, { status: 201 })
}
