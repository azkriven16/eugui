'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

export interface Stat {
  end: number
  suffix?: string
  prefix?: string
  label: string
  decimals?: number
}

export interface StatsRowProps {
  stats: Stat[]
  heading?: string
  className?: string
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3
}

function AnimatedStat({ end, suffix = '', prefix = '', label, decimals = 0 }: Stat) {
  const [value, setValue] = React.useState(0)
  const [animated, setAnimated] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el)
      return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated) {
          setAnimated(true)
          const start = performance.now()
          const tick = (now: number) => {
            const t = Math.min((now - start) / 2000, 1)
            setValue(end * easeOutCubic(t))
            if (t < 1)
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
  }, [end, animated])

  return (
    <div ref={ref} className="flex flex-col items-center gap-1 text-center">
      <span className="tabular-nums text-5xl font-bold text-zinc-50">
        {prefix}
        {value.toFixed(decimals)}
        {suffix}
      </span>
      <span className="text-sm text-zinc-500">{label}</span>
    </div>
  )
}

export function StatsRow({ stats, heading, className }: StatsRowProps) {
  return (
    <section className={cn('bg-zinc-950 px-4 py-24', className)}>
      <div className="mx-auto max-w-5xl">
        {heading && (
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-50">{heading}</h2>
          </div>
        )}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {stats.map((stat, i) => (
            <AnimatedStat key={i} {...stat} />
          ))}
        </div>
      </div>
    </section>
  )
}
