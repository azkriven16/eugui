'use client'

import { AboutSection } from '@/ui/about-section'

export default function AboutSectionPreview() {
  return (
    <AboutSection
      name="Alex Rivera"
      role="Full-Stack Developer"
      bio={[
        'I\'m a developer based in San Francisco with 5 years of experience building products that people love to use.',
        'I care deeply about performance, accessibility, and the small details that make interfaces feel alive.',
      ]}
      tech={['React', 'TypeScript', 'Next.js', 'Node.js', 'PostgreSQL', 'Tailwind', 'Figma', 'Go']}
      links={[
        { label: 'GitHub', href: '#' },
        { label: 'Twitter', href: '#' },
        { label: 'Resume ↓', href: '#' },
      ]}
      className="py-16"
    />
  )
}
