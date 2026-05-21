import 'server-only'

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
export const BUCKET = process.env.SUPABASE_BUCKET ?? 'proposal-attachments'

/**
 * Service-role client — bypasses RLS and signs URLs. Server-only.
 * Lazy init so `next build` doesn't crash when env vars are missing.
 */
let cached: SupabaseClient | null = null

function client(): SupabaseClient {
  if (cached) return cached
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required (see .env.example)',
    )
  }
  cached = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return cached
}

/** Sanitize a filename to be safe in a URL/object key. */
export function safeFilename(name: string): string {
  return (
    name
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-zA-Z0-9._-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 120) || 'file'
  )
}

export function objectKey(proposalId: string, filename: string): string {
  const uuid = crypto.randomUUID()
  return `${proposalId}/${uuid}-${safeFilename(filename)}`
}

/**
 * Generates a signed UPLOAD URL the browser can PUT to directly, bypassing
 * our serverless route (which has a 4.5MB body limit on Vercel Hobby).
 */
export async function createSignedUploadUrl(path: string) {
  const { data, error } = await client()
    .storage.from(BUCKET)
    .createSignedUploadUrl(path)
  if (error) throw error
  return { token: data.token, path: data.path, signedUrl: data.signedUrl }
}

/** Signed download URL, valid for `expiresInSeconds`. */
export async function createSignedDownloadUrl(
  path: string,
  expiresInSeconds = 300,
) {
  const { data, error } = await client()
    .storage.from(BUCKET)
    .createSignedUrl(path, expiresInSeconds)
  if (error) throw error
  return data.signedUrl
}

/** Download a file as a Node Buffer (used when attaching to Resend). */
export async function downloadAsBuffer(path: string): Promise<Buffer> {
  const { data, error } = await client().storage.from(BUCKET).download(path)
  if (error) throw error
  const arrayBuffer = await data.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

/** Hard delete from the bucket. */
export async function removeObject(path: string) {
  const { error } = await client().storage.from(BUCKET).remove([path])
  if (error) throw error
}
