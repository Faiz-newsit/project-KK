import type { ThemeId } from '@/themes/types'

/**
 * Festive decoration only: flowing brand-colour ribbons behind the hero and
 * offer banner. Product, category and hero photography are real images, not
 * illustrations. These ribbons are pure gradient geometry, no scene drawing.
 */

const RIBBONS: Record<ThemeId, string[]> = {
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
