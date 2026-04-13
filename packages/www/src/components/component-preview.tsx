'use client'

import dynamic from 'next/dynamic'

const previews: Record<string, React.ComponentType> = {
  button: dynamic(() => import('@/previews/button')),
}

export function ComponentPreview({ name }: { name: string }) {
  const Preview = previews[name]

  if (!Preview) return null

  return (
    <section className="mb-10">
      <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
        Preview
      </h2>
      <div className="flex min-h-40 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 p-8">
        <Preview />
      </div>
    </section>
  )
}
