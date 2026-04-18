'use client'

import { BlobCursor } from '@/ui/blob-cursor'

export default function BlobCursorPreview() {
  return (
    <div className="relative flex min-h-48 w-full items-center justify-center overflow-hidden rounded-xl bg-zinc-950">
      <BlobCursor fixed={false} color="#a78bfa" size={48} />
      <div className="pointer-events-none select-none text-center">
        <p className="text-lg font-semibold text-zinc-300">Move your cursor</p>
        <p className="mt-1 text-sm text-zinc-600">Blob morphs and follows with spring lag</p>
      </div>
    </div>
  )
}
