'use client'

import { TiltCard } from '@/ui/tilt-card'

export default function TiltCardPreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <TiltCard className="w-52 rounded-2xl border border-zinc-700 bg-zinc-900 p-6">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/20">
          <span className="text-xl">⚡</span>
        </div>
        <h3 className="mb-1 font-semibold text-zinc-100">Fast</h3>
        <p className="text-sm text-zinc-500">Zero runtime overhead.</p>
      </TiltCard>

      <TiltCard className="w-52 rounded-2xl border border-zinc-700 bg-zinc-900 p-6" maxTilt={20}>
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
          <span className="text-xl">✦</span>
        </div>
        <h3 className="mb-1 font-semibold text-zinc-100">Yours</h3>
        <p className="text-sm text-zinc-500">Own every line of code.</p>
      </TiltCard>
    </div>
  )
}
