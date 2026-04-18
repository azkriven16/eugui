'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

export interface GradientBorderProps {
  children: React.ReactNode
  className?: string
  containerClassName?: string
  colors?: string[]
  duration?: number
  borderWidth?: number
  borderRadius?: string
}

export function GradientBorder({
  children,
  className,
  containerClassName,
  colors = ['#a78bfa', '#60a5fa', '#f472b6', '#a78bfa'],
  duration = 3,
  borderWidth = 1,
  borderRadius = '0.75rem',
}: GradientBorderProps) {
  const uid = React.useId().replace(/:/g, '')
  const innerRadius = `calc(${borderRadius} - ${borderWidth}px)`

  return (
    <>
      <style>{`
        @property --gb-rot-${uid} {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .gb-${uid} {
          background: conic-gradient(
            from var(--gb-rot-${uid}),
            ${colors.join(', ')}
          );
          animation: gb-spin-${uid} ${duration}s linear infinite;
        }
        @keyframes gb-spin-${uid} {
          to { --gb-rot-${uid}: 360deg; }
        }
      `}</style>
      <div
        className={cn('relative overflow-hidden', containerClassName)}
        style={{ padding: borderWidth, borderRadius }}
      >
        <div
          className={cn('gb-' + uid, 'absolute inset-[-200%]')}
        />
        <div
          className={cn('relative z-10 overflow-hidden bg-zinc-950', className)}
          style={{ borderRadius: innerRadius }}
        >
          {children}
        </div>
      </div>
    </>
  )
}
