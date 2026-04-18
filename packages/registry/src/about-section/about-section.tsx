'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

export interface AboutSectionLink {
  label: string
  href: string
}

export interface AboutSectionProps {
  name: string
  role: string
  avatar?: string
  bio: string[]
  tech?: string[]
  links?: AboutSectionLink[]
  className?: string
}

export function AboutSection({
  name,
  role,
  avatar,
  bio,
  tech = [],
  links = [],
  className,
}: AboutSectionProps) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <section className={cn('bg-zinc-950 px-4 py-24', className)}>
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-50">About</h2>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
          {/* Left: profile + links */}
          <div className="flex flex-col items-center gap-6 lg:items-start">
            <div className="size-28 overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600">
              {avatar
                ? <img src={avatar} alt={name} className="h-full w-full object-cover" />
                : (
                    <span className="flex h-full w-full items-center justify-center text-3xl font-bold text-white">
                      {initials}
                    </span>
                  )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-zinc-100">{name}</h3>
              <p className="text-violet-400">{role}</p>
            </div>
            {links.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {links.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200"
                  >
                    {label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Right: bio + tech */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              {bio.map((paragraph, i) => (
                <p key={i} className="leading-relaxed text-zinc-400">
                  {paragraph}
                </p>
              ))}
            </div>
            {tech.length > 0 && (
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Technologies
                </p>
                <div className="flex flex-wrap gap-2">
                  {tech.map(name => (
                    <span
                      key={name}
                      className="rounded-lg border border-zinc-700/60 bg-zinc-800/80 px-2.5 py-1 text-sm font-medium text-zinc-300"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
