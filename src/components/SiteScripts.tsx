import { Analytics } from '@vercel/analytics/next'

import { Consent } from '@/components/Consent'

/**
 * Scripts de terceiros das páginas públicas.
 *
 * - Vercel Web Analytics: sem cookies nem identificadores persistentes,
 *   por isso corre sempre (não precisa de consentimento).
 * - Google Analytics + Google AdSense: geridos por <Consent /> com
 *   Consent Mode v2 — só colocam cookies depois de o visitante aceitar.
 *
 * Qualquer tracker novo tem de passar pelo mesmo banner e ser descrito em
 * content/legal/*\/cookies.mdx, privacy.mdx e notice.mdx (4 idiomas).
 * Os dados estruturados (JSON-LD) ficam em src/app/[locale]/layout.tsx.
 */
export function SiteScripts() {
  return (
    <>
      <Analytics />
      <Consent />
    </>
  )
}
