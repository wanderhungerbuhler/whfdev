'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { BRANDS } from '@/data/brands'

export function Marquee() {
  const t = useTranslations('Index.marquee')
  const row = [...BRANDS, ...BRANDS]

  return (
    <section className="border-b border-rule-soft py-10 sm:py-14">
      <p className="mx-auto max-w-6xl px-4 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted sm:px-6 sm:text-[11px] sm:tracking-[0.22em]">
        {t('label')}
      </p>
      <div className="mask-fade-x relative mt-8 overflow-hidden sm:mt-10">
        <div className="marquee flex w-max items-center gap-10 pr-10 sm:gap-16 sm:pr-16">
          {row.map((logo, i) => (
            <Image
              key={i}
              src={logo.src}
              alt={logo.alt}
              width={logo.w}
              quality={100}
              className="h-6 w-auto opacity-50 grayscale transition hover:opacity-90 hover:grayscale-0 sm:h-8"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
