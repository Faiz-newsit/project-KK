import Image from 'next/image'
import type { Theme, HeroTitleLine } from '@/themes/types'
import { Button } from '@/components/ui/Button'
import { RibbonSweep, GlowWash, LightString } from '@/components/ui/FestiveArt'
import { BrushUnderline } from '@/components/ui/TricolourRibbon'
import { FestiveGlyph } from '@/components/ui/FestiveGlyph'
import { Reveal } from '@/components/ui/Reveal'
import { ShopNowButton } from '@/components/ui/ShopNowButton'
import { featureIcons, ChevronLeft, ChevronRight } from '@/components/ui/Icons'

const toneClass = {
  primary: 'text-[var(--primary)]',
  accent: 'text-[var(--accent)]',
  ink: 'text-[var(--ink)]',
} as const

function TitleLine({ line }: { line: HeroTitleLine }) {
  if (!line.underline) {
    return <span className={'block ' + toneClass[line.tone]}>{line.text}</span>
  }
  return (
    <span className={'relative inline-block ' + toneClass[line.tone]}>
      {line.text}
      <BrushUnderline className="absolute -bottom-1 left-0 h-[0.28em] w-full text-[var(--accent)] opacity-70" />
    </span>
  )
}

/**
 * Festive hero. Where a theme supplies artwork the panel is that image, with the
 * copy set over its open left side; otherwise it falls back to a gradient with
 * painted decoration. The artwork already carries the product, so no separate
 * product card is drawn on top of it.
 *
 * Which decoration depends on what the panel sits on. Flat themes get the
 * brand ribbon sweeps; a theme running over the midnight sky gets a lamp
 * garland and two warm glows instead, because ribbons read as paint on a page
 * while a night sky wants light falling into it.
 *
 * The panel is capped to the same 1320px column as every other section rather
 * than bleeding full width, so the artwork keeps its proportions on very wide
 * or zoomed-out windows instead of stretching alone.
 *
 * Copy enters in a short stagger (60ms steps). Reveal collapses to a plain
 * render under prefers-reduced-motion.
 */
export function Hero({ theme }: { theme: Theme }) {
  const { titleLines, subtitle, chips, ctaPrimary, ctaSecondary, script, art } = theme.content.hero
  const { code } = theme.content.announcement
  const offer = `${theme.content.promo.headline} on all fresh cuts`

  return (
    <section className="mx-auto max-w-[1320px] px-4 pt-4" aria-label="Festive offer">
      <div
        className="relative isolate overflow-hidden rounded-2xl"
        style={{ background: 'linear-gradient(115deg, var(--hero-from), var(--hero-to))' }}
      >
        {art ? (
          <>
            <Image
              src={art}
              alt=""
              aria-hidden="true"
              fill
              priority
              sizes="(max-width: 1360px) 100vw, 1320px"
              className="-z-20 object-cover object-[center_30%]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,252,247,0.94)_0%,rgba(255,252,247,0.80)_32%,rgba(255,252,247,0.30)_54%,transparent_72%)]"
            />
          </>
        ) : theme.backdrop ? (
          <>
            <GlowWash className="absolute -left-24 -top-28 -z-10 h-80 w-80 opacity-30" />
            <GlowWash
              tone="accent"
              className="absolute -bottom-32 right-[-6rem] -z-10 h-80 w-80 opacity-25"
            />
            <LightString className="absolute inset-x-0 top-0 -z-10" />
          </>
        ) : (
          <>
            <RibbonSweep
              themeId={theme.id}
              className="pointer-events-none absolute -left-20 -top-12 -z-10 h-36 w-[40rem] opacity-75"
            />
            <RibbonSweep
              themeId={theme.id}
              flip
              className="pointer-events-none absolute -bottom-14 -left-24 -z-10 h-32 w-[36rem] opacity-60"
            />
          </>
        )}

        <div className="flex min-h-[clamp(380px,38vw,520px)] items-center px-6 py-12 sm:px-12">
          <div className="w-full lg:max-w-[54%]">
            {/* Offer and coupon surfaced in the hero, not just the top bar --
                the credibility-first pattern wants the reason to buy visible
                before any scrolling. */}
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full bg-[var(--glass)] py-1.5 pl-2 pr-3.5 text-[13px] font-semibold text-[var(--ink)] ring-1 ring-[var(--glass-ring)] backdrop-blur-md">
                <FestiveGlyph
                  themeId={theme.id}
                  className="h-[15px] w-[21px] shrink-0 rounded-[2px] text-[var(--primary)]"
                />
                <span className="capitalize">{offer}</span>
                <span aria-hidden="true" className="text-[var(--ink-muted)]">
                  ·
                </span>
                <span className="font-extrabold tracking-wide text-[var(--primary)]">{code}</span>
              </p>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="mt-4 text-[clamp(2.1rem,4.4vw,3.5rem)] font-extrabold leading-[1.08]">
                {titleLines.map((line) => (
                  <span key={line.text} className="block">
                    <TitleLine line={line} />
                  </span>
                ))}
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-4 max-w-[34ch] text-[15px] font-medium leading-relaxed text-[var(--ink-muted)] sm:text-base">
                {subtitle}
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <ul className="mt-6 flex flex-wrap items-center gap-2.5">
                {chips.map((chip) => {
                  const Icon = featureIcons[chip.icon]
                  return (
                    <li
                      key={chip.label}
                      className="flex items-center gap-2 rounded-full bg-[var(--glass)] py-1.5 pl-2 pr-3.5 text-[13px] font-semibold text-[var(--ink)] ring-1 ring-[var(--glass-ring)] backdrop-blur-md"
                    >
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--accent)]/12 text-[var(--accent)]">
                        <Icon size={16} weight="bold" />
                      </span>
                      {chip.label}
                    </li>
                  )
                })}
              </ul>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <ShopNowButton label={ctaPrimary} />
                <Button variant="glass" size="lg">
                  {ctaSecondary}
                </Button>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Handwritten tag, beside the product in the artwork. Raised clear of the
            fixed festive switcher, which sits in the same corner. */}
        <p
          className="pointer-events-none absolute bottom-24 right-[6%] hidden max-w-[11rem] rotate-[-6deg] text-right font-script text-[clamp(1.3rem,1.8vw,1.75rem)] leading-tight text-[var(--script-ink)] xl:block"
          style={{ filter: 'drop-shadow(0 1px 3px var(--script-halo))' }}
        >
          {script}
        </p>

        {/* Carousel affordances mirror the comp; slides are not wired in this demo build. */}
        {[
          { side: 'left', Icon: ChevronLeft, label: 'Previous slide' },
          { side: 'right', Icon: ChevronRight, label: 'Next slide' },
        ].map(({ side, Icon, label }) => (
          <button
            key={side}
            type="button"
            aria-label={label}
            className={[
              'absolute top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full',
              'bg-[var(--glass)] text-[var(--ink)] ring-1 ring-[var(--glass-ring)] backdrop-blur-md',
              'transition-all duration-200 hover:text-[var(--primary)] hover:ring-[var(--primary)]',
              'active:scale-95 sm:grid cursor-pointer',
              side === 'left' ? 'left-3' : 'right-3',
            ].join(' ')}
          >
            <Icon size={20} weight="bold" />
          </button>
        ))}
      </div>
    </section>
  )
}
