'use client'

import { motion, useMotionValue, useSpring } from 'motion/react'
import * as React from 'react'

import { cn } from '@/lib/utils'

export interface BlobCursorProps {
  className?: string
  color?: string
  size?: number
  fixed?: boolean
}

export function BlobCursor({
  className,
  color = '#a78bfa',
  size = 44,
  fixed = true,
}: BlobCursorProps) {
  const mouseX = useMotionValue(-9999)
  const mouseY = useMotionValue(-9999)
  const x = useSpring(mouseX, { damping: 18, stiffness: 180, mass: 0.6 })
  const y = useSpring(mouseY, { damping: 18, stiffness: 180, mass: 0.6 })
  const ref = React.useRef<HTMLDivElement>(null)
  const uid = React.useId().replace(/:/g, '')

  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (fixed) {
        mouseX.set(e.clientX - size / 2)
        mouseY.set(e.clientY - size / 2)
      }
      else {
        const parent = ref.current?.parentElement
        if (!parent)
          return
        const rect = parent.getBoundingClientRect()
        mouseX.set(e.clientX - rect.left - size / 2)
        mouseY.set(e.clientY - rect.top - size / 2)
      }
    }

    const target = fixed ? window : (ref.current?.parentElement ?? window)
    target.addEventListener('mousemove', onMove as EventListener)
    return () => target.removeEventListener('mousemove', onMove as EventListener)
  }, [fixed, mouseX, mouseY, size])

  return (
    <div
      ref={ref}
      className={cn(
        'pointer-events-none overflow-hidden',
        fixed ? 'fixed inset-0 z-[9999]' : 'absolute inset-0',
        className,
      )}
    >
      <style>
        {`
          @keyframes blob-morph-${uid} {
            0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
            25%      { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
            50%      { border-radius: 50% 60% 30% 70% / 30% 40% 60% 50%; }
            75%      { border-radius: 40% 60% 50% 30% / 60% 40% 50% 40%; }
          }
        `}
      </style>
      <motion.div
        className="absolute"
        style={{
          x,
          y,
          width: size,
          height: size,
          background: `${color}28`,
          border: `1.5px solid ${color}99`,
          animation: `blob-morph-${uid} 4s ease-in-out infinite`,
        }}
      />
    </div>
  )
}
