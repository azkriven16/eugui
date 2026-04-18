'use client'

import { GradientBorder } from '@/ui/gradient-border'

export default function GradientBorderPreview() {
  return (
    <div className="flex items-center gap-6">
      <GradientBorder borderRadius="0.75rem" duration={3}>
        <div className="px-6 py-4 text-center">
          <p className="font-semibold text-zinc-100">Default</p>
          <p className="mt-1 text-xs text-zinc-500">violet → blue → pink</p>
        </div>
      </GradientBorder>

      <GradientBorder
        colors={['#34d399', '#60a5fa', '#a78bfa', '#34d399']}
        duration={2}
        borderWidth={2}
        borderRadius="9999px"
      >
        <div className="px-6 py-3 text-center">
          <p className="text-sm font-semibold text-zinc-100">Pill shape</p>
        </div>
      </GradientBorder>

      <GradientBorder
        colors={['#fb923c', '#f472b6', '#fb923c']}
        duration={4}
        borderWidth={1}
        borderRadius="0.5rem"
      >
        <div className="px-6 py-4 text-center">
          <p className="font-semibold text-zinc-100">Warm tones</p>
          <p className="mt-1 text-xs text-zinc-500">orange → pink</p>
        </div>
      </GradientBorder>
    </div>
  )
}
