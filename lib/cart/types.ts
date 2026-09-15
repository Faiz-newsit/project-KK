/**
 * One line in the cart. `unitPrice` is snapshotted when the line is created,
 * so a later catalogue price change cannot silently rewrite what a shopper
 * already has in their cart.
 */
export interface CartLine {
  productId: string
  weightLabel: string
  unitPrice: number
  qty: number
}

export interface CartState {
  lines: CartLine[]
  /** False until localStorage has been read; the header badge waits on this. */
  hydrated: boolean
}

/** Identifies a line. Product plus weight, because the same cut at two weights is two lines. */
export interface LineKey {
  productId: string
  weightLabel: string
}

export type CartAction =
  | { type: 'ADD'; line: Omit<CartLine, 'qty'>; qty?: number }
  | { type: 'SET_QTY'; productId: string; weightLabel: string; qty: number }
  | { type: 'REMOVE'; productId: string; weightLabel: string }
  | { type: 'HYDRATE'; lines: CartLine[]; validIds: string[] }
  | { type: 'CLEAR' }

/** Keeps the badge and totals sane if someone leans on the + button. */
export const MAX_QTY = 99

export const initialCartState: CartState = { lines: [], hydrated: false }
