# Cart — Design

**Date:** 2026-09-16
**Status:** Approved for planning
**Scope:** Browser-persisted shopping cart for the Karikadai festive site

## Goal

Make add-to-cart real. A shopper can add products at a chosen weight, adjust
quantities, remove lines, see a live count and total in the header, open a cart
drawer, and find the cart still there after a reload.

## Boundaries

This site is statically prerendered with no backend, no database and no auth.
The cart therefore lives entirely in the browser.

**In scope:** cart state, per-weight pricing, header reactivity, cart drawer,
localStorage persistence, reducer unit tests.

**Out of scope:** checkout, payment, order records, accounts, server-side cart,
stock or availability. The drawer's checkout CTA is a visual endpoint only —
it does not submit anywhere. That is a deliberate stopping point, not an
oversight.

## Decisions

| Question | Decision | Why |
|---|---|---|
| Scope ceiling | Cart only, browser-persisted | No backend exists; this is the honest maximum |
| Pricing model | Explicit price per weight | Weight selector is currently decorative; real meat pricing is not linear |
| Cart surface | Slide-out drawer | Keeps the shopper on a single-page festive site; no routing changes |
| State library | React Context + `useReducer` | No new runtime dependency; matches a 5-dependency project |
| Tests | Vitest, reducer TDD | Merge and hydrate rules are where silent bugs live |

Rejected: Zustand (a second state idiom for four products), lifting state into
`FestiveHome` (it is a Server Component; lifting state there would force the
whole page tree client-side).

## Architecture

### State layer — pure, React-free

```
lib/cart/types.ts     CartLine, CartState, CartAction
lib/cart/reducer.ts   cartReducer + selectCount + selectTotal
```

```ts
interface CartLine {
  productId: string
  weightLabel: string
  unitPrice: number   // snapshot at add time
  qty: number
}
```

`unitPrice` is stored on the line rather than looked up later, so a catalogue
price change cannot silently rewrite what a shopper already has in their cart.

Actions: `ADD`, `SET_QTY`, `REMOVE`, `HYDRATE`, `CLEAR`.

**Rules the reducer encodes:**

1. Same `productId` **and** same `weightLabel` → increment `qty`, do not add a
   second line.
2. Same `productId`, different `weightLabel` → a separate line.
3. `SET_QTY` to `0` or below → remove the line.
4. `HYDRATE` drops any line whose `productId` is no longer in the catalogue.
5. Quantity is capped at 99 per line, to keep the badge and totals sane.

The reducer is pure and imports nothing from React, so it is testable without a
DOM and cannot accidentally depend on render order.

### Client components

```
components/cart/CartProvider.tsx   context + useReducer + persistence
components/cart/CartButton.tsx     header button, live count and total
components/cart/CartDrawer.tsx     slide-out panel
```

`ProductCard` becomes a Client Component in full. This reverses an earlier
draft of this design, which kept the card server-rendered and split only the
purchase controls into a `ProductPurchase` child.

That split does not survive contact with per-weight pricing. Selecting a weight
must update three things: the price, the add action, and the **"% OFF" badge**
-- and the badge is absolutely positioned over the product image, in the half of
the card the split would have left on the server. Passing selected-weight state
back up to a server-rendered sibling is not possible; the alternatives were a
stale badge (wrong for a shopper who switches weight) or a contrived wrapper.

The card is small, there are four of them, and `next/image` works unchanged in a
Client Component. Making the whole card client is the simpler and more honest
boundary. The cost is a few kB of markup in the client bundle.

The existing `AddToCartButton` is absorbed into `ProductCard`. Its confirmation
animation survives; it now fires on a real add.

`discountPercent` changes signature from `(p: Product)` to
`(w: ProductWeight)`, since price and mrp now live on the weight.

### Data model change

`data/products.ts`:

```ts
// before
weights: string[]
price: number
mrp?: number

// after
weights: { label: string; price: number; mrp?: number }[]
```

**The per-weight prices will be seeded with plausible placeholder values and
marked as such in the file.** They are not real Karikadai prices and must be
replaced before this is shown to anyone outside the team.

