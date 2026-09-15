'use client'

import { motion } from 'motion/react'
import { RIBBONS } from './FestiveArt'
import type { ThemeId } from '@/themes/types'

/** Path length used to seed the dash offset; any value above the true length works. */
const DASH = 1400

/** Ribbon strength. High enough for the brand colours to actually read as colour. */
const RIBBON_OPACITY = 0.78
const STROKE_W = 46

/**
 * The three brand ribbons, painting themselves across the splash.
 *
 * Geometry echoes `RibbonSweep` but is tuned for a full-screen backdrop rather
 * than a section corner: flatter arcs, wider spread. Colours come from the
 * shared RIBBONS record, so a new theme gets its own colourway for free.
 */
export function SplashRibbons({
  themeId,
  reduce,
}: {
  themeId: ThemeId
  reduce: boolean | null
}) {
  const colors = RIBBONS[themeId]

  return (
    <svg
      viewBox="0 0 600 260"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      {colors.map((color, i) => (
        <motion.path
          key={color + i}
          d={
            'M-60 ' + (78 + i * 46) +
            ' C 150 ' + (18 + i * 46) + ', 330 ' + (150 + i * 46) +
            ', 680 ' + (52 + i * 46)
          }
          stroke={color}
          strokeWidth={STROKE_W}
          strokeLinecap="round"
          fill="none"
          opacity={RIBBON_OPACITY}
          strokeDasharray={DASH}
          /* Reduced motion gets the finished stroke with no drawing pass. */
          initial={reduce ? { strokeDashoffset: 0 } : { strokeDashoffset: DASH }}
          animate={{ strokeDashoffset: 0 }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }
          }
        />
      ))}
    </svg>
  )
}
