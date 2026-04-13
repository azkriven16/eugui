'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

export interface AnimatedBeamProps {
  containerRef: React.RefObject<HTMLElement | null>
  fromRef: React.RefObject<HTMLElement | null>
  toRef: React.RefObject<HTMLElement | null>
  className?: string
  curvature?: number
  duration?: number
  gradientStartColor?: string
  gradientStopColor?: string
  reverse?: boolean
}

export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  className,
  curvature = 0,
  duration = 3,
  gradientStartColor = '#a78bfa',
  gradientStopColor = '#60a5fa',
  reverse = false,
}: AnimatedBeamProps) {
  const id = React.useId()
  const pathRef = React.useRef<SVGPathElement>(null)
  const [pathD, setPathD] = React.useState('')
  const [totalLength, setTotalLength] = React.useState(0)

  const updatePath = React.useCallback(() => {
    if (!containerRef.current || !fromRef.current || !toRef.current)
      return
    const container = containerRef.current.getBoundingClientRect()
    const from = fromRef.current.getBoundingClientRect()
    const to = toRef.current.getBoundingClientRect()

    const fx = from.left - container.left + from.width / 2
    const fy = from.top - container.top + from.height / 2
    const tx = to.left - container.left + to.width / 2
    const ty = to.top - container.top + to.height / 2
    const mx = (fx + tx) / 2
    const my = (fy + ty) / 2 - curvature

    setPathD(`M ${fx} ${fy} Q ${mx} ${my} ${tx} ${ty}`)
  }, [containerRef, fromRef, toRef, curvature])

  React.useEffect(() => {
    updatePath()
    window.addEventListener('resize', updatePath)
    return () => window.removeEventListener('resize', updatePath)
  }, [updatePath])

  React.useEffect(() => {
    if (pathRef.current && pathD)
      setTotalLength(pathRef.current.getTotalLength())
  }, [pathD])

  const beamLength = totalLength * 0.3
  const gradientId = `beam-grad-${id}`

  return (
    <svg
      className={cn('pointer-events-none absolute inset-0 h-full w-full overflow-visible', className)}
    >
      <defs>
        <linearGradient id={gradientId} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={gradientStartColor} stopOpacity="0" />
          <stop offset="40%" stopColor={gradientStartColor} />
          <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Track */}
      <path d={pathD} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={2} />

      {/* Beam */}
      {totalLength > 0 && (
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray={`${beamLength} ${totalLength - beamLength}`}
          style={{
            'animation': `beam-move-${reverse ? 'rev' : 'fwd'} ${duration}s linear infinite`,
            '--beam-total': `-${totalLength}px`,
          } as React.CSSProperties}
        />
      )}

      <style>
        {`
          @keyframes beam-move-fwd {
            from { stroke-dashoffset: 0; }
            to { stroke-dashoffset: var(--beam-total); }
          }
          @keyframes beam-move-rev {
            from { stroke-dashoffset: var(--beam-total); }
            to { stroke-dashoffset: 0; }
          }
        `}
      </style>
    </svg>
  )
}
