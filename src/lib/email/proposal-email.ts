import 'server-only'

type RenderArgs = {
  clientName: string
  subject: string
  message: string
  /** Filenames to show as chips in the email body. */
  attachmentFilenames: string[]
}

const SIGNATURE_LINE = 'Wander Hungerbühler · WHFDEV'
const COMPANY_LINE = 'WHFDEV Consultoria em Tecnologia LTDA · CNPJ 46.185.304/0001-71'
const CONTACT_EMAIL = 'talkto@whfdev.com'
const SITE = 'https://whfdev.com'

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Localized starter message used when the user hasn't typed one. */
export function defaultMessageFor(clientName: string, locale = 'pt-PT'): string {
  if (locale.startsWith('pt-PT')) {
    return `Olá ${clientName},

Em anexo segue a nossa proposta. Estamos à disposição para qualquer dúvida em ${CONTACT_EMAIL}.

Abraço,
${SIGNATURE_LINE}`
  }
  if (locale.startsWith('pt')) {
    return `Olá ${clientName},

Em anexo segue a nossa proposta. Qualquer dúvida estamos disponíveis em ${CONTACT_EMAIL}.

Abraço,
${SIGNATURE_LINE}`
  }
  if (locale.startsWith('fr')) {
    return `Bonjour ${clientName},

Veuillez trouver notre proposition en pièce jointe. Nous restons disponibles à ${CONTACT_EMAIL}.

Bien à vous,
${SIGNATURE_LINE}`
  }
  if (locale.startsWith('es')) {
    return `Hola ${clientName},

Adjunto encontrará nuestra propuesta. Quedamos a su disposición en ${CONTACT_EMAIL}.

Saludos,
${SIGNATURE_LINE}`
  }
  return `Hi ${clientName},

Please find our proposal attached. We're available at ${CONTACT_EMAIL} for any questions.

Best,
${SIGNATURE_LINE}`
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

function attachmentChip(filename: string): string {
  const icon = /\.pdf$/i.test(filename)
    ? '📄'
    : /\.(png|jpe?g|gif|webp|svg)$/i.test(filename)
      ? '🖼️'
      : '📎'
  return `<span style="display:inline-block;padding:8px 12px;margin:4px 6px 4px 0;border:1px solid #E5E5E7;border-radius:8px;font-family:'JetBrains Mono',ui-monospace,Menlo,monospace;font-size:11px;color:#0A0A0B;">${icon} ${escapeHtml(filename)}</span>`
}

export function renderEmail({
  clientName,
  subject,
  message,
  attachmentFilenames,
}: RenderArgs): { html: string; text: string } {
  const htmlMessage = escapeHtml(message).replace(/\n/g, '<br/>')

  const chips =
    attachmentFilenames.length > 0
      ? `<div style="padding:4px 32px 16px 32px;">${attachmentFilenames.map(attachmentChip).join('')}</div>`
      : ''

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#F7F7F8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Geist,Inter,Helvetica,Arial,sans-serif;color:#0A0A0B;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#F7F7F8;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="560" style="max-width:560px;background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #EFEFF1;">
          <tr>
            <td style="background:#0A0A0B;padding:22px 28px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="color:#FAFAFA;font-size:14px;font-weight:600;letter-spacing:-0.2px;">
                    <span style="display:inline-block;width:10px;height:10px;background:#FF4D6D;border-radius:50%;vertical-align:middle;margin-right:8px;"></span>
                    WHFDEV
                  </td>
                  <td align="right" style="font-family:'JetBrains Mono',ui-monospace,Menlo,monospace;color:#9A9A9A;font-size:10px;letter-spacing:1.6px;text-transform:uppercase;">
                    Proposta · ${escapeHtml(clientName)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 32px 8px 32px;">
              <p style="margin:0 0 6px 0;font-family:'JetBrains Mono',ui-monospace,Menlo,monospace;font-size:10px;letter-spacing:1.6px;text-transform:uppercase;color:#6E6E73;">
                ${escapeHtml(subject)}
              </p>
              <div style="font-size:14px;line-height:1.65;color:#3B3B3F;margin-top:16px;">
                ${htmlMessage}
              </div>
            </td>
          </tr>

          ${chips}

          <tr>
            <td style="padding:20px 32px 28px 32px;border-top:1px solid #EFEFF1;">
              <p style="margin:0 0 4px 0;font-size:12px;color:#0A0A0B;font-weight:500;">
                ${escapeHtml(SIGNATURE_LINE)}
              </p>
              <p style="margin:0;font-size:11px;color:#6E6E73;line-height:1.5;">
                ${escapeHtml(COMPANY_LINE)}<br/>
                <a href="mailto:${CONTACT_EMAIL}" style="color:#FF4D6D;text-decoration:none;">${CONTACT_EMAIL}</a>
                · <a href="${SITE}" style="color:#FF4D6D;text-decoration:none;">whfdev.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  const text = `${message}

${
  attachmentFilenames.length > 0
    ? `Anexos:\n${attachmentFilenames.map((f) => `  • ${f}`).join('\n')}\n\n`
    : ''
}—
${COMPANY_LINE}
${CONTACT_EMAIL} · ${SITE}`

  return { html, text }
}

export { formatBytes }
