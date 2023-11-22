import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Head from './head'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WHFdev',
  description: 'Welcome to my profile and portfolio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head />
      <body className={inter.className}>{children}</body>
    </html>
  )
}
