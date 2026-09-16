import type { ThemeId } from '@/themes/types'
import { IndiaFlagGlyph } from './TricolourRibbon'

/**
 * Small themed mark set beside the announcement and hero offer copy, where a
 * festival emoji would otherwise go. Drawn as SVG so it renders identically on
 * every platform, and keyed off the theme so no page carries another festival's
 * symbol: tricolour for Independence Day, a lit diya for Diwali, a crescent and
 * star for Bakrid.
 */

/** Clay lamp with a flame -- the Diwali counterpart to the flag. */
export function DiyaGlyph({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 17" aria-hidden="true" focusable="false" className={className}>
      {/* Flame: a warm outer teardrop with a paler core. */}
      <path
        d="M12 1.2c1.9 1.7 2.9 3.2 2.9 4.5a2.9 2.9 0 0 1-5.8 0c0-1.3 1-2.8 2.9-4.5Z"
        fill="#FFB43F"
      />
      <path d="M12 3.6c.9.9 1.4 1.7 1.4 2.4a1.4 1.4 0 0 1-2.8 0c0-.7.5-1.5 1.4-2.4Z" fill="#FFF0BE" />
      {/* Glow behind the wick, so the lamp reads as lit rather than drawn. */}
      <ellipse cx="12" cy="8.8" rx="6.4" ry="1.5" fill="#FFB43F" opacity="0.28" />
      {/* Bowl, with the wick lip drawn out to the left. */}
      <path
        d="M3.4 9.6h17.2c-.5 3.3-3.4 5.6-8.6 5.6S3.9 12.9 3.4 9.6Z"
        fill="#B4552A"
      />
      <path d="M3.4 9.6c-1.5 0-2.4-.5-2.4-1 0-.6 1.3-.9 3.4-.9h15.8c1.4 0 2.2.3 2.2.9 0 .6-.8 1-2.4 1Z" fill="#D9743C" />
    </svg>
  )
}

/** Crescent and star. */
export function CrescentGlyph({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 17" aria-hidden="true" focusable="false" className={className}>
      <path
        d="M13.4 1.6a7 7 0 1 0 0 13.8 7.9 7.9 0 0 1 0-13.8Z"
        fill="currentColor"
      />
      <path
        d="m18.6 4.1 1 2.1 2.3.3-1.7 1.6.4 2.3-2-1.1-2 1.1.4-2.3-1.7-1.6 2.3-.3Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function FestiveGlyph({
  themeId,
  className = '',
}: {
  themeId: ThemeId
  className?: string
}) {
  if (themeId === 'diwali') return <DiyaGlyph className={className} />
  if (themeId === 'bakrid') return <CrescentGlyph className={className} />
  return <IndiaFlagGlyph className={className} />
}
