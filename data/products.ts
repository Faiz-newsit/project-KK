export interface ProductWeight {
  label: string
  price: number
  /** Struck-through reference price. Omit when the cut is not discounted. */
  mrp?: number
}

export interface Product {
  id: string
  name: string
  image: string
  /** First entry is the default selection on the card. */
  weights: ProductWeight[]
  /** Cut description -- context shoppers actually use to choose. */
  detail: string
}

/**
 * Photography is the brand's own, taken from the live Karikadai catalogue.
 *
 * PLACEHOLDER PRICES: the 1 Kg figures came from the original catalogue, but
 * every smaller weight below is an invented approximation. Replace them with
 * real Karikadai prices before this is shown outside the team.
 */
export const products: Product[] = [
  {
    id: 'chicken-mince',
    name: 'Chicken Mince (Keema)',
    image: '/products/chicken-mince.png',
    weights: [
      { label: '1 Kg', price: 555 },
      { label: '500 Grams', price: 289 },
      { label: '250 Grams', price: 155 },
    ],
    detail: 'Serves 4-5 · Finely minced, skinless',
  },
  {
    id: 'chicken-curry-cut',
    name: 'Chicken Curry Cut With Skin',
    image: '/products/chicken-curry-cut.png',
    weights: [
      { label: '1 Kg', price: 310 },
      { label: '500 Grams', price: 165 },
    ],
    detail: 'Serves 3-4 · Bone-in, 12-14 pieces',
  },
  {
    id: 'mutton-curry-cut',
    name: 'Mutton Curry Cut',
    image: '/products/mutton-curry-cut.png',
    weights: [
      { label: '1 Kg', price: 350, mrp: 500 },
      { label: '500 Grams', price: 185, mrp: 260 },
    ],
    detail: 'Serves 3-4 · Bone-in, tender shoulder',
  },
  {
    id: 'seer-fish-slices',
    name: 'Seer Fish - Slices',
    image: '/products/seer-fish-slices.png',
    weights: [
      { label: '1 Kg', price: 1750, mrp: 2050 },
      { label: '500 Grams', price: 890, mrp: 1040 },
    ],
    detail: 'Serves 4-5 · Thick cut, cleaned',
  },
]

/** Discount is now a property of the chosen weight, not of the product. */
export const discountPercent = (w: ProductWeight) =>
  w.mrp ? Math.round(((w.mrp - w.price) / w.mrp) * 100) : 0
