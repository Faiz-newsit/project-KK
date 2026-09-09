import { ArrowRight } from './Icons'

export function SectionHeading({
  title,
  subtitle,
  viewAll = true,
}: {
  title: string
  subtitle?: string
  viewAll?: boolean
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-6">
      <div>
        <h2 className="text-[26px] font-bold tracking-[-0.02em] text-[var(--ink)] sm:text-[32px]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-[var(--ink-muted)]">{subtitle}</p>
        )}
      </div>

      {viewAll && (
        <button
          type="button"
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[var(--primary)] transition-colors hover:text-[var(--primary-hover)] cursor-pointer"
        >
          View All
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      )}
    </div>
  )
}
