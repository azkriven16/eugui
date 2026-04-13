'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

interface Particle {
  radius: number
  vx: number
  vy: number
  x: number
  y: number
}

export interface ParticlesProps {
  className?: string
  color?: string
  connectionDistance?: number
  count?: number
  interactive?: boolean
  speed?: number
}

export function Particles({
  className,
  color = '#8b5cf6',
  connectionDistance = 120,
  count = 80,
  interactive = true,
  speed = 0.5,
}: ParticlesProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const mouse = React.useRef({ x: -9999, y: -9999 })
  const particles = React.useRef<Particle[]>([])
  const animId = React.useRef<number>(0)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas)
      return
    const ctx = canvas.getContext('2d')
    if (!ctx)
      return

    function resize() {
      if (!canvas)
        return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    function init() {
      if (!canvas)
        return
      particles.current = Array.from({ length: count }, () => ({
        radius: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * speed * 2,
        vy: (Math.random() - 0.5) * speed * 2,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
      }))
    }

    function hexToRgb(hex: string) {
      const r = Number.parseInt(hex.slice(1, 3), 16)
      const g = Number.parseInt(hex.slice(3, 5), 16)
      const b = Number.parseInt(hex.slice(5, 7), 16)
      return `${r}, ${g}, ${b}`
    }

    const rgb = hexToRgb(color.startsWith('#') ? color : '#8b5cf6')

    function draw() {
      if (!canvas || !ctx)
        return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles.current) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width)
          p.vx *= -1
        if (p.y < 0 || p.y > canvas.height)
          p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rgb}, 0.8)`
        ctx.fill()
      }

      const pts = particles.current
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x
          const dy = pts[i].y - pts[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.25
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(${rgb}, ${alpha})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      if (interactive) {
        for (const p of pts) {
          const dx = p.x - mouse.current.x
          const dy = p.y - mouse.current.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            const alpha = (1 - dist / 100) * 0.6
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(mouse.current.x, mouse.current.y)
            ctx.strokeStyle = `rgba(${rgb}, ${alpha})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      animId.current = requestAnimationFrame(draw)
    }

    function onMouseMove(e: MouseEvent) {
      if (!canvas)
        return
      const rect = canvas.getBoundingClientRect()
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    function onMouseLeave() {
      mouse.current = { x: -9999, y: -9999 }
    }

    function onResize() {
      resize()
      init()
    }

    resize()
    init()
    draw()

    window.addEventListener('resize', onResize)
    if (interactive) {
      canvas.addEventListener('mousemove', onMouseMove)
      canvas.addEventListener('mouseleave', onMouseLeave)
    }

    return () => {
      cancelAnimationFrame(animId.current)
      window.removeEventListener('resize', onResize)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [color, connectionDistance, count, interactive, speed])

  return (
    <canvas
      ref={canvasRef}
      className={cn('h-full w-full', className)}
    />
  )
}
