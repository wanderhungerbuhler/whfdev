'use client'

import { useTranslations } from 'next-intl'

import { Reveal } from '@/components/ui/Reveal'

import { SectionHeader } from './SectionHeader'

export function Process() {
  const t = useTranslations('Index.process')
  const s = useTranslations('Index.process.steps')

  const steps = ['discovery', 'design', 'build', 'ship', 'grow'] as const

  return (
    <section id="process" className="border-b border-rule-soft py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeader
            eyebrow={t('eyebrow')}
            title={t('title')}
            lede={t('lede')}
          />
        </Reveal>

        <ol className="relative grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((key, idx) => (
            <Reveal
              key={key}
              as="li"
              delay={idx * 0.07}
              className="card-gradient group relative flex flex-col gap-3 p-5 sm:gap-4 sm:p-6"
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
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
