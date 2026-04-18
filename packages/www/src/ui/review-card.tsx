'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

export interface ReviewCardProps {
  quote: string
  name: string
  role?: string
  company?: string
  avatar?: string
  rating?: number
  className?: string
}

export function ReviewCard({
  quote,
  name,
  role,
  company,
  avatar,
  rating,
  className,
}: ReviewCardProps) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-6',
        className,
      )}
    >
      {rating !== undefined && (
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={i < rating ? 'text-yellow-400' : 'text-zinc-700'}
              aria-hidden
            >
              ★
            </span>
          ))}
        </div>
      )}
      <blockquote className="text-sm leading-relaxed text-zinc-400">
        &ldquo;
        {quote}
        &rdquo;
      </blockquote>
      <div className="flex items-center gap-3">
        <div className="size-9 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-violet-600 to-blue-600">
          {avatar
            ? (
                <img src={avatar} alt={name} className="h-full w-full object-cover" />
              )
            : (
                <span className="flex h-full w-full items-center justify-center text-xs font-bold text-white">
                  {initials}
                </span>
              )}
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-200">{name}</p>
          {(role || company) && (
            <p className="text-xs text-zinc-500">
              {[role, company].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
