'use client'

import { StaggeredList } from '@/ui/staggered-list'

const ITEMS = ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion']

export default function StaggeredListPreview() {
  return (
    <StaggeredList className="flex flex-col gap-2" stagger={0.1} once={false}>
      {ITEMS.map(item => (
        <div
          key={item}
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-300"
        >
          {item}
        </div>
      ))}
    </StaggeredList>
  )
}
