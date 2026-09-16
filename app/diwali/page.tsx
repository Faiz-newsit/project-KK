import { FestiveHome } from '@/components/FestiveHome'
import { diwali } from '@/themes'

export const metadata = {
  title: 'Diwali Special | Karikadai',
  description: 'Up to 20% off premium cuts this Diwali. Use code DIWALI20.',
}

export default function DiwaliPage() {
  return <FestiveHome theme={diwali} />
}
