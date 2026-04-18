'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

export interface DotGridProps {
  className?: string
  dotColor?: string
  dotSize?: number
  gap?: number
  radius?: number
  maxScale?: number
}

export function DotGrid({
  className,
  dotColor = '#a78bfa',
  dotSize = 2,
  gap = 24,
  radius = 90,
  maxScale = 3.5,
}: DotGridProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const mouseRef = React.useRef({ x: -9999, y: -9999 })
  const frameRef = React.useRef<number>(0)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas)
      return
    const ctx = canvas.getContext('2d')
    if (!ctx)
      return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    const onLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 }
    }

    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseleave', onLeave)
    window.addEventListener('resize', resize)

    // Parse hex to rgb string (handles 6-digit hex)
    const hexToRgb = (hex: string) => {
      const clean = hex.replace('#', '')
      const r = parseInt(clean.slice(0, 2), 16)
      const g = parseInt(clean.slice(2, 4), 16)
      const b = parseInt(clean.slice(4, 6), 16)
      return `${r},${g},${b}`
    }
    const rgb = dotColor.startsWith('#') ? hexToRgb(dotColor) : '167,139,250'

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const cols = Math.ceil(canvas.width / gap) + 1
      const rows = Math.ceil(canvas.height / gap) + 1

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * gap
          const y = r * gap
          const dist = Math.hypot(x - mx, y - my)
          const influence = Math.max(0, 1 - dist / radius)
          const scale = 1 + (maxScale - 1) * influence
          const opacity = 0.15 + influence * 0.7

          ctx.beginPath()
          ctx.arc(x, y, dotSize * scale, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${rgb},${opacity})`
          ctx.fill()
        }
      }

      frameRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(frameRef.current)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('resize', resize)
    }
  }, [dotColor, dotSize, gap, radius, maxScale])

  return (
    <canvas
      ref={canvasRef}
      className={cn('block h-full w-full', className)}
    />
  )
}
