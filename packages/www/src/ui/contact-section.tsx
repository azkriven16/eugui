'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

export interface ContactLink {
  label: string
  href: string
  external?: boolean
}

export interface ContactSectionProps {
  heading?: string
  subheading?: string
  email: string
  links?: ContactLink[]
  className?: string
}

export function ContactSection({
  heading = 'Let\'s work together',
  subheading = 'Have a project in mind? I\'d love to hear about it.',
  email,
  links = [],
  className,
}: ContactSectionProps) {
  return (
    <section className={cn('bg-zinc-950 px-4 py-24', className)}>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="mb-4 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
          {heading}
        </h2>
        <p className="mb-10 text-zinc-500">{subheading}</p>

        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-violet-500"
        >
          {email}
          {' →'}
        </a>

        {links.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {links.map(({ label, href, external }) => (
              <a
                key={label}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
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
