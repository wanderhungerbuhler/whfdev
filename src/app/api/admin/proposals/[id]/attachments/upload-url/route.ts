import { NextResponse } from 'next/server'

import { requireAdmin } from '@/lib/admin-guard'
import { createSignedUploadUrl, objectKey } from '@/lib/supabase/storage'

export const runtime = 'nodejs'

type Ctx = { params: { id: string } }

/**
 * Returns a Supabase Storage signed URL the browser can PUT the file to
 * directly. The follow-up POST /attachments registers the upload.
 *
 * Body: { filename: string, contentType?: string }
 */
export async function POST(req: Request, { params }: Ctx) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  const body = await req.json().catch(() => ({}) as Record<string, unknown>)
  const filename = String(body.filename ?? '').trim()
  if (!filename) {
    return NextResponse.json({ error: 'filename is required' }, { status: 400 })
  }

  const path = objectKey(params.id, filename)
  try {
    const { signedUrl, token } = await createSignedUploadUrl(path)
    return NextResponse.json({ path, signedUrl, token })
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    )
  }
}
