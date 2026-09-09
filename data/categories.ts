export interface Category {
  id: string
  name: string
  image: string
}

export const categories: Category[] = [
  { id: 'chicken', name: 'Chicken', image: '/categories/chicken.png' },
  { id: 'mutton', name: 'Mutton', image: '/categories/mutton.png' },
  { id: 'seafood', name: 'Seafood', image: '/categories/seafood.png' },
  { id: 'premium-cuts', name: 'Premium Cuts', image: '/categories/premium-cuts.png' },
  { id: 'protein-packs', name: 'Protein Packs', image: '/categories/protein-packs.png' },
  { id: '99-store', name: '99 Store', image: '/categories/99-store.png' },
]
