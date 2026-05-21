import 'server-only'

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from './schema'

/**
 * The Auth.js Drizzle adapter inspects the shape of the db object to detect
 * the dialect, so we must initialize a real Drizzle instance at module load.
 * The Postgres driver is lazy (no TCP until first query), so we can pass a
 * placeholder URL when DATABASE_URL is missing (e.g. during `next build` on
 * CI) — queries will simply fail at runtime with a clear error.
 */
declare global {
  // eslint-disable-next-line no-var, camelcase
  var __whfdev_pg: ReturnType<typeof postgres> | undefined
}

const connectionString =
  process.env.DATABASE_URL ?? 'postgres://placeholder@localhost:5432/placeholder'

const sql =
  globalThis.__whfdev_pg ??
  postgres(connectionString, { prepare: false, max: 5, idle_timeout: 20 })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__whfdev_pg = sql
}

export const db = drizzle(sql, { schema })
export { schema }
