'use client'

import {
  IconAppWindow,
  IconBrandAndroid,
  IconBrandApple,
  IconChartBar,
  IconCode,
  IconDatabaseCog,
  IconRocket,
  IconShoppingBag,
} from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'

import { Reveal } from '@/components/ui/Reveal'

import { SectionHeader } from './SectionHeader'

export function Services() {
  const t = useTranslations('Index.services')
  const it = useTranslations('Index.services.items')

  const items: { key: string; icon: ReactNode }[] = [
    { key: 'crm', icon: <IconDatabaseCog size={22} /> },
    { key: 'dashboard', icon: <IconChartBar size={22} /> },
    { key: 'landing', icon: <IconRocket size={22} /> },
    { key: 'ios', icon: <IconBrandApple size={22} /> },
    { key: 'android', icon: <IconBrandAndroid size={22} /> },
    { key: 'web', icon: <IconAppWindow size={22} /> },
    { key: 'ecommerce', icon: <IconShoppingBag size={22} /> },
    { key: 'consult', icon: <IconCode size={22} /> },
  ]

  return (
    <section id="services" className="border-b border-rule-soft py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeader
            eyebrow={t('eyebrow')}
            title={t('title')}
            lede={t('lede')}
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ key, icon }, idx) => (
            <Reveal
              key={key}
              as="article"
              delay={idx * 0.05}
              className="card-gradient group relative flex h-full flex-col gap-3 p-6 transition hover:bg-canvas-card"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-md border border-rule-soft bg-canvas-card text-coral transition group-hover:text-coral-soft">
                  {icon}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-dim">
                  {String(idx + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="mt-2 text-base font-semibold tracking-tight text-ink">
                {it(`${key}.title`)}
              </h3>
              <p className="text-sm leading-relaxed text-ink-muted">
                {it(`${key}.desc`)}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
