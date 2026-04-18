'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

export interface CountUpProps {
  end: number
  start?: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
  className?: string
  once?: boolean
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3
}

export function CountUp({
  end,
  start = 0,
  duration = 2000,
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
  once = true,
}: CountUpProps) {
  const [value, setValue] = React.useState(start)
  const hasAnimatedRef = React.useRef(false)
  const ref = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el)
      return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !(once && hasAnimatedRef.current)) {
          if (once)
            hasAnimatedRef.current = true
          const startTime = performance.now()
          const tick = (now: number) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            setValue(start + (end - start) * easeOutCubic(progress))
            if (progress < 1) {
              requestAnimationFrame(tick)
            }
            else {
              setValue(end)
            }
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [end, start, duration, once])

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  )
}
