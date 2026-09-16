'use client'

import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCheckout } from './CheckoutProvider'
import { AnimatedTick } from '@/components/ui/AnimatedTick'
import { SplashRibbons } from '@/components/ui/SplashRibbons'
import { Button } from '@/components/ui/Button'
import { formatRupees } from '@/lib/format'
import { products } from '@/data/products'
import type { ThemeId } from '@/themes/types'

/**
 * Full-screen order confirmation.
 *
 * Reuses the splash screen's ribbons and themed backdrop on purpose, so
 * placing an order reads as the same brand moment that opened the page.
 */
export function OrderSuccess({ themeId }: { themeId: ThemeId }) {
  const { phase, order, finish } = useCheckout()
  const panel = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const open = phase === 'done' && order !== null

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, finish])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panel.current?.focus()
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && order && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-success-heading"
          tabIndex={-1}
          ref={panel}
          className="fixed inset-0 z-[110] overflow-y-auto overflow-x-hidden bg-[linear-gradient(160deg,var(--bg)_0%,var(--bg-alt)_100%)] outline-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <SplashRibbons themeId={themeId} reduce={reduce} />

          <div className="relative mx-auto flex min-h-dvh max-w-[520px] flex-col items-center justify-center px-5 py-12 text-center">
            <AnimatedTick />

            <motion.div
              className="w-full"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: reduce ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 id="order-success-heading" className="mt-5 text-2xl font-bold text-[var(--ink)]">
                Payment successful
              </h2>
              <p className="mt-1.5 text-sm text-[var(--ink-muted)]">
                Your order is placed and on its way.
              </p>

              {/* Required: this screen outlives the conversation in which
                  everyone knew the payment was simulated. */}
              <p className="mt-3 inline-block rounded-full bg-[var(--surface-alt)] px-3 py-1 text-[11px] font-semibold text-[var(--ink-muted)]">
                Demo order — no payment was taken
              </p>

              <dl className="mt-7 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-left backdrop-blur-2xl">
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-xs text-[var(--ink-muted)]">Order</dt>
                  <dd className="tnum text-sm font-bold text-[var(--ink)]">{order.id}</dd>
                </div>
                <div className="mt-2 flex items-baseline justify-between gap-3">
                  <dt className="text-xs text-[var(--ink-muted)]">Delivery</dt>
                  <dd className="text-sm font-semibold text-[var(--ink)]">{order.customer.slot}</dd>
                </div>

                <ul className="mt-4 border-t border-[var(--border)] pt-3">
                  {order.lines.map((line) => {
                    const product = products.find((p) => p.id === line.productId)
                    return (
                      <li
                        key={line.productId + line.weightLabel}
                        className="flex items-baseline justify-between gap-3 py-1"
                      >
                        <span className="text-[13px] text-[var(--ink)]">
                          {(product?.name ?? line.productId) + ' · ' + line.weightLabel}
                          {line.qty > 1 && ' × ' + line.qty}
                        </span>
                        <span className="tnum text-[13px] font-semibold text-[var(--ink)]">
                          {formatRupees(line.unitPrice * line.qty)}
                        </span>
                      </li>
                    )
                  })}
                </ul>

                <div className="mt-3 flex items-baseline justify-between gap-3 border-t border-[var(--border)] pt-3">
                  <dt className="text-sm font-semibold text-[var(--ink)]">Total paid</dt>
                  <dd className="tnum text-lg font-bold text-[var(--primary)]">
                    {formatRupees(order.total)}
                  </dd>
                </div>
              </dl>

              <Button className="mt-6 w-full" size="lg" onClick={finish}>
                Continue shopping
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
