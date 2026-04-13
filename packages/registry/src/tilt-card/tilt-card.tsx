'use client'

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'motion/react'
import * as React from 'react'

import { cn } from '@/lib/utils'

export interface TiltCardProps {
  children: React.ReactNode
  className?: string
  glare?: boolean
  maxTilt?: number
  scale?: number
}

export function TiltCard({
  children,
  className,
  glare = true,
  maxTilt = 15,
  scale = 1.05,
}: TiltCardProps) {
  const ref = React.useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { damping: 30, stiffness: 300 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  const rotateX = useTransform(ySpring, [-0.5, 0.5], [maxTilt, -maxTilt])
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-maxTilt, maxTilt])
  const glareX = useTransform(xSpring, [-0.5, 0.5], ['0%', '100%'])
  const glareY = useTransform(ySpring, [-0.5, 0.5], ['0%', '100%'])
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.15) 0%, transparent 60%)`

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current)
      return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      whileHover={{ scale }}
      className={cn('relative cursor-pointer', className)}
    >
      {children}
      {glare && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background: glareBackground }}
        />
      )}
    </motion.div>
  )
}
