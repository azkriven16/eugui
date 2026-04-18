'use client'

import { motion } from 'motion/react'
import * as React from 'react'

import { cn } from '@/lib/utils'

export interface StaggeredListProps {
  children: React.ReactNode
  className?: string
  itemClassName?: string
  stagger?: number
  duration?: number
  direction?: 'up' | 'down'
  distance?: number
  once?: boolean
}

export function StaggeredList({
  children,
  className,
  itemClassName,
  stagger = 0.08,
  duration = 0.5,
  direction = 'up',
  distance = 20,
  once = true,
}: StaggeredListProps) {
  const [inView, setInView] = React.useState(false)
  const [hasAnimated, setHasAnimated] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  const initialY = direction === 'up' ? distance : -distance

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
    <div ref={ref} className={cn(className)}>
      {React.Children.map(children, (child, i) => (
        <motion.div
          key={i}
          className={cn(itemClassName)}
          initial={{ y: initialY, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : { y: initialY, opacity: 0 }}
          transition={{
            duration,
            delay: i * stagger,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}
