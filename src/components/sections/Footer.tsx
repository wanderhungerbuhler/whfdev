'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import LogoMark from '@/assets/logo-mark.svg'

export function Footer() {
  const t = useTranslations('Index.footer')
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden">
      <div className="beam-top absolute inset-x-0 top-0 h-px" />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Image src={LogoMark} alt="WHFDEV" width={28} height={28} />
            <span className="flex items-baseline gap-2">
              <span className="text-sm font-semibold tracking-tight text-ink">
                whfdev
              </span>
              <span className="h-3 w-px bg-rule" />
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
                Tech Consulting
              </span>
            </span>
          </div>
          <p className="max-w-sm text-sm text-ink-muted">{t('tagline')}</p>
        </div>

        <div className="flex flex-col gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-dim">
            Navegação
          </span>
          <Link href="#work" className="text-sm text-ink-soft hover:text-ink">
            Trabalho
          </Link>
          <Link href="#services" className="text-sm text-ink-soft hover:text-ink">
            Serviços
          </Link>
          <Link href="#process" className="text-sm text-ink-soft hover:text-ink">
            Processo
          </Link>
          <Link href="#contact" className="text-sm text-ink-soft hover:text-ink">
            Contato
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-dim">
            Contato
          </span>
          <Link
            href="mailto:talkto@whfdev.com"
            className="text-sm text-ink-soft hover:text-ink"
          >
            talkto@whfdev.com
          </Link>
        </div>
      </div>

      <div className="border-t border-rule-soft">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-6 py-6 text-xs text-ink-dim sm:flex-row sm:items-center">
          <p>
            © {year} {t('company')}
          </p>
          <p>{t('rights')}</p>
        </div>
      </div>
    </footer>
  )
}
