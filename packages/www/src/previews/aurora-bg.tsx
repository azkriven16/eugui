'use client'

import { AuroraBg } from '@/ui/aurora-bg'

export default function AuroraBgPreview() {
  return (
    <AuroraBg
      className="flex min-h-48 w-full items-center justify-center rounded-xl bg-zinc-950"
      colors={['#a855f7', '#6366f1', '#3b82f6', '#10b981']}
      blur={80}
    >
      <div className="text-center">
        <p className="text-2xl font-bold tracking-tight text-white">
          Aurora Background
        </p>
        <p className="mt-1 text-sm text-white/50">
          Canvas-based northern lights effect
        </p>
      </div>
    </AuroraBg>
  )
}
