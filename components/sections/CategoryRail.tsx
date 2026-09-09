import { categories } from '@/data/categories'
import { CategoryImage } from '@/components/ui/Media'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ChevronLeft, ChevronRight } from '@/components/ui/Icons'

export function CategoryRail() {
  return (
    <section className="mx-auto max-w-[1320px] px-4 py-10 sm:py-12" aria-label="Shop by category">
      <SectionHeading title="Shop by Category" />

      <div className="relative">
        <ul className="no-scrollbar -mx-1 flex gap-4 overflow-x-auto px-1 pb-2 sm:grid sm:grid-cols-6 sm:gap-6 sm:overflow-visible">
          {categories.map((category, i) => (
            <li key={category.id} className="shrink-0 basis-[112px] sm:basis-auto">
              <button
                type="button"
                className="rise group flex w-full flex-col items-center gap-2.5 cursor-pointer"
                style={{ animationDelay: i * 50 + 'ms' }}
              >
                <span className="relative block aspect-square w-full overflow-hidden rounded-full border-2 border-[var(--border)] bg-[var(--surface)] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[var(--primary)] group-hover:shadow-[0_10px_24px_var(--shadow)]">
                  <CategoryImage category={category} />
                </span>
                <span className="text-center text-[13px] font-medium text-[var(--ink)] transition-colors group-hover:text-[var(--primary)]">
                  {category.name}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {/* Rail arrows mirror the mockup; the list scrolls natively on touch. */}
        {[
          { side: 'left', Icon: ChevronLeft, label: 'Scroll categories left' },
          { side: 'right', Icon: ChevronRight, label: 'Scroll categories right' },
        ].map(({ side, Icon, label }) => (
          <button
            key={side}
            type="button"
            aria-label={label}
            className={[
              'absolute top-[38%] hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full',
              'border border-[var(--border)] bg-[var(--surface)] text-[var(--ink-muted)] shadow-[0_4px_12px_var(--shadow)]',
              'transition-colors duration-200 hover:border-[var(--primary)] hover:text-[var(--primary)]',
              'lg:grid cursor-pointer',
              side === 'left' ? '-left-4' : '-right-4',
            ].join(' ')}
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
      </div>
    </section>
  )
}
