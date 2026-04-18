'use client'

import { SpotlightCard } from '@/ui/spotlight-card'

export default function SpotlightCardPreview() {
  return (
    <div className="flex items-start gap-4">
      <SpotlightCard className="w-52 p-5">
        <div className="mb-3 text-2xl">✦</div>
        <h3 className="font-semibold text-zinc-100">Hover me</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Spotlight follows your cursor.
        </p>
      </SpotlightCard>
      <SpotlightCard
        className="w-52 p-5"
        spotlightColor="rgba(96, 165, 250, 0.15)"
      >
        <div className="mb-3 text-2xl">◈</div>
        <h3 className="font-semibold text-zinc-100">Custom color</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Blue spotlight variant.
        </p>
      </SpotlightCard>
      <SpotlightCard
        className="w-52 p-5"
        spotlightColor="rgba(52, 211, 153, 0.15)"
        spotlightSize={200}
      >
        <div className="mb-3 text-2xl">⬡</div>
        <h3 className="font-semibold text-zinc-100">Smaller radius</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Tight green spotlight.
        </p>
      </SpotlightCard>
    </div>
  )
}
