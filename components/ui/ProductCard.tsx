import { discountPercent, type Product } from '@/data/products'
import { ProductImage } from './Media'
import { ChevronDown } from './Icons'
import { WishlistButton } from './WishlistButton'
import { AddToCartButton } from './AddToCartButton'

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const weight = product.weights[0]
  const off = discountPercent(weight)

  return (
    <article
      className="rise group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_34px_var(--shadow)]"
      style={{ animationDelay: index * 60 + 'ms' }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--surface-alt)]">
        <ProductImage product={product} />

        {off > 0 && (
          <span className="absolute left-3 top-3 rounded-md bg-[var(--primary)] px-2 py-1 text-[11px] font-bold tracking-wide text-[var(--primary-ink)]">
            {off}% OFF
          </span>
        )}

        <WishlistButton productName={product.name} />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-[var(--ink)]">
            {product.name}
          </h3>
          <p className="mt-1 text-xs text-[var(--ink-muted)]">{product.detail}</p>
        </div>

        <div className="relative mt-auto w-fit">
          <select
            defaultValue={weight.label}
            aria-label={'Weight for ' + product.name}
            className="appearance-none rounded-lg border border-[var(--border)] bg-[var(--bg-alt)] py-1.5 pl-3 pr-8 text-xs font-medium text-[var(--ink)] transition-colors hover:border-[var(--primary)] cursor-pointer"
          >
            {product.weights.map((w) => (
              <option key={w.label} value={w.label}>
                {w.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--ink-muted)]" />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="tnum flex items-baseline gap-1.5">
            {weight.mrp && (
              <span className="text-xs text-[var(--ink-muted)] line-through">₹{weight.mrp}</span>
            )}
            <span className="text-lg font-bold text-[var(--primary)]">₹{weight.price}</span>
          </div>

          <AddToCartButton productName={product.name} />
        </div>
      </div>
    </article>
  )
}
