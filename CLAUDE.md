# WHFDEV

Portfolio e site institucional da **WHFDEV Consultoria em Tecnologia LTDA** — agência fundada por Wander Hungerbühler, com 14 anos de experiência em desenvolvimento de produtos digitais (CRMs, dashboards, landing pages, apps iOS/Android, web apps e e-commerce).

CNPJ: 46.185.304/0001-71
Contato: talkto@whfdev.com

## Stack

- **Next.js 14** (App Router) com TypeScript
- **next-intl** para i18n (pt, en, fr) — locale em segmento de rota `[locale]`
- **Tailwind CSS** + tokens HSL via `globals.css`
- **Framer Motion** para animações
- **Tabler Icons** + **Phosphor Icons**
- **pnpm** como gerenciador (lockfile `pnpm-lock.yaml` é o ativo; `yarn.lock` é resquício antigo)

## Estrutura

```
src/
  app/
    [locale]/              # Páginas por idioma (pt|en|fr)
      layout.tsx           # Metadata + i18n provider
      page.tsx             # Home (hero, serviços, cases, processo, contato)
      head.tsx             # Tags de SEO/OG/Twitter
    layout.tsx             # Root shell (apenas pass-through)
  components/
    ui/                    # Componentes reutilizáveis (Menu, Button, etc)
    sections/              # Seções da home (Hero, Services, Cases, Contact...)
  assets/                  # SVGs (logos de clientes, bandeiras, ícones)
  i18n.ts                  # Config next-intl
  middleware.ts            # Rotas locale-aware
messages/                  # JSON de traduções por idioma
public/                    # Estáticos (og-image, favicon, etc)
```

## Comandos

```bash
pnpm dev      # Dev server (localhost:3000)
pnpm build    # Build de produção
pnpm start    # Servir build
pnpm lint     # ESLint
```

## Convenções de código

- **Imports**: organizados via `eslint-plugin-simple-import-sort` (não reordenar manualmente).
- **Paths**: usar alias `@/*` para `src/*` (ver `tsconfig.json`).
- **Componentes client**: marcar com `'use client'` no topo apenas quando necessário (interatividade, hooks).
- **i18n**: toda string visível ao usuário deve vir de `messages/*.json` via `useTranslations()`. Adicionar nova chave nos três arquivos (pt/en/fr) ao mesmo tempo.
- **Imagens**: usar `next/image` com `quality={100}` para logos.

## Padrão de commits

- Use mensagens curtas no formato `<tipo>: <descrição imperativa>` (ex: `feat: add contact form`, `fix: typo in hero copy`, `chore: bump deps`).
- **NÃO incluir Claude como co-author**. Não adicionar trailers `Co-Authored-By: Claude …` nem `Generated with Claude Code`. Commits devem aparecer apenas com a autoria do desenvolvedor.

## SEO

- Metadata canônica fica em `src/app/[locale]/layout.tsx` (`generateMetadata`).
- Tags estendidas (business, theme-color, scripts de tracking) ficam em `src/app/[locale]/head.tsx`.
- OG image padrão: `/og-image.png` (1200×630).
- GTM ID atual: `G-B4F22YPY1E`.

## Contato (form)

O formulário da home compõe um e-mail estruturado e envia para `talkto@whfdev.com`. Campos: nome, e-mail, tipo de projeto (CRM, dashboard, landing page, iOS, Android, web app, e-commerce, outro), orçamento estimado, prazo e descrição. Para mudar o destino, ajustar em `src/components/sections/Contact.tsx`.
