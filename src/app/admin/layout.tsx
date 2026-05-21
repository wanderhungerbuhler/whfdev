import '@/styles/global.css'

import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { auth, signOut } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Admin · WHFDEV',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html
      lang="pt-BR"
      className={`${GeistSans.variable} ${GeistMono.variable} bg-canvas`}
    >
      <body className="min-h-screen bg-canvas text-ink antialiased">
        {session?.user ? (
          <>
            <AdminNav email={session.user.email} />
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8">{children}</main>
          </>
        ) : (
          // Anything under /admin without session bounces to sign-in.
          // We still render children for /admin/sign-in.
          <SignInGate>{children}</SignInGate>
        )}
      </body>
    </html>
  )
}

function SignInGate({ children }: { children: React.ReactNode }) {
  // We need a way to allow /admin/sign-in to render. Hack: read the URL via
  // React's experimental headers? Simplest: always render children; the
  // sign-in page is a public route, and protected pages call requireSession().
  return <>{children}</>
}

async function AdminNav({ email }: { email?: string | null }) {
  async function doSignOut() {
    'use server'
    await signOut({ redirectTo: '/admin/sign-in' })
    redirect('/admin/sign-in')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-rule-soft bg-canvas/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-coral" />
            WHFDEV · Admin
          </Link>
          <nav className="flex gap-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
            <Link href="/admin" className="hover:text-ink">
              Propostas
            </Link>
            <Link href="/admin/proposals/new" className="hover:text-ink">
              Nova
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.15em] text-ink-dim sm:inline">
            {email}
          </span>
          <form action={doSignOut}>
            <button
              type="submit"
              className="rounded-full border border-rule-soft px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-soft transition hover:border-rule hover:text-ink"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
