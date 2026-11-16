-- Pagamentos via Stripe: sinal e cobranças por marco ligadas a cada proposta,
-- e página pública /p/[token] onde o cliente vê a proposta, aceita e paga.
-- Rode no Supabase SQL Editor após 0002_attachments.sql.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE "proposals" ADD COLUMN IF NOT EXISTS "currency"           text    NOT NULL DEFAULT 'eur';
ALTER TABLE "proposals" ADD COLUMN IF NOT EXISTS "total_amount_cents" integer;
ALTER TABLE "proposals" ADD COLUMN IF NOT EXISTS "deposit_percent"    integer NOT NULL DEFAULT 40;
ALTER TABLE "proposals" ADD COLUMN IF NOT EXISTS "locale"             text    NOT NULL DEFAULT 'pt-PT';
ALTER TABLE "proposals" ADD COLUMN IF NOT EXISTS "public_token"       text;
ALTER TABLE "proposals" ADD COLUMN IF NOT EXISTS "accepted_at"        timestamp;

-- Propostas antigas ganham um token aleatório (36 hex = 144 bits).
UPDATE "proposals"
   SET "public_token" = encode(gen_random_bytes(18), 'hex')
 WHERE "public_token" IS NULL;

ALTER TABLE "proposals" ALTER COLUMN "public_token" SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS proposals_public_token_idx ON "proposals" ("public_token");

CREATE TABLE IF NOT EXISTS "payments" (
  "id"                         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "proposal_id"                uuid NOT NULL REFERENCES "proposals"("id") ON DELETE CASCADE,
  "kind"                       text NOT NULL DEFAULT 'deposit',   -- deposit | milestone
  "description"                text,
  "amount_cents"               integer NOT NULL,
  "currency"                   text NOT NULL DEFAULT 'eur',
  "status"                     text NOT NULL DEFAULT 'pending',   -- pending | processing | paid | failed
  "stripe_checkout_session_id" text,
  "stripe_payment_intent_id"   text,
  "stripe_payment_method"      text,                              -- card, mb_way, multibanco, …
  "paid_at"                    timestamp,
  "created_at"                 timestamp NOT NULL DEFAULT now(),
  "updated_at"                 timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS payments_proposal_id_idx ON "payments" ("proposal_id");
