export function SectionHeader({
  eyebrow,
  title,
  lede,
  align = 'left',
}: {
  eyebrow: string
  title: string
  lede?: string
  align?: 'left' | 'center'
}) {
  const alignCls = align === 'center' ? 'items-center text-center mx-auto' : ''
  return (
    <header className={`mb-14 flex max-w-3xl flex-col gap-5 ${alignCls}`}>
      <div className="inline-flex items-center gap-2">
        <span className="h-px w-6 bg-coral" />
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-coral">
          {eyebrow}
        </span>
      </div>
      <h2 className="text-balance text-4xl font-semibold leading-[1.04] tracking-tighter2 sm:text-5xl">
        <span className="text-gradient">{title}</span>
      </h2>
      {lede && (
        <p className="max-w-2xl text-pretty text-base text-ink-muted sm:text-lg">
          {lede}
        </p>
      )}
    </header>
  )
}
