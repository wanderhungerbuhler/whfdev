import fs from 'node:fs'
import path from 'node:path'

import matter from 'gray-matter'

export type MdxFile<T> = { content: string; data: T }

export function loadMdxFile<T = Record<string, unknown>>(
  dir: string,
  locale: string,
  slug: string,
): MdxFile<T> | null {
  const fp = path.join(process.cwd(), 'content', dir, locale, `${slug}.mdx`)
  if (!fs.existsSync(fp)) return null
  const raw = fs.readFileSync(fp, 'utf8')
  const { data, content } = matter(raw)
  return { content, data: data as T }
}
