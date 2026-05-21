import 'server-only'

import { Resend } from 'resend'

const apiKey = process.env.RESEND_API_KEY

export const resend = apiKey ? new Resend(apiKey) : null

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? 'WHFDEV <talkto@whfdev.com>'
export const REPLY_TO = process.env.RESEND_REPLY_TO ?? 'talkto@whfdev.com'
