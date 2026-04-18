'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

export interface TrailCursorProps {
  className?: string
  color?: string
  size?: number
  length?: number
  fixed?: boolean
}

export function TrailCursor({
  className,
  color = '#a78bfa',
  size = 7,
  length = 22,
  fixed = true,
}: TrailCursorProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const pointsRef = React.useRef<Array<{ x: number, y: number }>>([])
  const frameRef = React.useRef<number>(0)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas)
      return
    const ctx = canvas.getContext('2d')
    if (!ctx)
      return

    const resize = () => {
      const parent = canvas.parentElement
      canvas.width = fixed ? window.innerWidth : (parent?.offsetWidth ?? window.innerWidth)
      canvas.height = fixed ? window.innerHeight : (parent?.offsetHeight ?? window.innerHeight)
    }
    resize()

    const onMove = (e: MouseEvent) => {
      if (fixed) {
        pointsRef.current.push({ x: e.clientX, y: e.clientY })
      }
      else {
        const rect = canvas.getBoundingClientRect()
        pointsRef.current.push({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      }
      if (pointsRef.current.length > length)
        pointsRef.current.shift()
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const pts = pointsRef.current
      for (let i = 0; i < pts.length; i++) {
        const t = (i + 1) / pts.length
        const r = Math.max(1, size * t)
        const alpha = t * 0.75
        const hex = Math.round(alpha * 255).toString(16).padStart(2, '0')
        ctx.beginPath()
        ctx.arc(pts[i].x, pts[i].y, r, 0, Math.PI * 2)
        ctx.fillStyle = `${color}${hex}`
        ctx.fill()
      }
      frameRef.current = requestAnimationFrame(draw)
    }

    const target = fixed ? window : (canvas.parentElement ?? canvas)
    target.addEventListener('mousemove', onMove as EventListener)
    window.addEventListener('resize', resize)
    draw()

    return () => {
      cancelAnimationFrame(frameRef.current)
      target.removeEventListener('mousemove', onMove as EventListener)
      window.removeEventListener('resize', resize)
    }
  }, [color, size, length, fixed])

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        'pointer-events-none',
        fixed ? 'fixed inset-0 z-[9999]' : 'absolute inset-0 h-full w-full',
        className,
      )}
    />
  )
}
