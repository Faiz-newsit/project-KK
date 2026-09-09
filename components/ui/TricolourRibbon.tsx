import type { ThemeId } from '@/themes/types'

const PALETTES: Record<ThemeId, [string, string, string]> = {
  'independence-day': ['#FF9933', '#FFFFFF', '#138808'],
  diwali: ['#E8B44A', '#F3D9A4', '#7B1B3F'],
  bakrid: ['#C9A227', '#F0E6C8', '#0F5132'],
}

/**
 * One painted band: the top and bottom edges follow slightly different curves,
 * so the stroke is thick where it enters and tapers as it leaves. A uniform
 * stroke reads as a line; a varying one reads as a brush stroke.
 */
function Band({
  y,
  thickStart,
  thickEnd,
  color,
  opacity,
}: {
  y: number
  thickStart: number
  thickEnd: number
  color: string
  opacity: number
}) {
  const d = [
    `M-30 ${y}`,
    `C 70 ${y - 34}, 150 ${y + 30}, 300 ${y - 8}`,
    `L 300 ${y - 8 + thickEnd}`,
    `C 150 ${y + 30 + thickStart}, 70 ${y - 34 + thickStart}, -30 ${y + thickStart}`,
    'Z',
  ].join(' ')

  return <path d={d} fill={color} opacity={opacity} />
}

/**
 * Tricolour brush sweep used along the header edges. Purely decorative, so it
 * is hidden from assistive tech and never intercepts pointer events.
 */
export function TricolourRibbon({
  themeId,
  className = '',
  flip = false,
  opacity = 1,
}: {
  themeId: ThemeId
  className?: string
  flip?: boolean
  opacity?: number
}) {
  const [a, b, c] = PALETTES[themeId]

  return (
    <svg
      viewBox="0 0 280 150"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{
        transform: flip ? 'scale(-1,-1)' : undefined,
        opacity,
        pointerEvents: 'none',
      }}
    >
      <Band y={14} thickStart={30} thickEnd={18} color={a} opacity={0.95} />
      <Band y={46} thickStart={26} thickEnd={15} color={b} opacity={0.92} />
      <Band y={74} thickStart={30} thickEnd={18} color={c} opacity={0.95} />
    </svg>
  )
}

/**
 * Full-width festive rule. Replaces the corner brush marks, which sat out in
 * the dead margin beside the content column and read as strays. As a rule it
 * becomes structure: it separates the header from the page and carries the
 * theme across the whole width.
 *
 * The middle band is warmed slightly off-white so it stays visible against a
 * white page instead of dropping out.
 */
export function TricolourRule({
  themeId,
  className = '',
}: {
  themeId: ThemeId
  className?: string
}) {
  const [a, b, c] = PALETTES[themeId]
  const mid = themeId === 'independence-day' ? '#FFF1DC' : b

  return (
    <div
      aria-hidden="true"
      className={'h-[3px] w-full ' + className}
      style={{
        background: `linear-gradient(90deg, ${a} 0%, ${a} 26%, ${mid} 42%, ${mid} 58%, ${c} 74%, ${c} 100%)`,
      }}
    />
  )
}

/**
 * Hand-painted underline for a headline word. Thick in the middle, tapering at
 * both ends with a small skip near the tail, so it reads as one brush pass
 * rather than a rounded rule.
 */
export function BrushUnderline({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 22"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        d="M4 13.5C48 6.2 104 4.4 158 6.1c34 1.1 68 3.6 100 7.4-30-1.4-60-2.2-90-2.2-56 0-112 1.9-164 6.1Z"
        fill="currentColor"
      />
      <path
        d="M212 17.6c26 .5 52 1.9 78 4.1-24-.2-50-.9-78-2.1Z"
        fill="currentColor"
        opacity="0.55"
      />
    </svg>
  )
}

/** Small tricolour flag glyph for the announcement bar (SVG, never an emoji). */
export function IndiaFlagGlyph({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 17" aria-hidden="true" focusable="false" className={className}>
      <rect x="0.5" y="0.5" width="23" height="16" rx="2" fill="#FFFFFF" stroke="rgba(0,0,0,.18)" />
      <path d="M2.5.5h19a2 2 0 0 1 2 2V6H.5V2.5a2 2 0 0 1 2-2Z" fill="#FF9933" />
      <path d="M.5 11h23v3.5a2 2 0 0 1-2 2h-19a2 2 0 0 1-2-2V11Z" fill="#138808" />
      <circle cx="12" cy="8.5" r="2.1" fill="none" stroke="#0B3B8C" strokeWidth="0.7" />
      <circle cx="12" cy="8.5" r="0.45" fill="#0B3B8C" />
    </svg>
  )
}
