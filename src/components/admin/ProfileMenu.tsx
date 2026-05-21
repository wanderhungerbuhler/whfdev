'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

type Props = {
  name: string | null | undefined
  email: string | null | undefined
  image: string | null | undefined
  signOutAction: () => Promise<void>
}

export function ProfileMenu({ name, email, image, signOutAction }: Props) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const initials = (name ?? email ?? '?')
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-rule-soft bg-canvas-elev transition hover:border-rule focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/30"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Abrir menu de perfil"
      >
        {image ? (
          <Image
            src={image}
            alt={name ?? 'Avatar'}
            width={36}
            height={36}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink">
            {initials}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-72 overflow-hidden rounded-2xl border border-rule-soft bg-canvas-elev shadow-2xl"
        >
          {/* Identidade */}
          <div className="flex items-center gap-3 px-4 py-4">
            <div className="h-10 w-10 overflow-hidden rounded-full border border-rule-soft bg-canvas">
              {image ? (
                <Image
                  src={image}
                  alt={name ?? 'Avatar'}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="grid h-full w-full place-items-center font-mono text-xs uppercase text-ink">
                  {initials}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              {name && (
                <p className="truncate text-sm font-medium text-ink">{name}</p>
              )}
              {email && (
                <p className="truncate font-mono text-[11px] text-ink-muted">
                  {email}
                </p>
              )}
            </div>
          </div>

          <div className="h-px bg-rule-soft" />

          {/* Ações */}
          <form action={signOutAction}>
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-ink-soft transition hover:bg-canvas hover:text-ink"
            >
              <span>Sign out</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-muted">
                ↩
              </span>
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
