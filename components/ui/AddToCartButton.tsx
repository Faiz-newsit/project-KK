'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { PlusIcon, CheckIcon } from './Icons'

/** How long the tick stays up before the button offers itself again. */
const CONFIRM_MS = 1300

/**
 * Add-to-cart control for a product card.
 *
 * The card itself stays a Server Component; only this button ships to the
 * client. Confirmation is a state change first and an animation second, so a
 * visitor who prefers reduced motion still sees the tick -- it just appears
 * rather than springing in, and screen readers get the live announcement
 * either way.
 */
export function AddToCartButton({ productName }: { productName: string }) {
  const [added, setAdded] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  const reduce = useReducedMotion()

  /* A pending timer outliving the card would set state on an unmounted tree. */
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const onClick = () => {
    /* Ignore repeat taps while confirming, so timers never stack. */
    if (added) return
    setAdded(true)
    timer.current = window.setTimeout(() => setAdded(false), CONFIRM_MS)
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={onClick}
        aria-label={'Add ' + productName + ' to cart'}
        whileTap={reduce ? undefined : { scale: 0.9 }}
        animate={reduce ? undefined : { scale: added ? [1, 1.18, 1] : 1 }}
        transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
        className={[
          'relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-lg border',
          'transition-colors duration-200 cursor-pointer',
          added
            ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-ink)]'
            : 'border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--primary-ink)]',
        ].join(' ')}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={added ? 'check' : 'plus'}
            className="grid place-items-center"
            initial={reduce ? false : { opacity: 0, scale: 0.5, rotate: -25 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.5, rotate: 25 }}
            transition={{ duration: reduce ? 0 : 0.18, ease: 'easeOut' }}
          >
            {added ? <CheckIcon className="h-4 w-4" weight="bold" /> : <PlusIcon className="h-4 w-4" />}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      {/* The tick is visual; this is the same confirmation for screen readers. */}
      <span aria-live="polite" className="sr-only">
        {added ? productName + ' added to cart' : ''}
      </span>
    </>
  )
}
