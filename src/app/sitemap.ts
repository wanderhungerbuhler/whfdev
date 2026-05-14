import type { MetadataRoute } from 'next'

const SITE_URL = 'https://whfdev.com'
const LOCALES = ['pt-BR', 'pt-PT', 'en', 'fr'] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const languages = Object.fromEntries(
    LOCALES.map((l) => [l, `${SITE_URL}/${l}`]),
  )

  return LOCALES.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 1.0,
    alternates: { languages },
  }))
}
