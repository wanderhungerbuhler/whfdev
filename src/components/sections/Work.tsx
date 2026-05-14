'use client'

import { IconArrowUpRight } from '@tabler/icons-react'
import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import ExpressoSvg from '@/assets/expresso.svg'
import SicNoticiasSvg from '@/assets/sicnoticias.svg'
import ZionStorySvg from '@/assets/zionstory.svg'
import { Reveal } from '@/components/ui/Reveal'
import { BRANDS } from '@/data/brands'

import { SectionHeader } from './SectionHeader'

type Case = {
  title: string
  role: string
  hint: string
  href: string
  // Either a full preview image (cover) or a centered logo over a gradient
  preview?: string
  logo?: StaticImageData
  gradient: string
}

const featured: Case[] = [
  {
    title: 'Gestal',
    role: 'SaaS · Plataforma para alojamento local',
    hint: 'Check-in digital, AIMA, faturação e taxas turísticas para Portugal.',
    href: 'https://gestal.app',
    preview: '/gestal-app.png',
    gradient: 'from-stone-100/10 to-amber-200/5',
  },
  {
    title: 'Ria Casa',
    role: 'Web · Marca de serviços de limpeza',
    hint: 'Limpeza doméstica profissional em Aveiro, Portugal.',
    href: 'https://riacasa.pt',
    preview: '/riacasa.png',
    gradient: 'from-emerald-700/20 to-emerald-400/5',
  },
  {
    title: 'Futebolada',
    role: 'iOS · Android · App nativo',
    hint: 'Encontre as melhores partidas de futebol entre amigos.',
    href: 'https://futebolada.app',
    preview: '/futebolada.png',
    gradient: 'from-emerald-500/15 to-neutral-900/40',
  },
]

const selected: Case[] = [
  {
    title: 'SIC Notícias',
    role: 'iOS · Android · App Store',
    hint: 'Veículo de notícias #1 em Portugal.',
    href: 'https://apps.apple.com/pt/app/sic-not%C3%ADcias/id1478878799?l=en-GB',
    logo: SicNoticiasSvg,
    gradient: 'from-coral-orange/15 to-coral/5',
  },
  {
    title: 'Zion Story',
    role: 'App nativo · App Store + Play Store',
    hint: 'Plataforma de conteúdo religioso.',
    href: 'https://apps.apple.com/pt/app/zion-story/id6476232761?l=en-GB',
    logo: ZionStorySvg,
    gradient: 'from-coral/15 to-coral-pink/5',
  },
  {
    title: 'Expresso',
    role: 'Aplicativo de leitura · iOS',
    hint: 'Semanário de referência em Portugal.',
    href: 'https://apps.apple.com/pt/app/expresso/id416836970?l=en-GB',
    logo: ExpressoSvg,
    gradient: 'from-coral-pink/15 to-coral-orange/5',
  },
]

function CaseCard({ c }: { c: Case }) {
  return (
    <Link
      href={c.href}
      target="_blank"
      rel="noreferrer"
      className="card-gradient group relative flex flex-col overflow-hidden transition hover:bg-canvas-card"
    >
      <div className="relative h-56 w-full overflow-hidden border-b border-rule-soft">
        <div
          className={`absolute inset-0 -z-10 bg-gradient-to-br ${c.gradient} opacity-90`}
        />
        <div className="bg-grid-pattern mask-fade-y absolute inset-0 -z-10 opacity-40" />

        {c.preview ? (
          <Image
            src={c.preview}
            alt={c.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
          />
        ) : c.logo ? (
          <Image
            src={c.logo}
            alt={c.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-contain p-5 opacity-95"
          />
        ) : null}

        {c.preview && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canvas-elev/80 via-transparent to-transparent" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold tracking-tight">{c.title}</h3>
          <IconArrowUpRight
            size={18}
            className="shrink-0 text-ink-dim transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-coral"
          />
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-muted">
          {c.role}
        </p>
        <p className="mt-1 text-sm text-ink-soft">{c.hint}</p>
      </div>
    </Link>
  )
}

export function Work() {
  const t = useTranslations('Index.work')

  return (
    <section id="work" className="relative border-b border-rule-soft py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeader
            eyebrow={t('eyebrow')}
            title={t('title')}
            lede={t('lede')}
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {featured.map((c) => (
              <CaseCard key={c.title} c={c} />
            ))}
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-16 flex items-center gap-3">
            <span className="h-px flex-1 bg-rule-soft" />
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
              {t('moreLabel')}
            </span>
            <span className="h-px flex-1 bg-rule-soft" />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            {selected.map((c) => (
              <CaseCard key={c.title} c={c} />
            ))}
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-20 flex items-center gap-3">
            <span className="h-px flex-1 bg-rule-soft" />
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
              {t('clientsLabel')}
            </span>
            <span className="h-px flex-1 bg-rule-soft" />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {BRANDS.map((b) => (
              <li
                key={b.alt}
                title={b.alt}
                className="card-gradient flex h-24 items-center justify-center p-6 transition hover:bg-canvas-card sm:h-28"
              >
                <Image
                  src={b.src}
                  alt={b.alt}
                  quality={100}
                  className="max-h-12 w-auto max-w-full object-contain opacity-70 grayscale transition group-hover:opacity-100 hover:opacity-100 hover:grayscale-0 sm:max-h-14"
                />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
