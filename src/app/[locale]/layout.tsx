import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/global.css'
import Head from './head'
import { NextIntlClientProvider, useMessages } from 'next-intl'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WHFdev | Welcome to my profile and portfolio',
  description: 'Welcome to my profile and portfolio',
}

type RootLayoutProps = {
  children: React.ReactNode
  params: { locale: string }
}

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<RootLayoutProps>) {
  const messages = useMessages()

  return (
    <html lang={locale}>
      <NextIntlClientProvider messages={messages}>
        <Head />
        <body className={inter.className}>{children}</body>
      </NextIntlClientProvider>
    </html>
  )
}
