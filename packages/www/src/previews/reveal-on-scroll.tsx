'use client'

import { RevealOnScroll } from '@/ui/reveal-on-scroll'

export default function RevealOnScrollPreview() {
  return (
    <div className="flex flex-col items-center gap-4">
      {(['up', 'left', 'right'] as const).map((dir, i) => (
        <RevealOnScroll key={dir} direction={dir} delay={i * 0.1} once={false}>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-6 py-3 text-sm text-zinc-300">
            Reveal from
            {' '}
            <span className="text-violet-400">{dir}</span>
          </div>
        </RevealOnScroll>
      ))}
    </div>
  )
}
