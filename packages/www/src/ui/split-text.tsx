'use client'

import { motion } from 'motion/react'
import * as React from 'react'

import { cn } from '@/lib/utils'

export interface SplitTextProps {
  children: string
  className?: string
  charClassName?: string
  delay?: number
  stagger?: number
  duration?: number
  once?: boolean
  by?: 'char' | 'word'
}

export function SplitText({
  children,
  className,
  charClassName,
  delay = 0,
  stagger = 0.03,
  duration = 0.5,
  once = true,
  by = 'char',
}: SplitTextProps) {
  const [inView, setInView] = React.useState(false)
  const hasAnimatedRef = React.useRef(false)
  const ref = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el)
      return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !(once && hasAnimatedRef.current)) {
          setInView(true)
          if (once)
            hasAnimatedRef.current = true
        }
        else if (!once) {
          setInView(entry.isIntersecting)
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [once])

  const units = by === 'word' ? children.split(' ') : children.split('')

  return (
    <span ref={ref} className={cn('inline', className)} aria-label={children}>
      {units.map((unit, i) => (
        <React.Fragment key={i}>
          <span className="inline-block overflow-hidden">
            <motion.span
              aria-hidden
              className={cn('inline-block', charClassName)}
              initial={{ y: '110%', opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : { y: '110%', opacity: 0 }}
              transition={{
                duration,
                delay: delay + i * stagger,
                ease: [0.2, 0.65, 0.3, 0.9],
              }}
            >
              {unit === ' ' ? '\u00A0' : unit}
            </motion.span>
          </span>
          {by === 'word' && i < units.length - 1 && '\u00A0'}
        </React.Fragment>
      ))}
    </span>
  )
}
