import Image from 'next/image'
import type { Theme } from '@/themes/types'
import { navLinks } from '@/data/nav'
import { categories } from '@/data/categories'
import { CartButton } from '@/components/cart/CartButton'
import { CategoryImage } from '@/components/ui/Media'
import { BRAND_LOGO_ATTR } from '@/lib/brand'
import { TricolourRule } from '@/components/ui/TricolourRibbon'
import { FestiveGlyph } from '@/components/ui/FestiveGlyph'
import {
  SearchIcon,
  UserIcon,
  CartIcon,
  PinIcon,
  ChevronDown,
  ArrowRight,
} from '@/components/ui/Icons'

/** Hover/focus panel behind the first nav item. CSS-driven, so it needs no JS
 *  and opens for keyboard users via focus-within as well as pointer hover. */
function CategoryMegaPanel() {
  return (
    <div
      className={[
        'invisible absolute left-1/2 top-full z-50 w-[min(92vw,720px)] -translate-x-1/2 pt-3 opacity-0',
        'transition-[opacity,transform] duration-200 ease-out',
        'group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100',
        'translate-y-1 group-hover:translate-y-0 group-focus-within:translate-y-0',
      ].join(' ')}
    >
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_20px_48px_var(--shadow)] backdrop-blur-2xl">
        <ul className="grid grid-cols-3 gap-2">
          {categories.map((category) => (
            <li key={category.id}>
              <a
                href="#"
                className="flex items-center gap-3 rounded-xl p-2 transition-colors duration-200 hover:bg-[var(--surface-alt)]"
              >
                <span className="relative block h-11 w-11 shrink-0 overflow-hidden rounded-full ring-1 ring-[var(--border)]">
                  <CategoryImage category={category} />
                </span>
                <span className="text-[13px] font-semibold text-[var(--ink)]">
                  {category.name}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#"
          className="group/all mt-3 flex items-center justify-center gap-1.5 border-t border-[var(--border)] pt-3 text-[13px] font-semibold text-[var(--primary)]"
        >
          View all categories
          <ArrowRight
            size={14}
            className="transition-transform duration-200 group-hover/all:translate-x-0.5"
          />
        </a>
      </div>
    </div>
  )
}

/**
 * Announcement bar, header row and nav row as one block, closed by a full-width
 * tricolour rule. The bar scrolls away; the white block sticks. Sticky (not
 * fixed) keeps it in flow, so no padding compensation is needed below.
 */
export function SiteHeader({ theme }: { theme: Theme }) {
  const { text, code } = theme.content.announcement

  return (
    <>
      <div
        className="w-full backdrop-blur-xl"
        style={{
          background: 'linear-gradient(90deg, var(--announcement-from), var(--announcement-to))',
          color: 'var(--announcement-ink)',
        }}
      >
        <p className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4 py-2 text-center text-[13px] font-semibold">
          <span>{text.split('!')[0]}!</span>
          <FestiveGlyph themeId={theme.id} className="h-[15px] w-[21px] shrink-0 rounded-[2px]" />
          <span>{text.split('!').slice(1).join('!').trim()}</span>
          <span aria-hidden="true" className="opacity-40">|</span>
          <span className="font-extrabold tracking-wide">Use Code: {code}</span>
        </p>
      </div>

      {/* No overflow-hidden here: the mega panel has to escape the header box. */}
      <header
        className="sticky top-0 z-40 shadow-[0_4px_18px_rgba(90,50,25,0.08)] backdrop-blur-xl"
        style={{ background: 'var(--header-bg)', color: 'var(--header-ink)' }}
      >
        {/* Three-column grid from md up: the side columns are equal fractions, so
            the search sits dead centre of the container regardless of how wide
            the logo or icon clusters happen to be. Below md it falls back to a
            flex row where the field simply takes the remaining space. */}
        <div className="mx-auto flex max-w-[1320px] items-center gap-4 px-4 pt-3 md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-6">
          <div className="flex shrink-0 items-center gap-3 md:justify-self-start">
            <a href="#" className="flex shrink-0 items-center" aria-label="Karikadai home">
              <Image
                src="/brand/karikadai-logo.png"
                alt="Karikadai, Lets Meat Today"
                width={592}
                height={316}
                priority
                {...{ [BRAND_LOGO_ATTR]: '' }}
                className="h-14 w-auto sm:h-[68px]"
              />
            </a>

            {/* Set-once action, so it reads as a text button rather than competing
                with the search field. */}
            <button
              type="button"
              className="hidden shrink-0 items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-semibold transition-colors duration-200 hover:bg-[var(--surface-alt)] xl:inline-flex cursor-pointer"
            >
              <PinIcon size={17} weight="fill" className="text-[var(--primary)]" />
              Chennai
              <ChevronDown size={14} className="opacity-55" />
            </button>
          </div>

          <div className="relative min-w-0 flex-1 md:w-[380px] md:flex-none md:justify-self-center lg:w-[440px] xl:w-[480px]">
            <SearchIcon
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]"
            />
            <input
              type="search"
              placeholder="Search for chicken, mutton, seafood..."
              aria-label="Search products"
              className="h-11 w-full rounded-full border border-[var(--border)] bg-[var(--bg-alt)] pl-11 pr-4 text-sm outline-none transition-all duration-200 placeholder:text-[var(--ink-muted)] focus:border-[var(--primary)] focus:bg-[var(--surface)] focus:ring-2 focus:ring-[var(--ring)]"
            />
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2 md:justify-self-end">
            <button
              type="button"
              aria-label="Your account"
              className="grid h-11 w-11 place-items-center rounded-full transition-colors duration-200 hover:bg-[var(--surface-alt)] cursor-pointer"
            >
              <UserIcon size={22} />
            </button>

            {/* Count and running total: standard on Indian grocery commerce and
                a stronger nudge than a bare icon. */}
            <CartButton />
          </div>
        </div>

        <nav aria-label="Primary" className="relative mx-auto max-w-[1320px] px-4">
          <ul className="no-scrollbar flex items-center justify-start gap-7 overflow-x-auto py-3 sm:justify-center sm:gap-10 sm:overflow-visible">
            {navLinks.map((link, i) => {
              const isCategories = i === 0
              return (
                <li key={link} className={isCategories ? 'group relative' : undefined}>
                  <a
                    href="#"
                    aria-current={i === 0 ? 'page' : undefined}
                    aria-haspopup={isCategories ? 'true' : undefined}
                    className={[
                      'relative flex shrink-0 items-center gap-1 whitespace-nowrap py-1 text-[14px] transition-colors duration-200',
                      'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[2px] after:origin-left',
                      'after:scale-x-0 after:bg-[var(--primary)] after:transition-transform after:duration-200',
                      'hover:text-[var(--primary)] hover:after:scale-x-100',
                      i === 0
                        ? 'font-semibold text-[var(--primary)] after:scale-x-100'
                        : 'font-medium text-[var(--nav-ink)]',
                    ].join(' ')}
                  >
                    {link}
                    {isCategories && (
                      <ChevronDown
                        size={13}
                        className="opacity-60 transition-transform duration-200 group-hover:rotate-180"
                      />
                    )}
                  </a>
                  {isCategories && <CategoryMegaPanel />}
                </li>
              )
            })}
          </ul>
        </nav>

        <TricolourRule themeId={theme.id} />
      </header>
    </>
  )
}
