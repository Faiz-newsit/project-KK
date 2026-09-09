import Image from 'next/image'
import type { Theme } from '@/themes/types'
import { GooglePlayLogo, AppStoreLogo } from '@phosphor-icons/react/dist/ssr'
import { Reveal } from '@/components/ui/Reveal'

function StoreBadge({
  line1,
  line2,
  Logo,
  compact = false,
}: {
  line1: string
  line2: string
  Logo: typeof GooglePlayLogo
  compact?: boolean
}) {
  return (
    <button
      type="button"
      className={[
        'flex items-center gap-2.5 rounded-xl bg-[#141414] text-white',
        'shadow-[0_6px_18px_rgba(20,20,20,0.28)] ring-1 ring-white/15',
        'transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer',
        compact ? 'h-11 px-3.5' : 'h-12 px-4',
      ].join(' ')}
    >
      <Logo size={compact ? 20 : 24} weight="fill" />
      <span className="text-left leading-tight">
        <span className="block text-[9px] uppercase tracking-wide opacity-75">{line1}</span>
        <span className={compact ? 'block text-[13px] font-semibold' : 'block text-[15px] font-semibold'}>
          {line2}
        </span>
      </span>
    </button>
  )
}

function Badges({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <StoreBadge line1="Get it on" line2="Google Play" Logo={GooglePlayLogo} compact={compact} />
      <StoreBadge
        line1="Download on the"
        line2="App Store"
        Logo={AppStoreLogo}
        compact={compact}
      />
    </div>
  )
}

export function AppDownload({ theme }: { theme: Theme }) {
  const { title, subtitle, image } = theme.content.app

  /* --- artwork supplied: show it, overlay only the store badges --- */
  if (image) {
    return (
      <Reveal className="mx-auto max-w-[1320px] px-4 py-10">
        <section aria-labelledby="app-heading">
          {/* Copy lives inside the artwork, so it is restated here for screen
              readers and search engines rather than being lost as pixels. */}
          <h2 id="app-heading" className="sr-only">
            {title}. {subtitle}
          </h2>

          <div className="overflow-hidden rounded-2xl bg-[var(--surface-alt)]">
            <div className="relative h-[clamp(200px,32vw,430px)] w-full">
              <Image
                src={image}
                alt={`${title}. ${subtitle}`}
                fill
                sizes="(max-width: 1360px) 100vw, 1320px"
                className="object-cover object-center"
              />

              {/* Height is set so the artwork is ~99% visible: at 3:1 anything
                  shorter crops the phone mockup's top and bottom off. Capped at
                  430px, which stays under container-width/3 at every breakpoint,
                  so the crop is only ever vertical and only ever ~1%.

                  Badge position is measured, not eyeballed. An ink scan of the
                  feature row finds three chip clusters spanning x 10.1%..42.8%,
                  so its optical centre is 26.4%. These offsets put the pair's
                  centre within 0.6% of that at every breakpoint, while keeping
                  its right edge inside the cream band (which ends at ~46.5%,
                  where the meat and board begin). Two values are needed because
                  the fixed-width pair covers a larger share of a narrow
                  container than a wide one. */}
              <div className="absolute left-[9%] top-[70%] hidden -translate-y-1/2 lg:block xl:left-[13%]">
                <Badges compact />
              </div>
            </div>

            {/* Under lg the badges sit below the art at full size. */}
            <div className="flex justify-center px-4 py-4 lg:hidden">
              <Badges />
            </div>
          </div>
        </section>
      </Reveal>
    )
  }

  /* --- no artwork: typeset the block in HTML --- */
  return (
    <section
      className="border-y border-[var(--border)]"
      style={{ background: 'linear-gradient(100deg, var(--hero-from), var(--hero-to))' }}
      aria-label={title}
    >
      <Reveal className="mx-auto flex max-w-[1320px] flex-col items-center justify-between gap-6 px-4 py-12 sm:flex-row">
        <div className="text-center sm:text-left">
          <h2 className="text-[24px] font-bold text-[var(--ink)] sm:text-[30px]">{title}</h2>
          <p className="mt-1.5 max-w-[46ch] text-sm text-[var(--ink-muted)]">{subtitle}</p>
        </div>
        <Badges />
      </Reveal>
    </section>
  )
}
