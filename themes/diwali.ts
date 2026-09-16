import type { Theme } from './types'

/**
 * Diwali runs over the animated midnight sky (`backdrop`), so most surfaces are
 * translucent rather than solid: the stars, meteors and moon read through the
 * header, the cards and the footer instead of being boxed out by them. The one
 * opaque value is `bg`, which is the night the sky itself is painted on.
 *
 * No artwork is referenced. Every section falls back to its typeset layout, so
 * the page is complete before any Diwali photography exists.
 */
export const diwali: Theme = {
  id: 'diwali',
  label: 'Diwali',
  route: '/diwali',
  available: true,
  isDark: true,
  backdrop: 'midnight-sky',
  swatch: ['#E8B44A', '#7B1B3F', '#0A0512'],

  tokens: {
    bg: '#0A0512',
    bgAlt: 'rgba(28, 10, 34, 0.72)',
    surface: 'rgba(48, 19, 56, 0.62)',
    surfaceAlt: 'rgba(24, 8, 30, 0.72)',
    border: 'rgba(232, 180, 74, 0.26)',
    ink: '#FDF6E9',
    inkMuted: '#C3A9C0',
    primary: '#E8B44A',
    primaryHover: '#F2C76B',
    primaryInk: '#2B0A1E',
    accent: '#FF9C4A',
    accentInk: '#2B0A1E',
    gold: '#E8B44A',
    announcementFrom: 'rgba(74, 14, 46, 0.88)',
    announcementTo: 'rgba(123, 27, 63, 0.88)',
    announcementInk: '#F5D896',
    headerBg: 'rgba(16, 6, 22, 0.72)',
    headerInk: '#FDF6E9',
    navBg: 'rgba(16, 6, 22, 0.72)',
    navInk: '#E4CBDA',
    heroFrom: 'rgba(61, 18, 41, 0.62)',
    heroTo: 'rgba(10, 5, 18, 0.20)',
    promoFrom: 'rgba(123, 27, 63, 0.74)',
    promoTo: 'rgba(74, 14, 46, 0.52)',
    promoInk: '#FDF6E9',
    ring: 'rgba(232, 180, 74, 0.45)',
    shadow: 'rgba(0, 0, 0, 0.55)',
    glass: 'rgba(255, 255, 255, 0.08)',
    glassRing: 'rgba(232, 180, 74, 0.32)',
    scriptInk: '#F5D896',
    scriptHalo: 'rgba(0, 0, 0, 0.55)',
    elegantBg: 'rgba(20, 7, 26, 0.72)',
    elegantBgHover: 'rgba(48, 17, 58, 0.86)',
    elegantBorder: 'rgba(232, 180, 74, 0.45)',
    elegantInk: '#FDF6E9',
  },

  content: {
    announcement: {
      text: 'Diwali Feast Special! Get 20% OFF on premium cuts',
      code: 'DIWALI20',
      tagline: "Let's make it a delicious one",
    },
    hero: {
      titleLines: [
        { text: 'Light Up', tone: 'ink' },
        { text: 'Your Feast.', tone: 'primary' },
      ],
      subtitle: 'Make your Diwali celebration special with premium fresh cuts.',
      chips: [
        { icon: 'fresh', label: 'Fresh & Hygienic' },
        { icon: 'halal', label: 'Halal Certified' },
        { icon: 'delivery', label: 'Fast Delivery' },
      ],
      ctaPrimary: 'Shop Now',
      ctaSecondary: 'Diwali Offers',
      script: 'Good Food, Brighter Celebrations',
    },
    promo: {
      eyebrow: 'Diwali Feast Special',
      headline: 'Up to 20% off',
      sub: 'On premium cuts',
      cta: 'Shop Now',
      script: 'Good Food Brings People Together',
    },
    favourites: {
      title: 'All Time Favourites',
      subtitle: 'Most loved by our customers',
    },
    app: {
      title: 'Get the Karikadai App',
      subtitle: 'Fresh meat for happier moments.',
    },
  },
}
