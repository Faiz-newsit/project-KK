import { MAX_QTY, type CartAction, type CartState, type LineKey } from './types'

const isSameLine = (a: LineKey, b: LineKey) =>
  a.productId === b.productId && a.weightLabel === b.weightLabel

const clampQty = (n: number) => Math.min(Math.max(Math.trunc(n), 0), MAX_QTY)

/**
 * Pure cart logic. Imports nothing from React, so it can be tested without a
 * DOM and cannot accidentally depend on render order.
 */
export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const addition = action.qty ?? 1
      const exists = state.lines.some((line) => isSameLine(line, action.line))

      /* Same cut at the same weight is one line with a higher count, not two lines. */
      if (exists) {
        return {
          ...state,
          lines: state.lines.map((line) =>
            isSameLine(line, action.line) ? { ...line, qty: clampQty(line.qty + addition) } : line,
          ),
        }
      }

      return { ...state, lines: [...state.lines, { ...action.line, qty: clampQty(addition) }] }
    }

    case 'SET_QTY': {
      const qty = clampQty(action.qty)

      /* Stepping down to zero is how a shopper removes a line. */
      if (qty === 0) {
        return { ...state, lines: state.lines.filter((line) => !isSameLine(line, action)) }
      }

      return {
        ...state,
        lines: state.lines.map((line) => (isSameLine(line, action) ? { ...line, qty } : line)),
      }
    }

    case 'REMOVE':
      return { ...state, lines: state.lines.filter((line) => !isSameLine(line, action)) }

    case 'HYDRATE':
      /* A cart stored before a catalogue change can name products that no longer exist. */
      return {
        lines: action.lines.filter((line) => action.validIds.includes(line.productId)),
        hydrated: true,
      }

    case 'CLEAR':
      return { ...state, lines: [] }
  }
}

export const selectCount = (state: CartState) =>
  state.lines.reduce((total, line) => total + line.qty, 0)

export const selectTotal = (state: CartState) =>
  state.lines.reduce((total, line) => total + line.unitPrice * line.qty, 0)
