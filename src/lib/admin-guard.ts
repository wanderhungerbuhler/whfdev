import 'server-only'

import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'

/**
 * For API routes: returns the session or a 401 Response.
 */
export async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id) {
    return {
      ok: false as const,
      response: new Response('Unauthorized', { status: 401 }),
    }
  }
  return { ok: true as const, session }
}

/**
 * For server components: returns the session or redirects to /admin/sign-in.
 */
export async function requireAdminPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/admin/sign-in')
  }
  return session
}
