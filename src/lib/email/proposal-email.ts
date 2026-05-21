import 'server-only'

import sanitizeHtmlLib from 'sanitize-html'

type RenderArgs = {
  clientName: string
  subject: string
  message: string
  /**
   * Filenames of attachments — used only in the plain-text fallback so
   * users on plain-text clients know what was sent. NOT rendered as
   * visible chips in the HTML (the email client shows attachments natively).
   */
  attachmentFilenames: string[]
}

const SIGNATURE_LINE = 'WHFDEV'
const CONTACT_EMAIL = 'talkto@whfdev.com'
const SITE = 'https://whfdev.com'
const LOGO_URL = 'https://whfdev.com/whfdev.png'

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

function isHtml(s: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(s)
}

function sanitizeHtml(html: string): string {
  return sanitizeHtmlLib(html, {
    allowedTags: [
      'p',
      'br',
      'strong',
      'b',
      'em',
      'i',
      'u',
      's',
      'ul',
      'ol',
      'li',
      'a',
      'span',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    transformTags: {
      a: sanitizeHtmlLib.simpleTransform('a', {
        rel: 'noopener noreferrer',
        target: '_blank',
      }),
    },
  })
}

/**
 * Inline a minimal style budget onto the sanitized HTML so the message looks
 * consistent in Gmail/Apple Mail/Outlook (which strip <style> tags).
 */
function inlineStyles(html: string): string {
  return html
    .replace(/<p(\s|>)/g, '<p style="margin:0 0 12px 0;"$1')
    .replace(/<ul(\s|>)/g, '<ul style="margin:0 0 12px 0;padding-left:20px;"$1')
    .replace(/<ol(\s|>)/g, '<ol style="margin:0 0 12px 0;padding-left:20px;"$1')
    .replace(/<li(\s|>)/g, '<li style="margin:0 0 4px 0;"$1')
    .replace(/<a(\s)/g, '<a style="color:#FF4D6D;text-decoration:underline;"$1')
}

function htmlToPlainText(html: string): string {
  return html
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\/(p|li|ul|ol|div)>/gi, '\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

export function renderEmail({
  clientName,
  subject,
  message,
  attachmentFilenames,
}: RenderArgs): { html: string; text: string } {
  const htmlMessage = isHtml(message)
    ? inlineStyles(sanitizeHtml(message))
    : escapeHtml(message).replace(/\n/g, '<br/>')

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

          <!-- Brand header: logo + WHFDEV + TECH CONSULTING / Proposta · Cliente -->
          <tr>
            <td style="background:#0A0A0B;padding:20px 28px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="vertical-align:middle;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="vertical-align:middle;padding-right:12px;">
                          <img src="${LOGO_URL}" width="36" height="36" alt="WHFDEV" style="display:block;border-radius:8px;border:0;outline:none;text-decoration:none;" />
                        </td>
                        <td style="vertical-align:middle;border-left:1px solid #2F2F33;padding-left:12px;">
                          <div style="color:#FAFAFA;font-size:14px;font-weight:600;letter-spacing:-0.2px;line-height:1.1;">WHFDEV</div>
                          <div style="color:#9A9A9A;font-family:'JetBrains Mono',ui-monospace,Menlo,monospace;font-size:9px;letter-spacing:1.6px;text-transform:uppercase;margin-top:3px;">TECH CONSULTING</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" style="vertical-align:middle;font-family:'JetBrains Mono',ui-monospace,Menlo,monospace;color:#9A9A9A;font-size:10px;letter-spacing:1.6px;text-transform:uppercase;">
                    Proposta · ${escapeHtml(clientName)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 32px 24px 32px;">
              <div style="font-size:14px;line-height:1.65;color:#3B3B3F;">
                ${htmlMessage}
              </div>
            </td>
          </tr>

          <!-- Footer: só contato, sem nome pessoal/CNPJ -->
          <tr>
            <td style="padding:18px 32px 24px 32px;border-top:1px solid #EFEFF1;">
              <p style="margin:0;font-size:11px;color:#6E6E73;line-height:1.5;">
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

  // Plain-text fallback (some clients render this instead of HTML).
  // Mantemos a lista de anexos aqui pra que o cliente sem suporte a HTML
  // ainda saiba o que veio anexado. Em HTML não aparece (o email client mostra nativamente).
  const plainMessage = isHtml(message) ? htmlToPlainText(message) : message
  const text = `${plainMessage}
${
  attachmentFilenames.length > 0
    ? `\nAnexos:\n${attachmentFilenames.map((f) => `  • ${f}`).join('\n')}\n`
    : ''
}
—
${CONTACT_EMAIL} · ${SITE}`

  return { html, text }
}

export { formatBytes }
