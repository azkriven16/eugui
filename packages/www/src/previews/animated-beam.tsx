'use client'

import * as React from 'react'

import { AnimatedBeam } from '@/ui/animated-beam'

function Node({ label, icon }: { icon: string, label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-xl shadow-lg">
        {icon}
      </div>
      <span className="text-xs text-zinc-500">{label}</span>
    </div>
  )
}

export default function AnimatedBeamPreview() {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const aRef = React.useRef<HTMLDivElement>(null)
  const bRef = React.useRef<HTMLDivElement>(null)
  const cRef = React.useRef<HTMLDivElement>(null)
  const dRef = React.useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className="relative flex w-full max-w-sm items-center justify-between px-8 py-10"
    >
      <div ref={aRef}>
        <Node icon="🗄️" label="Database" />
      </div>
      <div ref={bRef}>
        <Node icon="⚙️" label="API" />
      </div>
      <div ref={cRef}>
        <Node icon="🤖" label="AI" />
      </div>
      <div ref={dRef}>
        <Node icon="🖥️" label="Client" />
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={aRef}
        toRef={bRef}
        duration={2.5}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={bRef}
        toRef={cRef}
        duration={2.5}
        gradientStartColor="#60a5fa"
        gradientStopColor="#34d399"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={cRef}
        toRef={dRef}
        duration={2.5}
        gradientStartColor="#34d399"
        gradientStopColor="#f472b6"
      />
    </div>
  )
}
