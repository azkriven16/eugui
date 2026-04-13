'use client'

import dynamic from 'next/dynamic'

const previews: Record<string, React.ComponentType> = {
  'animated-beam': dynamic(() => import('@/previews/animated-beam')),
  'button': dynamic(() => import('@/previews/button')),
  'magnetic-button': dynamic(() => import('@/previews/magnetic-button')),
  'morphing-text': dynamic(() => import('@/previews/morphing-text')),
  'particles': dynamic(() => import('@/previews/particles')),
  'tilt-card': dynamic(() => import('@/previews/tilt-card')),
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
