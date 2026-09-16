/**
 * Diwali night sky: tiled star fields, drifting meteors and a crescent moon.
 *
 * Every mark is CSS (see `.midnight-sky` in globals.css), so this renders on
 * the server, costs no JavaScript and stays sharp at any size. It is purely
 * decorative -- hidden from assistive tech and never a pointer target.
 *
 * Positioning comes from the caller: `fixed inset-0` to sit behind a whole
 * page, `absolute inset-0` to fill a panel.
 */
export function MidnightSky({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={'midnight-sky ' + className}>
      <div className="sky-stars sky-stars--near" />
      <div className="sky-stars sky-stars--mid" />
      <div className="sky-stars sky-stars--far" />
      <div className="sky-meteor sky-meteor--1" />
      <div className="sky-meteor sky-meteor--2" />
      <div className="sky-meteor sky-meteor--3" />
      <div className="sky-moon" />
    </div>
  )
}
