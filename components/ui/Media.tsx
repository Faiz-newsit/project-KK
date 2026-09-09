import Image from 'next/image'
import type { Product } from '@/data/products'
import type { Category } from '@/data/categories'

export function ProductImage({ product, priority = false }: { product: Product; priority?: boolean }) {
  return (
    <Image
      src={product.image}
      alt={product.name}
      fill
      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
      priority={priority}
      className="object-cover transition-transform duration-500 group-hover:scale-105"
    />
  )
}

export function CategoryImage({ category }: { category: Category }) {
  return (
    <Image
      src={category.image}
      alt={category.name}
      fill
      sizes="140px"
      className="object-cover"
    />
  )
}
