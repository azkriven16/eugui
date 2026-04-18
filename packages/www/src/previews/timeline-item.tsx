'use client'

import { TimelineItem } from '@/ui/timeline-item'

export default function TimelineItemPreview() {
  return (
    <div className="w-full max-w-md">
      <TimelineItem
        date="2023 – Present"
        title="Senior Frontend Engineer"
        company="Acme Corp"
        description="Building design systems and component libraries used by 50+ engineers."
        type="work"
        current
      />
      <TimelineItem
        date="2021 – 2023"
        title="Frontend Developer"
        company="Startup Inc."
        description="Led a full redesign from Figma to production in 3 months."
        type="work"
      />
      <TimelineItem
        date="2017 – 2021"
        title="BSc Computer Science"
        company="State University"
        type="education"
        last
      />
    </div>
  )
}
