'use client'

import { ProjectCard } from '@/ui/project-card'

export default function ProjectCardPreview() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <ProjectCard
        title="Portfolio Site"
        description="Personal portfolio built with Next.js, Tailwind, and Framer Motion."
        tags={['Next.js', 'TypeScript', 'Tailwind']}
        liveUrl="#"
        repoUrl="#"
      />
      <ProjectCard
        title="SaaS Dashboard"
        description="Analytics dashboard with real-time data visualization and team collaboration."
        tags={['React', 'Supabase', 'Recharts']}
        liveUrl="#"
      />
    </div>
  )
}
