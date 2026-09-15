'use client'

import { motion, useReducedMotion } from 'motion/react'

const TICK = 'M14 26 L22 34 L38 16'
/** Comfortably longer than the path, so the stroke starts fully hidden. */
const LEN = 60

export function AnimatedTick() {
  const reduce = useReducedMotion()

  return (
    <motion.svg
      viewBox="0 0 52 52"
      aria-hidden="true"
      className="h-24 w-24"
      initial={reduce ? false : { scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <circle
        cx="26"
        cy="26"
        r="24"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="2.5"
        opacity="0.25"
      />
      <motion.path
        d={TICK}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={LEN}
        initial={reduce ? { strokeDashoffset: 0 } : { strokeDashoffset: LEN }}
        animate={{ strokeDashoffset: 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.45, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.svg>
  )
}
