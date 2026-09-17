/** The ten shells. Position, colour, size and timing all live in globals.css. */
const SHELLS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

/**
 * Diwali crackers: aerial shells that rise and burst over the splash.
 *
 * Every mark is CSS (see `.crackers` in globals.css), so this renders on the
 * server, costs no JavaScript and stays sharp at any size. No images, no canvas.
 *
 * Each burst is four layers on one shared delay: the span's `::before` is the
 * rising shell and its `::after` the detonation flash, while the two `<i>`
 * children carry the radiating spark streaks and the spark heads. It takes all
 * four -- a lone expanding ring of dots reads as a ring of dots, not a firework.
 *
 * Deliberately separate from `MidnightSky` rather than folded into it: that
 * component also paints the backdrop behind the whole Diwali page, where
 * fireworks going off forever would pull against the content. These belong to
 * the splash alone.
 *
 * The ten bursts are timed against the splash's own 1.75s life rather than left
 * to chance -- see the delay table in globals.css. They are purely decorative:
 * hidden from assistive tech and never a pointer target.
 *
 * Positioning comes from the caller, matching `MidnightSky`.
 */
export function Crackers({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={'crackers ' + className}>
      {SHELLS.map((n) => (
        <span key={n} className={'cracker cracker--' + n}>
          <i className="cracker__rays" />
          <i className="cracker__spark" />
        </span>
      ))}
    </div>
  )
}
