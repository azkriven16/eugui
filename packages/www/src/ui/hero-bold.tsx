'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

export interface HeroBoldProps {
  name: string
  role: string
  description?: string
  ctaLabel?: string
  ctaHref?: string
  colors?: string[]
  className?: string
}

export function HeroBold({
  name,
  role,
  description,
  ctaLabel = 'See my work',
  ctaHref = '#projects',
  colors = ['#a855f7', '#6366f1', '#3b82f6', '#10b981'],
  className,
}: HeroBoldProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const frameRef = React.useRef<number>(0)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas)
      return
    const ctx = canvas.getContext('2d')
    if (!ctx)
      return

    const blobs = colors.map((color, i) => ({
      x: (canvas.offsetWidth / colors.length) * i + (canvas.offsetWidth / colors.length) * 0.5,
      y: canvas.offsetHeight * 0.5 + (Math.random() - 0.5) * 200,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.min(canvas.offsetWidth, canvas.offsetHeight) * 0.45,
      color,
    }))

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
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
        grad.addColorStop(0, `${b.color}aa`)
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
  }, [colors])

  return (
    <section
      className={cn(
        'relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950 px-4 text-center',
        className,
      )}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full scale-110 opacity-40"
        style={{ filter: 'blur(80px)' }}
      />
      <div className="pointer-events-none absolute inset-0 bg-zinc-950/50" />

      <div className="relative z-10 flex max-w-3xl flex-col items-center gap-6">
        <h1 className="text-balance text-6xl font-bold tracking-tighter text-white sm:text-8xl">
          {name}
        </h1>
        <p
          className="text-xl font-semibold tracking-wide"
          style={{
            background: 'linear-gradient(90deg, #a78bfa, #60a5fa, #34d399)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {role}
        </p>
        {description && (
          <p className="max-w-lg text-balance text-base text-zinc-400">{description}</p>
        )}
        <a
          href={ctaHref}
          className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-zinc-950 transition-opacity hover:opacity-90"
        >
          {ctaLabel}
          {' →'}
        </a>
      </div>
    </section>
  )
}
