'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

export interface TimelineItemProps {
  date: string
  title: string
  company?: string
  description?: string
  type?: 'work' | 'education' | 'project'
  current?: boolean
  last?: boolean
  className?: string
}

const TYPE_DOT: Record<string, string> = {
  work: 'bg-violet-500',
  education: 'bg-blue-500',
  project: 'bg-emerald-500',
}

export function TimelineItem({
  date,
  title,
  company,
  description,
  type = 'work',
  current = false,
  last = false,
  className,
}: TimelineItemProps) {
  return (
    <div className={cn('relative flex gap-5', className)}>
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'mt-1 size-3 shrink-0 rounded-full ring-4 ring-zinc-950',
            TYPE_DOT[type] ?? 'bg-zinc-500',
            current && 'ring-2 ring-violet-400/40 ring-offset-1 ring-offset-zinc-950',
          )}
        />
        {!last && <div className="mt-1.5 w-px flex-1 bg-zinc-800" />}
      </div>
      <div className={cn('min-w-0 flex-1', last ? 'pb-0' : 'pb-8')}>
        <time className="text-xs font-medium text-zinc-500">{date}</time>
        <h3 className="mt-0.5 font-semibold text-zinc-100">{title}</h3>
        {company && <p className="text-sm text-zinc-400">{company}</p>}
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-zinc-500">{description}</p>
        )}
      </div>
    </div>
  )
}
