'use client'

import { motion } from 'motion/react'
import * as React from 'react'

import { cn } from '@/lib/utils'

export interface SkillBarProps {
  label: string
  value: number
  className?: string
  color?: string
  showValue?: boolean
  duration?: number
  delay?: number
}

export function SkillBar({
  label,
  value,
  className,
  color = '#a78bfa',
  showValue = true,
  duration = 1.2,
  delay = 0,
}: SkillBarProps) {
  const [inView, setInView] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  const clamped = Math.min(100, Math.max(0, value))

  React.useEffect(() => {
    const el = ref.current
    if (!el)
      return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={cn('w-full', className)}>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium text-zinc-300">{label}</span>
        {showValue && <span className="text-zinc-500">{clamped}%</span>}
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: '0%' }}
          animate={inView ? { width: `${clamped}%` } : { width: '0%' }}
          transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>
    </div>
  )
}
