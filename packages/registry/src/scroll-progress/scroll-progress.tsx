'use client'

import { motion, useScroll, useSpring } from 'motion/react'

import { cn } from '@/lib/utils'

export interface ScrollProgressProps {
  className?: string
  color?: string
  height?: number
  position?: 'top' | 'bottom'
  zIndex?: number
}

export function ScrollProgress({
  className,
  color = '#a78bfa',
  height = 2,
  position = 'top',
  zIndex = 50,
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })

  return (
    <motion.div
      className={cn('fixed left-0 right-0 origin-left', className)}
      style={{
        scaleX,
        background: color,
        height,
        [position]: 0,
        zIndex,
      }}
    />
  )
}
