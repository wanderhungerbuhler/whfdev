import type { MetadataRoute } from 'next'

import { getAllPosts } from '@/lib/blog'

const SITE_URL = 'https://whfdev.com'
const LOCALES = ['pt-BR', 'pt-PT', 'en', 'fr'] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const homeLanguages = Object.fromEntries(
    LOCALES.map((l) => [l, `${SITE_URL}/${l}`]),
  )
  const blogLanguages = Object.fromEntries(
    LOCALES.map((l) => [l, `${SITE_URL}/${l}/blog`]),
  )

  const homes: MetadataRoute.Sitemap = LOCALES.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 1.0,
    alternates: { languages: homeLanguages },
  }))

  const blogs: MetadataRoute.Sitemap = LOCALES.map((locale) => ({
    url: `${SITE_URL}/${locale}/blog`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
    alternates: { languages: blogLanguages },
  }))

  const posts: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    getAllPosts(locale).map((p) => {
      const languages: Record<string, string> = {}
      if (p.alternates) {
        for (const [loc, slug] of Object.entries(p.alternates)) {
          languages[loc] = `${SITE_URL}/${loc}/blog/${slug}`
        }
      }
      return {
        url: `${SITE_URL}/${locale}/blog/${p.slug}`,
        lastModified: new Date(p.date),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
        alternates: { languages },
      }
    }),
  )

  return [...homes, ...blogs, ...posts]
}
