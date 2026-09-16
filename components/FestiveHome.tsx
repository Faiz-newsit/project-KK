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
import { MidnightSky } from './ui/MidnightSky'
import { CartProvider } from './cart/CartProvider'
import { CartDrawer } from './cart/CartDrawer'
import { CheckoutProvider } from './cart/CheckoutProvider'
import { OrderSuccess } from './cart/OrderSuccess'

/**
 * The single homepage layout, shared by every festive route.
 *
 * Nothing in here branches on theme id -- the theme supplies colours as CSS
 * custom properties and copy as plain strings. That is what keeps the three
 * festive pages structurally identical: there is only one of this component.
 *
 * A theme may also ask for an animated backdrop. It is fixed to the viewport
 * and sits at z-0, with the page lifted to z-10 above it, so it stays put while
 * the page scrolls over it. The lift is a real element rather than a negative
 * z-index, which would be painted out by the wrapper's own background.
 */
export function FestiveHome({ theme }: { theme: Theme }) {
  const sky = theme.backdrop === 'midnight-sky'

  return (
    <div
      style={toCssVars(theme.tokens)}
      className={[
        'min-h-dvh bg-[var(--bg)] text-[var(--ink)]',
        sky ? 'relative isolate' : '',
      ].join(' ')}
    >
      {sky && <MidnightSky className="fixed inset-0 z-0" />}

      <div className={sky ? 'relative z-10' : 'contents'}>
        <CartProvider>
          <CheckoutProvider>
            <SplashScreen themeId={theme.id} backdrop={theme.backdrop} />

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
            <OrderSuccess themeId={theme.id} />
          </CheckoutProvider>
        </CartProvider>
      </div>
    </div>
  )
}
