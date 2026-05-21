'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

export function Footer() {
  const t = useTranslations('Index.footer')
  const nav = useTranslations('Index.nav')
  const locale = useLocale()
  const year = new Date().getFullYear()

  const navLinks = [
    { href: `/${locale}#work`, label: nav('work') },
    { href: `/${locale}#services`, label: nav('services') },
    { href: `/${locale}#process`, label: nav('process') },
    { href: `/${locale}/blog`, label: nav('blog') },
  ]

  const legalLinks = [
    { href: `/${locale}/legal/privacy`, label: t('privacy') },
    { href: `/${locale}/legal/terms`, label: t('terms') },
    { href: `/${locale}/legal/notice`, label: t('notice') },
    { href: `/${locale}/legal/cookies`, label: t('cookies') },
  ]

  return (
    <footer className="relative overflow-hidden">
      <div className="beam-top absolute inset-x-0 top-0 h-px" />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-2 sm:gap-10 sm:px-6 sm:py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-4 sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-3">
            <Image
              src="/whfdev.png"
              alt="WHFDEV"
              width={28}
              height={28}
              quality={100}
              className="rounded-md"
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
              Tech Consulting
            </span>
          </div>
          <p className="max-w-sm text-sm text-ink-muted">{t('tagline')}</p>
        </div>

        <div className="flex flex-col gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-dim">
            {t('navTitle')}
          </span>
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-ink-soft hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-dim">
            {t('legalTitle')}
          </span>
          {legalLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-ink-soft hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-rule-soft">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-4 py-6 text-xs text-ink-dim sm:flex-row sm:items-center sm:px-6">
          <p>
            © {year} {t('company')}
          </p>
          <p>{t('rights')}</p>
        </div>
      </div>
    </footer>
  )
}
