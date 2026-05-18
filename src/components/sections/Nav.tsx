'use client'

import { IconChevronDown } from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { startTransition, useEffect, useRef, useState } from 'react'

import LogoMark from '@/assets/logo-mark.svg'

const LOCALES = [
  { code: 'pt-BR', label: 'BR', currency: 'R$' },
  { code: 'pt-PT', label: 'PT', currency: '€' },
  { code: 'en', label: 'EN', currency: '$' },
  { code: 'fr', label: 'FR', currency: '€' },
] as const

export function Nav() {
  const t = useTranslations('Index.nav')
  const router = useRouter()
  const { locale } = useParams<{ locale: string }>()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function changeLanguage(next: string) {
    if (typeof document !== 'undefined') {
      const oneYear = 60 * 60 * 24 * 365
      document.cookie = `NEXT_LOCALE=${next}; Path=/; Max-Age=${oneYear}; SameSite=Lax`
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('@whfdev-idioms', next)
    }
    startTransition(() => router.replace(`/${next}`))
  }

  const links = [
    { name: t('work'), href: `/${locale ?? 'pt-BR'}#work` },
    { name: t('services'), href: `/${locale ?? 'pt-BR'}#services` },
    { name: t('process'), href: `/${locale ?? 'pt-BR'}#process` },
    { name: t('blog'), href: `/${locale ?? 'pt-BR'}/blog` },
    { name: t('contact'), href: `/${locale ?? 'pt-BR'}#contact` },
  ]

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-rule-soft bg-canvas/80 backdrop-blur-xl'
          : 'border-b border-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href={`/${locale}`} className="group flex items-center gap-3">
          <Image src={LogoMark} alt="WHFDEV" width={28} height={28} priority />
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted sm:block">
            Tech Consulting
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-ink-soft transition-colors hover:text-ink"
            >
              {l.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LangDropdown
            locale={locale ?? 'pt-BR'}
            onChange={changeLanguage}
            className="hidden md:inline-flex"
          />

          <Link
            href="#contact"
            className="group relative inline-flex h-9 items-center gap-2 rounded-full bg-ink px-3 text-xs font-medium text-canvas transition hover:bg-ink/90 sm:px-4 sm:text-sm"
          >
            {t('startProject')}
            <span className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>

          <button
            onClick={() => setOpen((s) => !s)}
            aria-label="Menu"
            className="grid h-9 w-9 place-items-center rounded-full border border-rule-soft md:hidden"
          >
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 right-0 top-0 h-px bg-ink transition-transform ${
                  open ? 'translate-y-1.5 rotate-45' : ''
                }`}
              />
              <span
                className={`absolute left-0 right-0 top-1.5 h-px bg-ink transition-opacity ${
                  open ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 right-0 h-px bg-ink transition-transform ${
                  open ? '-translate-y-1.5 -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-rule-soft bg-canvas/95 backdrop-blur-xl md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 sm:px-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2 text-base text-ink-soft hover:text-ink"
              >
                {l.name}
              </Link>
            ))}
            <div className="mt-2 border-t border-rule-soft pt-3">
              <LangDropdown
                locale={locale ?? 'pt-BR'}
                onChange={changeLanguage}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

function LangDropdown({
  locale,
  onChange,
  className = '',
}: {
  locale: string
  onChange: (l: string) => void
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const currentEntry = LOCALES.find((l) => l.code === locale) ?? LOCALES[0]

  return (
    <div ref={ref} className={`relative inline-flex ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-rule-soft bg-canvas-elev/60 px-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft transition hover:text-ink"
      >
        <span>{currentEntry.label}</span>
        <span className="text-ink-dim">·</span>
        <span className="text-ink-soft">{currentEntry.currency}</span>
        <IconChevronDown
          size={14}
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-11 z-50 w-32 overflow-hidden rounded-lg border border-rule-soft bg-canvas-elev/95 p-1 shadow-2xl backdrop-blur-xl"
        >
          {LOCALES.map((l) => {
            const active = l.code === locale
            return (
              <li key={l.code}>
                <button
                  role="option"
                  aria-selected={active}
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    onChange(l.code)
                  }}
                  className={[
                    'flex w-full items-center justify-between gap-2 rounded-md px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] transition',
                    active
                      ? 'bg-canvas-card text-ink'
                      : 'text-ink-soft hover:bg-canvas-card hover:text-ink',
                  ].join(' ')}
                >
                  <span className="flex items-center gap-1.5">
                    <span>{l.label}</span>
                    <span className="text-ink-dim">·</span>
                    <span>{l.currency}</span>
                  </span>
                  {active && (
                    <span className="h-1.5 w-1.5 rounded-full bg-coral" />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
