'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCart } from './CartProvider'
import { formatRupees } from '@/lib/format'
import { products } from '@/data/products'
import { Button } from '@/components/ui/Button'
import { XIcon, MinusIcon, PlusIcon } from '@/components/ui/Icons'

const FOCUSABLE =
  'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

/**
 * Slide-out cart. Keeps the shopper on the page, which matters on a
 * single-page festive site where navigating away would replay the splash.
 */
export function CartDrawer() {
  const { lines, total, isOpen, setQty, remove, closeCart } = useCart()
  const panel = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  /* Escape closes, and Tab stays inside while the dialog is modal. */
  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeCart()
        return
      }
      if (e.key !== 'Tab' || !panel.current) return

      const items = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (items.length === 0) return

      const first = items[0]
      const last = items[items.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, closeCart])

  /* The page behind must not scroll while the drawer is open. */
  useEffect(() => {
    if (!isOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [isOpen])

  /* Focus moves into the panel on open, and back to the opener on close. */
  useEffect(() => {
    if (!isOpen) {
      document.querySelector<HTMLElement>('[aria-label^="Cart"]')?.focus()
      return
    }
    panel.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus()
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[90] bg-black/40"
            onClick={closeCart}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-heading"
            className="fixed right-0 top-0 z-[95] flex h-dvh w-full max-w-[420px] flex-col bg-[var(--surface)] shadow-[0_0_60px_var(--shadow)]"
            initial={reduce ? { opacity: 0 } : { x: '100%' }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: '100%' }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
              <h2 id="cart-drawer-heading" className="text-base font-bold text-[var(--ink)]">
                Your cart
              </h2>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                className="grid h-11 w-11 place-items-center rounded-full text-[var(--ink-muted)] transition-colors hover:bg-[var(--surface-alt)] hover:text-[var(--ink)] cursor-pointer"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="grid flex-1 place-items-center px-6 text-center">
                <p className="text-sm text-[var(--ink-muted)]">
                  Nothing here yet. Add a cut to get started.
                </p>
              </div>
            ) : (
              <ul className="flex-1 overflow-y-auto px-5 py-4">
                {lines.map((line) => {
                  const product = products.find((p) => p.id === line.productId)
                  if (!product) return null

                  return (
                    <li
                      key={line.productId + line.weightLabel}
                      className="flex gap-3 border-b border-[var(--border)] py-3 last:border-0"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[var(--surface-alt)]">
                        <Image
                          src={product.image}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>

                      <div className="flex flex-1 flex-col gap-1.5">
                        <p className="text-[13px] font-semibold leading-snug text-[var(--ink)]">
                          {product.name}
                        </p>
                        <p className="text-xs text-[var(--ink-muted)]">{line.weightLabel}</p>

                        <div className="mt-auto flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              aria-label={'Decrease quantity of ' + product.name}
                              onClick={() => setQty(line.productId, line.weightLabel, line.qty - 1)}
                              className="grid h-8 w-8 place-items-center rounded-md border border-[var(--border)] text-[var(--ink)] transition-colors hover:border-[var(--primary)] cursor-pointer"
                            >
                              <MinusIcon className="h-3.5 w-3.5" />
                            </button>
                            <span className="tnum w-7 text-center text-sm font-semibold">
                              {line.qty}
                            </span>
                            <button
                              type="button"
                              aria-label={'Increase quantity of ' + product.name}
                              onClick={() => setQty(line.productId, line.weightLabel, line.qty + 1)}
                              className="grid h-8 w-8 place-items-center rounded-md border border-[var(--border)] text-[var(--ink)] transition-colors hover:border-[var(--primary)] cursor-pointer"
                            >
                              <PlusIcon className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <span className="tnum text-sm font-bold text-[var(--primary)]">
                            {formatRupees(line.unitPrice * line.qty)}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        aria-label={'Remove ' + product.name + ' from cart'}
                        onClick={() => remove(line.productId, line.weightLabel)}
                        className="self-start text-xs text-[var(--ink-muted)] underline transition-colors hover:text-[var(--primary)] cursor-pointer"
                      >
                        Remove
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}

            {/* Removals are announced; additions are announced by the card. */}
            <span aria-live="polite" className="sr-only">
              {lines.length === 0 ? 'Cart is empty' : `${lines.length} lines in cart`}
            </span>

            <div className="border-t border-[var(--border)] px-5 py-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-[var(--ink-muted)]">Total</span>
                <span className="tnum text-lg font-bold text-[var(--ink)]">
                  {formatRupees(total)}
                </span>
              </div>
              {/* Deliberate endpoint: there is no backend to submit an order to. */}
              <Button className="w-full" size="lg">
                Checkout
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
