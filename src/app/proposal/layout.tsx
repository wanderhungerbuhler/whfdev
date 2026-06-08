import '@/styles/global.css'

import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: '#0A0A0B',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'Proposta · WHFDEV',
  description: 'Proposta comercial da WHFDEV.',
  // Propostas comerciais: fora dos índices de busca.
  robots: { index: false, follow: false },
}

export default function ProposalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="pt-BR"
      className={`${GeistSans.variable} ${GeistMono.variable} bg-canvas`}
    >
      <body className="min-h-screen bg-canvas text-ink antialiased">
        {children}
      </body>
    </html>
  )
}
