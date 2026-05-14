import '@/styles/global.css'

import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import type { Metadata, Viewport } from 'next'
import { NextIntlClientProvider, useMessages } from 'next-intl'

import { SiteScripts } from '@/components/SiteScripts'
import {
  buildOrganizationSchema,
  buildWebSiteSchema,
  pickDescription,
  pickTitle,
  SITE_URL,
} from '@/lib/seo'

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
  const title = pickTitle(locale)
  const description = pickDescription(locale)

  const ogLocaleMap: Record<string, string> = {
    'pt-BR': 'pt_BR',
    'pt-PT': 'pt_PT',
    en: 'en_US',
    fr: 'fr_FR',
  }
  const ogLocale = ogLocaleMap[locale] ?? 'pt_BR'

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
        'pt-BR': `${SITE_URL}/pt-BR`,
        'pt-PT': `${SITE_URL}/pt-PT`,
        'en-US': `${SITE_URL}/en`,
        'fr-FR': `${SITE_URL}/fr`,
        'x-default': `${SITE_URL}/pt-BR`,
      },
    },
    openGraph: {
      type: 'website',
      url: `${SITE_URL}/${locale}`,
      siteName: 'WHFDEV',
      title,
      description,
      locale: ogLocale,
      alternateLocale: ['pt_BR', 'pt_PT', 'en_US', 'fr_FR'].filter(
        (l) => l !== ogLocale,
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
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/whfdev.png', type: 'image/png' },
      ],
      shortcut: '/favicon.svg',
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

  const organizationSchema = buildOrganizationSchema(
    locale,
    pickDescription(locale),
  )
  const websiteSchema = buildWebSiteSchema(locale)

  return (
    <html
      lang={locale}
      className={`${GeistSans.variable} ${GeistMono.variable} bg-canvas`}
    >
      <NextIntlClientProvider messages={messages}>
        <body className="font-sans antialiased">
          {children}
          <SiteScripts />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationSchema),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(websiteSchema),
            }}
          />
        </body>
      </NextIntlClientProvider>
    </html>
  )
}
