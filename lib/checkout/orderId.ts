/**
 * Display reference for a demo order.
 *
 * The DEMO segment is deliberate: an order id gets screenshotted and pasted
 * into messages where the surrounding "no payment was taken" copy does not
 * travel with it, so the reference has to say so itself.
 */
export function newOrderId(): string {
  const hex = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .toUpperCase()
    .padStart(6, '0')

  return 'KK-DEMO-' + hex
}
