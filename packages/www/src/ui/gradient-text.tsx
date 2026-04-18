'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

export interface GradientTextProps {
  children: React.ReactNode
  className?: string
  colors?: string[]
  duration?: number
  as?: React.ElementType
}

export function GradientText({
  children,
  className,
  colors = ['#a78bfa', '#60a5fa', '#34d399', '#f472b6', '#a78bfa'],
  duration = 4,
  as: Tag = 'span',
}: GradientTextProps) {
  const uid = React.useId().replace(/:/g, '')

  return (
    <>
      <style>
        {`
          .gt-${uid} {
            background: linear-gradient(90deg, ${colors.join(', ')});
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: gt-shift-${uid} ${duration}s linear infinite;
          }
          @keyframes gt-shift-${uid} {
            0%   { background-position: 0% center; }
            100% { background-position: 200% center; }
          }
        `}
      </style>
      <Tag className={cn(`gt-${uid}`, className)}>
        {children}
      </Tag>
    </>
  )
}
