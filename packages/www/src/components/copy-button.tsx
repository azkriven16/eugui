'use client'

import { useState } from 'react'

export function CopyButton({ text, className = '' }: { text: string, className?: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const colorClass = copied
    ? 'bg-zinc-700 text-green-400'
    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'

  return (
    <button
      onClick={handleCopy}
      className={`rounded px-2 py-1 text-xs transition-colors ${colorClass} ${className}`}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}
