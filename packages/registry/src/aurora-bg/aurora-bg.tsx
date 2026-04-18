'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

export interface AuroraBgProps {
  className?: string
  children?: React.ReactNode
  colors?: string[]
  blur?: number
  speed?: number
}

interface Blob {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  color: string
}

export function AuroraBg({
  className,
  children,
  colors = ['#a855f7', '#6366f1', '#3b82f6', '#10b981'],
  blur = 80,
  speed = 1,
}: AuroraBgProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const frameRef = React.useRef<number>(0)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas)
      return
    const ctx = canvas.getContext('2d')
    if (!ctx)
      return

    let blobs: Blob[] = []

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      blobs = colors.map((color, i) => ({
        x: (canvas.width / colors.length) * i + (canvas.width / colors.length) * 0.5,
        y: canvas.height * 0.5 + (Math.random() - 0.5) * canvas.height * 0.4,
        vx: (Math.random() - 0.5) * speed * 0.6,
        vy: (Math.random() - 0.5) * speed * 0.4,
        r: Math.min(canvas.width, canvas.height) * (0.35 + Math.random() * 0.2),
        color,
      }))
    }

    resize()

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const b of blobs) {
        b.x += b.vx
        b.y += b.vy
        if (b.x < -b.r / 2)
          b.vx = Math.abs(b.vx)
        if (b.x > canvas.width + b.r / 2)
          b.vx = -Math.abs(b.vx)
        if (b.y < -b.r / 2)
          b.vy = Math.abs(b.vy)
        if (b.y > canvas.height + b.r / 2)
          b.vy = -Math.abs(b.vy)

        ctx.globalCompositeOperation = 'screen'
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r)
        grad.addColorStop(0, `${b.color}bb`)
        grad.addColorStop(0.5, `${b.color}44`)
        grad.addColorStop(1, `${b.color}00`)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalCompositeOperation = 'source-over'
      frameRef.current = requestAnimationFrame(draw)
    }

    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [colors, speed])

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full scale-110"
        style={{ filter: `blur(${blur}px)` }}
      />
      {children && <div className="relative z-10">{children}</div>}
    </div>
  )
}
