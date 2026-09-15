import type { CartLine } from '@/lib/cart/types'

export type Phase = 'cart' | 'details' | 'paying' | 'done'

/**
 * Fixed list, because there is no scheduling backend to query. The labels are
 * static strings, so "Today" is only accurate relative to when the demo is
 * viewed; real slots would come from a delivery service.
 */
export const DELIVERY_SLOTS = [
  'Today, 5-7 pm',
  'Today, 7-9 pm',
  'Tomorrow, 7-9 am',
  'Tomorrow, 5-7 pm',
] as const

export interface CustomerDetails {
  name: string
  phone: string
  address: string
  slot: string
}

export type FieldErrors = Partial<Record<keyof CustomerDetails, string>>

export interface Order {
  id: string
  placedAt: string
  /** Snapshot: the cart is cleared the moment the order is created. */
  lines: CartLine[]
  total: number
  customer: CustomerDetails
}

export const emptyDetails: CustomerDetails = { name: '', phone: '', address: '', slot: '' }

/** Simulated gateway latency. */
export const PAY_MS = 1800
