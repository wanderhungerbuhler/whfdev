import { asc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

import { requireAdmin } from '@/lib/admin-guard'
import { db } from '@/lib/db/client'
import { attachments } from '@/lib/db/schema'

export const runtime = 'nodejs'

type Ctx = { params: { id: string } }

/** List all attachments for a proposal. */
export async function GET(_req: Request, { params }: Ctx) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  const rows = await db
    .select({
      id: attachments.id,
      filename: attachments.filename,
      mimeType: attachments.mimeType,
      sizeBytes: attachments.sizeBytes,
      position: attachments.position,
      createdAt: attachments.createdAt,
    })
    .from(attachments)
    .where(eq(attachments.proposalId, params.id))
    .orderBy(asc(attachments.position), asc(attachments.createdAt))

  return NextResponse.json({ attachments: rows })
}

/**
 * Register an attachment after the browser has uploaded the file to
 * Supabase Storage using a signed upload URL.
 */
export async function POST(req: Request, { params }: Ctx) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  const body = await req.json().catch(() => ({}) as Record<string, unknown>)
  const filename = String(body.filename ?? '').trim()
  const mimeType = String(body.mimeType ?? '').trim() || 'application/octet-stream'
  const sizeBytes = Math.max(0, Number(body.sizeBytes ?? 0))
  const storagePath = String(body.storagePath ?? '').trim()

  if (!filename || !storagePath) {
    return NextResponse.json(
      { error: 'filename and storagePath are required' },
      { status: 400 },
    )
  }
  if (!storagePath.startsWith(`${params.id}/`)) {
    return NextResponse.json(
      { error: 'storagePath must be scoped to this proposal id' },
      { status: 400 },
    )
  }

  // Position = current count (append to end).
  const existing = await db
    .select({ id: attachments.id })
    .from(attachments)
    .where(eq(attachments.proposalId, params.id))

  const [inserted] = await db
    .insert(attachments)
    .values({
      proposalId: params.id,
      filename,
      mimeType,
      sizeBytes,
      storagePath,
      position: existing.length,
    })
    .returning({ id: attachments.id })

  return NextResponse.json({ id: inserted.id }, { status: 201 })
}
