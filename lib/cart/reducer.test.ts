import { describe, it, expect } from 'vitest'
import { cartReducer, selectCount, selectTotal } from './reducer'
import { initialCartState, type CartState } from './types'

const mince = { productId: 'chicken-mince', weightLabel: '1 Kg', unitPrice: 555 }
const minceHalf = { productId: 'chicken-mince', weightLabel: '500 Grams', unitPrice: 289 }

const withLines = (lines: CartState['lines']): CartState => ({ lines, hydrated: true })

describe('cartReducer', () => {
  it('ADD to an empty cart creates one line with qty 1', () => {
    const next = cartReducer(initialCartState, { type: 'ADD', line: mince })
    expect(next.lines).toEqual([{ ...mince, qty: 1 }])
  })

  it('ADD of the same product and weight increments instead of duplicating', () => {
    const once = cartReducer(initialCartState, { type: 'ADD', line: mince })
    const twice = cartReducer(once, { type: 'ADD', line: mince })
    expect(twice.lines).toHaveLength(1)
    expect(twice.lines[0].qty).toBe(2)
  })

  it('ADD of the same product at a different weight makes a separate line', () => {
    const once = cartReducer(initialCartState, { type: 'ADD', line: mince })
    const twice = cartReducer(once, { type: 'ADD', line: minceHalf })
    expect(twice.lines).toHaveLength(2)
  })

  it('SET_QTY to 0 removes the line', () => {
    const state = withLines([{ ...mince, qty: 3 }])
    const next = cartReducer(state, {
      type: 'SET_QTY',
      productId: mince.productId,
      weightLabel: mince.weightLabel,
      qty: 0,
    })
    expect(next.lines).toHaveLength(0)
  })

  it('SET_QTY above the cap clamps to 99', () => {
    const state = withLines([{ ...mince, qty: 3 }])
    const next = cartReducer(state, {
      type: 'SET_QTY',
      productId: mince.productId,
      weightLabel: mince.weightLabel,
      qty: 500,
    })
    expect(next.lines[0].qty).toBe(99)
  })

  it('REMOVE deletes only the targeted line', () => {
    const state = withLines([
      { ...mince, qty: 1 },
      { ...minceHalf, qty: 2 },
    ])
    const next = cartReducer(state, {
      type: 'REMOVE',
      productId: mince.productId,
      weightLabel: mince.weightLabel,
    })
    expect(next.lines).toEqual([{ ...minceHalf, qty: 2 }])
  })

  it('HYDRATE drops lines whose product is no longer in the catalogue', () => {
    const stored = [
      { ...mince, qty: 1 },
      { productId: 'discontinued-cut', weightLabel: '1 Kg', unitPrice: 100, qty: 4 },
    ]
    const next = cartReducer(initialCartState, {
      type: 'HYDRATE',
      lines: stored,
      validIds: ['chicken-mince'],
    })
    expect(next.lines).toEqual([{ ...mince, qty: 1 }])
    expect(next.hydrated).toBe(true)
  })

  it('selectTotal multiplies unit price by quantity across lines', () => {
    const state = withLines([
      { ...mince, qty: 2 },
      { ...minceHalf, qty: 1 },
    ])
    expect(selectTotal(state)).toBe(555 * 2 + 289)
  })

  it('selectCount sums quantities rather than counting lines', () => {
    const state = withLines([
      { ...mince, qty: 2 },
      { ...minceHalf, qty: 3 },
    ])
    expect(selectCount(state)).toBe(5)
  })
})
