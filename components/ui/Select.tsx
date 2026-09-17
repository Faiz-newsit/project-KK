'use client'

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ChevronDown, CheckIcon } from './Icons'

export type SelectOption = { value: string; label: string }

/** Window in which consecutive keystrokes count as one type-ahead search. */
const TYPEAHEAD_MS = 500

/** Rough row height, used only to guess whether the panel fits below. */
const ROW_PX = 44
const MAX_ROWS = 6

/**
 * Themed select.
 *
 * A native <select> renders its option list in the OS, which ignores the page
 * entirely -- on the festive themes that means a light system menu dropping out
 * of a dark card. This is the ARIA select-only combobox instead: a real button
 * that owns the accessible name and state, and a listbox panel we can style.
 *
 * Replacing a native control means re-earning what it gave away for free, so
 * this keeps the whole keyboard contract: arrows move, Home/End jump, Enter and
 * Space select, Escape closes and returns focus, Tab closes and moves on, and
 * typing letters jumps to a matching option. Focus never leaves the button --
 * the active option is pointed at with aria-activedescendant -- so there is no
 * focus trap to escape and tab order still matches visual order.
 *
 * The panel flips above the button when there is not room below, and the active
 * option is scrolled into view, so keyboard focus is never left hidden behind
 * the sticky header or the drawer edge (WCAG 2.2 "focus not obscured").
 *
 * `name` is forwarded to the button because CheckoutForm finds the field that
 * failed validation with querySelector('[name=...]') and focuses it; a button
 * carries the attribute fine and stays findable.
 */
export function Select({
  value,
  onChange,
  options,
  label,
  name,
  id,
  placeholder,
  invalid,
  describedBy,
  className = '',
  size = 'md',
}: {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  /** Accessible name. Used when no visible <label> is wired up via `id`. */
  label: string
  name?: string
  id?: string
  /** Shown when `value` matches no option, e.g. an unchosen delivery slot. */
  placeholder?: string
  invalid?: boolean
  describedBy?: string
  className?: string
  size?: 'sm' | 'md'
}) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [flip, setFlip] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const typed = useRef({ text: '', at: 0 })
  const reduce = useReducedMotion()

  const uid = useId()
  const listId = uid + '-list'
  const optionId = (i: number) => uid + '-opt-' + i

  const selectedIndex = options.findIndex((o) => o.value === value)
  const current = selectedIndex >= 0 ? options[selectedIndex] : undefined

  const openList = (startAt = selectedIndex < 0 ? 0 : selectedIndex) => {
    /* Decide the direction before painting, so the panel never opens downward
       and then jumps. Estimated from row height rather than measured: the panel
       does not exist yet at this point. */
    const box = trigger.current?.getBoundingClientRect()
    if (box) {
      const below = window.innerHeight - box.bottom
      const needed = Math.min(options.length, MAX_ROWS) * ROW_PX + 16
      setFlip(below < needed && box.top > below)
    }
    setActive(startAt)
    setOpen(true)
  }

  const choose = (i: number) => {
    onChange(options[i].value)
    setOpen(false)
    trigger.current?.focus()
  }

  /* Pointer down rather than click: a press that starts outside should dismiss
     without also activating whatever sits under the release. */
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  /* Keep the active row visible while arrowing through a scrolled panel. */
  useEffect(() => {
    if (!open) return
    list.current
      ?.querySelector<HTMLElement>('[data-active="true"]')
      ?.scrollIntoView({ block: 'nearest' })
  }, [open, active])

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = options.length - 1

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (open) setActive((i) => Math.min(i + 1, last))
        else openList()
        return
      case 'ArrowUp':
        e.preventDefault()
        if (open) setActive((i) => Math.max(i - 1, 0))
        else openList()
        return
      case 'Home':
        if (!open) return
        e.preventDefault()
        setActive(0)
        return
      case 'End':
        if (!open) return
        e.preventDefault()
        setActive(last)
        return
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (open) choose(active)
        else openList()
        return
      case 'Escape':
        if (!open) return
        e.preventDefault()
        setOpen(false)
        return
      case 'Tab':
        /* Close but do not swallow the key or restore focus: Tab should carry
           on to the next control the way it does from a native select. */
        if (open) setOpen(false)
        return
    }

    /* Type-ahead, the last thing a native select does that a div never would. */
    if (e.key.length !== 1 || e.metaKey || e.ctrlKey || e.altKey) return
    const now = Date.now()
    const text = now - typed.current.at > TYPEAHEAD_MS ? e.key : typed.current.text + e.key
    typed.current = { text, at: now }

    const hit = options.findIndex((o) => o.label.toLowerCase().startsWith(text.toLowerCase()))
    if (hit < 0) return
    e.preventDefault()
    if (open) setActive(hit)
    else openList(hit)
  }

  const trigger_ = [
    'flex w-full items-center justify-between gap-2 rounded-lg border text-left',
    'bg-[var(--bg-alt)] text-[var(--ink)] transition-colors cursor-pointer',
    'hover:border-[var(--primary)]',
    invalid ? 'border-[var(--primary)]' : 'border-[var(--border)]',
    open ? 'border-[var(--primary)]' : '',
    size === 'sm' ? 'min-h-9 px-3 py-1.5 text-xs font-medium' : 'min-h-11 px-3 py-3 text-sm',
  ].join(' ')

  return (
    <div ref={root} className={'relative ' + className}>
      <button
        ref={trigger}
        type="button"
        id={id}
        name={name}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? optionId(active) : undefined}
        aria-label={id ? undefined : label}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={trigger_}
      >
        <span className={current ? '' : 'text-[var(--ink-muted)]'}>
          {current?.label ?? placeholder ?? ''}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={
            'h-3.5 w-3.5 shrink-0 text-[var(--ink-muted)] transition-transform duration-200 ' +
            (open ? 'rotate-180' : '')
          }
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            ref={list}
            id={listId}
            role="listbox"
            aria-label={label}
            /* Opaque, unlike the translucent card surfaces: a list of choices
               has to stay readable over whatever it covers. */
            className={[
              'absolute z-50 max-h-[264px] w-full min-w-max overflow-y-auto',
              'rounded-xl border border-[var(--border)] bg-[var(--bg)] p-1',
              'shadow-[0_18px_40px_var(--shadow)]',
              flip ? 'bottom-full mb-1.5' : 'top-full mt-1.5',
            ].join(' ')}
            /* Transform and opacity only -- height would thrash layout. */
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: flip ? 4 : -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: flip ? 4 : -4 }}
            transition={{ duration: reduce ? 0 : 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            {options.map((option, i) => {
              const isSelected = option.value === value
              const isActive = i === active
              return (
                <li
                  key={option.value}
                  id={optionId(i)}
                  role="option"
                  aria-selected={isSelected}
                  data-active={isActive}
                  onPointerEnter={() => setActive(i)}
                  onClick={() => choose(i)}
                  className={[
                    /* 44px rows: this is the one part of a select people
                       actually have to hit with a thumb. */
                    'flex min-h-11 cursor-pointer items-center justify-between gap-3',
                    'rounded-lg px-3 text-sm transition-colors',
                    isActive ? 'bg-[color-mix(in_srgb,var(--primary)_16%,transparent)]' : '',
                    isSelected
                      ? 'font-semibold text-[var(--primary)]'
                      : 'text-[var(--ink)]',
                  ].join(' ')}
                >
                  <span>{option.label}</span>
                  {isSelected && <CheckIcon aria-hidden="true" className="h-4 w-4 shrink-0" />}
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
