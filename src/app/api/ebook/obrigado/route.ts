import { NextResponse } from 'next/server'

import { canDownload } from '@/lib/ebook'
import { createDownloadToken, downloadUrl } from '@/lib/ebook-download'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const page = (body: string) =>
  `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Obrigado</title></head><body style="margin:0;padding:32px 16px;background:#f4f4f6;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1f1f24"><main style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e4e4ea;border-radius:12px;padding:28px">${body}</main></body></html>`

/**
 * GET /api/ebook/obrigado?session_id=…: página de obrigado do Payment Link e
 * "gerar novo link". Só mostra o download se a compra estiver paga e válida.
 */
export async function GET(req: Request) {
  const sessionId = new URL(req.url).searchParams.get('session_id') ?? ''
  const headers = { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }
  if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) {
    return new NextResponse(page('<p>Link inválido.</p>'), { status: 400, headers })
  }
  const ok = await canDownload(sessionId).catch(() => false)
  if (!ok) {
    return new NextResponse(
      page('<h1 style="font-size:20px">Obrigado!</h1><p>Ainda não conseguimos confirmar o seu pagamento (no Multibanco pode levar algumas horas). Assim que for confirmado, você recebe o link por e-mail.</p>'),
      { status: 200, headers },
    )
  }
  const url = downloadUrl(createDownloadToken(sessionId))
  return new NextResponse(
    page(`<h1 style="font-size:20px;margin:0 0 12px">Obrigado pela compra!</h1><p style="line-height:24px">Seu guia <strong>Seus primeiros agentes de IA</strong> está pronto. Também enviamos o link para o seu e-mail.</p><p style="margin:24px 0;text-align:center"><a href="${url}" style="display:inline-block;background:#121212;color:#fff;text-decoration:none;font-weight:700;padding:13px 26px;border-radius:999px">Baixar o guia (PDF)</a></p><p style="font-size:13px;color:#5f5f6b">O link vale por 72 horas. Se expirar, volte a esta página.</p>`),
    { status: 200, headers },
  )
}
