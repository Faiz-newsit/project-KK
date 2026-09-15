'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

/**
 * How long the logo stays on screen before the overlay starts leaving, and how
 * long the leave itself takes. Both are here so the splash is easy to retune --
 * set HOLD_MS to 0 while working on the page below it.
 */
const HOLD_MS = 1400
const EXIT_S = 0.45

/**
 * Brand splash shown on every full load of a festive route.
 *
 * It renders visible on the server, so it covers the page from the first paint
 * rather than flashing the hero and then hiding it. Colours come from the theme
 * custom properties on the FestiveHome wrapper, which is why this has to live
 * inside that wrapper and not in the root layout.
 */
export function SplashScreen() {
  const [visible, setVisible] = useState(true)
  const reduce = useReducedMotion()

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), HOLD_MS)
    return () => window.clearTimeout(timer)
  }, [])

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
    <AnimatePresence>
      {visible && (
        <motion.div
          aria-hidden="true"
          className="fixed inset-0 z-[100] grid place-items-center bg-[linear-gradient(160deg,var(--bg)_0%,var(--bg-alt)_100%)]"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -14 }}
          transition={{ duration: EXIT_S, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Warm glow behind the mark, so a white logo on a white theme still sits on something. */}
          <div
            className="pointer-events-none absolute h-[420px] w-[420px] rounded-full opacity-45 blur-3xl"
            style={{
              background:
                'radial-gradient(circle, var(--gold) 0%, transparent 70%)',
            }}
          />

          <motion.div
            className="relative w-[200px] sm:w-[240px]"
            initial={reduce ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
  )
}
