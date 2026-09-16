import type { Theme } from './types'

/** See the note in diwali.ts -- config is complete, route is not built yet. */
export const bakrid: Theme = {
  id: 'bakrid',
  label: 'Bakrid',
  route: '/bakrid',
  available: false,
  isDark: false,
  swatch: ['#C9A227', '#0F5132', '#F5F1E6'],

  tokens: {
    bg: '#F7F4EA',
    bgAlt: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceAlt: '#F0EDE0',
    border: '#E2DCC8',
    ink: '#16261D',
    inkMuted: '#6B7A70',
    primary: '#0F5132',
    primaryHover: '#0A3D25',
    primaryInk: '#FFFFFF',
    accent: '#C9A227',
    accentInk: '#16261D',
    gold: '#C9A227',
    announcementFrom: '#0F5132',
    announcementTo: '#166B43',
    announcementInk: '#F3E9C8',
    headerBg: '#FFFDF6',
    headerInk: '#16261D',
    navBg: '#FFFDF6',
    navInk: '#3E4F45',
    heroFrom: '#F7F4EA',
    heroTo: '#E8F0E6',
    promoFrom: '#0F5132',
    promoTo: '#1B6B45',
    promoInk: '#FFFFFF',
    ring: 'rgba(15, 81, 50, 0.35)',
    shadow: 'rgba(22, 38, 29, 0.10)',
    glass: 'rgba(255, 255, 255, 0.68)',
    glassRing: 'rgba(255, 255, 255, 0.70)',
    scriptInk: '#16261D',
    scriptHalo: 'rgba(255, 253, 246, 0.85)',
  },

  content: {
    announcement: {
      text: 'Bakrid Special Offer! Get 20% OFF on mutton & premium cuts',
      code: 'BAKRID20',
      tagline: 'Share the blessings, share the good food',
    },
    hero: {
      titleLines: [
        { text: 'Celebrate. Share.', tone: 'ink' },
        { text: 'Feast.', tone: 'primary' },
      ],
      subtitle: 'Premium fresh cuts for your special Bakrid celebration.',
      chips: [
        { icon: 'fresh', label: 'Fresh & Hygienic' },
        { icon: 'halal', label: 'Halal Certified' },
        { icon: 'delivery', label: 'Fast Delivery' },
      ],
      ctaPrimary: 'Shop Now',
      ctaSecondary: 'Bakrid Offers',
      script: 'Blessed to Share Good Food',
    },
    promo: {
      eyebrow: 'Bakrid Special',
      headline: 'Up to 20% off',
      sub: 'On mutton & premium cuts',
      cta: 'Shop Now',
      script: 'Good Food, Stronger Bonds',
    },
    favourites: {
      title: 'All Time Favourites',
      subtitle: 'Most loved by our customers',
    },
    app: {
      title: 'Get the Karikadai App',
      subtitle: 'Fresh meat for every celebration.',
    },
  },
}
