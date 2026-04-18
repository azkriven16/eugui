'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import * as React from 'react'

import { cn } from '@/lib/utils'

export interface ParallaxLayerProps {
  children: React.ReactNode
  className?: string
  speed?: number
  horizontal?: boolean
}

export function ParallaxLayer({
  children,
  className,
  speed = 0.3,
  horizontal = false,
}: ParallaxLayerProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const range = speed * 80
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    horizontal ? ['0px', '0px'] : [`${range}px`, `-${range}px`],
  )
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    horizontal ? [`${range}px`, `-${range}px`] : ['0px', '0px'],
  )

  return (
    <div ref={ref} className={cn('overflow-hidden', className)}>
      <motion.div style={{ y, x }}>{children}</motion.div>
    </div>
  )
}
