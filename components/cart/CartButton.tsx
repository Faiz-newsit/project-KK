'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useCart } from './CartProvider'
import { formatRupees } from '@/lib/format'
import { CartIcon } from '@/components/ui/Icons'

/**
 * Header cart. Count and total stay blank until the cart has hydrated from
 * localStorage, because the server cannot know them and a guess would be a
 * hydration mismatch.
 */
export function CartButton() {
  const { count, total, hydrated, openCart } = useCart()
  const reduce = useReducedMotion()

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={hydrated ? `Cart, ${count} items, ${formatRupees(total)}` : 'Cart'}
      className="flex h-11 items-center gap-2.5 rounded-full border border-[var(--border)] pl-2.5 pr-3.5 transition-colors duration-200 hover:border-[var(--primary)] hover:bg-[var(--surface-alt)] cursor-pointer"
    >
      <span className="relative grid place-items-center">
        <CartIcon size={22} />
        {hydrated && count > 0 && (
          <motion.span
            /* A bump on change is the cheapest way to show the add landed. */
            key={count}
            initial={reduce ? false : { scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="tnum absolute -right-1.5 -top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[var(--primary)] px-1 text-[10px] font-bold leading-none text-[var(--primary-ink)]"
          >
            {count}
          </motion.span>
        )}
      </span>
      <span className="tnum hidden text-sm font-bold lg:block">
        {hydrated ? formatRupees(total) : ''}
      </span>
    </button>
  )
}
