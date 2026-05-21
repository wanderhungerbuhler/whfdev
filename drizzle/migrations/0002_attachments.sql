-- Pivot: admin agora é upload-driven. brief vira opcional, e nasce a tabela
-- attachments (arquivos no Supabase Storage referenciados aqui).
-- Rode no Supabase SQL Editor após 0001_init.sql.

ALTER TABLE "proposals" ALTER COLUMN "brief" DROP NOT NULL;
ALTER TABLE "proposals" ALTER COLUMN "brief" SET DEFAULT NULL;

CREATE TABLE IF NOT EXISTS "attachments" (
  "id"            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "proposal_id"   uuid NOT NULL REFERENCES "proposals"("id") ON DELETE CASCADE,
  "filename"      text NOT NULL,
  "mime_type"     text NOT NULL,
  "size_bytes"    integer NOT NULL DEFAULT 0,
  "storage_path"  text NOT NULL,    -- key dentro do bucket
  "position"      integer NOT NULL DEFAULT 0,
  "created_at"    timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS attachments_proposal_id_idx ON "attachments" ("proposal_id");
CREATE INDEX IF NOT EXISTS attachments_position_idx ON "attachments" ("proposal_id", "position");

-- Bucket de storage precisa ser criado manualmente no Supabase Dashboard
-- (Storage → New bucket → "proposal-attachments" → Private → Save).
