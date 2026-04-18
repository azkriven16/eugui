'use client'

import { ParallaxLayer } from '@/ui/parallax-layer'

export default function ParallaxLayerPreview() {
  return (
    <div className="flex flex-col gap-3 text-center">
      <p className="text-sm text-zinc-500">
        Scroll the page — layers move at different speeds
      </p>
      <div className="flex items-end justify-center gap-6">
        {[
          { speed: 0.1, label: 'Slow (0.1x)', color: 'bg-violet-600/20 border-violet-500/30' },
          { speed: 0.3, label: 'Normal (0.3x)', color: 'bg-blue-600/20 border-blue-500/30' },
          { speed: 0.6, label: 'Fast (0.6x)', color: 'bg-emerald-600/20 border-emerald-500/30' },
        ].map(({ speed, label, color }) => (
          <ParallaxLayer key={speed} speed={speed} className="rounded-xl">
            <div className={`rounded-xl border px-4 py-3 text-xs text-zinc-300 ${color}`}>
              {label}
            </div>
          </ParallaxLayer>
        ))}
      </div>
    </div>
  )
}
