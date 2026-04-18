'use client'

import { GlassCard } from '@/ui/glass-card'

export default function GlassCardPreview() {
  return (
    <div
      className="relative flex items-center justify-center gap-4 rounded-xl p-8"
      style={{
        background:
          'linear-gradient(135deg, #a855f7 0%, #6366f1 40%, #3b82f6 100%)',
      }}
    >
      <GlassCard className="w-48 text-center">
        <p className="text-sm font-semibold text-white">Glass Card</p>
        <p className="mt-1 text-xs text-white/60">backdrop-blur-md</p>
      </GlassCard>
      <GlassCard blur="xl" className="w-48 text-center">
        <p className="text-sm font-semibold text-white">Heavy Blur</p>
        <p className="mt-1 text-xs text-white/60">backdrop-blur-xl</p>
      </GlassCard>
      <GlassCard blur="sm" className="w-48 text-center">
        <p className="text-sm font-semibold text-white">Light Blur</p>
        <p className="mt-1 text-xs text-white/60">backdrop-blur-sm</p>
      </GlassCard>
    </div>
  )
}
