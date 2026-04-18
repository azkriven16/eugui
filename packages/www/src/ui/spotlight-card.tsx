'use client'

import { motion, useMotionTemplate, useMotionValue } from 'motion/react'
import * as React from 'react'

import { cn } from '@/lib/utils'

export interface SpotlightCardProps {
  children: React.ReactNode
  className?: string
  spotlightColor?: string
  spotlightSize?: number
}

export function SpotlightCard({
  children,
  className,
  spotlightColor = 'rgba(167, 139, 250, 0.15)',
  spotlightSize = 300,
}: SpotlightCardProps) {
  const mouseX = useMotionValue(-9999)
  const mouseY = useMotionValue(-9999)
  const ref = React.useRef<HTMLDivElement>(null)

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current)
      return
    const rect = ref.current.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  function handleMouseLeave() {
    mouseX.set(-9999)
    mouseY.set(-9999)
  }

  const background = useMotionTemplate`radial-gradient(${spotlightSize}px circle at ${mouseX}px ${mouseY}px, ${spotlightColor}, transparent 80%)`

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900',
        className,
      )}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
