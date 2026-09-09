import type { Theme } from '@/themes/types'
import { products } from '@/data/products'
import { ProductCard } from '@/components/ui/ProductCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'

export function ProductGrid({ theme }: { theme: Theme }) {
  const { title, subtitle } = theme.content.favourites

  return (
    <section className="mx-auto max-w-[1320px] px-4 py-10 sm:py-12" aria-label={title}>
      <SectionHeading title={title} subtitle={subtitle} />

      <Reveal className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </Reveal>
    </section>
  )
}
