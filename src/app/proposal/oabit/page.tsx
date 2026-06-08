import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Proposta · OABit · WHFDEV',
  description:
    'Proposta de engenharia e produto da WHFDEV para o OABit, plataforma de gestão jurídica distribuída pela OAB.',
}

const PHASES = [
  {
    tag: 'Fase 0',
    cadence: 'Pagamento único',
    title: 'Descoberta e Arquitetura',
    price: 'R$ 15.000',
    accent: false,
    items: [
      'Arquitetura técnica multi-tenant na AWS, com dados isolados por escritório',
      'Escopo, backlog e cronograma do MVP fechados',
      'Modelo de dados e desenho de segurança (LGPD e sigilo desde o início)',
      'Plano de integração com o DataJud (CNJ)',
      'Protótipo navegável validado com o escritório-piloto',
    ],
  },
  {
    tag: 'Fase 1',
    cadence: 'Mensal · 4 a 5 meses',
    title: 'MVP Core',
    price: 'R$ 35.000',
    suffix: '/mês',
    accent: true,
    items: [
      'Cadastro e gestão de processos',
      'Controle de prazos com alertas automáticos',
      'Base de clientes do escritório',
      'Login com autenticação em dois fatores (2FA)',
      'Painel de gestão (dashboard)',
      'Consulta de processos via DataJud (CNJ)',
      'Plataforma web responsiva, com dados isolados por escritório',
    ],
  },
  {
    tag: 'Fase 2',
    cadence: 'Mensal · recorrente',
    title: 'Evolução e Operação',
    price: 'R$ 10.000',
    suffix: '/mês',
    accent: false,
    items: [
      'Manutenção evolutiva e correções',
      'Novas funcionalidades priorizadas com base no uso real',
      'Monitoramento, suporte e melhoria contínua',
    ],
  },
]

const EDGES = [
  {
    k: '01',
    t: 'Canal OAB',
    d: 'A distribuição institucional alcança a base de advogados de forma direta. É a vantagem que nenhum orçamento de marketing compra.',
  },
  {
    k: '02',
    t: 'Simplicidade que se usa',
    d: 'Sistemas maduros incham de funções que ninguém usa. O OABit faz bem o essencial: processos, prazos e clientes.',
  },
  {
    k: '03',
    t: 'Pronto para validar',
    d: 'Em poucas semanas há uma entrega demonstrável, pronta para um escritório-piloto antes de qualquer investimento maior.',
  },
]

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-coral">
      {children}
    </span>
  )
}

