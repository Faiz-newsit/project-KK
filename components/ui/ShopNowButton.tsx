import { ArrowRight } from './Icons'

/**
 * Primary festive CTA. The gradient, warm glow and ring do the work at rest --
 * the shine sweep is a hover bonus only, since hover never fires on touch.
 */
export function ShopNowButton({
  label,
  className = '',
  compact = false,
}: {
  label: string
  className?: string
  /** 40px variant for the overlay, where vertical room inside the art is tight. */
  compact?: boolean
}) {
  return (
    <button
      type="button"
      className={[
        'group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full',
        'font-bold tracking-[0.01em] text-white',
        compact
          ? 'h-10 px-6 text-sm'
          : 'min-h-[48px] px-7 text-[15px] sm:px-8 sm:text-base',
        'bg-[linear-gradient(100deg,#F2751F_0%,#E0341A_52%,#C21F12_100%)]',
        'shadow-[0_8px_22px_rgba(200,60,25,0.42),inset_0_1px_0_rgba(255,255,255,0.34)]',
        'ring-1 ring-white/25',
        'transition-[transform,box-shadow] duration-200 ease-out',
        'hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(200,60,25,0.52),inset_0_1px_0_rgba(255,255,255,0.4)]',
        'active:translate-y-0 active:scale-[0.97]',
        'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#C21F12]',
        'cursor-pointer',
        className,
      ].join(' ')}
    >
      {/* Shine sweep: decorative, hover-only, never the sole affordance. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.45),transparent)] transition-all duration-700 ease-out group-hover:left-[130%] motion-reduce:hidden"
      />

      <span className="relative">{label}</span>

      <span
        className={[
          'relative grid place-items-center rounded-full bg-white/20',
          'transition-transform duration-200 ease-out group-hover:translate-x-0.5',
          compact ? 'h-5 w-5' : 'h-6 w-6',
        ].join(' ')}
      >
        <ArrowRight size={compact ? 12 : 14} weight="bold" />
      </span>
    </button>
  )
}
