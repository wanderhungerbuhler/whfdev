'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'

export function Hero() {
  const t = useTranslations('Index.hero')

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden border-b border-rule-soft pt-28"
    >
      {/* hero mesh + grid */}
      <div className="hero-mesh pointer-events-none absolute inset-0 -z-10" />
      <div className="bg-grid-pattern mask-fade-y pointer-events-none absolute inset-0 -z-10" />
      <div className="beam-top absolute inset-x-0 top-16 h-px" />

      <div className="mx-auto flex max-w-5xl flex-col items-center px-6 pb-32 pt-16 text-center md:pt-24">
        {/* eyebrow chip */}
        <div className="inline-flex items-center gap-2 rounded-full border border-rule-soft bg-canvas-elev/60 px-3 py-1 backdrop-blur">
          <span className="relative grid h-2 w-2 place-items-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-coral/60" />
            <span className="relative h-2 w-2 rounded-full bg-coral" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">
            {t('available')}
          </span>
        </div>

        <h1 className="mt-8 text-balance text-5xl font-semibold leading-[1.02] tracking-tighter2 sm:text-6xl md:text-[5.5rem]">
          <span className="text-gradient block">{t('titlePre')}</span>
          <span className="text-gradient-accent block">{t('titleEm')}</span>
          <span className="text-gradient block">{t('titlePost')}</span>
        </h1>

        <p className="mt-8 max-w-2xl text-pretty text-base text-ink-muted sm:text-lg">
          {t('lede')}
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="#contact"
            className="btn-glow group inline-flex h-11 items-center gap-2 rounded-full bg-coral px-6 text-sm font-medium text-white transition hover:bg-coral-soft"
          >
            {t('ctaPrimary')}
            <span className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
          <Link
            href="#work"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-rule px-6 text-sm font-medium text-ink transition hover:bg-canvas-elev"
          >
            {t('ctaSecondary')}
          </Link>
        </div>

        {/* meta row */}
        <dl className="mt-16 grid w-full max-w-3xl grid-cols-3 gap-3 border-t border-rule-soft pt-8 sm:gap-8">
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
      <div className="text-gradient-accent text-3xl font-semibold tracking-tighter2 sm:text-4xl">
        {value}
      </div>
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted sm:text-xs">
        {label}
      </div>
    </div>
  )
}