export default function OabitProposalPage() {
  return (
    <main className="relative overflow-hidden">
      {/* coral glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[620px] opacity-70"
        style={{
          background:
            'radial-gradient(60% 70% at 50% 0%, rgba(255,77,109,0.18), rgba(255,138,74,0.05) 45%, transparent 75%)',
        }}
      />

      {/* nav */}
      <header className="sticky top-0 z-40 border-b border-rule-soft bg-canvas/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-3">
            <Image
              src="/whfdev.png"
              alt="WHFDEV"
              width={30}
              height={30}
              quality={100}
              priority
              className="rounded-lg"
            />
            <div className="hidden h-6 w-px bg-rule sm:block" />
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted sm:block">
              Tech Consulting
            </span>
          </div>
          <a
            href="/proposal/oabit/proposta-oabit.pdf"
            className="rounded-full bg-ink px-4 py-2 text-[12px] font-semibold text-canvas transition hover:opacity-90"
          >
            Baixar PDF
          </a>
        </div>
      </header>

      {/* hero */}
      <section className="relative mx-auto max-w-6xl px-5 pb-10 pt-20 sm:px-8 sm:pt-28">
        <div className="flex items-center gap-3">
          <Eyebrow>Proposta de Projeto</Eyebrow>
          <span className="h-px w-8 bg-rule" />
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
            Junho 2026
          </span>
        </div>
        <h1 className="mt-7 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tighter2 sm:text-6xl">
          Só o essencial da gestão jurídica, bem feito.
        </h1>
        <p className="mt-7 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
          Plataforma de gestão jurídica para advogados e escritórios, com
          distribuição prevista pela OAB. Esta proposta cobre a engenharia da
          primeira versão: o MVP que resolve as dores reais do advogado
          (processos, prazos e clientes), pronto para validação com um
          escritório-piloto.
        </p>

        <div className="mt-10 flex flex-wrap gap-2.5">
          {['Gestão de processos', 'Prazos com alerta', 'Clientes', '2FA', 'Dashboard', 'DataJud · CNJ', 'Plataforma web'].map(
            (chip) => (
              <span
                key={chip}
                className="rounded-full border border-rule bg-canvas-card px-3.5 py-1.5 text-[12px] text-ink-soft"
              >
                {chip}
              </span>
            ),
          )}
        </div>
      </section>

      {/* posicionamento */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <Eyebrow>Onde o OABit ganha</Eyebrow>
        <p className="mt-4 max-w-2xl text-lg text-ink-soft sm:text-xl">
          O mercado já tem um líder consolidado. O OABit não vence copiando
          função por função. Vence por dois movimentos que o líder não replica.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {EDGES.map((e) => (
            <div
              key={e.k}
              className="rounded-2xl border border-rule bg-canvas-card p-6"
            >
              <span className="font-mono text-[13px] text-coral">{e.k}</span>
              <h3 className="mt-3 text-lg font-semibold tracking-tightish">
                {e.t}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {e.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* protótipo web */}
      <section className="border-y border-rule-soft bg-canvas-elev/40">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <Eyebrow>Prévia da plataforma</Eyebrow>
              <h2 className="mt-4 text-3xl font-bold tracking-tighter2 sm:text-4xl">
                Veja uma parte do OABit.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-ink-soft">
                O painel de gestão da versão web: a visão da semana, os prazos
                por urgência, os processos sincronizados via DataJud e a base de
                clientes, tudo em uma só tela.
              </p>
            </div>
            <a
              href="/proposal/oabit/dashboard.html"
              target="_blank"
              rel="noreferrer"
              className="inline-flex flex-none items-center gap-2 self-start rounded-full border border-rule px-4 py-2 text-[13px] font-semibold text-ink transition hover:border-coral hover:text-coral sm:self-auto"
            >
              Abrir em tela cheia
              <span aria-hidden>↗</span>
            </a>
          </div>

          {/* browser frame */}
          <div className="mt-10 overflow-hidden rounded-2xl border border-rule bg-canvas-card shadow-2xl">
            <div className="flex items-center gap-3 border-b border-rule-soft bg-canvas-elev px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="mx-auto w-full max-w-sm rounded-md border border-rule bg-canvas px-3 py-1.5 text-center font-mono text-[11px] text-ink-muted">
                app.oabit.com.br/dashboard
              </div>
            </div>
            <Image
              src="/proposal/oabit/web-dashboard.png"
              alt="Dashboard da versão web do OABit"
              width={3200}
              height={1740}
              quality={100}
              priority
              className="h-auto w-full"
            />
          </div>

          <ul className="mt-8 grid gap-2.5 text-sm text-ink-muted sm:grid-cols-2">
            {[
              'Próximos prazos em destaque, por urgência',
              'Processos com vara, partes e movimentações',
              'Acesso protegido com 2FA',
              'Dados isolados por escritório (multi-tenant)',
            ].map((li) => (
              <li key={li} className="flex items-start gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-coral" />
                {li}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* fases / escopo */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <Eyebrow>Escopo e fases</Eyebrow>
        <h2 className="mt-4 text-3xl font-bold tracking-tighter2 sm:text-4xl">
          Construção por fases, escopo fechado.
        </h2>
        <p className="mt-5 max-w-2xl text-base text-ink-soft">
          Cobrança mensal durante a construção. Você só avança quando a etapa
          anterior entrega.
        </p>

        <div className="mt-10 space-y-4">
          {PHASES.map((p) => (
            <div
              key={p.tag}
              className={`grid gap-6 rounded-3xl border p-6 sm:grid-cols-[260px_1fr] sm:p-8 ${
                p.accent
                  ? 'border-coral/40 bg-coral/[0.06]'
                  : 'border-rule bg-canvas-card'
              }`}
            >
              <div className="sm:border-r sm:border-rule sm:pr-6">
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
                  {p.tag} · {p.cadence}
                </div>
                <h3 className="mt-3 text-2xl font-bold tracking-tightish">
                  {p.title}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span
                    className={`text-4xl font-extrabold tracking-tighter2 ${
                      p.accent ? 'text-coral' : 'text-ink'
                    }`}
                  >
                    {p.price}
                  </span>
                  {p.suffix && (
                    <span className="text-sm font-semibold text-ink-muted">
                      {p.suffix}
                    </span>
                  )}
                </div>
              </div>
              <ul className="grid gap-y-2.5 self-center sm:grid-cols-2 sm:gap-x-8">
                {p.items.map((it, i) => (
                  <li
                    key={it}
                    className="flex items-start gap-3 text-[14px] text-ink-soft"
                  >
                    <span className="mt-0.5 font-mono text-[11px] text-ink-dim">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* marketing */}
      <section className="border-t border-rule-soft bg-canvas-elev/40">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <div className="flex flex-col gap-2">
            <Eyebrow>Valor adicional · Marketing</Eyebrow>
            <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tighter2 sm:text-4xl">
              A presença visual do OABit, criada por nós.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft">
              Além da plataforma, a WHFDEV cuida da marca: identidade, criativos
              para redes sociais e campanhas. Os exemplos abaixo estão na
              identidade do OABit.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { src: 'brand', cap: 'Identidade · marca' },
              { src: 'prazos', cap: 'Campanha · prazos' },
              { src: 'datajud', cap: 'Produto · DataJud' },
            ].map((img) => (
              <figure
                key={img.src}
                className="overflow-hidden rounded-2xl border border-rule bg-canvas-card"
              >
                <Image
                  src={`/proposal/oabit/marketing/${img.src}.png`}
                  alt={img.cap}
                  width={1024}
                  height={1024}
                  quality={100}
                  className="aspect-square h-auto w-full object-cover"
                />
                <figcaption className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                  {img.cap}
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-6 rounded-3xl border border-rule bg-canvas-card p-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
                Adicional · Marketing · mensal
              </div>
              <ul className="mt-4 grid gap-2 text-sm text-ink-soft sm:grid-cols-2 sm:gap-x-8">
                {[
                  'Identidade visual e criativos para redes sociais',
                  'Criação de imagens e peças gráficas sob medida',
                  'Landing page de campanha para captação',
                  'SEO, Google Analytics e Meta Pixel',
                  'Gestão de Google Ads e Meta Ads',
                  'Pacote mensal, ajustável conforme a demanda',
                ].map((li) => (
                  <li key={li} className="flex items-start gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-coral" />
                    {li}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-none text-right">
              <div className="text-4xl font-extrabold tracking-tighter2 text-coral">
                R$ 4.000
              </div>
              <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted">
                /mês · opcional
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* investimento */}
      <section className="border-t border-rule-soft">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <Eyebrow>Investimento</Eyebrow>
          <h2 className="mt-4 text-3xl font-bold tracking-tighter2 sm:text-4xl">
            Investimento por fase.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-soft">
            A Fase 0 inicia o trabalho à vista. MVP e Evolução são faturados
            mensalmente, com escopo fechado por fase. Infraestrutura (AWS) e
            serviços de terceiros são faturados direto ao cliente pelos
            fornecedores.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-stretch">
            <div className="relative overflow-hidden rounded-3xl border border-coral/50 bg-canvas-card p-7">
              <span className="absolute right-6 top-6 rounded-full bg-coral px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                À vista
              </span>
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
                Fase 0 · para iniciar
              </div>
              <div className="mt-4 text-5xl font-extrabold tracking-tighter2">
                R$ 15.000
              </div>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted">
                Descoberta e Arquitetura · pagamento único para começar
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-dim">
                  Aceitamos:
                </span>
                {['Pix', 'Transferência bancária'].map((m) => (
                  <span
                    key={m}
                    className="rounded-full border border-rule px-3 py-1 text-[12px] text-ink-soft"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-between gap-6 rounded-3xl border border-rule bg-canvas-elev/40 p-7 sm:w-72">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
                  Próximas fases
                </div>
                <div className="mt-4 space-y-3 text-sm text-ink-soft">
                  <div className="flex items-baseline justify-between gap-3">
                    <span>Fase 1 · MVP</span>
                    <span className="font-semibold text-ink">
                      R$ 35.000<span className="text-ink-muted">/mês</span>
                    </span>
                  </div>
                  <div className="h-px bg-rule-soft" />
                  <div className="flex items-baseline justify-between gap-3">
                    <span>Fase 2 · Evolução</span>
                    <span className="font-semibold text-ink">
                      R$ 10.000<span className="text-ink-muted">/mês</span>
                    </span>
                  </div>
                </div>
              </div>
              <a
                href="mailto:talkto@whfdev.com?subject=OABit%20%C2%B7%20Vamos%20come%C3%A7ar"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-[13px] font-semibold text-canvas transition hover:opacity-90"
              >
                Vamos começar <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-rule-soft">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-3">
            <Image
              src="/whfdev.png"
              alt="WHFDEV"
              width={28}
              height={28}
              quality={100}
              className="rounded-lg"
            />
            <div className="leading-tight">
              <div className="text-sm font-semibold">Wander Hungerbühler</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                WHFDEV · CNPJ 46.185.304/0001-71
              </div>
            </div>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-dim">
            talkto@whfdev.com · Est. 2011 · Brasil · Portugal · França
          </div>
        </div>
      </footer>
    </main>
  )
}
