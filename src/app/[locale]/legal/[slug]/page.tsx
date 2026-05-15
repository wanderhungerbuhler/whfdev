import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'

import { Footer } from '@/components/sections/Footer'
import { Nav } from '@/components/sections/Nav'
import { loadMdxFile } from '@/lib/mdx'
import { SITE_URL } from '@/lib/seo'

type Props = { params: { locale: string; slug: string } }

type LegalFrontmatter = {
  title: string
  description: string
  updatedAt: string
}

const ALLOWED_SLUGS = ['privacy', 'terms', 'notice', 'cookies'] as const

export async function generateMetadata({
  params: { locale, slug },
}: Props): Promise<Metadata> {
  const doc = loadMdxFile<LegalFrontmatter>('legal', locale, slug)
  if (!doc) return {}

  return {
    title: doc.data.title,
    description: doc.data.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/legal/${slug}`,
      languages: {
        'pt-BR': `${SITE_URL}/pt-BR/legal/${slug}`,
        'pt-PT': `${SITE_URL}/pt-PT/legal/${slug}`,
        'en-US': `${SITE_URL}/en/legal/${slug}`,
        'fr-FR': `${SITE_URL}/fr/legal/${slug}`,
        'x-default': `${SITE_URL}/pt-BR/legal/${slug}`,
      },
    },
    robots: { index: true, follow: true },
  }
}

export default function LegalPage({ params: { locale, slug } }: Props) {
  if (!ALLOWED_SLUGS.includes(slug as (typeof ALLOWED_SLUGS)[number])) {
    notFound()
  }

  const doc = loadMdxFile<LegalFrontmatter>('legal', locale, slug)
  if (!doc) notFound()

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <>
      <Nav />
      <main className="bg-canvas">
        <article className="border-b border-rule-soft pt-32">
          <div className="mx-auto max-w-3xl px-6 pb-10">
            <h1 className="text-balance text-4xl font-semibold tracking-tighter2 sm:text-5xl">
              {doc.data.title}
            </h1>
            <p className="mt-4 text-pretty text-base text-ink-muted">
              {doc.data.description}
            </p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-dim">
              {dateFormatter.format(new Date(doc.data.updatedAt))}
            </p>
          </div>

          <div className="mx-auto max-w-3xl px-6 pb-24">
            <div className="prose prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-h2:mt-12 prose-h2:text-2xl prose-h3:text-xl prose-p:text-ink-soft prose-a:text-coral prose-a:no-underline hover:prose-a:underline prose-strong:text-ink prose-li:marker:text-coral prose-ol:text-ink-soft prose-ul:text-ink-soft">
              <MDXRemote source={doc.content} />
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
