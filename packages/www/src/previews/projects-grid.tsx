'use client'

import { ProjectsGrid } from '@/ui/projects-grid'

export default function ProjectsGridPreview() {
  return (
    <ProjectsGrid
      heading="Projects"
      subheading="A selection of things I've built."
      projects={[
        {
          title: 'Portfolio v3',
          description: 'Personal site built with Next.js 15, Tailwind v4, and custom animations.',
          tags: ['Next.js', 'TypeScript', 'Tailwind'],
          liveUrl: '#',
          repoUrl: '#',
        },
        {
          title: 'DevBoard',
          description: 'A real-time developer dashboard for tracking GitHub activity and CI status.',
          tags: ['React', 'Supabase', 'Vercel'],
          liveUrl: '#',
        },
        {
          title: 'Open CLI',
          description: 'A shadcn-style CLI for distributing component libraries via copy-paste.',
          tags: ['Node.js', 'Commander', 'npm'],
          repoUrl: '#',
        },
      ]}
      className="py-16"
    />
  )
}
