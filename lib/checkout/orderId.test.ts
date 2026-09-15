import { describe, it, expect } from 'vitest'
import { newOrderId } from './orderId'

describe('newOrderId', () => {
  it('produces a DEMO-prefixed reference', () => {
    expect(newOrderId()).toMatch(/^KK-DEMO-[0-9A-F]{6}$/)
  })

  it('pads short values to a full six characters', () => {
    for (let i = 0; i < 200; i += 1) {
      expect(newOrderId()).toMatch(/^KK-DEMO-[0-9A-F]{6}$/)
    }
  })
})
