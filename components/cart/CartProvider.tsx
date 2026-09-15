'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react'
import { cartReducer, selectCount, selectTotal } from '@/lib/cart/reducer'
import { initialCartState, type CartLine } from '@/lib/cart/types'
import { products } from '@/data/products'

const STORAGE_KEY = 'karikadai.cart.v1'

interface CartApi {
  lines: CartLine[]
  count: number
  total: number
  hydrated: boolean
  isOpen: boolean
  add: (line: Omit<CartLine, 'qty'>, qty?: number) => void
  setQty: (productId: string, weightLabel: string, qty: number) => void
  remove: (productId: string, weightLabel: string) => void
  clear: () => void
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartApi | null>(null)

/** Storage can throw in private mode or when the quota is full; never let that break the cart. */
function readStored(): CartLine[] | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as CartLine[]) : null
  } catch {
    return null
  }
}

/**
 * Owns cart state for the page.
 *
 * `children` is a prop rather than JSX written inside this file, so the Server
 * Components rendered within it stay server-rendered.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState)
  const [isOpen, setIsOpen] = useState(false)

  /* localStorage does not exist during SSR, so the cart starts empty on the
     server and on the first client render, then hydrates. Rendering a stored
     count straight away would be a hydration mismatch. */
  useEffect(() => {
    const stored = readStored()
    dispatch({
      type: 'HYDRATE',
      lines: stored ?? [],
      validIds: products.map((p) => p.id),
    })
  }, [])

  /* Only persist after hydrating, or the empty initial state would immediately
     overwrite a real stored cart. */
  useEffect(() => {
    if (!state.hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines))
    } catch {
      /* Quota or blocked storage -- the cart still works for this session. */
    }
  }, [state.lines, state.hydrated])

  const add = useCallback((line: Omit<CartLine, 'qty'>, qty?: number) => {
    dispatch({ type: 'ADD', line, qty })
  }, [])

  const setQty = useCallback((productId: string, weightLabel: string, qty: number) => {
    dispatch({ type: 'SET_QTY', productId, weightLabel, qty })
  }, [])

  const remove = useCallback((productId: string, weightLabel: string) => {
    dispatch({ type: 'REMOVE', productId, weightLabel })
  }, [])

  const clear = useCallback(() => dispatch({ type: 'CLEAR' }), [])
  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const value = useMemo<CartApi>(
    () => ({
      lines: state.lines,
      count: selectCount(state),
      total: selectTotal(state),
      hydrated: state.hydrated,
      isOpen,
      add,
      setQty,
      remove,
      clear,
      openCart,
      closeCart,
    }),
    [state, isOpen, add, setQty, remove, clear, openCart, closeCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartApi {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
