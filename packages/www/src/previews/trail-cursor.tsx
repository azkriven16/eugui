'use client'

import { TrailCursor } from '@/ui/trail-cursor'

export default function TrailCursorPreview() {
  return (
    <div className="relative flex min-h-48 w-full items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
      <TrailCursor fixed={false} color="#a78bfa" size={7} length={22} />
      <p className="pointer-events-none select-none text-sm text-zinc-500">
        Move your cursor here
      </p>
    </div>
  )
}