`data/cart.ts` (the static demo cart) is deleted as superseded. `formatRupees`
moves to `lib/format.ts`.

### Wiring

- `FestiveHome` wraps children in `CartProvider` and renders `CartDrawer`.
  `CartProvider` takes `children` as a prop, so the Server Components inside it
  stay server-rendered.
- `SiteHeader:149` swaps its static cart button for `<CartButton />`. The rest
  of the header remains a Server Component.

## Data flow

```
ProductCard      --ADD-->  CartProvider (useReducer)
                                |
                                +--> CartButton   (count, total)
                                +--> CartDrawer   (lines, qty, remove)
                                +--> localStorage (persist effect)
```

## Hydration

localStorage does not exist during SSR, so a server-rendered count would not
match the client-restored one.

Sequence: the provider starts with an empty cart on the server **and on the
first client render**; a `useEffect` then reads localStorage and dispatches
`HYDRATE`. The badge renders nothing until `hydrated` is true.

This means the count appears a frame after paint. That is the correct trade-off:
the alternative is a hydration mismatch React will complain about and may
silently patch wrong.

## Error handling

| Case | Behaviour |
|---|---|
| localStorage unavailable (private mode, blocked) | `try/catch`; cart works in-memory for the session |
| Stored JSON corrupt or wrong shape | Caught, discarded, start empty |
| Stored line references a deleted product | Dropped during `HYDRATE` |
| Quantity beyond 99 | Clamped |
| Writing to storage throws (quota) | Caught and ignored; cart still works in memory |

No failure in persistence may break the cart itself.

## Accessibility

- Drawer: `role="dialog"`, `aria-modal="true"`, labelled by its heading.
- Escape closes it; focus is trapped while open and returned to the cart button
  on close.
- Body scroll locked while open, reusing the pattern in `SplashScreen`.
- Quantity steppers have real labels, not icon-only buttons.
- Cart button exposes count and total in its `aria-label`, as it does today.
- `aria-live` announcement when a line is added or removed.
- All motion honours `prefers-reduced-motion`; the drawer appears without
  sliding rather than not appearing.

**Known pre-existing issue, not fixed here:** the add-to-cart and wishlist
buttons are 36px and 32px, below the 44×44px minimum touch target. Fixing it
shifts card layout and belongs in its own change.

## Testing

Vitest as a dev dependency; `npm test` added to scripts.

Reducer tests, written before the implementation:

1. `ADD` to an empty cart creates one line with qty 1
2. `ADD` same product and same weight twice → one line, qty 2
3. `ADD` same product at a different weight → two lines
4. `SET_QTY` to 0 removes the line
5. `SET_QTY` above 99 clamps to 99
6. `REMOVE` deletes only the targeted line
7. `HYDRATE` drops lines whose product is not in the catalogue
8. `selectTotal` multiplies unit price by qty across lines
9. `selectCount` sums quantities, not line count

Component behaviour (drawer focus trap, persistence round-trip) is verified
manually in the browser; no component test harness is proposed here.

## Files

**New:** `lib/cart/types.ts`, `lib/cart/reducer.ts`, `lib/cart/reducer.test.ts`,
`lib/format.ts`, `components/cart/CartProvider.tsx`,
`components/cart/CartButton.tsx`, `components/cart/CartDrawer.tsx`,
`vitest.config.ts`

**Modified:** `data/products.ts`, `components/ui/ProductCard.tsx`,
`components/layout/SiteHeader.tsx`, `components/FestiveHome.tsx`,
`package.json`

**Deleted:** `data/cart.ts`, `components/ui/AddToCartButton.tsx` (absorbed)

## Risks

- **Placeholder prices shipping as real.** Mitigated by an explicit comment in
  `data/products.ts`; still needs a human to replace them.
- **Client bundle growth.** `ProductCard` moves wholesale to the client. For
  four cards this is a few kB of markup; if the catalogue grows to dozens, the
  server/client split is worth revisiting.
- **`ProductCard` restructuring** touches a component that currently works.
  It keeps its markup and gains `'use client'` plus weight state, so the change
  is additive rather than a rewrite.
