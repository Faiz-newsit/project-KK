import type { Theme } from '@/themes/types'
import { toCssVars } from '@/lib/theme'

import { SiteHeader } from './layout/SiteHeader'
import { Footer } from './layout/Footer'

import { Hero } from './sections/Hero'
import { CategoryRail } from './sections/CategoryRail'
import { PromoBanner } from './sections/PromoBanner'
import { ProductGrid } from './sections/ProductGrid'
import { AppDownload } from './sections/AppDownload'

import { ThemeSwitcher } from './ThemeSwitcher'
import { SplashScreen } from './ui/SplashScreen'
import { CartProvider } from './cart/CartProvider'
import { CartDrawer } from './cart/CartDrawer'

/**
 * The single homepage layout, shared by every festive route.
 *
 * Nothing in here branches on theme id -- the theme supplies colours as CSS
 * custom properties and copy as plain strings. That is what keeps the three
 * festive pages structurally identical: there is only one of this component.
 */
export function FestiveHome({ theme }: { theme: Theme }) {
  return (
    <div style={toCssVars(theme.tokens)} className="min-h-dvh bg-[var(--bg)] text-[var(--ink)]">
      <CartProvider>
        <SplashScreen themeId={theme.id} />

        <SiteHeader theme={theme} />

        <main>
          <Hero theme={theme} />
          <CategoryRail />
          <PromoBanner theme={theme} />
          <ProductGrid theme={theme} />
          <AppDownload theme={theme} />
        </main>

        <Footer theme={theme} />
        <ThemeSwitcher current={theme.id} />
        <CartDrawer />
      </CartProvider>
    </div>
  )
}
