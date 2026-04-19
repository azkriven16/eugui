'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

export interface TypewriterTextProps {
  words: string[]
  className?: string
  typeSpeed?: number
  deleteSpeed?: number
  pauseDuration?: number
  loop?: boolean
}

export function TypewriterText({
  words,
  className,
  typeSpeed = 80,
  deleteSpeed = 40,
  pauseDuration = 1800,
  loop = true,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = React.useState('')
  const [wordIndex, setWordIndex] = React.useState(0)
  const [phase, setPhase] = React.useState<'typing' | 'pausing' | 'deleting'>('typing')
  const [cursorVisible, setCursorVisible] = React.useState(true)
  const isDone = !loop && wordIndex >= words.length - 1 && phase === 'pausing'

  React.useEffect(() => {
    const id = setInterval(() => setCursorVisible(v => !v), 530)
    return () => clearInterval(id)
  }, [])

  React.useEffect(() => {
    if (isDone)
      return
    const current = words[wordIndex % words.length]

    if (phase === 'typing') {
      if (displayed.length < current.length) {
        const id = setTimeout(
          () => setDisplayed(current.slice(0, displayed.length + 1)),
          typeSpeed,
        )
        return () => clearTimeout(id)
      }
      const id = setTimeout(() => setPhase('pausing'), pauseDuration)
      return () => clearTimeout(id)
    }

    if (phase === 'pausing') {
      setPhase('deleting')
      return
    }

    if (phase === 'deleting') {
      if (displayed.length > 0) {
        const id = setTimeout(() => setDisplayed(d => d.slice(0, -1)), deleteSpeed)
        return () => clearTimeout(id)
      }
      setWordIndex(i => i + 1)
      setPhase('typing')
    }
  }, [displayed, phase, wordIndex, words, typeSpeed, deleteSpeed, pauseDuration, isDone])

  return (
    <span className={cn('inline-flex items-center gap-0.5', className)}>
      <span>{displayed}</span>
      <span
        className="inline-block w-0.5 shrink-0 bg-current"
        style={{
          height: '1.1em',
          opacity: isDone ? 1 : cursorVisible ? 1 : 0,
          transition: 'opacity 0.1s',
        }}
        aria-hidden
      />
    </span>
  )
}
