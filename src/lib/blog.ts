import fs from 'node:fs'
import path from 'node:path'

import matter from 'gray-matter'
import readingTime from 'reading-time'

export type PostFrontmatter = {
  title: string
  description: string
  date: string
  tags?: string[]
  cover?: string
  alternates?: Record<string, string>
}

export type PostMeta = PostFrontmatter & {
  slug: string
  locale: string
  readingMinutes: number
}

export type Post = PostMeta & {
  content: string
}

const ROOT = path.join(process.cwd(), 'content', 'blog')

function localeDir(locale: string) {
  return path.join(ROOT, locale)
}

export function getAllSlugs(locale: string): string[] {
  const dir = localeDir(locale)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
}

export function getPostBySlug(locale: string, slug: string): Post | null {
  const fp = path.join(localeDir(locale), `${slug}.mdx`)
  if (!fs.existsSync(fp)) return null
  const raw = fs.readFileSync(fp, 'utf8')
  const { data, content } = matter(raw)
  const fm = data as PostFrontmatter
  return {
    ...fm,
    slug,
    locale,
    readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
    content,
  }
}

export function getAllPosts(locale: string): PostMeta[] {
  const metas: PostMeta[] = []
  for (const slug of getAllSlugs(locale)) {
    const p = getPostBySlug(locale, slug)
    if (!p) continue
    metas.push({
      title: p.title,
      description: p.description,
      date: p.date,
      tags: p.tags,
      cover: p.cover,
      alternates: p.alternates,
      slug: p.slug,
      locale: p.locale,
      readingMinutes: p.readingMinutes,
    })
  }
  return metas.sort((a, b) => (a.date < b.date ? 1 : -1))
}
