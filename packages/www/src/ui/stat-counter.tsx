'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

export interface StatCounterProps {
  end: number
  label: string
  prefix?: string
  suffix?: string
  duration?: number
  decimals?: number
  icon?: React.ReactNode
  className?: string
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3
}

export function StatCounter({
  end,
  label,
  prefix = '',
  suffix = '',
  duration = 2000,
  decimals = 0,
  icon,
  className,
}: StatCounterProps) {
  const [value, setValue] = React.useState(0)
  const hasAnimatedRef = React.useRef(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el)
      return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true
          const startTime = performance.now()
          const tick = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1)
            setValue(end * easeOutCubic(progress))
            if (progress < 1)
              requestAnimationFrame(tick)
            else
              setValue(end)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  return (
    <div ref={ref} className={cn('flex flex-col items-center gap-1 text-center', className)}>
      {icon && <div className="mb-1 text-2xl text-violet-400">{icon}</div>}
      <span className="tabular-nums text-4xl font-bold text-zinc-50">
        {prefix}
        {value.toFixed(decimals)}
        {suffix}
      </span>
      <span className="text-sm text-zinc-500">{label}</span>
    </div>
  )
}
