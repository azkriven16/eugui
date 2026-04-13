'use client'

import { MorphingText } from '@/ui/morphing-text'

export default function MorphingTextPreview() {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center text-4xl font-bold tracking-tight text-zinc-50">
        {'Components that are '}
        <MorphingText
          words={['animated', '3D', 'stunning', 'yours']}
          className="text-violet-400"
          duration={2000}
        />
      </div>
      <div className="text-center text-xl font-medium text-zinc-400">
        {'Built for '}
        <MorphingText
          words={['portfolios', 'landing pages', 'dashboards', 'everything']}
          className="text-zinc-200"
          duration={1800}
        />
      </div>
    </div>
  )
}
