/**
 * Single icon family for the whole project: Phosphor.
 * Imported from the /ssr entrypoint so these stay Server Components.
 * Weight is standardised to "regular" (duotone/fill are not mixed in).
 */
import {
  MagnifyingGlass,
  User,
  ShoppingCartSimple,
  MapPin,
  CaretDown,
  CaretLeft,
  CaretRight,
  ArrowRight as PhArrowRight,
  Heart,
  Plus,
  Leaf,
  SealCheck,
  Truck,
  HandSoap,
} from '@phosphor-icons/react/dist/ssr'
import type { IconName } from '@/themes/types'

export const SearchIcon = MagnifyingGlass
export const UserIcon = User
export const CartIcon = ShoppingCartSimple
export const PinIcon = MapPin
export const ChevronDown = CaretDown
export const ChevronLeft = CaretLeft
export const ChevronRight = CaretRight
export const ArrowRight = PhArrowRight
export const HeartIcon = Heart
export const PlusIcon = Plus

export const featureIcons: Record<IconName, typeof Leaf> = {
  fresh: Leaf,
  halal: SealCheck,
  delivery: Truck,
  hygiene: HandSoap,
}
