'use client'

import { useTranslations } from 'next-intl'

import { SectionHeader } from './SectionHeader'

export function Process() {
  const t = useTranslations('Index.process')
  const s = useTranslations('Index.process.steps')

  const steps = ['discovery', 'design', 'build', 'ship', 'grow'] as const

  return (
    <section id="process" className="border-b border-rule-soft py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          eyebrow={t('eyebrow')}
          title={t('title')}
          lede={t('lede')}
        />

        <ol className="relative grid grid-cols-1 gap-3 md:grid-cols-5">
          {steps.map((key, idx) => (
            <li
              key={key}
              className="card-gradient group relative flex flex-col gap-4 p-6"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-coral">
                  {`Step ${String(idx + 1).padStart(2, '0')}`}
                </span>
                <span className="h-2 w-2 rounded-full bg-coral/40 transition group-hover:bg-coral" />
              </div>
              <h3 className="text-base font-semibold tracking-tight">
                {s(`${key}.title`)}
              </h3>
              <p className="text-sm leading-relaxed text-ink-muted">
                {s(`${key}.desc`)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
