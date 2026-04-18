'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

const VARIANT_STYLES = {
  default: 'bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 hover:border-zinc-600',
  outline: 'border border-zinc-700 text-zinc-400 hover:border-violet-500/50 hover:text-violet-300',
  filled: 'bg-violet-600/20 border border-violet-500/30 text-violet-300 hover:bg-violet-600/30',
} as const

export interface TechBadgeProps {
  name: string
  icon?: React.ReactNode
  variant?: keyof typeof VARIANT_STYLES
  className?: string
}

export function TechBadge({
  name,
  icon,
  variant = 'default',
  className,
}: TechBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-sm font-medium transition-colors',
        VARIANT_STYLES[variant],
        className,
      )}
    >
      {icon && <span className="size-4 shrink-0 leading-none">{icon}</span>}
      {name}
    </span>
  )
}
