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
    <header
      className={`mb-10 flex max-w-3xl flex-col gap-4 sm:mb-14 sm:gap-5 ${alignCls}`}
    >
      <div className="inline-flex items-center gap-2">
        <span className="h-px w-6 bg-coral" />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-coral sm:text-[11px] sm:tracking-[0.22em]">
          {eyebrow}
        </span>
      </div>
      <h2 className="text-balance text-3xl font-semibold leading-[1.06] tracking-tighter2 sm:text-5xl">
        <span className="text-gradient">{title}</span>
      </h2>
      {lede && (
        <p className="max-w-2xl text-pretty text-sm text-ink-muted sm:text-lg">
          {lede}
        </p>
      )}
    </header>
  )
}
