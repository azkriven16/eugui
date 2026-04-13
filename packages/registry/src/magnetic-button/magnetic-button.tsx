'use client'

import { motion, useSpring } from 'motion/react'
import * as React from 'react'

import { cn } from '@/lib/utils'

export interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  strength?: number
}

export function MagneticButton({
  children,
  className,
  strength = 40,
  ...props
}: MagneticButtonProps) {
  const ref = React.useRef<HTMLButtonElement>(null)

  const x = useSpring(0, { damping: 20, stiffness: 200 })
  const y = useSpring(0, { damping: 20, stiffness: 200 })

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    if (!ref.current)
      return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * (strength / 100))
    y.set((e.clientY - centerY) * (strength / 100))
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className={cn(
        'relative inline-flex cursor-pointer items-center justify-center rounded-full bg-zinc-50 px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200',
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
}
