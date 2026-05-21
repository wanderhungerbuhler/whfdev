import '@/styles/global.css'

import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { ProfileMenu } from '@/components/admin/ProfileMenu'
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

  async function doSignOut() {
    'use server'
    await signOut({ redirectTo: '/admin/sign-in' })
    redirect('/admin/sign-in')
  }

  return (
    <html
      lang="pt-BR"
      className={`${GeistSans.variable} ${GeistMono.variable} bg-canvas`}
    >
      <body className="min-h-screen bg-canvas text-ink antialiased">
        {session?.user ? (
          <>
            <AdminNav
              name={session.user.name}
              email={session.user.email}
              image={session.user.image}
              signOutAction={doSignOut}
            />
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
              {children}
            </main>
          </>
        ) : (
          // Sign-in page renders without nav; protected pages enforce auth
          // server-side via requireAdminPage and redirect to /admin/sign-in.
          <>{children}</>
        )}
      </body>
    </html>
  )
}

function AdminNav({
  name,
  email,
  image,
  signOutAction,
}: {
  name: string | null | undefined
  email: string | null | undefined
  image: string | null | undefined
  signOutAction: () => Promise<void>
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-rule-soft bg-canvas/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-8">
        {/* Marca: logo + WHFDEV + TECH CONSULTING (mesmo padrão do e-mail/PDF) */}
        <Link
          href="/admin"
          className="group flex items-center gap-3"
          aria-label="WHFDEV Admin"
        >
          <Image
            src="/whfdev.png"
            alt="WHFDEV"
            width={32}
            height={32}
            quality={100}
            priority
            className="rounded-lg"
          />
          <div className="hidden h-7 w-px bg-rule sm:block" />
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-semibold tracking-[-0.01em] text-ink">
              WHFDEV
            </span>
            <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-ink-muted">
              Tech Consulting
            </span>
          </div>
        </Link>

        {/* Nav central */}
        <nav className="flex flex-1 items-center justify-center gap-6 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">
          <Link href="/admin" className="transition hover:text-ink">
            Propostas
          </Link>
          <Link
            href="/admin/proposals/new"
            className="transition hover:text-ink"
          >
            Nova
          </Link>
        </nav>

        {/* Profile menu */}
        <ProfileMenu
          name={name}
          email={email}
          image={image}
          signOutAction={signOutAction}
        />
      </div>
    </header>
  )
}
