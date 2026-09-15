import { describe, it, expect } from 'vitest'
import { validateDetails, hasErrors } from './validate'
import { DELIVERY_SLOTS, type CustomerDetails } from './types'

const valid: CustomerDetails = {
  name: 'Faiz',
  phone: '9876543210',
  address: '12 Anna Salai, Teynampet, Chennai 600018',
  slot: DELIVERY_SLOTS[0],
}

describe('validateDetails', () => {
  it('accepts a fully valid set of details', () => {
    expect(validateDetails(valid)).toEqual({})
    expect(hasErrors(validateDetails(valid))).toBe(false)
  })

  it('rejects an empty name', () => {
    expect(validateDetails({ ...valid, name: '' }).name).toBe('Please enter your name')
  })

  it('rejects a one-character name', () => {
    expect(validateDetails({ ...valid, name: 'F' }).name).toBeDefined()
  })

  it('rejects a phone shorter than 10 digits', () => {
    expect(validateDetails({ ...valid, phone: '98765' }).phone).toBe(
      'Enter a 10-digit mobile number',
    )
  })

  it('rejects a phone starting with 5', () => {
    expect(validateDetails({ ...valid, phone: '5876543210' }).phone).toBeDefined()
  })

  it('accepts a phone written with spaces and hyphens', () => {
    expect(validateDetails({ ...valid, phone: '98765 43210' }).phone).toBeUndefined()
    expect(validateDetails({ ...valid, phone: '98765-43210' }).phone).toBeUndefined()
  })

  it('rejects an address under 10 characters', () => {
    expect(validateDetails({ ...valid, address: 'Chennai' }).address).toBe(
      'Please enter a full delivery address',
    )
  })

  it('rejects an empty slot', () => {
    expect(validateDetails({ ...valid, slot: '' }).slot).toBe('Choose a delivery slot')
  })

  it('rejects a slot outside the offered list', () => {
    expect(validateDetails({ ...valid, slot: 'Next Tuesday' }).slot).toBeDefined()
  })

  it('reports every invalid field at once, not just the first', () => {
    const errors = validateDetails({ name: '', phone: '1', address: '', slot: '' })
    expect(Object.keys(errors).sort()).toEqual(['address', 'name', 'phone', 'slot'])
  })
})
