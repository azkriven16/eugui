'use client'

import dynamic from 'next/dynamic'

const previews: Record<string, React.ComponentType> = {
  'about-section': dynamic(() => import('@/previews/about-section')),
  'contact-section': dynamic(() => import('@/previews/contact-section')),
  'hero-bold': dynamic(() => import('@/previews/hero-bold')),
  'hero-minimal': dynamic(() => import('@/previews/hero-minimal')),
  'projects-grid': dynamic(() => import('@/previews/projects-grid')),
  'skills-section': dynamic(() => import('@/previews/skills-section')),
  'stats-row': dynamic(() => import('@/previews/stats-row')),
}

export function BlockPreview({ name }: { name: string }) {
  const Preview = previews[name]

  if (!Preview)
    return null

  return (
    <section className="mb-10">
      <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
        Preview
      </h2>
      <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
        <Preview />
      </div>
    </section>
  )
}
