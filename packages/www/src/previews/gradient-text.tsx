'use client'

import { GradientText } from '@/ui/gradient-text'

export default function GradientTextPreview() {
  return (
    <div className="flex flex-col items-center gap-6">
      <GradientText
        className="text-6xl font-bold tracking-tighter"
        colors={['#a78bfa', '#60a5fa', '#34d399', '#f472b6', '#a78bfa']}
        duration={4}
      >
        Portfolio
      </GradientText>
      <GradientText
        className="text-2xl font-semibold"
        colors={['#f472b6', '#fb923c', '#facc15', '#f472b6']}
        duration={3}
      >
        Designed with passion
      </GradientText>
      <GradientText
        as="p"
        className="text-base"
        colors={['#60a5fa', '#a78bfa', '#60a5fa']}
        duration={5}
      >
        Any element. Any colors. Any speed.
      </GradientText>
    </div>
  )
}
