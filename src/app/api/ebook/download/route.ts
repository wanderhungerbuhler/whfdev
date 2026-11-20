import { get } from '@vercel/blob'
import { NextResponse } from 'next/server'

import { canDownload } from '@/lib/ebook'
import { verifyDownloadToken } from '@/lib/ebook-download'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const FILENAME = 'Seus-primeiros-agentes-de-IA_guia-pratico.pdf'

/** GET /api/ebook/download?t=<token assinado, 72 h>: entrega o PDF do Blob privado. */
export async function GET(req: Request) {
  const t = new URL(req.url).searchParams.get('t')
  const v = verifyDownloadToken(t)
  if (!v.ok) {
    const msg = v.reason === 'expired'
      ? 'Este link expirou. Use o link "gerar um novo" do e-mail da compra.'
      : 'Link inválido.'
    return new NextResponse(msg, { status: v.reason === 'expired' ? 410 : 403, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } })
  }
  if (!(await canDownload(v.sessionId).catch(() => false))) {
    return new NextResponse('Esta compra não está disponível para download.', { status: 403, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } })
  }
  const path = process.env.EBOOK_BLOB_PATH
  if (!path) return new NextResponse('Indisponível.', { status: 503 })
  const blob = await get(path, { access: 'private' })
  if (!blob) return new NextResponse('Indisponível.', { status: 503 })
  console.log(`[ebook] download session=${v.sessionId}`)
  return new NextResponse(blob.stream as unknown as ReadableStream, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${FILENAME}"`,
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex',
    },
  })
}
