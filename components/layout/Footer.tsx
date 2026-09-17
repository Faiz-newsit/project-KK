import Image from 'next/image'
import type { Theme } from '@/themes/types'
import { categories } from '@/data/categories'
import { TricolourRule } from '@/components/ui/TricolourRibbon'
import { SocialIcon, type Social } from './SocialIcon'
import {
  FacebookLogo,
  InstagramLogo,
  WhatsappLogo,
  YoutubeLogo,
  Phone,
  EnvelopeSimple,
  MapPin,
} from '@phosphor-icons/react/dist/ssr'

const quickLinks = [
  'About us',
  'Terms and Conditions',
  'Privacy Policy',
  'Refund Policy',
  'Delivery Areas',
]

/* Demo build: real handles go here when the accounts are confirmed. Brand
   colours stay literal rather than themed -- a social mark is recognised by its
   own colour, so these do not follow the festival palette. */
const socials: Social[] = [
  {
    label: 'Facebook',
    Icon: FacebookLogo,
    handle: '@thekarikadai',
    blurb: 'Fresh halal cuts, Chennai',
    brand: '#1877f2',
  },
  {
    label: 'Instagram',
    Icon: InstagramLogo,
    handle: '@thekarikadai',
    blurb: 'Today’s cuts, daily',
    brand: '#e1306c',
  },
  {
    label: 'WhatsApp',
    Icon: WhatsappLogo,
    handle: 'Order on chat',
    blurb: 'Replies within the hour',
    brand: '#25d366',
  },
  {
    label: 'YouTube',
    Icon: YoutubeLogo,
    handle: '@thekarikadai',
    blurb: 'Recipes and cuts explained',
    brand: '#ff0000',
  },
]

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[13px] font-bold uppercase tracking-[0.08em] text-[var(--ink)]">
      {children}
    </h3>
  )
}

function FooterLink({ children }: { children: React.ReactNode }) {
  return (
    <a
      href="#"
      className="text-sm text-[var(--ink-muted)] transition-colors duration-200 hover:text-[var(--primary)]"
    >
      {children}
    </a>
  )
}

export function Footer({ theme }: { theme: Theme }) {
  return (
    <footer className="bg-[var(--bg-alt)] backdrop-blur-md" aria-label="Site footer">
      {/* Bookends the header rule, so the page opens and closes on the same mark. */}
      <TricolourRule themeId={theme.id} />

      <div className="mx-auto grid max-w-[1320px] gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div>
          <Image
            src="/brand/karikadai-logo.png"
            alt="Karikadai"
            width={592}
            height={316}
            className="h-16 w-auto"
          />
          <p className="mt-4 max-w-[32ch] text-sm leading-relaxed text-[var(--ink-muted)]">
            Fresh halal meat, cut to order and delivered across Chennai. Never frozen.
          </p>

          {/* Wider gaps and a bottom margin than the row needs at rest: the
              layers fan 16px out on hover and the label drops 26px below, and
              both would otherwise run into the next icon and the column under
              it. */}
          <ul className="mt-5 mb-8 flex items-center gap-6">
            {socials.map((social) => (
              <SocialIcon key={social.label} {...social} />
            ))}
          </ul>
        </div>

        <nav aria-label="Quick links">
          <ColumnHeading>Quick links</ColumnHeading>
          <ul className="mt-4 space-y-2.5">
            {quickLinks.map((link) => (
              <li key={link}>
                <FooterLink>{link}</FooterLink>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Shop">
          <ColumnHeading>Shop</ColumnHeading>
          <ul className="mt-4 space-y-2.5">
            {categories.map((category) => (
              <li key={category.id}>
                <FooterLink>{category.name}</FooterLink>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <ColumnHeading>Contact us</ColumnHeading>
          <address className="mt-4 space-y-3 text-sm not-italic">
            <a
              href="tel:+919384870218"
              className="flex items-center gap-2.5 font-semibold text-[var(--ink)] transition-colors duration-200 hover:text-[var(--primary)]"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--surface)] text-[var(--primary)] ring-1 ring-[var(--border)]">
                <Phone size={16} weight="fill" />
              </span>
              9384870218
            </a>

            <a
              href="mailto:info@thekarikadai.com"
              className="flex items-center gap-2.5 text-[var(--ink-muted)] transition-colors duration-200 hover:text-[var(--primary)]"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--surface)] text-[var(--primary)] ring-1 ring-[var(--border)]">
                <EnvelopeSimple size={16} weight="fill" />
              </span>
              info@thekarikadai.com
            </a>

            <p className="flex gap-2.5 text-[var(--ink-muted)]">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--surface)] text-[var(--primary)] ring-1 ring-[var(--border)]">
                <MapPin size={16} weight="fill" />
              </span>
              <span className="max-w-[26ch] leading-relaxed">
                No. 4/4, 3rd Street, Bakthi Vedantha Avenue, Royala Nagar, Ramapuram,
                Chennai 600089.
              </span>
            </p>
          </address>
        </div>
      </div>

      {/* Bottom bar. FSSAI licence number belongs here once supplied; it is a
          legal requirement for an Indian food business and a real trust cue. */}
      <div className="border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-[1320px] flex-col items-center gap-3 px-4 pb-24 pt-5 text-sm text-[var(--ink-muted)] sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Karikadai. All rights reserved.</p>
          <p className="flex items-center gap-4">
            <FooterLink>Terms</FooterLink>
            <FooterLink>Privacy</FooterLink>
            <FooterLink>Refunds</FooterLink>
          </p>
        </div>
      </div>
    </footer>
  )
}
