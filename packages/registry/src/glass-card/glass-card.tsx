'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

const BLUR_MAP = {
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl',
} as const

export interface GlassCardProps {
  children: React.ReactNode
  className?: string
  blur?: keyof typeof BLUR_MAP
  border?: boolean
  padding?: boolean
}

export function GlassCard({
  children,
  className,
  blur = 'md',
  border = true,
  padding = true,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-white/5',
        BLUR_MAP[blur],
        border && 'border border-white/10',
        padding && 'p-6',
        'shadow-xl shadow-black/20',
        className,
      )}
    >
      {children}
    </div>
  )
}
