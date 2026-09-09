export interface Product {
  id: string
  name: string
  image: string
  weights: string[]
  price: number
  mrp?: number
  /** Cut description -- context shoppers actually use to choose. */
  detail: string
}

/** Photography is the brand's own, taken from the live Karikadai catalogue. */
export const products: Product[] = [
  {
    id: 'chicken-mince',
    name: 'Chicken Mince (Keema)',
    image: '/products/chicken-mince.png',
    weights: ['1 Kg', '500 Grams', '250 Grams'],
    price: 555,
    detail: 'Serves 4-5 · Finely minced, skinless',
  },
  {
    id: 'chicken-curry-cut',
    name: 'Chicken Curry Cut With Skin',
    image: '/products/chicken-curry-cut.png',
    weights: ['1 Kg', '500 Grams'],
    price: 310,
    detail: 'Serves 3-4 · Bone-in, 12-14 pieces',
  },
  {
    id: 'mutton-curry-cut',
    name: 'Mutton Curry Cut',
    image: '/products/mutton-curry-cut.png',
    weights: ['1 Kg', '500 Grams'],
    price: 350,
    mrp: 500,
    detail: 'Serves 3-4 · Bone-in, tender shoulder',
  },
  {
    id: 'seer-fish-slices',
    name: 'Seer Fish - Slices',
    image: '/products/seer-fish-slices.png',
    weights: ['1 Kg', '500 Grams'],
    price: 1750,
    mrp: 2050,
    detail: 'Serves 4-5 · Thick cut, cleaned',
  },
]

export const discountPercent = (p: Product) =>
  p.mrp ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0
