'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

export interface HeroMinimalLink {
  label: string
  href: string
}

export interface HeroMinimalProps {
  name: string
  role: string
  bio?: string
  ctaLabel?: string
  ctaHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  links?: HeroMinimalLink[]
  className?: string
}

export function HeroMinimal({
  name,
  role,
  bio,
  ctaLabel = 'View my work',
  ctaHref = '#projects',
  secondaryLabel = 'Contact me',
  secondaryHref = '#contact',
  links = [],
  className,
}: HeroMinimalProps) {
  return (
    <section
      className={cn(
        'relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950 px-4 text-center',
        className,
      )}
    >
      {/* Grid background */}
      <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:40px_40px]" />
      {/* Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px]" />

      <div className="relative z-10 flex max-w-2xl flex-col items-center gap-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs text-violet-300">
          <span className="size-1.5 rounded-full bg-violet-400" />
          Available for work
        </div>

        <h1 className="text-balance text-5xl font-semibold tracking-tighter text-white sm:text-7xl">
          {name}
        </h1>

        <p className="text-xl font-medium text-zinc-400">{role}</p>

        {bio && (
          <p className="max-w-md text-balance text-base text-zinc-500">{bio}</p>
        )}

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <a
            href={ctaHref}
            className="inline-flex items-center gap-1 rounded-full bg-violet-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-500"
          >
            {ctaLabel}
            {' →'}
          </a>
          <a
            href={secondaryHref}
            className="inline-flex items-center gap-1 rounded-full border border-zinc-700 px-6 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100"
          >
            {secondaryLabel}
          </a>
        </div>

        {links.length > 0 && (
          <div className="flex items-center gap-4">
            {links.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
              >
                {label}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
