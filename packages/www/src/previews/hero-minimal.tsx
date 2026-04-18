'use client'

import { HeroMinimal } from '@/ui/hero-minimal'

export default function HeroMinimalPreview() {
  return (
    <HeroMinimal
      name="Alex Rivera"
      role="Full-Stack Developer"
      bio="I build fast, accessible web experiences with React, TypeScript, and a strong eye for design."
      ctaLabel="View my work"
      ctaHref="#"
      secondaryLabel="Contact me"
      secondaryHref="#"
      links={[
        { label: 'GitHub', href: '#' },
        { label: 'Twitter', href: '#' },
        { label: 'LinkedIn', href: '#' },
      ]}
      className="min-h-[480px]"
    />
  )
}
