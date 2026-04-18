'use client'

import { motion } from 'motion/react'
import * as React from 'react'

import { cn } from '@/lib/utils'

const DIRECTION_OFFSET = {
  up: { y: 32, x: 0 },
  down: { y: -32, x: 0 },
  left: { x: 32, y: 0 },
  right: { x: -32, y: 0 },
  none: { x: 0, y: 0 },
}

export interface RevealOnScrollProps {
  children: React.ReactNode
  className?: string
  direction?: keyof typeof DIRECTION_OFFSET
  distance?: number
  duration?: number
  delay?: number
  once?: boolean
}

export function RevealOnScroll({
  children,
  className,
  direction = 'up',
  distance = 32,
  duration = 0.6,
  delay = 0,
  once = true,
}: RevealOnScrollProps) {
  const [inView, setInView] = React.useState(false)
  const [hasAnimated, setHasAnimated] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  const base = DIRECTION_OFFSET[direction]
  const scale = distance / 32
  const hidden = {
    x: base.x * scale,
    y: base.y * scale,
    opacity: 0,
  }

  React.useEffect(() => {
    const el = ref.current
    if (!el)
      return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !(once && hasAnimated)) {
          setInView(true)
          if (once)
            setHasAnimated(true)
        }
        else if (!once) {
          setInView(entry.isIntersecting)
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [once, hasAnimated])

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={hidden}
      animate={inView ? { x: 0, y: 0, opacity: 1 } : hidden}
      transition={{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  )
}
