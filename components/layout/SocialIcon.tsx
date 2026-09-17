import type { Icon as PhosphorIcon } from '@phosphor-icons/react'

export type Social = {
  label: string
  Icon: PhosphorIcon
  handle: string
  blurb: string
  /** Network brand colour. Drives the ring, glow, card and gradient via --brand. */
  brand: string
}

/**
 * Footer social link: a layered ring that fans out on hover, with a profile
 * card rising above it.
 *
 * All of the motion is CSS (see `.social` in globals.css), so this stays a
 * server component -- no 'use client', no JavaScript shipped for a hover.
 *
 * The network's brand colour arrives as the --brand custom property rather than
 * as a class per network, so the same markup and the same rules cover all four
 * without a colour ever being hard-coded in CSS.
 *
 * The card is decorative restatement of the link: the anchor already carries
 * the accessible name, so the card is hidden from assistive tech to avoid
 * reading the same thing twice.
 */
export function SocialIcon({ label, Icon, handle, blurb, brand }: Social) {
  return (
    <li className="social" style={{ ['--brand' as string]: brand }}>
      <a href="#" aria-label={'Karikadai on ' + label} className="social__link">
        <span className="social__card" aria-hidden="true">
          <span className="social__profile">
            <span className="social__user">
              <span className="social__avatar">KK</span>
              <span className="social__details">
                <span className="social__name">Karikadai</span>
                <span className="social__handle">{handle}</span>
              </span>
            </span>
            <span className="social__blurb">{blurb}</span>
          </span>
        </span>

        {/* Five stacked discs. Four are empty rings that fan out behind; the
            fifth carries the mark, so the icon itself leads the fan. */}
        <span className="social__layer" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span className="social__mark">
            <Icon size={18} weight="fill" />
          </span>
        </span>

        <span className="social__label" aria-hidden="true">
          {label}
        </span>
      </a>
    </li>
  )
}
