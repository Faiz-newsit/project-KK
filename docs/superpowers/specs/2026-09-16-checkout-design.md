# Checkout — Design

**Date:** 2026-09-16
**Status:** Approved for planning
**Scope:** Demo checkout flow, simulated payment, and order-placed screen
**Builds on:** `docs/superpowers/specs/2026-09-16-cart-design.md`

## Goal

Turn the drawer's dead-end checkout button into a flow: collect delivery
details, show a paying state, then a full-screen success moment with an
animated tick, an order ID, and the order summary.

## Boundaries

**No money moves.** This is a simulated payment in a demo site.

**In scope:** a checkout state machine, a delivery-details form with real
validation, a simulated paying state, order creation, and a full-screen
success screen.

**Out of scope:** payment gateways, card data, order persistence beyond the
current session, order history, email or SMS confirmation, stock checks,
delivery-area validation, accounts.

### The demo must announce itself

The success screen carries a visible line: **"Demo order — no payment was
taken."** The order id is prefixed `KK-DEMO-`.

This is not decoration. A screen that says "Payment successful" with an order
number is indistinguishable from a real confirmation, and it will outlive the
conversation in which everyone knew it was fake. The label is a requirement,
not a suggestion, and must not be removed without replacing the simulation
with a real gateway.

**No card fields anywhere.** Not name-on-card, not a masked number, not a CVV
placeholder. A form that collects card details and does not charge them is the
one version of this feature that could cause real harm, and it is not built
here in any form.

## Decisions

| Question | Decision | Why |
|---|---|---|
| Payment | Simulated, clearly labelled | No gateway account; a realistic fake is worse than an honest demo |
| Surface | Drawer steps, then full-screen success | Keeps the flow on one page; full screen gives the tick real impact |
| Fields | Name, phone, address, slot | Realistic minimum for meat delivery without becoming a long form |
| State owner | Separate `CheckoutProvider` | `CartProvider` already owns contents, persistence and drawer state |

Rejected: extending `CartProvider` (one file doing too much); local state in
`CartDrawer` (the success overlay is a sibling, so state lifts anyway);
a payment-method radio group (implies real processing).

## Architecture

### State machine

```
cart ──Checkout──> details ──Place order──> paying ──~1.8s──> done
                     ↑                                         │
                     └──────────── Back ────┘       drawer closes,
                                                 full-screen success
```

| Phase | Drawer shows | Exit |
|---|---|---|
| `cart` | Line items, totals, "Checkout" | Checkout, if the cart is non-empty |
| `details` | Delivery form, "Place order" | Valid submit, or Back |
| `paying` | Spinner, "Placing your order…" | Automatic after `PAY_MS` |
| `done` | (drawer closed) | "Continue shopping" |

`paying` cannot be cancelled or double-submitted. `PAY_MS = 1800`.

### Pure modules

```
lib/checkout/types.ts     Phase, CustomerDetails, Order, FieldErrors, DELIVERY_SLOTS
lib/checkout/validate.ts  validateDetails(details) -> FieldErrors
lib/checkout/orderId.ts   newOrderId() -> "KK-DEMO-7F3A2B"
```

`DELIVERY_SLOTS` is a fixed list, since there is no scheduling backend to query:

```ts
export const DELIVERY_SLOTS = [
  'Today, 5-7 pm',
  'Today, 7-9 pm',
  'Tomorrow, 7-9 am',
  'Tomorrow, 5-7 pm',
] as const
```

They are static strings, so "Today" is only accurate relative to when the
demo is viewed. Real slots would come from a delivery service.

`validate.ts` is React-free and unit-tested, like `lib/cart/reducer.ts`.

**Validation rules:**

| Field | Rule | Message |
|---|---|---|
| `name` | trimmed length ≥ 2 | "Please enter your name" |
| `phone` | exactly 10 digits, first digit 6-9 | "Enter a 10-digit mobile number" |
| `address` | trimmed length ≥ 10 | "Please enter a full delivery address" |
| `slot` | non-empty, from `DELIVERY_SLOTS` | "Choose a delivery slot" |

Phone is checked after stripping spaces and hyphens, so "98765 43210" passes.
The 6-9 rule matches Indian mobile numbering.

### Order

```ts
interface Order {
  id: string              // KK-DEMO-7F3A2B
  placedAt: string        // ISO timestamp
  lines: CartLine[]       // snapshot, so clearing the cart cannot empty it
  total: number
  customer: CustomerDetails
}
```

