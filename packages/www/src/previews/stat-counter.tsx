'use client'

import { StatCounter } from '@/ui/stat-counter'

export default function StatCounterPreview() {
  return (
    <div className="flex items-center justify-center gap-10">
      <StatCounter end={50} suffix="+" label="Projects shipped" duration={1800} />
      <StatCounter end={4} suffix=" yrs" label="Experience" duration={1400} />
      <StatCounter end={12} suffix="k" label="GitHub stars" duration={2000} />
    </div>
  )
}
