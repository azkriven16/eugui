'use client'

import { TypewriterText } from '@/ui/typewriter-text'

export default function TypewriterTextPreview() {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-4xl font-bold tracking-tight text-zinc-50">
        {'I build '}
        <TypewriterText
          words={['websites', 'apps', 'experiences', 'things']}
          className="text-violet-400"
        />
      </div>
      <div className="text-lg text-zinc-400">
        <TypewriterText
          words={['Full-stack developer', 'Open source contributor', 'UI enthusiast']}
          typeSpeed={60}
          deleteSpeed={30}
          pauseDuration={2200}
        />
      </div>
    </div>
  )
}
