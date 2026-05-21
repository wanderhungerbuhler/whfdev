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

## Painel /admin

Painel privado para criar, fazer preview e enviar **propostas comerciais em PDF** (via Resend) para clientes. Fica fora do `[locale]` (não traduzido).

### Stack do admin
- **NextAuth v5** (Auth.js) — GitHub OAuth, sessão em database
- **Drizzle ORM + Postgres** — Supabase Postgres via Transaction pooler
- **Supabase Storage** — bucket privado `proposal-attachments` pra arquivos anexos (PDF + imagens + outros)
- **Resend** — envio com múltiplos anexos

### Fluxo (upload-driven)

Você cria uma proposta com `Cliente + e-mail + assunto + mensagem`. O PDF da proposta é gerado **fora** do admin (skill CLI, Figma export, etc) e você sobe via drag-drop. Pode subir múltiplos arquivos (PDFs, mockups, catálogos). Antes de enviar, vê o preview do e-mail e de cada anexo. Clica enviar → todos os anexos vão junto via Resend → tracking de open/click no painel do Resend (link "Resend →" no histórico).

### Estrutura
```
src/
  app/
    admin/
      layout.tsx              # Nav, brand, sign-out
      page.tsx                # Lista de propostas
      sign-in/page.tsx        # GitHub OAuth
      proposals/
        new/page.tsx          # Form de criação
        [id]/
          page.tsx            # Preview PDF + email + envio + histórico
          edit/page.tsx       # Form de edição
    api/
      auth/[...nextauth]/     # Handler NextAuth
      admin/proposals/        # CRUD + /pdf + /email-preview + /send + /sends
  components/admin/
    ProposalForm.tsx          # Form simplificado (Cliente + Assunto + Mensagem)
    ProposalDetail.tsx        # Preview e-mail + anexos + send controls + histórico
    AttachmentsPanel.tsx      # Drag-drop, signed upload pra Supabase Storage
  lib/
    auth.ts                   # NextAuth config (allowlist via ADMIN_EMAILS)
    admin-guard.ts            # requireAdmin (API) / requireAdminPage (RSC)
    db/                       # Drizzle schema + client
    email/                    # Resend client + template HTML branded
    supabase/storage.ts       # Signed upload/download URLs, bucket helpers
drizzle/migrations/
  0001_init.sql               # Schema inicial
  0002_attachments.sql        # attachments table + brief nullable
```

Sobre `@react-pdf/renderer` no projeto: foi instalado mas **não é mais usado** pelo admin (upload-driven). A skill CLI em `~/.claude/skills/whfdev-proposal/` ainda usa pra gerar PDFs por conversa.

### Setup local

1. **Supabase**: criar projeto, copiar connection string (Transaction pooler, porta 6543) e colar em `DATABASE_URL`. Em Settings → API: copiar `Project URL` pra `SUPABASE_URL` e `service_role` key pra `SUPABASE_SERVICE_ROLE_KEY`. **Cuidado**: se a senha do banco tiver caracteres especiais (`@`, `:`, `/`, `?`, `#`, `&`, `%`), precisam de URL-encoding (`@` vira `%40`, etc.). Opcionalmente, defina `DIRECT_URL` apontando para a conexão direta (porta 5432) — usado só pelo `drizzle-kit` em migrations locais.
2. **SQL**: rodar `drizzle/migrations/0001_init.sql` e depois `0002_attachments.sql` no SQL Editor do Supabase.
2a. **Storage**: Storage → New bucket → nome `proposal-attachments` → marcar **Private** → Save.
3. **GitHub OAuth**: Settings → Developer settings → OAuth Apps. Cada OAuth App aceita **um único** Callback URL, então crie **duas**:
   - `whfdev-admin (dev)` → `http://localhost:3000/api/auth/callback/github` → use no `.env.local`
   - `whfdev-admin (prod)` → `https://whfdev.com/api/auth/callback/github` → use nas env vars do deploy

   Cada uma com seu próprio `GITHUB_ID`/`GITHUB_SECRET`.
4. **AUTH_SECRET**: `openssl rand -base64 32`. Em prod defina também `AUTH_URL=https://whfdev.com` (a Vercel já injeta isso automaticamente).
5. **ADMIN_EMAILS**: lista de e-mails GitHub permitidos (CSV). Em prod, sem isso o login falha closed.
6. **Resend**: domínio `whfdev.com` precisa estar **verificado** (Domains → Add → DKIM + SPF + Return-Path no DNS). Sem verificação, o envio retorna 403. API key em `RESEND_API_KEY`, sender em `RESEND_FROM_EMAIL`.

Ver `.env.example` para a lista completa.

### Migrations

```bash
# Gerar nova migration após editar src/lib/db/schema.ts
npx drizzle-kit generate

# Aplicar
npx drizzle-kit push    # dev
# ou: rodar o SQL gerado no Supabase SQL Editor
```

### Skill `whfdev-proposal`

A skill global em `~/.claude/skills/whfdev-proposal/` é o caminho **alternativo** pra gerar PDFs via CLI/conversa. Os componentes React-PDF são duplicados em `src/lib/proposal/` (sincronizados manualmente). Se mexer num lado, replicar no outro.
