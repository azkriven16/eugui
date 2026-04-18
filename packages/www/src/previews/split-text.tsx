'use client'

import { SplitText } from '@/ui/split-text'

export default function SplitTextPreview() {
  return (
    <div className="flex flex-col items-center gap-8">
      <h2 className="text-5xl font-bold tracking-tight text-zinc-50">
        <SplitText stagger={0.04} duration={0.6} delay={0.1}>
          Hello, World.
        </SplitText>
      </h2>
      <p className="text-xl text-zinc-400">
        <SplitText by="word" stagger={0.08} duration={0.5} delay={0.3}>
          Each word slides in with stagger.
        </SplitText>
      </p>
      <p className="text-base text-zinc-500">
        <SplitText stagger={0.02} duration={0.4} delay={0}>
          Scroll-triggered. Once. Or looping.
        </SplitText>
      </p>
    </div>
  )
}