The line snapshot matters: the cart is cleared the moment the order is created,
and the success screen must still be able to show what was ordered.

`newOrderId()` uses `Math.random`. It is a display reference for a demo, not an
identifier anything depends on, and it is generated only on submit — never
during render — so it cannot cause a hydration mismatch.

### Components

```
components/cart/CheckoutProvider.tsx  phase, details, errors, order, submit
components/cart/CheckoutForm.tsx      the details step
components/cart/OrderSuccess.tsx      full-screen success overlay
components/ui/AnimatedTick.tsx        self-drawing tick
```

`CheckoutProvider` consumes `useCart()` to read lines and total and to call
`clear()` on success. `CartDrawer` becomes phase-aware, rendering its existing
cart view, `CheckoutForm`, or the paying state.

### The success screen

Full-screen overlay above the drawer. It reuses the splash screen's visual
language deliberately — the same ribbon sweep and themed backdrop — so placing
an order reads as the same brand moment that opened the page.

Sequence: backdrop fades in, the tick draws itself via `stroke-dashoffset` (the
technique already in `SplashRibbons.tsx`), the tick pops, then heading, order
id, slot, total and line items fade up beneath it.

Under `prefers-reduced-motion` the tick renders complete with no drawing pass
and the content appears without staggering.

"Continue shopping" dismisses the overlay and returns the phase to `cart`.

## Data flow

```
CartDrawer ──setPhase──> CheckoutProvider ──clear()──> CartProvider
                               │
                               └──> OrderSuccess (order snapshot)
```

## Error handling

| Case | Behaviour |
|---|---|
| Invalid field on submit | Inline message under the field; focus moves to the first invalid field |
| Checkout with an empty cart | The Checkout button is disabled when there are no lines |
| Drawer closed during `details` | Entered values are kept, so reopening does not lose them |
| Drawer closed during `paying` | The phase continues; success still fires |
| Double submit | Ignored — `paying` is terminal until the timer resolves |
| Cart emptied in another tab | Not handled; out of scope for a session-scoped demo |

## Accessibility

- Every field has a visible `<label>`, not a placeholder standing in for one.
- Errors sit next to their field and are linked with `aria-describedby`;
  invalid fields carry `aria-invalid`.
- The error summary is announced via `aria-live="polite"`.
- The paying state exposes `role="status"` so the wait is announced.
- The success overlay is `role="dialog"` with `aria-modal`, labelled by its
  heading, focus moved to it on open, Escape dismisses it.
- The animated tick is `aria-hidden`; the heading carries the meaning.
- All motion honours `prefers-reduced-motion`.

**Known pre-existing issue, not fixed here:** card buttons remain below the
44×44px touch target. New controls in this feature meet it.

## Testing

Vitest, extending the existing setup. `vitest.config.mts` currently includes
only `lib/**/*.test.ts`, which already covers `lib/checkout/`.

Validation tests, written before the implementation:

1. A fully valid set of details produces no errors
2. Empty name is rejected
3. One-character name is rejected
4. Phone shorter than 10 digits is rejected
5. Phone starting with 5 is rejected
6. Phone with spaces and hyphens is accepted
7. Address under 10 characters is rejected
8. Empty slot is rejected
9. A slot outside `DELIVERY_SLOTS` is rejected
10. Multiple invalid fields all report at once, not just the first

Order id format is asserted against `/^KK-DEMO-[0-9A-F]{6}$/`.

The flow itself — steps, the tick, focus movement — is verified manually.

## Files

**New:** `lib/checkout/types.ts`, `lib/checkout/validate.ts`,
`lib/checkout/validate.test.ts`, `lib/checkout/orderId.ts`,
`lib/checkout/orderId.test.ts`, `components/cart/CheckoutProvider.tsx`,
`components/cart/CheckoutForm.tsx`, `components/cart/OrderSuccess.tsx`,
`components/ui/AnimatedTick.tsx`

**Modified:** `components/cart/CartDrawer.tsx`, `components/FestiveHome.tsx`

## Risks

- **The demo label being removed later.** Mitigated by stating it as a
  requirement here and by the `KK-DEMO-` id prefix, which is harder to strip
  by accident than a line of copy.
- **`CartDrawer` growing.** It gains phase branching on top of 209 lines. The
  form and success screen are separate files specifically to contain this; if
  the drawer still reads badly afterwards, splitting its cart view into its own
  component is the follow-up.
- **Simulated latency reading as sluggish.** `PAY_MS` is a named constant so it
  can be tuned.
