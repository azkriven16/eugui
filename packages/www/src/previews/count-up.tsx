'use client'

import { CountUp } from '@/ui/count-up'

export default function CountUpPreview() {
  return (
    <div className="flex items-center justify-center gap-12">
      {[
        { end: 50, suffix: '+', label: 'Projects' },
        { end: 3, suffix: ' yrs', label: 'Experience' },
        { end: 99, suffix: '%', label: 'Satisfaction' },
      ].map(({ end, suffix, label }) => (
        <div key={label} className="flex flex-col items-center gap-1">
          <span className="text-5xl font-bold text-zinc-50">
            <CountUp end={end} suffix={suffix} duration={1800} />
          </span>
          <span className="text-sm text-zinc-500">{label}</span>
        </div>
      ))}
    </div>
  )
}
