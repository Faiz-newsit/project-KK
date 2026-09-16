export type ThemeId = 'independence-day' | 'diwali' | 'bakrid'

export type IconName = 'fresh' | 'halal' | 'delivery' | 'hygiene'

/**
 * Every visual value a theme can change. These are emitted as CSS custom
 * properties on the page wrapper, so components never branch on theme id --
 * they just read `var(--surface)` and friends.
 */
export interface ThemeTokens {
  bg: string
  bgAlt: string
  surface: string
  surfaceAlt: string
  border: string
  ink: string
  inkMuted: string
  primary: string
  primaryHover: string
  primaryInk: string
  accent: string
  accentInk: string
  gold: string
  announcementFrom: string
  announcementTo: string
  announcementInk: string
  headerBg: string
  headerInk: string
  navBg: string
  navInk: string
  heroFrom: string
  heroTo: string
  promoFrom: string
  promoTo: string
  promoInk: string
  ring: string
  shadow: string
  /** Frosted panel behind copy that sits over artwork or a backdrop. */
  glass: string
  glassRing: string
  /** Handwritten tag colour, and the halo that keeps it legible over art. */
  scriptInk: string
  scriptHalo: string
}

export interface HeroTitleLine {
  text: string
  tone: 'primary' | 'accent' | 'ink'
  /** Draws a hand-painted brush stroke beneath this line. */
  underline?: boolean
}

export interface ThemeContent {
  announcement: { text: string; code: string; tagline: string }
  hero: {
    titleLines: HeroTitleLine[]
    subtitle: string
    chips: { icon: IconName; label: string }[]
    ctaPrimary: string
    ctaSecondary: string
    script: string
    /** Full-bleed background artwork. Without it the hero falls back to a gradient. */
    art?: string
  }
  promo: {
    eyebrow: string
    headline: string
    sub: string
    cta: string
    script: string
    /**
     * Finished banner artwork with the offer copy already set into it.
     * When present the section renders the image and overlays only the CTA;
     * when absent the copy above is typeset in HTML instead.
     */
    image?: string
  }
  favourites: { title: string; subtitle: string }
  app: {
    title: string
    subtitle: string
    /**
     * Finished app-promo artwork with its copy already set into it. When present
     * the section renders the image and overlays only the store badges.
     */
    image?: string
  }
}

export interface Theme {
  id: ThemeId
  label: string
  route: string
  /** Unbuilt themes render dimmed with a "Soon" tag in the switcher. */
  available: boolean
  /** Diwali inverts card surfaces and text weight. */
  isDark: boolean
  /**
   * Animated backdrop painted behind the whole page, with the sections left
   * translucent so it reads through them. Themes without one are opaque.
   */
  backdrop?: 'midnight-sky'
  /** Three stops used to draw the switcher thumbnail, no image needed. */
  swatch: [string, string, string]
  tokens: ThemeTokens
  content: ThemeContent
}
