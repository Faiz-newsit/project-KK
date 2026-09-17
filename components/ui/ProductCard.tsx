'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { discountPercent, type Product } from '@/data/products'
import { useCart } from '@/components/cart/CartProvider'
import { ProductImage } from './Media'
import { CheckIcon, PlusIcon } from './Icons'
import { Select } from './Select'
import { WishlistButton } from './WishlistButton'

/** How long the tick stays up before the button offers itself again. */
const CONFIRM_MS = 1300

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [weightLabel, setWeightLabel] = useState(product.weights[0].label)
  const [added, setAdded] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  const reduce = useReducedMotion()
  const { add } = useCart()

  const weight = product.weights.find((w) => w.label === weightLabel) ?? product.weights[0]
  const off = discountPercent(weight)

  /* A pending timer outliving the card would set state on an unmounted tree. */
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const onAdd = () => {
    /* Ignore repeat taps while confirming, so timers never stack. */
    if (added) return
    add({ productId: product.id, weightLabel: weight.label, unitPrice: weight.price })
    setAdded(true)
    timer.current = window.setTimeout(() => setAdded(false), CONFIRM_MS)
  }

  /* The card deliberately does not clip: the weight dropdown opens past its
     edge, and overflow-hidden here would cut the panel off. The image below
     clips itself, so the rounded top corners still hold. */
  return (
    <article
      className="rise group flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_34px_var(--shadow)]"
      style={{ animationDelay: index * 60 + 'ms' }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--surface-alt)]">
        <ProductImage product={product} />

        {off > 0 && (
          <span className="absolute left-3 top-3 rounded-md bg-[var(--primary)] px-2 py-1 text-[11px] font-bold tracking-wide text-[var(--primary-ink)]">
            {off}% OFF
          </span>
        )}

        <WishlistButton productName={product.name} />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-[var(--ink)]">
            {product.name}
          </h3>
          <p className="mt-1 text-xs text-[var(--ink-muted)]">{product.detail}</p>
        </div>

        <div className="mt-auto w-fit">
          <Select
            size="sm"
            value={weightLabel}
            onChange={setWeightLabel}
            label={'Weight for ' + product.name}
            options={product.weights.map((w) => ({ value: w.label, label: w.label }))}
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="tnum flex items-baseline gap-1.5">
            {weight.mrp && (
              <span className="text-xs text-[var(--ink-muted)] line-through">₹{weight.mrp}</span>
            )}
            <span className="text-lg font-bold text-[var(--primary)]">₹{weight.price}</span>
          </div>

          <motion.button
            type="button"
            onClick={onAdd}
            aria-label={'Add ' + product.name + ', ' + weight.label + ', to cart'}
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
                {added ? (
                  <CheckIcon className="h-4 w-4" weight="bold" />
                ) : (
                  <PlusIcon className="h-4 w-4" />
                )}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>

        {/* The tick is visual; this is the same confirmation for screen readers. */}
        <span aria-live="polite" className="sr-only">
          {added ? product.name + ', ' + weight.label + ', added to cart' : ''}
        </span>
      </div>
    </article>
  )
}
