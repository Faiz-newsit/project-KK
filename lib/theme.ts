import type { CSSProperties } from 'react'
import type { ThemeTokens } from '@/themes/types'

const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)

/**
 * Turns the token object into inline CSS custom properties.
 * Components then read them with Tailwind arbitrary values, e.g.
 * `bg-[var(--surface)]`. Inline vars mean no flash of the wrong palette
 * on navigation, and no per-theme Tailwind config.
 */
export function toCssVars(tokens: ThemeTokens): CSSProperties {
  const vars: Record<string, string> = {}
  for (const [key, value] of Object.entries(tokens)) {
    vars[`--${kebab(key)}`] = value
  }
  return vars as CSSProperties
}
