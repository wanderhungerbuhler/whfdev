import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { MDXRemote } from 'next-mdx-remote/rsc'

import { Footer } from '@/components/sections/Footer'
import { Nav } from '@/components/sections/Nav'
import { getPostBySlug } from '@/lib/blog'
import { SITE_URL } from '@/lib/seo'

type Props = { params: { locale: string; slug: string } }

export async function generateMetadata({
  params: { locale, slug },
}: Props): Promise<Metadata> {
  const post = getPostBySlug(locale, slug)
  if (!post) return {}

  const url = `${SITE_URL}/${locale}/blog/${slug}`
  const languages: Record<string, string> = {}
  if (post.alternates) {
    for (const [loc, altSlug] of Object.entries(post.alternates)) {
      languages[loc] = `${SITE_URL}/${loc}/blog/${altSlug}`
    }
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      tags: post.tags,
      images: post.cover ? [post.cover] : ['/og-image.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.cover ? [post.cover] : ['/og-image.png'],
    },
  }
}

export default async function BlogPost({ params: { locale, slug } }: Props) {
  const post = getPostBySlug(locale, slug)
  if (!post) notFound()

  const t = await getTranslations({ locale, namespace: 'Index.blog' })
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    inLanguage: locale,
    author: {
      '@type': 'Person',
      name: 'Wander Hungerbühler',
      url: SITE_URL,
    },
    publisher: { '@id': `${SITE_URL}#organization` },
    mainEntityOfPage: `${SITE_URL}/${locale}/blog/${slug}`,
    keywords: post.tags?.join(', '),
  }

  return (
    <>
      <Nav />
      <main className="bg-canvas">
        <article className="border-b border-rule-soft pt-24 sm:pt-32">
          <div className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
            <Link
              href={`/${locale}/blog`}
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-coral hover:text-coral-soft sm:text-[11px] sm:tracking-[0.22em]"
            >
              ← {t('back')}
            </Link>
            <h1 className="mt-6 text-balance text-3xl font-semibold tracking-tighter2 sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-4 text-pretty text-sm text-ink-muted sm:text-base">
              {post.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-dim">
              <time dateTime={post.date}>
                {dateFormatter.format(new Date(post.date))}
              </time>
              <span className="text-rule">·</span>
              <span>
                {post.readingMinutes} {t('minRead')}
              </span>
              {post.tags && post.tags.length > 0 && (
                <>
                  <span className="text-rule">·</span>
                  <span>{post.tags.join(', ')}</span>
                </>
              )}
            </div>
          </div>

          <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 sm:pb-24">
            <div className="prose prose-sm prose-invert max-w-none break-words prose-headings:font-semibold prose-headings:tracking-tight prose-h2:mt-10 prose-h2:text-xl prose-h3:text-lg prose-p:text-ink-soft prose-a:text-coral prose-a:no-underline hover:prose-a:underline prose-strong:text-ink prose-code:rounded prose-code:bg-canvas-elev prose-code:px-1.5 prose-code:py-0.5 prose-code:text-ink prose-code:before:content-none prose-code:after:content-none prose-pre:overflow-x-auto prose-pre:rounded-lg prose-pre:border prose-pre:border-rule-soft prose-pre:bg-canvas-elev prose-ol:text-ink-soft prose-ul:text-ink-soft prose-li:marker:text-coral prose-blockquote:border-l-coral prose-blockquote:text-ink-muted sm:prose-base sm:prose-h2:mt-12 sm:prose-h2:text-2xl sm:prose-h3:text-xl">
              <MDXRemote source={post.content} />
            </div>

            <div className="mt-12 rounded-lg border border-coral/30 bg-coral/10 p-5 sm:mt-16 sm:p-6">
              <h3 className="text-lg font-semibold text-ink">{t('ctaTitle')}</h3>
              <p className="mt-2 text-sm text-ink-soft">{t('ctaLede')}</p>
              <Link
                href={`/${locale}#contact`}
                className="mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-coral px-5 text-sm font-medium text-white transition hover:bg-coral-soft"
              >
                {t('ctaButton')} →
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </>
  )
}
