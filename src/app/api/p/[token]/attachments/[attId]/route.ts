import { and, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

import { db } from '@/lib/db/client'
import { attachments, proposals } from '@/lib/db/schema'
import { createSignedDownloadUrl } from '@/lib/supabase/storage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Ctx = { params: { token: string; attId: string } }

/** Download de um anexo pelo cliente, autorizado pelo token da proposta. */
export async function GET(_req: Request, { params }: Ctx) {
  const [row] = await db
    .select({ storagePath: attachments.storagePath })
    .from(attachments)
    .innerJoin(proposals, eq(proposals.id, attachments.proposalId))
    .where(
      and(
        eq(attachments.id, params.attId),
        eq(proposals.publicToken, params.token),
      ),
    )
    .limit(1)

  if (!row) return NextResponse.json({ error: 'not found' }, { status: 404 })

  try {
    const url = await createSignedDownloadUrl(row.storagePath, 300)
    return NextResponse.redirect(url, 302)
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    )
  }
}
