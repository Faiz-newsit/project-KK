'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { HeartIcon } from './Icons'

/**
 * Wishlist toggle for a product card.
 *
 * Purely local state -- there is no wishlist store yet, so this reflects the
 * visitor's tap and nothing more. `aria-pressed` carries the state for anyone
 * who cannot see the fill.
 */
export function WishlistButton({ productName }: { productName: string }) {
  const [saved, setSaved] = useState(false)
  const reduce = useReducedMotion()

  return (
    <motion.button
      type="button"
      onClick={() => setSaved((s) => !s)}
      aria-pressed={saved}
      aria-label={'Save ' + productName + ' to wishlist'}
      whileTap={reduce ? undefined : { scale: 0.85 }}
      /* One pop on the way in; unsaving just fades the fill out. */
      animate={reduce ? undefined : { scale: saved ? [1, 1.3, 1] : 1 }}
      transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
      className={[
        'absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full',
        'bg-white/90 backdrop-blur transition-colors duration-200 cursor-pointer',
        saved ? 'text-[var(--primary)]' : 'text-[var(--ink-muted)] hover:text-[var(--primary)]',
      ].join(' ')}
    >
      <HeartIcon className="h-4 w-4" weight={saved ? 'fill' : 'regular'} />
    </motion.button>
  )
}
