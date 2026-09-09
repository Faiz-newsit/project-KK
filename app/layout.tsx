import type { Metadata } from 'next'
import { Rubik, Nunito_Sans, Caveat } from 'next/font/google'
import './globals.css'

/* Display face: headlines, prices, anything that carries weight. */
const rubik = Rubik({
  subsets: ['latin'],
  variable: '--font-rubik',
  weight: ['400', '500', '600', '700', '800'],
})

/* Body face: paragraphs, labels, product copy. */
const nunito = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-nunito',
  weight: ['300', '400', '500', '600', '700'],
})

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  weight: ['500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Karikadai | Fresh Halal Meat Delivered in Chennai',
  description:
    'Premium fresh chicken, mutton and seafood, cut to order and delivered across Chennai. Halal certified, never frozen.',
  icons: { icon: '/brand/karikadai-logo.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${rubik.variable} ${nunito.variable} ${caveat.variable}`}>
      <body>{children}</body>
    </html>
  )
}
