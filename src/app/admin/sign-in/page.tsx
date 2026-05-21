import Image from 'next/image'
import { redirect } from 'next/navigation'

import { auth, signIn } from '@/lib/auth'

export const metadata = { title: 'Sign in · WHFDEV Admin' }

export default async function SignInPage() {
  const session = await auth()
  if (session?.user) redirect('/admin')

  async function doGithubSignIn() {
    'use server'
    await signIn('github', { redirectTo: '/admin' })
  }

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-rule-soft bg-canvas-elev p-8 text-center">
        <div className="mx-auto mb-7 flex items-center justify-center gap-3">
          <Image
            src="/whfdev.png"
            alt="WHFDEV"
            width={40}
            height={40}
            quality={100}
            priority
            className="rounded-xl"
          />
          <div className="h-8 w-px bg-rule" />
          <div className="flex flex-col items-start leading-tight">
            <span className="text-base font-semibold tracking-[-0.01em] text-ink">
              WHFDEV
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
              Tech Consulting
            </span>
          </div>
        </div>
        <h1 className="mb-2 text-2xl font-semibold tracking-tight text-ink">
          Entrar no painel
        </h1>
        <p className="mb-8 text-sm text-ink-soft">
          Acesso restrito. Faz login com o GitHub para gerir propostas.
        </p>
        <form action={doGithubSignIn}>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-canvas transition hover:bg-ink-soft"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.92.58.11.79-.25.79-.56v-2c-3.2.69-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.74.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.06 11.06 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.06.78 2.13v3.16c0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.73 18.27.5 12 .5z" />
            </svg>
            Continuar com GitHub
          </button>
        </form>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          Acesso por allowlist
        </p>
      </div>
    </div>
  )
}
