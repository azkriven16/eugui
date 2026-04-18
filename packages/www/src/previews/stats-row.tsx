'use client'

import { StatsRow } from '@/ui/stats-row'

export default function StatsRowPreview() {
  return (
    <StatsRow
      stats={[
        { end: 50, suffix: '+', label: 'Projects shipped' },
        { end: 5, label: 'Years experience' },
        { end: 12, suffix: 'k', label: 'GitHub stars' },
        { end: 98, suffix: '%', label: 'Client satisfaction' },
      ]}
      className="py-16"
    />
  )
}
