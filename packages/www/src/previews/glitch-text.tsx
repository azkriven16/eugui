'use client'

import { GlitchText } from '@/ui/glitch-text'

export default function GlitchTextPreview() {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-5xl font-bold tracking-tight text-zinc-50">
        <GlitchText>GLITCH</GlitchText>
      </div>
      <div className="text-2xl font-semibold text-zinc-300">
        <GlitchText speed="fast" color1="#ff2020" color2="#00ffcc">FAST MODE</GlitchText>
      </div>
      <div className="text-xl font-mono text-zinc-400">
        <GlitchText speed="slow">slow and steady</GlitchText>
      </div>
    </div>
  )
}
