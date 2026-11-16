'use client'

import Link from 'next/link'
import Script from 'next/script'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

/**
 * Banner de consentimento (RGPD / LGPD) + Google Consent Mode v2.
 *
 * - O gtag arranca sempre com todos os tipos de consentimento em `denied`:
 *   o Google Analytics não coloca cookies e envia apenas pings agregados
 *   sem identificadores (modelação do Consent Mode).
 * - Ao aceitar, actualizamos o consentimento (cookies `_ga*`) e só então
 *   carregamos o script do Google AdSense.
 * - A escolha fica no cookie `whfdev-consent` (estritamente necessário).
 * - O rodapé dispara `CONSENT_OPEN_EVENT` para voltar a abrir o banner
 *   (retirar o consentimento tem de ser tão fácil como dá-lo).
 */

export const GA_ID = 'G-B4F22YPY1E'
const ADSENSE_CLIENT = 'ca-pub-2906000400105513'
const COOKIE = 'whfdev-consent'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180 // 6 meses
export const CONSENT_OPEN_EVENT = 'whfdev:consent-open'

type Choice = 'granted' | 'denied'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

// Corre inline, antes do gtag.js: define o default "denied" e, se o visitante
// já tinha aceitado numa visita anterior, repõe o consentimento de imediato.
const CONSENT_BOOTSTRAP = `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
window.gtag=gtag;
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
if(/(?:^|; )${COOKIE}=granted(?:;|$)/.test(document.cookie)){gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});}
gtag('js',new Date());
gtag('config','${GA_ID}');
`.trim()

function readChoice(): Choice | null {
  const m = document.cookie.match(
    new RegExp(`(?:^|; )${COOKIE}=(granted|denied)(?:;|$)`),
  )
  return m ? (m[1] as Choice) : null
}

function writeChoice(choice: Choice) {
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${COOKIE}=${choice}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`
}

function updateGoogleConsent(choice: Choice) {
  window.gtag?.('consent', 'update', {
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
    analytics_storage: choice,
  })
}

// Ao retirar o consentimento, elimina os cookies do Google Analytics que este
// site colocou (os de publicidade vivem em domínios da Google e só o navegador
// os pode apagar).
function clearAnalyticsCookies() {
  const host = location.hostname
  const domains = ['', host, `.${host}`, `.${host.replace(/^www\./, '')}`]
  document.cookie
    .split('; ')
    .map((c) => c.split('=')[0])
    .filter((name) => name === '_ga' || name.startsWith('_ga_'))
    .forEach((name) => {
      domains.forEach((d) => {
        document.cookie = `${name}=; Path=/; Max-Age=0${d ? `; Domain=${d}` : ''}`
      })
    })
}

export function Consent() {
  const t = useTranslations('Index.consent')
  const locale = useLocale()
  const [choice, setChoice] = useState<Choice | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const stored = readChoice()
    setChoice(stored)
    setOpen(stored === null)

    const onOpen = () => setOpen(true)
    window.addEventListener(CONSENT_OPEN_EVENT, onOpen)
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, onOpen)
  }, [])

  function decide(next: Choice) {
    writeChoice(next)
    updateGoogleConsent(next)
    if (next === 'denied') clearAnalyticsCookies()
    setChoice(next)
    setOpen(false)
  }

  return (
    <>
      <script
        id="consent-bootstrap"
        dangerouslySetInnerHTML={{ __html: CONSENT_BOOTSTRAP }}
      />
      <Script
        id="gtag-src"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      {choice === 'granted' && (
        <Script
          id="adsbygoogle"
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label={t('title')}
          className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-5"
        >
          <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-xl border border-rule-soft bg-canvas-elev/95 p-5 shadow-2xl backdrop-blur-xl sm:flex-row sm:items-center sm:gap-6">
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink">{t('title')}</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                {t('text')}{' '}
                <Link
                  href={`/${locale}/legal/cookies`}
                  className="underline underline-offset-2 transition hover:text-ink"
                >
                  {t('policy')}
                </Link>
              </p>
            </div>
            <div className="flex shrink-0 flex-col-reverse gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => decide('denied')}
                className="inline-flex h-10 items-center justify-center rounded-full border border-rule px-4 text-sm font-medium text-ink transition hover:bg-canvas-card"
              >
                {t('reject')}
              </button>
              <button
                type="button"
                onClick={() => decide('granted')}
                className="btn-glow inline-flex h-10 items-center justify-center rounded-full bg-coral px-4 text-sm font-medium text-white transition hover:bg-coral-soft"
              >
                {t('accept')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
