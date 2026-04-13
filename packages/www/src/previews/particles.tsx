'use client'

import { Particles } from '@/ui/particles'

export default function ParticlesPreview() {
  return (
    <div className="relative h-56 w-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
      <Particles count={60} color="#8b5cf6" speed={0.4} />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 pointer-events-none">
        <p className="text-sm font-medium text-zinc-300">Interactive particle field</p>
        <p className="text-xs text-zinc-600">Move your cursor inside</p>
      </div>
    </div>
  )
}
