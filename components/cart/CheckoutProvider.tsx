'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useCart } from './CartProvider'
import { validateDetails, hasErrors } from '@/lib/checkout/validate'
import { newOrderId } from '@/lib/checkout/orderId'
import {
  emptyDetails,
  PAY_MS,
  type CustomerDetails,
  type FieldErrors,
  type Order,
  type Phase,
} from '@/lib/checkout/types'

interface CheckoutApi {
  phase: Phase
  details: CustomerDetails
  errors: FieldErrors
  order: Order | null
  setField: (field: keyof CustomerDetails, value: string) => void
  startCheckout: () => void
  backToCart: () => void
  submit: () => void
  finish: () => void
}

const CheckoutContext = createContext<CheckoutApi | null>(null)

/**
 * Owns the checkout flow. Layered over the cart rather than folded into it:
 * CartProvider already owns contents, persistence and drawer state, and a
 * flow machine plus form state on top would be too much for one file.
 */
export function CheckoutProvider({ children }: { children: ReactNode }) {
  const { lines, total, clear, closeCart } = useCart()
  const [phase, setPhase] = useState<Phase>('cart')
  const [details, setDetails] = useState<CustomerDetails>(emptyDetails)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [order, setOrder] = useState<Order | null>(null)
  const timer = useRef<number | undefined>(undefined)

  /* A pending payment timer outliving the tree would set state after unmount. */
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const setField = useCallback((field: keyof CustomerDetails, value: string) => {
    setDetails((d) => ({ ...d, [field]: value }))
    /* Clear this field's error as soon as it is edited, rather than making the
       shopper submit again to find out they fixed it. */
    setErrors((e) => {
      if (!e[field]) return e
      const next = { ...e }
      delete next[field]
      return next
    })
  }, [])

  const startCheckout = useCallback(() => setPhase('details'), [])
  const backToCart = useCallback(() => setPhase('cart'), [])

  const submit = useCallback(() => {
    /* Terminal until the timer resolves, so a double tap cannot place two orders. */
    if (phase === 'paying') return

    const found = validateDetails(details)
    setErrors(found)
    if (hasErrors(found)) return

    /* Snapshot before clearing, or the success screen would show nothing. */
    const placedLines = lines
    const placedTotal = total
    const placedFor = details

    setPhase('paying')

    timer.current = window.setTimeout(() => {
      setOrder({
        id: newOrderId(),
        placedAt: new Date().toISOString(),
        lines: placedLines,
        total: placedTotal,
        customer: placedFor,
      })
      clear()
      closeCart()
      setPhase('done')
    }, PAY_MS)
  }, [phase, details, lines, total, clear, closeCart])

  const finish = useCallback(() => {
    setPhase('cart')
    setOrder(null)
    setDetails(emptyDetails)
    setErrors({})
  }, [])

  const value = useMemo<CheckoutApi>(
    () => ({
      phase,
      details,
      errors,
      order,
      setField,
      startCheckout,
      backToCart,
      submit,
      finish,
    }),
    [phase, details, errors, order, setField, startCheckout, backToCart, submit, finish],
  )

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>
}

export function useCheckout(): CheckoutApi {
  const ctx = useContext(CheckoutContext)
  if (!ctx) throw new Error('useCheckout must be used inside <CheckoutProvider>')
  return ctx
}
