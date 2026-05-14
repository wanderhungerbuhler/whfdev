'use server'

import { Resend } from 'resend'

const FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL ?? 'WHFDEV <talkto@whfdev.com>'
const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? 'talkto@whfdev.com'

export type ContactPayload = {
  name: string
  email: string
  company?: string
  projectTypes: string[]
  budget?: string
  deadline?: string
  message: string
  locale?: string
}

export type ContactResult =
  | { ok: true }
  | { ok: false; error: 'config' | 'invalid' | 'send' }

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function sendContactEmail(
  payload: ContactPayload,
): Promise<ContactResult> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('[contact] missing RESEND_API_KEY')
    return { ok: false, error: 'config' }
  }

  const { name, email, company, projectTypes, budget, deadline, message } =
    payload

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return { ok: false, error: 'invalid' }
  }

  const resend = new Resend(apiKey)

  const subject = `Briefing WHFDEV — ${name}`
  const typesLine = projectTypes.length ? projectTypes.join(', ') : '—'

  const text = [
    `Nome: ${name}`,
    `E-mail: ${email}`,
    company && `Empresa: ${company}`,
    '',
    `O que precisa construir: ${typesLine}`,
    `Orçamento: ${budget || '—'}`,
    `Prazo: ${deadline || '—'}`,
    `Idioma: ${payload.locale || '—'}`,
    '',
    'Mensagem:',
    message,
  ]
    .filter(Boolean)
    .join('\n')

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0A0A0B;">
      <h2 style="margin:0 0 16px;font-size:18px;font-weight:600;">Novo briefing WHFDEV</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.5;">
        <tr><td style="padding:6px 0;color:#666;width:120px;">Nome</td><td>${escapeHtml(name)}</td></tr>
        <tr><td style="padding:6px 0;color:#666;">E-mail</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        ${company ? `<tr><td style="padding:6px 0;color:#666;">Empresa</td><td>${escapeHtml(company)}</td></tr>` : ''}
        <tr><td style="padding:6px 0;color:#666;">Construir</td><td>${escapeHtml(typesLine)}</td></tr>
        <tr><td style="padding:6px 0;color:#666;">Orçamento</td><td>${escapeHtml(budget || '—')}</td></tr>
        <tr><td style="padding:6px 0;color:#666;">Prazo</td><td>${escapeHtml(deadline || '—')}</td></tr>
        ${payload.locale ? `<tr><td style="padding:6px 0;color:#666;">Idioma</td><td>${escapeHtml(payload.locale)}</td></tr>` : ''}
      </table>
      <div style="margin-top:20px;padding-top:16px;border-top:1px solid #eee;">
        <div style="font-size:12px;color:#666;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Mensagem</div>
        <div style="font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(message)}</div>
      </div>
    </div>
  `

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject,
      text,
      html,
    })

    if (result.error) {
      console.error('[contact] resend error', {
        from: FROM_EMAIL,
        to: TO_EMAIL,
        error: result.error,
      })
      return { ok: false, error: 'send' }
    }

    console.log('[contact] sent', { id: result.data?.id, to: TO_EMAIL })
    return { ok: true }
  } catch (err) {
    console.error('[contact] resend threw', {
      from: FROM_EMAIL,
      to: TO_EMAIL,
      err,
    })
    return { ok: false, error: 'send' }
  }
}
