import 'server-only'

/**
 * E-mail ao cliente quando o pagamento em reais foi feito com cartão emitido
 * fora do Brasil (preço BRL só para o Brasil). Tom educado, sem acusar.
 */
export function ebookGeoRefundEmail({ eurUrl }: { eurUrl: string }) {
  const subject = 'Seu pagamento foi devolvido: compre pelo preço em euros'
  const text = [
    'Olá,',
    '',
    'Obrigado pelo interesse no guia "Seus primeiros agentes de IA".',
    '',
    'O preço em reais é exclusivo para compras feitas no Brasil, e o seu cartão foi emitido fora do Brasil. Por isso, devolvemos o valor integral do seu pagamento. O reembolso aparece no seu cartão no prazo normal do banco (em geral, de 5 a 10 dias úteis).',
    '',
    `Você pode comprar o guia pelo preço em euros aqui: ${eurUrl}`,
    '',
    'Se tiver alguma dúvida, é só responder a este e-mail.',
    '',
    'WHFDEV',
  ].join('\n')
  const html = `<!doctype html><html lang="pt-BR"><body style="margin:0;padding:24px;background:#f4f4f6;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1f1f24">
<table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e4e4ea;border-radius:12px"><tr><td style="padding:28px">
<p style="margin:0 0 14px;font-size:15px;line-height:24px">Olá,</p>
<p style="margin:0 0 14px;font-size:15px;line-height:24px">Obrigado pelo interesse no guia <strong>Seus primeiros agentes de IA</strong>.</p>
<p style="margin:0 0 14px;font-size:15px;line-height:24px">O preço em reais é exclusivo para compras feitas no Brasil, e o seu cartão foi emitido fora do Brasil. Por isso, <strong>devolvemos o valor integral</strong> do seu pagamento. O reembolso aparece no seu cartão no prazo normal do banco (em geral, de 5 a 10 dias úteis).</p>
<p style="margin:24px 0;text-align:center"><a href="${eurUrl}" style="display:inline-block;background:#121212;color:#fff;text-decoration:none;font-weight:700;padding:13px 26px;border-radius:999px">Comprar pelo preço em euros</a></p>
<p style="margin:0 0 14px;font-size:15px;line-height:24px">Se tiver alguma dúvida, é só responder a este e-mail.</p>
<p style="margin:0;font-size:15px;line-height:24px">WHFDEV</p>
</td></tr></table></body></html>`
  return { subject, html, text }
}
