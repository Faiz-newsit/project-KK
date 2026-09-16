import type { ThemeId } from '@/themes/types'

/**
 * Festive decoration only: flowing brand-colour ribbons behind the hero and
 * offer banner. Product, category and hero photography are real images, not
 * illustrations. These ribbons are pure gradient geometry, no scene drawing.
 */

/* Shared with the splash screen, so both draw the same three brand colours. */
export const RIBBONS: Record<ThemeId, string[]> = {
  'independence-day': ['#FF9933', '#FFFFFF', '#138808'],
  diwali: ['#E8B44A', '#C77B3A', '#7B1B3F'],
  bakrid: ['#C9A227', '#F0E6C8', '#0F5132'],
}

/** Wide ribbon sweep, anchored to a corner of the section it sits in. */
export function RibbonSweep({
  themeId,
  className = '',
  flip = false,
}: {
  themeId: ThemeId
  className?: string
  flip?: boolean
}) {
  const colors = RIBBONS[themeId]

  return (
    <svg
      viewBox="0 0 600 200"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      {colors.map((color, i) => (
        <path
          key={color + i}
          d={
            'M-40 ' + (54 + i * 34) +
            ' C 130 ' + (4 + i * 34) + ', 300 ' + (108 + i * 34) +
            ', 640 ' + (30 + i * 34)
          }
          stroke={color}
          strokeWidth={30}
          strokeLinecap="round"
          fill="none"
          opacity={0.9}
        />
      ))}
    </svg>
  )
}

/**
 * Warm lamp-light. Themes that run over the midnight sky use this in place of
 * the ribbon sweeps: a ribbon reads as paint on a flat page, but over a night
 * sky what a panel wants is light falling into it.
 */
export function GlowWash({ className = '', tone = 'gold' }: { className?: string; tone?: 'gold' | 'accent' }) {
  return (
    <div
      aria-hidden="true"
      className={'pointer-events-none rounded-full blur-3xl ' + className}
      style={{
        background:
          'radial-gradient(circle, var(--' + tone + ') 0%, transparent 70%)',
      }}
    />
  )
}

/* Garland geometry, in the same pixel space as the SVG wire below. */
const WIRE_TOP = 8
const WIRE_SAG = 26
const LAMP_COUNT = 13

/** Height of the strip the garland is drawn in. Matches the SVG viewBox, so the
 *  wire stretches horizontally only and its sag stays constant at any width. */
const STRING_H = 74

/**
 * Festoon of hanging lamps strung across the top of a panel.
 *
 * The wire is an SVG quadratic stretched on x only -- that is what keeps the
 * swag shallow on a wide window instead of scaling into a deep loop. The bulbs
 * are HTML, placed at percentage stops on the same curve, so they stay round
 * where a stretched SVG circle would go oval. Each breathes on its own offset,
 * so the string never pulses in unison.
 *
 * A symmetric quadratic is chosen over a cubic because its x is exactly linear
 * in t: `wireY(left%)` is then the wire's own height, so every bulb hangs off
 * the wire rather than a pixel or two beside it.
 *
 * The caller supplies the positioning class (the bulbs hang off it), which is
 * why no `relative` is set here -- Tailwind would let it win over an `absolute`
 * passed in and the string would land in the flow instead of on the panel.
 */
export function LightString({ className = '' }: { className?: string }) {
  /* The wire's y at a horizontal fraction t -- the quadratic below, expanded. */
  const wireY = (t: number) => WIRE_TOP + 4 * WIRE_SAG * t * (1 - t)

  return (
    <div
      aria-hidden="true"
      className={'pointer-events-none w-full ' + className}
      style={{ height: STRING_H }}
    >
      <svg
        viewBox={`0 0 660 ${STRING_H}`}
        preserveAspectRatio="none"
        focusable="false"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d={`M0 ${WIRE_TOP} Q 330 ${WIRE_TOP + WIRE_SAG * 2} 660 ${WIRE_TOP}`}
          stroke="var(--glass-ring)"
          strokeWidth={1.5}
          fill="none"
        />
      </svg>

      {Array.from({ length: LAMP_COUNT }, (_, i) => {
        const t = i / (LAMP_COUNT - 1)
        const warm = i % 2 === 0 ? 'var(--gold)' : 'var(--accent)'

        return (
          <span
            key={i}
            className="lamp absolute flex -translate-x-1/2 flex-col items-center"
            style={{ left: t * 100 + '%', top: wireY(t), animationDelay: i * 0.18 + 's' }}
          >
            {/* Lead from the wire down to the bulb. */}
            <span className="block h-2.5 w-px" style={{ background: 'var(--glass-ring)' }} />
            <span
              className="block h-2 w-2 rounded-full"
              style={{ background: warm, boxShadow: '0 0 10px 2px ' + warm }}
            />
          </span>
        )
      })}
    </div>
  )
}
