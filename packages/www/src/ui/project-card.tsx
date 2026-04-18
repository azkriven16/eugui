'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

export interface ProjectCardProps {
  title: string
  description: string
  image?: string
  tags?: string[]
  liveUrl?: string
  repoUrl?: string
  className?: string
}

export function ProjectCard({
  title,
  description,
  image,
  tags = [],
  liveUrl,
  repoUrl,
  className,
}: ProjectCardProps) {
  return (
    <div
      className={cn(
        'group flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition-colors duration-300 hover:border-zinc-700',
        className,
      )}
    >
      {image && (
        <div className="aspect-video overflow-hidden bg-zinc-800">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-semibold text-zinc-100">{title}</h3>
        <p className="flex-1 text-sm leading-relaxed text-zinc-500">{description}</p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map(tag => (
              <span
                key={tag}
                className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {(liveUrl || repoUrl) && (
          <div className="flex items-center gap-2 pt-1">
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md bg-violet-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-violet-500"
              >
                Live ↗
              </a>
            )}
            {repoUrl && (
              <a
                href={repoUrl}
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
  )
}
