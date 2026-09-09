import { products } from './products'

/**
 * Demo cart. Derived from the real catalogue rather than hardcoded, so the
 * header total always matches the prices shown on the product cards.
 */
export const cartItems = products.slice(0, 3)
export const cartCount = cartItems.length
export const cartTotal = cartItems.reduce((sum, p) => sum + p.price, 0)

/** Indian digit grouping: 1,215 / 1,20,500. */
export const formatRupees = (n: number) => '₹' + n.toLocaleString('en-IN')
