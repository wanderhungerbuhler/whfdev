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
