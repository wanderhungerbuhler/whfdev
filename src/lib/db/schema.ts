import {
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

/* ---------- NextAuth core tables (matches @auth/drizzle-adapter Postgres) ---------- */

export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').unique().notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
})

export const accounts = pgTable(
  'accounts',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (t) => [primaryKey({ columns: [t.provider, t.providerAccountId] })],
)

export const sessions = pgTable('sessions', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

export const verificationTokens = pgTable(
  'verificationTokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
)

/* ---------- Domain tables ---------- */

export const proposals = pgTable('proposals', {
  id: uuid('id').primaryKey().defaultRandom(),
  /** copy of client.name for quick listing */
  clientName: text('client_name').notNull(),
  clientEmail: text('client_email'),
  /**
   * Optional structured brief (kept for backwards compat / future auto-gen).
   * Admin V2 is upload-driven and doesn't touch this column.
   */
  brief: jsonb('brief').$type<unknown>(),
  status: text('status').notNull().default('draft'),
  /** Legacy: server-rendered PDF path. Unused in upload-driven flow. */
  pdfPath: text('pdf_path'),
  /** Message that ships with the email */
  emailSubject: text('email_subject'),
  emailBody: text('email_body'),
  createdBy: text('created_by').references(() => users.id, {
    onDelete: 'set null',
  }),
  /* ---- Pagamento (Stripe) ---- */
  /** ISO 4217 em minúsculas (eur, usd) */
  currency: text('currency').notNull().default('eur'),
  /** Valor total da proposta, em cêntimos. null = sem valor definido */
  totalAmountCents: integer('total_amount_cents'),
  /** Percentagem do sinal pedido para aceitar a proposta */
  depositPercent: integer('deposit_percent').notNull().default(40),
  /** Idioma do cliente: pt-PT | pt-BR | en | fr (página pública + Checkout) */
  locale: text('locale').notNull().default('pt-PT'),
  /** Token da página pública /p/[token] */
  publicToken: text('public_token')
    .notNull()
    .unique()
    .$defaultFn(() => randomToken()),
  /** Quando o sinal foi pago (proposta aceite) */
  acceptedAt: timestamp('accepted_at', { mode: 'date' }),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
})

function randomToken(): string {
  const bytes = new Uint8Array(18)
  globalThis.crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  proposalId: uuid('proposal_id')
    .notNull()
    .references(() => proposals.id, { onDelete: 'cascade' }),
  /** deposit (sinal) | milestone (cobrança adicional) */
  kind: text('kind').notNull().default('deposit'),
  description: text('description'),
  amountCents: integer('amount_cents').notNull(),
  currency: text('currency').notNull().default('eur'),
  /** pending | processing | paid | failed */
  status: text('status').notNull().default('pending'),
  stripeCheckoutSessionId: text('stripe_checkout_session_id'),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  stripePaymentMethod: text('stripe_payment_method'),
  paidAt: timestamp('paid_at', { mode: 'date' }),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
})

export const attachments = pgTable('attachments', {
  id: uuid('id').primaryKey().defaultRandom(),
  proposalId: uuid('proposal_id')
    .notNull()
    .references(() => proposals.id, { onDelete: 'cascade' }),
  filename: text('filename').notNull(),
  mimeType: text('mime_type').notNull(),
  sizeBytes: integer('size_bytes').notNull().default(0),
  /** Object key inside the Supabase Storage bucket */
  storagePath: text('storage_path').notNull(),
  position: integer('position').notNull().default(0),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
})

export const sends = pgTable('sends', {
  id: uuid('id').primaryKey().defaultRandom(),
  proposalId: uuid('proposal_id')
    .notNull()
    .references(() => proposals.id, { onDelete: 'cascade' }),
  toEmail: text('to_email').notNull(),
  subject: text('subject').notNull(),
  bodyHtml: text('body_html').notNull(),
  bodyText: text('body_text'),
  resendId: text('resend_id'),
  status: text('status').notNull().default('queued'),
  error: text('error'),
  sentAt: timestamp('sent_at', { mode: 'date' }).notNull().defaultNow(),
})

export type Proposal = typeof proposals.$inferSelect
export type NewProposal = typeof proposals.$inferInsert
export type Send = typeof sends.$inferSelect
export type NewSend = typeof sends.$inferInsert
export type Attachment = typeof attachments.$inferSelect
export type NewAttachment = typeof attachments.$inferInsert
export type Payment = typeof payments.$inferSelect
export type NewPayment = typeof payments.$inferInsert
