'use client'

import { motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react'
import * as React from 'react'

import { cn } from '@/lib/utils'

export interface SpotlightCursorProps {
  className?: string
  color?: string
  size?: number
  fixed?: boolean
}

export function SpotlightCursor({
  className,
  color = 'rgba(167, 139, 250, 0.12)',
  size = 450,
  fixed = true,
}: SpotlightCursorProps) {
  const mouseX = useMotionValue(-9999)
  const mouseY = useMotionValue(-9999)
  const x = useSpring(mouseX, { damping: 28, stiffness: 160 })
  const y = useSpring(mouseY, { damping: 28, stiffness: 160 })
  const background = useMotionTemplate`radial-gradient(${size}px circle at ${x}px ${y}px, ${color}, transparent 80%)`
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (fixed) {
        mouseX.set(e.clientX)
        mouseY.set(e.clientY)
      }
      else {
        const parent = ref.current?.parentElement
        if (!parent)
          return
        const rect = parent.getBoundingClientRect()
        mouseX.set(e.clientX - rect.left)
        mouseY.set(e.clientY - rect.top)
      }
    }

    const target = fixed ? window : (ref.current?.parentElement ?? window)
    target.addEventListener('mousemove', onMove as EventListener)
    return () => target.removeEventListener('mousemove', onMove as EventListener)
  }, [fixed, mouseX, mouseY])

  return (
    <motion.div
      ref={ref}
      className={cn(
        'pointer-events-none',
        fixed ? 'fixed inset-0 z-[9998]' : 'absolute inset-0',
        className,
      )}
      style={{ background }}
    />
  )
}
