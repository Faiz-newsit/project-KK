import { discountPercent, type Product } from '@/data/products'
import { ProductImage } from './Media'
import { HeartIcon, PlusIcon, ChevronDown } from './Icons'

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const off = discountPercent(product)

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

        <button
          type="button"
          aria-label={'Save ' + product.name + ' to wishlist'}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-[var(--ink-muted)] backdrop-blur transition-colors duration-200 hover:text-[var(--primary)] cursor-pointer"
        >
          <HeartIcon className="h-4 w-4" />
        </button>
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
            defaultValue={product.weights[0]}
            aria-label={'Weight for ' + product.name}
            className="appearance-none rounded-lg border border-[var(--border)] bg-[var(--bg-alt)] py-1.5 pl-3 pr-8 text-xs font-medium text-[var(--ink)] transition-colors hover:border-[var(--primary)] cursor-pointer"
          >
            {product.weights.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--ink-muted)]" />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="tnum flex items-baseline gap-1.5">
            {product.mrp && (
              <span className="text-xs text-[var(--ink-muted)] line-through">
                ₹{product.mrp}
              </span>
            )}
            <span className="text-lg font-bold text-[var(--primary)]">₹{product.price}</span>
          </div>

          <button
            type="button"
            aria-label={'Add ' + product.name + ' to cart'}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[var(--primary)] text-[var(--primary)] transition-all duration-200 hover:bg-[var(--primary)] hover:text-[var(--primary-ink)] active:scale-95 cursor-pointer"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  )
}
