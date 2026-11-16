import { asc, eq } from 'drizzle-orm'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import { db } from '@/lib/db/client'
import { attachments, type Payment, proposals } from '@/lib/db/schema'
import { renderMessageHtml } from '@/lib/email/proposal-email'
import {
  depositCents,
  ensureDepositPayment,
  formatMoney,
  fulfillCheckoutSession,
  listPayments,
  normalizeLocale,
  paymentLabel,
} from '@/lib/payments'
import { isStripeConfigured } from '@/lib/stripe'

import { TEXTS } from './texts'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type Props = {
  params: { token: string }
  searchParams: { session_id?: string; canceled?: string; error?: string }
}

export default async function PublicProposalPage({
  params,
  searchParams,
}: Props) {
  const [proposal] = await db
    .select()
    .from(proposals)
    .where(eq(proposals.publicToken, params.token))
    .limit(1)
  if (!proposal) notFound()

  const locale = normalizeLocale(proposal.locale)
  const t = TEXTS[locale]
  const intlLocale = locale === 'en' ? 'en-GB' : locale

  // Regresso do Stripe: confirma já (o webhook também o faz, de forma idempotente).
  let justPaid = false
  if (searchParams.session_id && isStripeConfigured()) {
    try {
      const r = await fulfillCheckoutSession(searchParams.session_id)
      justPaid = r.ok && r.payment.status === 'paid'
    } catch (err) {
      console.error('[public proposal] fulfil on return failed', err)
    }
  }

  // Garante a linha do sinal para mostrar o estado certo.
  if (depositCents(proposal)) await ensureDepositPayment(proposal)

  const [atts, pays] = await Promise.all([
    db
      .select({
        id: attachments.id,
        filename: attachments.filename,
        sizeBytes: attachments.sizeBytes,
      })
      .from(attachments)
      .where(eq(attachments.proposalId, proposal.id))
      .orderBy(asc(attachments.position), asc(attachments.createdAt)),
    listPayments(proposal.id),
  ])

  const deposit = pays.find((p) => p.kind === 'deposit') ?? null
  const extras = pays.filter((p) => p.kind !== 'deposit')
  const accepted = proposal.status === 'accepted' || deposit?.status === 'paid'
  const messageHtml = proposal.emailBody
    ? renderMessageHtml(proposal.emailBody)
    : null

  const fmt = (cents: number, cur = proposal.currency) =>
    formatMoney(cents, cur, intlLocale)
  const fmtDate = (d: Date) =>
    new Intl.DateTimeFormat(intlLocale, { dateStyle: 'medium' }).format(d)

  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      <div className="hero-mesh pointer-events-none absolute inset-x-0 top-0 -z-10 h-[60vh] opacity-60" />
      <div className="bg-grid-pattern mask-fade-y pointer-events-none absolute inset-x-0 top-0 -z-10 h-[60vh]" />

      <header className="mx-auto flex max-w-3xl items-center justify-between px-5 pt-8 sm:px-8">
        <div className="flex items-center gap-3">
          <Image
            src="/whfdev.png"
            alt="WHFDEV"
            width={32}
            height={32}
            quality={100}
            className="rounded-md"
          />
          <div className="leading-tight">
            <div className="text-sm font-semibold text-ink">WHFDEV</div>
            <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink-muted">
              Tech Consulting
            </div>
          </div>
        </div>
        {accepted && (
          <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-300">
            {t.acceptedBadge}
          </span>
        )}
      </header>

      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-5 pb-20 pt-12 sm:px-8 sm:pt-16">
        {/* Avisos de regresso do Stripe */}
        {justPaid && (
          <Notice tone="success" title={t.successTitle} body={t.successBody} />
        )}
        {searchParams.canceled && !justPaid && (
          <Notice tone="muted" title={t.canceledTitle} body={t.canceledBody} />
        )}
        {searchParams.error && (
          <Notice tone="error" title={t.errorTitle} body={t.errorBody} />
        )}

        <section>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-coral">
            {t.eyebrow}
          </p>
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
            {t.title(proposal.clientName)}
          </h1>
          {proposal.emailSubject && (
            <p className="mt-3 text-base text-ink-soft sm:text-lg">
              {proposal.emailSubject}
            </p>
          )}
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-muted">
            {t.intro}
          </p>
        </section>

        {messageHtml && (
          <section className="card-gradient rounded-2xl p-6 sm:p-8">
            <div
              className="prose prose-invert prose-sm max-w-none text-ink-soft prose-a:text-coral"
              dangerouslySetInnerHTML={{ __html: messageHtml }}
            />
          </section>
        )}

        {atts.length > 0 && (
          <section className="card-gradient rounded-2xl p-6 sm:p-8">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
              {t.attachments}
            </p>
            <ul className="divide-y divide-rule-soft">
              {atts.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-ink">{a.filename}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-dim">
                      {formatBytes(a.sizeBytes)}
                    </p>
                  </div>
                  <a
                    href={`/api/p/${proposal.publicToken}/attachments/${a.id}`}
                    className="shrink-0 rounded-full border border-rule px-4 py-1.5 text-xs font-medium text-ink transition hover:bg-canvas-card"
                  >
                    ↓ {t.download}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="card-gradient rounded-2xl p-6 sm:p-8">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
            {t.payment}
          </p>

          {proposal.totalAmountCents && deposit ? (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <Stat label={t.total} value={fmt(proposal.totalAmountCents)} />
                <Stat
                  label={t.deposit(proposal.depositPercent)}
                  value={fmt(deposit.amountCents, deposit.currency)}
                  accent
                />
                <div className="col-span-2 flex items-end sm:col-span-1">
                  <StatusBadge payment={deposit} t={t} fmtDate={fmtDate} />
                </div>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-ink-muted">
                {t.depositHint}
              </p>

              {deposit.status !== 'paid' && (
                <PayForm
                  token={proposal.publicToken}
                  paymentId={deposit.id}
                  label={
                    deposit.status === 'failed'
                      ? t.retry
                      : t.payDeposit(fmt(deposit.amountCents, deposit.currency))
                  }
                  secure={t.secure}
                  methods={proposal.currency === 'eur' ? t.methods : TEXTS.en.methods}
                />
              )}
            </>
          ) : (
            <p className="text-sm text-ink-muted">{t.noAmount}</p>
          )}

          {extras.length > 0 && (
            <div className="mt-8 border-t border-rule-soft pt-6">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
                {t.extraTitle}
              </p>
              <ul className="flex flex-col gap-3">
                {extras.map((p) => (
                  <li
                    key={p.id}
                    className="flex flex-col gap-3 rounded-xl border border-rule-soft bg-canvas/40 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm text-ink">{paymentLabel(p, proposal)}</p>
                      <p className="mt-1 text-lg font-semibold tracking-tight text-ink">
                        {fmt(p.amountCents, p.currency)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge payment={p} t={t} fmtDate={fmtDate} />
                      {p.status !== 'paid' && (
                        <form method="post" action={`/api/p/${proposal.publicToken}/checkout`}>
                          <input type="hidden" name="paymentId" value={p.id} />
                          <button
                            type="submit"
                            className="rounded-full bg-coral px-4 py-2 text-sm font-medium text-white transition hover:bg-coral-soft"
                          >
                            {p.status === 'failed' ? t.retry : t.pay(fmt(p.amountCents, p.currency))}
                          </button>
                        </form>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <footer className="mt-6 flex flex-col gap-2 text-xs text-ink-dim sm:flex-row sm:items-center sm:justify-between">
          <p>
            {t.questions}{' '}
            <a href="mailto:talkto@whfdev.com" className="text-coral hover:underline">
              talkto@whfdev.com
            </a>
          </p>
          <p className="flex gap-4">
            <a href={`/${locale}/legal/privacy`} className="hover:text-ink">
              {t.legalPrivacy}
            </a>
            <a href={`/${locale}/legal/terms`} className="hover:text-ink">
              {t.legalTerms}
            </a>
          </p>
        </footer>
      </main>
    </div>
  )
}

/* ---------- peças ---------- */

function PayForm({
  token,
  paymentId,
  label,
  secure,
  methods,
}: {
  token: string
  paymentId: string
  label: string
  secure: string
  methods: string
}) {
  return (
    <form method="post" action={`/api/p/${token}/checkout`} className="mt-6">
      <input type="hidden" name="paymentId" value={paymentId} />
      <button
        type="submit"
        className="btn-glow inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-coral px-6 text-sm font-medium text-white transition hover:bg-coral-soft sm:w-auto"
      >
        {label}
        <span aria-hidden>→</span>
      </button>
      <p className="mt-3 text-xs text-ink-dim">
        {secure} {methods}
      </p>
    </form>
  )
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
        {label}
      </p>
      <p
        className={`mt-1 text-2xl font-semibold tracking-tight ${
          accent ? 'text-gradient-accent' : 'text-ink'
        }`}
      >
        {value}
      </p>
    </div>
  )
}

function StatusBadge({
  payment,
  t,
  fmtDate,
}: {
  payment: Payment
  t: (typeof TEXTS)['pt-PT']
  fmtDate: (d: Date) => string
}) {
  const map: Record<string, { cls: string; label: string }> = {
    paid: {
      cls: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
      label: payment.paidAt ? t.paidOn(fmtDate(payment.paidAt)) : t.paid,
    },
    processing: {
      cls: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
      label: t.processing,
    },
    failed: {
      cls: 'border-red-500/40 bg-red-500/10 text-red-300',
      label: t.failed,
    },
    pending: { cls: 'border-rule text-ink-muted', label: t.pending },
  }
  const s = map[payment.status] ?? map.pending
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${s.cls}`}
    >
      {s.label}
    </span>
  )
}

function Notice({
  tone,
  title,
  body,
}: {
  tone: 'success' | 'muted' | 'error'
  title: string
  body: string
}) {
  const cls =
    tone === 'success'
      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
      : tone === 'error'
        ? 'border-red-500/40 bg-red-500/10 text-red-200'
        : 'border-rule-soft bg-canvas-elev text-ink-soft'
  return (
    <div role="status" className={`rounded-xl border px-5 py-4 ${cls}`}>
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-sm opacity-90">{body}</p>
    </div>
  )
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}
