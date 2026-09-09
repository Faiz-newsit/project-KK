import type { Theme } from './types'

/**
 * Tokens and copy are complete; `available: false` only because the route
 * has not been created yet. Enabling it is: flip this flag, add
 * app/diwali/page.tsx (three lines). No component changes.
 */
export const diwali: Theme = {
  id: 'diwali',
  label: 'Diwali',
  route: '/diwali',
  available: false,
  isDark: true,
  swatch: ['#E8B44A', '#7B1B3F', '#2B0A1E'],

  tokens: {
    bg: '#2B0A1E',
    bgAlt: '#3D1229',
    surface: '#F7ECD9',
    surfaceAlt: '#4A0E2E',
    border: 'rgba(232, 180, 74, 0.28)',
    ink: '#FDF6E9',
    inkMuted: '#C8A9B8',
    primary: '#E8B44A',
    primaryHover: '#D19E33',
    primaryInk: '#2B0A1E',
    accent: '#F0C674',
    accentInk: '#2B0A1E',
    gold: '#E8B44A',
    announcementFrom: '#4A0E2E',
    announcementTo: '#7B1B3F',
    announcementInk: '#F0C674',
    headerBg: '#3D1229',
    headerInk: '#FDF6E9',
    navBg: '#4A0E2E',
    navInk: '#E8CBB4',
    heroFrom: '#3D1229',
    heroTo: '#1A0512',
    promoFrom: '#7B1B3F',
    promoTo: '#4A0E2E',
    promoInk: '#F7ECD9',
    ring: 'rgba(232, 180, 74, 0.45)',
    shadow: 'rgba(0, 0, 0, 0.45)',
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
