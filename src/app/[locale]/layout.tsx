import '@/styles/global.css'

import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import type { Metadata, Viewport } from 'next'
import { NextIntlClientProvider, useMessages } from 'next-intl'

import { SiteScripts } from '@/components/SiteScripts'

const SITE_URL = 'https://whfdev.com'

export const viewport: Viewport = {
  themeColor: '#0A0A0B',
  width: 'device-width',
  initialScale: 1,
}

type RootLayoutProps = {
  children: React.ReactNode
  params: { locale: string }
}

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Metadata {
  const titles: Record<string, string> = {
    pt: 'WHFDEV — Estúdio de produto digital · CRMs, dashboards, web e apps',
    en: 'WHFDEV — Digital product studio · CRMs, dashboards, web & apps',
    fr: 'WHFDEV — Studio de produit numérique · CRM, dashboards, web et apps',
  }
  const descriptions: Record<string, string> = {
    pt: '14 anos desenhando e desenvolvendo CRMs, dashboards, landing pages e aplicativos iOS e Android para marcas como SIC Notícias, Expresso e SPMS. Vamos tirar seu projeto do papel.',
    en: '14 years designing and shipping CRMs, dashboards, landing pages and iOS/Android apps for brands like SIC Notícias, Expresso and SPMS. Let’s ship your idea.',
    fr: '14 ans à concevoir et livrer des CRM, dashboards, landing pages et applications iOS/Android pour des marques comme SIC Notícias, Expresso et SPMS.',
  }

  const title = titles[locale] ?? titles.pt
  const description = descriptions[locale] ?? descriptions.pt

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: '%s · WHFDEV',
    },
    description,
    applicationName: 'WHFDEV',
    authors: [{ name: 'Wander Hungerbühler', url: SITE_URL }],
    creator: 'Wander Hungerbühler',
    publisher: 'WHFDEV Consultoria em Tecnologia LTDA',
    keywords: [
      'whfdev',
      'wander hungerbühler',
      'agência de desenvolvimento',
      'desenvolvimento de CRM',
      'criação de dashboard',
      'landing page',
      'aplicativo iOS',
      'aplicativo Android',
      'desenvolvimento web',
      'consultoria em tecnologia',
      'product studio',
      'next.js',
      'react native',
      'rio de janeiro',
      'lisboa',
    ],
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        'pt-BR': `${SITE_URL}/pt`,
        'en-US': `${SITE_URL}/en`,
        'fr-FR': `${SITE_URL}/fr`,
        'x-default': `${SITE_URL}/pt`,
      },
    },
    openGraph: {
      type: 'website',
      url: `${SITE_URL}/${locale}`,
      siteName: 'WHFDEV',
      title,
      description,
      locale:
        locale === 'pt' ? 'pt_BR' : locale === 'fr' ? 'fr_FR' : 'en_US',
      alternateLocale: ['pt_BR', 'en_US', 'fr_FR'].filter(
        (l) =>
          l !==
          (locale === 'pt' ? 'pt_BR' : locale === 'fr' ? 'fr_FR' : 'en_US'),
      ),
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'WHFDEV — Software com bom gosto, entregue no prazo.',
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@whfdev',
      site: '@whfdev',
      images: ['/og-image.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    icons: {
      icon: '/whfdev.png',
      shortcut: '/whfdev.png',
      apple: '/whfdev.png',
    },
    category: 'technology',
    other: {
      'msapplication-TileColor': '#0A0A0B',
      'apple-mobile-web-app-status-bar-style': 'black',
      MobileOptimized: '320',
      HandheldFriendly: 'True',
      'reply-to': 'talkto@whfdev.com',
      'business:contact_data:email': 'talkto@whfdev.com',
    },
  }
}

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<RootLayoutProps>) {
  const messages = useMessages()

  return (
    <html
      lang={locale}
      className={`${GeistSans.variable} ${GeistMono.variable} bg-canvas`}
    >
      <NextIntlClientProvider messages={messages}>
        <body className="font-sans antialiased">
          {children}
          <SiteScripts />
        </body>
      </NextIntlClientProvider>
    </html>
  )
}
