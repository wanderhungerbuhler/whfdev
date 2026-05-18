'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'

export function Hero() {
  const t = useTranslations('Index.hero')

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden border-b border-rule-soft pt-24 sm:pt-28"
    >
      {/* hero mesh + grid */}
      <div className="hero-mesh pointer-events-none absolute inset-0 -z-10" />
      <div className="bg-grid-pattern mask-fade-y pointer-events-none absolute inset-0 -z-10" />
      <div className="beam-top absolute inset-x-0 top-16 h-px" />

      <div className="mx-auto flex max-w-5xl flex-col items-center px-4 pb-20 pt-10 text-center sm:px-6 sm:pb-32 sm:pt-16 md:pt-24">
        <h1 className="text-balance text-[2.25rem] font-semibold leading-[1.05] tracking-tighter2 sm:text-6xl md:text-[5.5rem]">
          <span className="text-gradient block">{t('titlePre')}</span>
          <span className="text-gradient-accent block">{t('titleEm')}</span>
          <span className="text-gradient block">{t('titlePost')}</span>
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-sm text-ink-muted sm:mt-8 sm:text-lg">
          {t('lede')}
        </p>

        <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:items-center">
          <Link
            href="#contact"
            className="btn-glow group inline-flex h-11 items-center justify-center gap-2 rounded-full bg-coral px-6 text-sm font-medium text-white transition hover:bg-coral-soft"
          >
            {t('ctaPrimary')}
            <span className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
          <Link
            href="#work"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-rule px-6 text-sm font-medium text-ink transition hover:bg-canvas-elev"
          >
            {t('ctaSecondary')}
          </Link>
        </div>

        {/* meta row */}
        <dl className="mt-12 grid w-full max-w-3xl grid-cols-3 gap-2 border-t border-rule-soft pt-6 sm:mt-16 sm:gap-8 sm:pt-8">
          <Meta value="14" label={t('metaYears')} />
          <Meta value="1000+" label={t('metaProjects')} />
          <Meta value="∞" label={t('metaTeam')} />
        </dl>
      </div>
    </section>
  )
}

function Meta({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <div className="text-gradient-accent text-2xl font-semibold tracking-tighter2 sm:text-4xl">
        {value}
      </div>
      <div className="font-mono text-[9px] uppercase leading-tight tracking-[0.14em] text-ink-muted sm:text-xs sm:tracking-[0.18em]">
        {label}
      </div>
    </div>
  )
}
