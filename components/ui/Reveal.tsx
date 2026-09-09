'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * Scroll-entry reveal. Motion is used here to sequence content as it arrives,
 * which is the one thing it earns its weight for on this page.
 * Collapses to a plain render when the visitor prefers reduced motion.
 */
export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
