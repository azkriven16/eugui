'use client'

import dynamic from 'next/dynamic'

const previews: Record<string, React.ComponentType> = {
  'animated-beam': dynamic(() => import('@/previews/animated-beam')),
  'aurora-bg': dynamic(() => import('@/previews/aurora-bg')),
  'button': dynamic(() => import('@/previews/button')),
  'count-up': dynamic(() => import('@/previews/count-up')),
  'dot-grid': dynamic(() => import('@/previews/dot-grid')),
  'glass-card': dynamic(() => import('@/previews/glass-card')),
  'glitch-text': dynamic(() => import('@/previews/glitch-text')),
  'gradient-border': dynamic(() => import('@/previews/gradient-border')),
  'gradient-mesh': dynamic(() => import('@/previews/gradient-mesh')),
  'gradient-text': dynamic(() => import('@/previews/gradient-text')),
  'magnetic-button': dynamic(() => import('@/previews/magnetic-button')),
  'morphing-text': dynamic(() => import('@/previews/morphing-text')),
  'particles': dynamic(() => import('@/previews/particles')),
  'blob-cursor': dynamic(() => import('@/previews/blob-cursor')),
  'parallax-layer': dynamic(() => import('@/previews/parallax-layer')),
  'profile-card': dynamic(() => import('@/previews/profile-card')),
  'project-card': dynamic(() => import('@/previews/project-card')),
  'reveal-on-scroll': dynamic(() => import('@/previews/reveal-on-scroll')),
  'review-card': dynamic(() => import('@/previews/review-card')),
  'scroll-progress': dynamic(() => import('@/previews/scroll-progress')),
  'skill-bar': dynamic(() => import('@/previews/skill-bar')),
  'split-text': dynamic(() => import('@/previews/split-text')),
  'spotlight-card': dynamic(() => import('@/previews/spotlight-card')),
  'spotlight-cursor': dynamic(() => import('@/previews/spotlight-cursor')),
  'staggered-list': dynamic(() => import('@/previews/staggered-list')),
  'stat-counter': dynamic(() => import('@/previews/stat-counter')),
  'tech-badge': dynamic(() => import('@/previews/tech-badge')),
  'tilt-card': dynamic(() => import('@/previews/tilt-card')),
  'timeline-item': dynamic(() => import('@/previews/timeline-item')),
  'trail-cursor': dynamic(() => import('@/previews/trail-cursor')),
  'typewriter-text': dynamic(() => import('@/previews/typewriter-text')),
}

export function ComponentPreview({ name }: { name: string }) {
  const Preview = previews[name]

  if (!Preview)
    return null

  return (
    <section className="mb-10">
      <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
        Preview
      </h2>
      <div className="flex min-h-56 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 p-8">
        <Preview />
      </div>
    </section>
  )
}
