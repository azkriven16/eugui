'use client'

import { MagneticButton } from '@/ui/magnetic-button'

export default function MagneticButtonPreview() {
  return (
    <div className="flex flex-col items-center gap-8">
      <p className="text-xs text-zinc-500">Hover near the buttons — they pull toward your cursor</p>
      <div className="flex flex-wrap items-center justify-center gap-6">
        <MagneticButton>Hover me</MagneticButton>
        <MagneticButton strength={60} className="bg-violet-600 text-white hover:bg-violet-500">
          Stronger pull
        </MagneticButton>
        <MagneticButton strength={20} className="border border-zinc-700 bg-transparent text-zinc-100 hover:bg-zinc-800">
          Subtle pull
        </MagneticButton>
      </div>
    </div>
  )
}
