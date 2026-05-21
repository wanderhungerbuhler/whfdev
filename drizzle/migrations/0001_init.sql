-- whfdev admin schema (NextAuth + proposals)
-- Run once in the Supabase SQL Editor (or via drizzle-kit push).

CREATE TABLE IF NOT EXISTS "users" (
  "id"            text PRIMARY KEY,
  "name"          text,
  "email"         text UNIQUE NOT NULL,
  "emailVerified" timestamp,
  "image"         text
);

CREATE TABLE IF NOT EXISTS "accounts" (
  "userId"            text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "type"              text NOT NULL,
  "provider"          text NOT NULL,
  "providerAccountId" text NOT NULL,
  "refresh_token"     text,
  "access_token"      text,
  "expires_at"        integer,
  "token_type"        text,
  "scope"             text,
  "id_token"          text,
  "session_state"     text,
  PRIMARY KEY ("provider", "providerAccountId")
);

CREATE TABLE IF NOT EXISTS "sessions" (
  "sessionToken" text PRIMARY KEY,
  "userId"       text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "expires"      timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS "verificationTokens" (
  "identifier" text NOT NULL,
  "token"      text NOT NULL,
  "expires"    timestamp NOT NULL,
  PRIMARY KEY ("identifier", "token")
);

CREATE TABLE IF NOT EXISTS "proposals" (
  "id"            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "client_name"   text NOT NULL,
  "client_email"  text,
  "brief"         jsonb NOT NULL,
  "status"        text NOT NULL DEFAULT 'draft',
  "pdf_path"      text,
  "email_subject" text,
  "email_body"    text,
  "created_by"    text REFERENCES "users"("id") ON DELETE SET NULL,
  "created_at"    timestamp NOT NULL DEFAULT now(),
  "updated_at"    timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS proposals_created_at_idx ON "proposals" ("created_at" DESC);

CREATE TABLE IF NOT EXISTS "sends" (
  "id"          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "proposal_id" uuid NOT NULL REFERENCES "proposals"("id") ON DELETE CASCADE,
  "to_email"    text NOT NULL,
  "subject"     text NOT NULL,
  "body_html"   text NOT NULL,
  "body_text"   text,
  "resend_id"   text,
  "status"      text NOT NULL DEFAULT 'queued',
  "error"       text,
  "sent_at"     timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sends_proposal_id_idx ON "sends" ("proposal_id");
CREATE INDEX IF NOT EXISTS sends_sent_at_idx ON "sends" ("sent_at" DESC);
