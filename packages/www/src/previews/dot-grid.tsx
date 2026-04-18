'use client'

import { DotGrid } from '@/ui/dot-grid'

export default function DotGridPreview() {
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-zinc-950" style={{ height: '192px' }}>
      <DotGrid
        className="absolute inset-0"
        dotColor="#a78bfa"
        gap={24}
        radius={100}
        maxScale={4}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <p className="text-sm text-zinc-500">Move your cursor over the grid</p>
      </div>
    </div>
  )
}
