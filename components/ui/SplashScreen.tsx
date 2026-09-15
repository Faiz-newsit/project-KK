'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from 'motion/react'
import { SplashRibbons } from './SplashRibbons'
import { BRAND_LOGO_ATTR } from '@/lib/brand'
import type { ThemeId } from '@/themes/types'

/**
 * Splash timing, gathered here so the sequence is easy to retune -- set HOLD_MS
 * to 0 while working on the page underneath it.
 */
const ENTRY_DELAY_S = 0.25
const ENTRY_S = 0.6
const HOLD_MS = 1300
const MORPH_S = 0.45
const LOGO_W = 240

/** Decelerating in, accelerating out. */
const EASE_IN = [0.16, 1, 0.3, 1] as const
const EASE_OUT = [0.7, 0, 0.84, 0] as const

type Morph = { x: number; y: number; scale: number }

/**
 * Measures the header logo and works out the transform that would carry the
 * centred splash logo onto it. Returns null when the target is missing or has
 * no layout yet, which is the caller's signal to fall back to a plain fade.
 */
function measureMorph(splash: HTMLElement | null): Morph | null {
  if (!splash) return null
  const target = document.querySelector('[' + BRAND_LOGO_ATTR + ']')
  if (!target) return null

  const to = target.getBoundingClientRect()
  const from = splash.getBoundingClientRect()
  if (!to.width || !to.height || !from.width || !from.height) return null

  return {
    x: to.left + to.width / 2 - (from.left + from.width / 2),
    y: to.top + to.height / 2 - (from.top + from.height / 2),
    scale: to.width / from.width,
  }
}

const sleep = (ms: number) => new Promise((r) => window.setTimeout(r, ms))

/**
 * Brand splash shown on every full load of a festive route.
 *
 * It renders visible on the server, so it covers the page from the first paint
 * rather than flashing the hero and then hiding it. The ribbons paint on, the
 * logo settles, then the logo flies to the header's logo while the backdrop
 * fades -- so the wait doubles as the transition into the page.
 *
 * Colours come from the theme custom properties on the FestiveHome wrapper,
 * which is why this has to live inside that wrapper, not in the root layout.
 */
export function SplashScreen({ themeId }: { themeId: ThemeId }) {
  const [visible, setVisible] = useState(true)
  const logoRef = useRef<HTMLDivElement>(null)
  const logo = useAnimationControls()
  const reduce = useReducedMotion()

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      try {
        if (reduce) {
          await logo.start({ opacity: 1, scale: 1, transition: { duration: 0 } })
          await sleep(HOLD_MS)
        } else {
          await logo.start({
            opacity: 1,
            scale: 1,
            transition: { duration: ENTRY_S, delay: ENTRY_DELAY_S, ease: EASE_IN },
          })
          await sleep(HOLD_MS - (ENTRY_DELAY_S + ENTRY_S) * 1000)

          /* No measurable target -- fall through to the backdrop's plain fade. */
          const morph = cancelled ? null : measureMorph(logoRef.current)
          if (morph) {
            await logo.start({
              ...morph,
              transition: { duration: MORPH_S, ease: EASE_OUT },
            })
          }
        }
      } catch {
        /* Controls rejected because the component unmounted; nothing to do. */
      }

      if (!cancelled) setVisible(false)
    }

    run()
    return () => {
      cancelled = true
    }
  }, [logo, reduce])

  /* The page behind is already in the DOM, so it must not scroll underneath. */
  useEffect(() => {
    if (!visible) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [visible])

  return (
    <>
      {/* The overlay is server-rendered, so without JS nothing would ever remove
          it. Hide it outright in that case rather than trapping the page. */}
      <noscript>
        <style>{'[data-splash]{display:none!important}'}</style>
      </noscript>

      <AnimatePresence>
      {visible && (
        <motion.div
          data-splash
          aria-hidden="true"
          className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-[linear-gradient(160deg,var(--bg)_0%,var(--bg-alt)_100%)]"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
        >
          <SplashRibbons themeId={themeId} reduce={reduce} />

          {/* Warm glow, so a white logo on the white Independence palette still sits on something. */}
          <div
            className="pointer-events-none absolute h-[460px] w-[460px] rounded-full opacity-25 blur-3xl"
            style={{ background: 'radial-gradient(circle, var(--gold) 0%, transparent 70%)' }}
          />

          <motion.div
            ref={logoRef}
            className="relative"
            style={{ width: LOGO_W }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={logo}
          >
            <Image
              src="/brand/karikadai-logo.png"
              alt="Karikadai"
              width={592}
              height={320}
              priority
              className="h-auto w-full"
            />
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  )
}
