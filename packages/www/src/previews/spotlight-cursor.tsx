'use client'

import { SpotlightCursor } from '@/ui/spotlight-cursor'

export default function SpotlightCursorPreview() {
  return (
    <div className="relative flex min-h-48 w-full items-center justify-center overflow-hidden rounded-xl bg-zinc-950">
      <SpotlightCursor fixed={false} color="rgba(167, 139, 250, 0.15)" size={350} />
      <div className="pointer-events-none select-none text-center">
        <p className="text-lg font-semibold text-zinc-300">Move your cursor</p>
        <p className="mt-1 text-sm text-zinc-600">Spotlight follows you</p>
      </div>
    </div>
  )
}
