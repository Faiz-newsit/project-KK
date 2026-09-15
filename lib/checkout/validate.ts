import { DELIVERY_SLOTS, type CustomerDetails, type FieldErrors } from './types'

/** People write mobile numbers with spaces and hyphens; that is not an error. */
const digitsOnly = (s: string) => s.replace(/[\s-]/g, '')

export function validateDetails(d: CustomerDetails): FieldErrors {
  const errors: FieldErrors = {}

  if (d.name.trim().length < 2) {
    errors.name = 'Please enter your name'
  }

  /* Indian mobile numbers are ten digits starting 6-9. */
  if (!/^[6-9]\d{9}$/.test(digitsOnly(d.phone))) {
    errors.phone = 'Enter a 10-digit mobile number'
  }

  if (d.address.trim().length < 10) {
    errors.address = 'Please enter a full delivery address'
  }

  if (!DELIVERY_SLOTS.some((slot) => slot === d.slot)) {
    errors.slot = 'Choose a delivery slot'
  }

  return errors
}

export const hasErrors = (e: FieldErrors) => Object.keys(e).length > 0
