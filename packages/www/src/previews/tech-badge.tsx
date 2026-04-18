'use client'

import { TechBadge } from '@/ui/tech-badge'

const STACK = ['React', 'TypeScript', 'Next.js', 'Tailwind', 'Supabase', 'Prisma', 'Go', 'Docker']

export default function TechBadgePreview() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        {STACK.map(name => (
          <TechBadge key={name} name={name} variant="default" />
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {['React', 'TypeScript', 'Next.js'].map(name => (
          <TechBadge key={name} name={name} variant="filled" />
        ))}
        {['Tailwind', 'Supabase'].map(name => (
          <TechBadge key={name} name={name} variant="outline" />
        ))}
      </div>
    </div>
  )
}
