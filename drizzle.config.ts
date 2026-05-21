import { defineConfig } from 'drizzle-kit'

/**
 * For drizzle-kit (migrations/introspection), prefer DIRECT_URL when set.
 * Reason: the Supabase Transaction pooler used at runtime (port 6543) doesn't
 * support prepared statements or some DDL operations cleanly. DIRECT_URL
 * should point to the direct/session connection (e.g. port 5432 or the
 * Direct Connection URL).
 *
 * Runtime queries (src/lib/db/client.ts) keep using DATABASE_URL.
 */
const migrationUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL

if (!migrationUrl) {
  throw new Error(
    'Either DIRECT_URL or DATABASE_URL must be set for drizzle-kit',
  )
}

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: migrationUrl,
  },
  strict: true,
  verbose: true,
})
