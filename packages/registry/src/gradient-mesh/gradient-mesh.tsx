'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

export interface GradientMeshProps {
  className?: string
  colors?: [string, string, string, string]
  speed?: number
  children?: React.ReactNode
}

export function GradientMesh({
  className,
  colors = ['#a78bfa', '#60a5fa', '#34d399', '#f472b6'],
  speed = 1,
  children,
}: GradientMeshProps) {
  const uid = React.useId().replace(/:/g, '')
  const dur = `${12 / speed}s`

  return (
    <>
      <style>{`
        .gm-${uid} {
          position: relative;
          overflow: hidden;
        }
        .gm-${uid}::before {
          content: '';
          position: absolute;
          inset: -60%;
          background:
            radial-gradient(ellipse at 20% 20%, ${colors[0]}50, transparent 55%),
            radial-gradient(ellipse at 80% 15%, ${colors[1]}50, transparent 55%),
            radial-gradient(ellipse at 15% 80%, ${colors[2]}50, transparent 55%),
            radial-gradient(ellipse at 80% 80%, ${colors[3]}50, transparent 55%);
          animation: gm-drift-${uid} ${dur} ease-in-out infinite alternate;
        }
        @keyframes gm-drift-${uid} {
          0%   { transform: translate(0%, 0%)    rotate(0deg); }
          33%  { transform: translate(4%, -4%)   rotate(1.5deg); }
          66%  { transform: translate(-4%, 4%)   rotate(-1.5deg); }
          100% { transform: translate(3%, -3%)   rotate(1deg); }
        }
      `}</style>
      <div className={cn('gm-' + uid, className)}>
        {children && <div className="relative z-10">{children}</div>}
      </div>
    </>
  )
}
