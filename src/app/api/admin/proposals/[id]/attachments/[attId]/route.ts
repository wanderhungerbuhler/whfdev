import { and, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

import { requireAdmin } from '@/lib/admin-guard'
import { db } from '@/lib/db/client'
import { attachments } from '@/lib/db/schema'
import {
  createSignedDownloadUrl,
  downloadAsBuffer,
  removeObject,
} from '@/lib/supabase/storage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Ctx = { params: { id: string; attId: string } }

/**
 * Streams the file inline (for browser PDF/image preview in <iframe>/<img>).
 * Query ?signed=1 returns a signed URL JSON instead of streaming.
 */
export async function GET(req: Request, { params }: Ctx) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  const [row] = await db
    .select()
    .from(attachments)
    .where(
      and(
        eq(attachments.id, params.attId),
        eq(attachments.proposalId, params.id),
      ),
    )
    .limit(1)

  if (!row) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const url = new URL(req.url)
  if (url.searchParams.get('signed') === '1') {
    const signedUrl = await createSignedDownloadUrl(row.storagePath, 300)
    return NextResponse.json({ url: signedUrl, filename: row.filename })
  }

  try {
    const buf = await downloadAsBuffer(row.storagePath)
    return new Response(new Uint8Array(buf), {
      headers: {
        'Content-Type': row.mimeType,
        'Content-Disposition': `inline; filename="${row.filename}"`,
        'Cache-Control': 'private, max-age=60',
      },
    })
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    )
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  const [row] = await db
    .select()
    .from(attachments)
    .where(
      and(
        eq(attachments.id, params.attId),
        eq(attachments.proposalId, params.id),
      ),
    )
    .limit(1)
  if (!row) return NextResponse.json({ error: 'not found' }, { status: 404 })

  try {
    await removeObject(row.storagePath)
  } catch {
    // ignore — DB delete still proceeds
  }
  await db.delete(attachments).where(eq(attachments.id, params.attId))

  return NextResponse.json({ ok: true })
}
