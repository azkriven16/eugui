'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

export interface MorphingTextProps {
  className?: string
  duration?: number
  words: string[]
}

export function MorphingText({
  className,
  duration = 2500,
  words,
}: MorphingTextProps) {
  const [index, setIndex] = React.useState(0)
  const [visible, setVisible] = React.useState(true)

  React.useEffect(() => {
    let t: ReturnType<typeof setTimeout>
    const interval = setInterval(() => {
      setVisible(false)
      t = setTimeout(() => {
        setIndex(i => (i + 1) % words.length)
        setVisible(true)
      }, 350)
    }, duration)
    return () => {
      clearInterval(interval)
      clearTimeout(t)
    }
  }, [words.length, duration])

  return (
    <span
      className={cn(
        'inline-block transition-all duration-300',
        visible
          ? 'translate-y-0 opacity-100 blur-0'
          : 'translate-y-2 opacity-0 blur-sm',
        className,
      )}
    >
      {words[index]}
    </span>
  )
}
