import { DrizzleAdapter } from '@auth/drizzle-adapter'
import NextAuth, { type DefaultSession } from 'next-auth'
import GitHub from 'next-auth/providers/github'

import { db } from '@/lib/db/client'
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from '@/lib/db/schema'

declare module 'next-auth' {
  interface Session {
    user: { id: string } & DefaultSession['user']
  }
}

/**
 * Whitelist of GitHub emails allowed to sign in. Comma-separated in env.
 * Falls back to the auto-memory email for local dev only.
 */
function allowedEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? ''
  return raw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  session: { strategy: 'database' },
  pages: {
    signIn: '/admin/sign-in',
  },
  callbacks: {
    async signIn({ user }) {
      const list = allowedEmails()
      const email = user.email?.toLowerCase()
      if (!email) return false
      if (list.length === 0) {
        // No allowlist configured → fail closed in prod, allow in dev.
        return process.env.NODE_ENV !== 'production'
      }
      return list.includes(email)
    },
    async session({ session, user }) {
      if (session.user) session.user.id = user.id
      return session
    },
  },
})
