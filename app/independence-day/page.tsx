import { FestiveHome } from '@/components/FestiveHome'
import { independence } from '@/themes'

export const metadata = {
  title: 'Independence Day Special | Karikadai',
  description: 'Flat 15% off all fresh cuts this Independence Day. Use code FREEDOM15.',
}

export default function IndependenceDayPage() {
  return <FestiveHome theme={independence} />
}
