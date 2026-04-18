'use client'

import { ReviewCard } from '@/ui/review-card'

export default function ReviewCardPreview() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <ReviewCard
        quote="Dropped eugui into my portfolio in an afternoon. The components are exactly what I needed — no fighting with customization."
        name="Sofia Chen"
        role="Frontend Engineer"
        company="Vercel"
        rating={5}
      />
      <ReviewCard
        quote="The tilt card and spotlight effects alone made my project section stand out. Hiring manager asked what library I used."
        name="Marcus Okafor"
        role="Full-Stack Dev"
        rating={5}
      />
    </div>
  )
}
