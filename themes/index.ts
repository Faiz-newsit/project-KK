import type { Theme, ThemeId } from './types'
import { independence } from './independence'
import { diwali } from './diwali'
import { bakrid } from './bakrid'

/** Order here is the order shown in the festive switcher. */
export const themes: Theme[] = [independence, diwali, bakrid]

export const themesById: Record<ThemeId, Theme> = {
  'independence-day': independence,
  diwali,
  bakrid,
}

export { independence, diwali, bakrid }
export type { Theme, ThemeId, ThemeTokens, ThemeContent, IconName } from './types'
