'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

export interface Project {
  title: string
  description: string
  image?: string
  tags?: string[]
  liveUrl?: string
  repoUrl?: string
}

export interface ProjectsGridProps {
  heading?: string
  subheading?: string
  projects: Project[]
  columns?: 2 | 3
  className?: string
}

export function ProjectsGrid({
  heading = 'Projects',
  subheading,
  projects,
  columns = 3,
  className,
}: ProjectsGridProps) {
  return (
    <section className={cn('bg-zinc-950 px-4 py-24', className)}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-semibold tracking-tight text-zinc-50">{heading}</h2>
          {subheading && <p className="text-zinc-500">{subheading}</p>}
        </div>

        <div
          className={cn(
            'grid grid-cols-1 gap-5',
            columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3',
          )}
        >
          {projects.map((project, i) => (
            <div
              key={i}
              className="group flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition-colors hover:border-zinc-700"
            >
              {project.image && (
                <div className="aspect-video overflow-hidden bg-zinc-800">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col gap-3 p-5">
                <h3 className="font-semibold text-zinc-100">{project.title}</h3>
                <p className="flex-1 text-sm leading-relaxed text-zinc-500">{project.description}</p>
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map(tag => (
                      <span key={tag} className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {(project.liveUrl || project.repoUrl) && (
                  <div className="flex items-center gap-2 pt-1">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-md bg-violet-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-violet-500"
                      >
                        Live ↗
                      </a>
                    )}
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-md border border-zinc-700 px-3 py-1 text-xs font-medium text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200"
                      >
                        Repo ↗
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
