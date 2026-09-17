'use client'

import { useEffect, useRef } from 'react'
import { useCheckout } from './CheckoutProvider'
import { DELIVERY_SLOTS, type CustomerDetails } from '@/lib/checkout/types'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'

const FIELD_ORDER: (keyof CustomerDetails)[] = ['name', 'phone', 'address', 'slot']

const labelClass = 'mb-1 block text-xs font-semibold text-[var(--ink)]'
/* py-3 keeps every control at or above the 44px minimum touch target. */
const controlClass =
  'w-full rounded-lg border bg-[var(--bg-alt)] px-3 py-3 text-sm text-[var(--ink)] transition-colors'

export function CheckoutForm() {
  const { details, errors, setField, submit, backToCart } = useCheckout()
  const form = useRef<HTMLFormElement>(null)

  /* Send focus to the first field that failed, so the shopper is taken to the
     problem rather than left to hunt for it. */
  useEffect(() => {
    const firstBad = FIELD_ORDER.find((field) => errors[field])
    if (!firstBad) return
    form.current?.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus()
  }, [errors])

  const border = (field: keyof CustomerDetails) =>
    errors[field] ? 'border-[var(--primary)]' : 'border-[var(--border)]'

  const errorCount = FIELD_ORDER.filter((field) => errors[field]).length

  return (
    <form
      ref={form}
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
      className="flex flex-1 flex-col overflow-y-auto px-5 py-4"
      noValidate
    >
      {/* Per-field messages are linked with aria-describedby, but nothing would
          announce a failed submit on its own. This does. */}
      <p aria-live="polite" className="sr-only">
        {errorCount > 0
          ? `${errorCount} ${errorCount === 1 ? 'field needs' : 'fields need'} attention`
          : ''}
      </p>

      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="co-name" className={labelClass}>
            Full name
          </label>
          <input
            id="co-name"
            name="name"
            value={details.name}
            onChange={(e) => setField('name', e.target.value)}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? 'co-name-error' : undefined}
            className={[controlClass, border('name')].join(' ')}
          />
          {errors.name && (
            <p id="co-name-error" className="mt-1 text-xs text-[var(--primary)]">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="co-phone" className={labelClass}>
            Mobile number
          </label>
          <input
            id="co-phone"
            name="phone"
            inputMode="numeric"
            autoComplete="tel"
            value={details.phone}
            onChange={(e) => setField('phone', e.target.value)}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? 'co-phone-error' : undefined}
            className={[controlClass, border('phone')].join(' ')}
          />
          {errors.phone && (
            <p id="co-phone-error" className="mt-1 text-xs text-[var(--primary)]">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="co-address" className={labelClass}>
            Delivery address
          </label>
          <textarea
            id="co-address"
            name="address"
            rows={3}
            value={details.address}
            onChange={(e) => setField('address', e.target.value)}
            aria-invalid={errors.address ? true : undefined}
            aria-describedby={errors.address ? 'co-address-error' : undefined}
            className={[controlClass, border('address'), 'resize-none'].join(' ')}
          />
          {errors.address && (
            <p id="co-address-error" className="mt-1 text-xs text-[var(--primary)]">
              {errors.address}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="co-slot" className={labelClass}>
            Delivery slot
          </label>
          <Select
            id="co-slot"
            name="slot"
            label="Delivery slot"
            placeholder="Choose a slot"
            value={details.slot}
            onChange={(slot) => setField('slot', slot)}
            invalid={Boolean(errors.slot)}
            describedBy={errors.slot ? 'co-slot-error' : undefined}
            options={DELIVERY_SLOTS.map((slot) => ({ value: slot, label: slot }))}
          />
          {errors.slot && (
            <p id="co-slot-error" className="mt-1 text-xs text-[var(--primary)]">
              {errors.slot}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <Button type="submit" size="lg" variant="arrow" className="w-full">
          Place order
        </Button>
        <button
          type="button"
          onClick={backToCart}
          className="grid h-11 place-items-center text-xs text-[var(--ink-muted)] underline transition-colors hover:text-[var(--primary)] cursor-pointer"
        >
          Back to cart
        </button>
      </div>
    </form>
  )
}
