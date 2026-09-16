import Image from 'next/image'
import type { Theme } from '@/themes/types'
import { RibbonSweep, GlowWash, LightString } from '@/components/ui/FestiveArt'
import { Reveal } from '@/components/ui/Reveal'
import { ShopNowButton } from '@/components/ui/ShopNowButton'

export function PromoBanner({ theme }: { theme: Theme }) {
  const { eyebrow, headline, sub, cta, script, image } = theme.content.promo

  /* --- artwork supplied: show it, overlay only the CTA --- */
  if (image) {
    return (
      <Reveal className="mx-auto max-w-[1320px] px-4 pb-4">
        <section aria-labelledby="promo-heading">
          {/* The offer copy lives inside the artwork, so it is restated here for
              screen readers and search engines rather than being lost as pixels. */}
          <h2 id="promo-heading" className="sr-only">
            {eyebrow}: {headline} {sub}
          </h2>

          <div className="overflow-hidden rounded-2xl bg-[var(--surface-alt)]">
            {/* Capped height: the artwork is 3:1, which would eat a third of the
                viewport. 340px keeps it 23% shorter than native.
                object-position 40% biases the crop upward so the chakra stays
                whole, while still leaving clear field below the copy for the CTA.
                Both clearances were solved for rather than eyeballed. */}
            <div className="relative h-[clamp(160px,25vw,340px)] w-full">
              <Image
                src={image}
                alt={`${eyebrow}. ${headline} ${sub}.`}
                fill
                sizes="(max-width: 1360px) 100vw, 1320px"
                className="object-cover object-[center_40%]"
              />

              {/* Positioning lives on this wrapper, never on the button itself.
                  ShopNowButton needs `relative` for its shine sweep, and Tailwind
                  emits `.relative` after `.absolute`, so a positioning class
                  passed into the button would silently lose the cascade.

                  Anchored to the bottom edge rather than a percentage: the gap
                  below the copy is what matters, and it holds as the banner
                  scales. Overlay only from xl up; below that the art is too short
                  to clear the copy, so the CTA drops to its own row. */}
              <span className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 xl:block">
                <ShopNowButton label={cta} compact />
              </span>
            </div>

            {/* Under xl the CTA sits below the art at full size. */}
            <div className="flex justify-center px-4 py-3 xl:hidden">
              <ShopNowButton label={cta} />
            </div>
          </div>
        </section>
      </Reveal>
    )
  }

  /* --- no artwork: typeset the offer in HTML --- */
  return (
    <Reveal className="mx-auto max-w-[1320px] px-4 pb-4">
      <div
        className="relative isolate overflow-hidden rounded-2xl"
        style={{
          background: 'linear-gradient(100deg, var(--promo-from), var(--promo-to))',
          color: 'var(--promo-ink)',
        }}
        aria-label={eyebrow}
      >
        {/* Same rule as the hero: ribbons on a flat page, lamplight over the sky. */}
        {theme.backdrop ? (
          <>
            <GlowWash className="absolute -left-20 -top-24 -z-10 h-64 w-64 opacity-30" />
            <GlowWash
              tone="accent"
              className="absolute -bottom-24 -right-16 -z-10 h-64 w-64 opacity-25"
            />
            <LightString className="absolute inset-x-0 top-0 -z-10 opacity-90" />
          </>
        ) : (
          <>
            <RibbonSweep
              themeId={theme.id}
              className="pointer-events-none absolute -left-10 -top-6 -z-10 h-32 w-[30rem] opacity-70"
            />
            <RibbonSweep
              themeId={theme.id}
              flip
              className="pointer-events-none absolute -bottom-8 -right-10 -z-10 h-28 w-[26rem] opacity-55"
            />
          </>
        )}

        <div className="flex flex-col items-center gap-4 px-6 py-8 text-center sm:px-12 md:flex-row md:justify-between md:text-left">
          <div>
            <p className="font-script text-[22px] leading-none text-[var(--primary)] sm:text-[26px]">
              {eyebrow}
            </p>
            <p className="mt-1.5 text-[30px] font-extrabold uppercase leading-none sm:text-[40px]">
              {headline}
            </p>
            <p className="mt-1.5 text-sm opacity-80">{sub}</p>
            <ShopNowButton label={cta} className="mt-4" />
          </div>

          <p className="max-w-[12rem] font-script text-[24px] leading-tight opacity-85 sm:text-[28px]">
            {script}
          </p>
        </div>
      </div>
    </Reveal>
  )
}
