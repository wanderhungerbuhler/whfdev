'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'

import { sendContactEmail } from '@/app/actions/contact'
import { Reveal } from '@/components/ui/Reveal'

import { SectionHeader } from './SectionHeader'

const TYPE_KEYS = [
  'crm',
  'dashboard',
  'landing',
  'ios',
  'android',
  'web',
  'ecommerce',
  'consult',
  'other',
] as const

const BUDGET_KEYS = ['explore', 'tier1', 'tier2', 'tier3', 'tier4'] as const
const DEADLINE_KEYS = ['asap', 'month', 'quarter', 'flex'] as const

type TypeKey = (typeof TYPE_KEYS)[number]
type BudgetKey = (typeof BUDGET_KEYS)[number]
type DeadlineKey = (typeof DEADLINE_KEYS)[number]

type Status = 'idle' | 'sending' | 'success' | 'error'

export function Contact() {
  const t = useTranslations('Index.contact')
  const typeLabel = useTranslations('Index.contact.types')
  const budgetLabel = useTranslations('Index.contact.budgets')
  const deadlineLabel = useTranslations('Index.contact.deadlines')
  const locale = useLocale()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [types, setTypes] = useState<TypeKey[]>([])
  const [budget, setBudget] = useState<BudgetKey | ''>('')
  const [deadline, setDeadline] = useState<DeadlineKey | ''>('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  const sending = status === 'sending'

  function toggleType(key: TypeKey) {
    setTypes((curr) =>
      curr.includes(key) ? curr.filter((k) => k !== key) : [...curr, key],
    )
  }

  function resetForm() {
    setName('')
    setEmail('')
    setCompany('')
    setTypes([])
    setBudget('')
    setDeadline('')
    setMessage('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')

    const result = await sendContactEmail({
      name,
      email,
      company,
      projectTypes: types.map((k) => typeLabel(k)),
      budget: budget ? budgetLabel(budget) : undefined,
      deadline: deadline ? deadlineLabel(deadline) : undefined,
      message,
      locale,
    })

    if (result.ok) {
      setStatus('success')
      resetForm()
    } else {
      setStatus('error')
    }
  }

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-b border-rule-soft py-20 sm:py-28"
    >
      <div className="hero-mesh pointer-events-none absolute inset-x-0 top-0 -z-10 h-1/2 opacity-50" />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:gap-12 sm:px-6 lg:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <SectionHeader
            eyebrow={t('eyebrow')}
            title={t('title')}
            lede={t('lede')}
          />
        </Reveal>

        <Reveal delay={0.1} direction="up" as="div">
          <form
          onSubmit={handleSubmit}
          className="card-gradient flex flex-col gap-5 p-5 sm:gap-6 sm:p-8"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={t('name')} htmlFor="name" required>
              <input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('namePh')}
                className={inputCls}
              />
            </Field>
            <Field label={t('email')} htmlFor="email" required>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('emailPh')}
                className={inputCls}
              />
            </Field>
          </div>

          <Field label={t('company')} htmlFor="company">
            <input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder={t('companyPh')}
              className={inputCls}
            />
          </Field>

          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <Label>{t('type')}</Label>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-dim">
                {t('typeHint')}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {TYPE_KEYS.map((k) => {
                const active = types.includes(k)
                return (
                  <button
                    type="button"
                    key={k}
                    onClick={() => toggleType(k)}
                    className={[
                      'rounded-full border px-3.5 py-1.5 text-xs font-medium transition',
                      active
                        ? 'border-coral bg-coral/15 text-ink'
                        : 'border-rule-soft bg-canvas-elev text-ink-soft hover:border-rule hover:text-ink',
                    ].join(' ')}
                  >
                    {typeLabel(k)}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-3">
              <Label>{t('budget')}</Label>
              <div className="grid grid-cols-1 gap-2">
                {BUDGET_KEYS.map((k) => (
                  <PillRadio
                    key={k}
                    name="budget"
                    value={k}
                    active={budget === k}
                    onChange={() => setBudget(k)}
                    label={budgetLabel(k)}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label>{t('deadline')}</Label>
              <div className="grid grid-cols-1 gap-2">
                {DEADLINE_KEYS.map((k) => (
                  <PillRadio
                    key={k}
                    name="deadline"
                    value={k}
                    active={deadline === k}
                    onChange={() => setDeadline(k)}
                    label={deadlineLabel(k)}
                  />
                ))}
              </div>
            </div>
          </div>

          <Field label={t('message')} htmlFor="message" required>
            <textarea
              id="message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('messagePh')}
              className={`${inputCls} resize-y`}
            />
          </Field>

          {status === 'success' && (
            <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              {t('success')}
            </div>
          )}
          {status === 'error' && (
            <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {t('error')}
            </div>
          )}

          <div className="flex flex-col-reverse items-start justify-between gap-3 sm:flex-row sm:items-center">
            <p className="text-xs text-ink-dim">{t('privacy')}</p>
            <button
              type="submit"
              disabled={sending}
              className="btn-glow group inline-flex h-11 items-center gap-2 rounded-full bg-coral px-6 text-sm font-medium text-white transition hover:bg-coral-soft disabled:opacity-70"
            >
              {sending ? t('sending') : t('submit')}
              {!sending && (
                <span className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              )}
            </button>
          </div>
          </form>
        </Reveal>
      </div>
    </section>
  )
}

const inputCls =
  'w-full rounded-md border border-rule-soft bg-canvas-elev px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-dim outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/30'

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
      {children}
    </span>
  )
}

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string
  htmlFor: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label htmlFor={htmlFor} className="flex flex-col gap-2">
      <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
        {label}
        {required && <span className="text-coral">*</span>}
      </span>
      {children}
    </label>
  )
}

function PillRadio({
  name,
  value,
  active,
  onChange,
  label,
}: {
  name: string
  value: string
  active: boolean
  onChange: () => void
  label: string
}) {
  return (
    <label
      className={[
        'flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2.5 text-sm transition',
        active
          ? 'border-coral bg-coral/10 text-ink'
          : 'border-rule-soft bg-canvas-elev text-ink-soft hover:border-rule',
      ].join(' ')}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={active}
        onChange={onChange}
        className="sr-only"
      />
      <span
        className={[
          'grid h-4 w-4 place-items-center rounded-full border transition',
          active ? 'border-coral' : 'border-rule',
        ].join(' ')}
      >
        {active && <span className="h-2 w-2 rounded-full bg-coral" />}
      </span>
      {label}
    </label>
  )
}
