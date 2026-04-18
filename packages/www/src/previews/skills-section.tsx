'use client'

import { SkillsSection } from '@/ui/skills-section'

export default function SkillsSectionPreview() {
  return (
    <SkillsSection
      heading="Skills"
      categories={[
        {
          name: 'Frontend',
          skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
        },
        {
          name: 'Backend',
          skills: ['Node.js', 'Go', 'PostgreSQL', 'Redis', 'tRPC'],
        },
        {
          name: 'Tooling',
          skills: ['Git', 'Docker', 'Vercel', 'Figma', 'Vitest'],
        },
      ]}
      className="py-16"
    />
  )
}
