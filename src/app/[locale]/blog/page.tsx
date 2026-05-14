import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

import { Footer } from '@/components/sections/Footer'
import { Nav } from '@/components/sections/Nav'
import { getAllPosts } from '@/lib/blog'
import { SITE_URL } from '@/lib/seo'

type Props = { params: { locale: string } }

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Index.blog' })
  return {
    title: `${t('title')} · WHFDEV`,
    description: t('lede'),
    alternates: {
      canonical: `${SITE_URL}/${locale}/blog`,
      languages: {
        'pt-BR': `${SITE_URL}/pt-BR/blog`,
        'pt-PT': `${SITE_URL}/pt-PT/blog`,
        'en-US': `${SITE_URL}/en/blog`,
        'fr-FR': `${SITE_URL}/fr/blog`,
        'x-default': `${SITE_URL}/pt-BR/blog`,
      },
    },
  }
}

export default async function BlogIndex({ params: { locale } }: Props) {
  const posts = getAllPosts(locale)
  const t = await getTranslations({ locale, namespace: 'Index.blog' })
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <>
      <Nav />
      <main className="bg-canvas">
        <section className="border-b border-rule-soft pt-32">
          <div className="mx-auto max-w-4xl px-6 pb-16">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-coral">
              {t('eyebrow')}
            </p>
            <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tighter2 sm:text-5xl">
              {t('title')}
            </h1>
            <p className="mt-4 max-w-2xl text-pretty text-base text-ink-muted">
              {t('lede')}
            </p>
          </div>
        </section>

        <section className="border-b border-rule-soft py-16">
          <div className="mx-auto max-w-4xl px-6">
            {posts.length === 0 ? (
              <p className="text-ink-muted">{t('empty')}</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {posts.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/${locale}/blog/${p.slug}`}
                      className="card-gradient group flex flex-col gap-3 p-6 transition hover:bg-canvas-card"
                    >
                      <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-dim">
                        <time dateTime={p.date}>
                          {dateFormatter.format(new Date(p.date))}
                        </time>
                        <span className="text-rule">·</span>
                        <span>
                          {p.readingMinutes} {t('minRead')}
                        </span>
                        {p.tags && p.tags.length > 0 && (
                          <>
                            <span className="text-rule">·</span>
                            <span>{p.tags.join(', ')}</span>
                          </>
                        )}
                      </div>
                      <h2 className="text-2xl font-semibold tracking-tight text-ink transition group-hover:text-coral">
                        {p.title}
                      </h2>
                      <p className="text-sm leading-relaxed text-ink-muted">
                        {p.description}
                      </p>
                      <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-coral">
                        {t('read')}
                        <span className="transition-transform group-hover:translate-x-0.5">
                          →
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
