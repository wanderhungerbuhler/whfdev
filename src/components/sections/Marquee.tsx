'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { BRANDS } from '@/data/brands'

export function Marquee() {
  const t = useTranslations('Index.marquee')
  const row = [...BRANDS, ...BRANDS]

  return (
    <section className="border-b border-rule-soft py-14">
      <p className="mx-auto max-w-6xl px-6 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
        {t('label')}
      </p>
      <div className="mask-fade-x relative mt-10 overflow-hidden">
        <div className="marquee flex w-max items-center gap-16 pr-16">
          {row.map((logo, i) => (
            <Image
              key={i}
              src={logo.src}
              alt={logo.alt}
              width={logo.w}
              quality={100}
              className="h-8 w-auto opacity-50 grayscale transition hover:opacity-90 hover:grayscale-0"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
