'use client'

import { useState } from 'react'
import Link from 'next/link'
import { themes } from '@/themes'
import type { ThemeId } from '@/themes/types'
import { X, Sparkle } from '@phosphor-icons/react/dist/ssr'

function Swatch({ colors, active }: { colors: [string, string, string]; active: boolean }) {
  return (
    <span
      className={[
        'block h-11 w-11 rounded-full transition-all duration-200',
        active
          ? 'ring-2 ring-[var(--primary)] ring-offset-2 ring-offset-[var(--surface)]'
          : 'ring-1 ring-[var(--border)]',
      ].join(' ')}
      style={{
        background:
          'linear-gradient(140deg, ' +
          colors[0] + ' 0%, ' + colors[0] + ' 33%, ' +
          colors[1] + ' 33%, ' + colors[1] + ' 66%, ' +
          colors[2] + ' 66%)',
      }}
    />
  )
}

/**
 * Festive theme picker. Each theme is its own route, so switching is a real
 * navigation; Next prefetches them, so it still feels instant. Themes with
 * `available: false` render dimmed until their route exists.
 *
 * Collapsible, because a permanently open panel pinned to the corner covers
 * the footer's contact details -- the exact problem the live site's chat
 * widget has.
 */
export function ThemeSwitcher({ current }: { current: ThemeId }) {
  const [open, setOpen] = useState(true)

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 flex h-11 items-center gap-2 rounded-full bg-[var(--surface)] pl-3 pr-4 text-[13px] font-semibold text-[var(--ink)] shadow-[0_10px_30px_var(--shadow)] ring-1 ring-[var(--border)] transition-transform duration-200 hover:-translate-y-0.5 sm:bottom-6 sm:right-6 cursor-pointer"
      >
        <Sparkle size={17} weight="fill" className="text-[var(--primary)]" />
        Festive themes
      </button>
    )
  }

  return (
    <aside
      className="fixed bottom-4 right-4 z-50 w-[248px] rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3.5 shadow-[0_16px_40px_var(--shadow)] sm:bottom-6 sm:right-6"
      aria-label="Festive theme picker"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-[13px] font-semibold text-[var(--ink)]">Explore Our Festive Themes</p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Collapse theme picker"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[var(--ink-muted)] transition-colors duration-200 hover:bg-[var(--surface-alt)] hover:text-[var(--ink)] cursor-pointer"
        >
          <X size={14} weight="bold" />
        </button>
      </div>

      <ul className="flex items-start justify-between gap-1.5">
        {themes.map((theme) => {
          const active = theme.id === current
          const label = (
            <>
              <Swatch colors={theme.swatch} active={active} />
              <span
                className={[
                  'text-center text-[11px] leading-tight',
                  active ? 'font-semibold text-[var(--primary)]' : 'text-[var(--ink-muted)]',
                ].join(' ')}
              >
                {theme.label}
              </span>
            </>
          )

          return (
            <li key={theme.id} className="flex-1">
              {theme.available ? (
                <Link
                  href={theme.route}
                  aria-current={active ? 'page' : undefined}
                  className="flex flex-col items-center gap-1.5 rounded-lg p-1 transition-transform duration-200 hover:-translate-y-0.5"
                >
                  {label}
                </Link>
              ) : (
                <span
                  className="flex cursor-not-allowed flex-col items-center gap-1.5 p-1 opacity-45"
                  title={theme.label + ' theme is not built yet'}
                >
                  {label}
                  <span className="rounded bg-[var(--surface-alt)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[var(--ink-muted)]">
                    Soon
                  </span>
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
