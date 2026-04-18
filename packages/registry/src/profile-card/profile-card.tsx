'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

export interface SocialLink {
  platform: string
  label: string
  url: string
}

export interface ProfileCardProps {
  name: string
  role: string
  avatar?: string
  location?: string
  bio?: string
  links?: SocialLink[]
  className?: string
}

export function ProfileCard({
  name,
  role,
  avatar,
  location,
  bio,
  links = [],
  className,
}: ProfileCardProps) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center',
        className,
      )}
    >
      <div className="mx-auto mb-4 size-20 overflow-hidden rounded-full bg-gradient-to-br from-violet-600 to-blue-600">
        {avatar
          ? (
              <img src={avatar} alt={name} className="h-full w-full object-cover" />
            )
          : (
              <span className="flex h-full w-full items-center justify-center text-xl font-bold text-white">
                {initials}
              </span>
            )}
      </div>
      <h3 className="text-lg font-semibold text-zinc-100">{name}</h3>
      <p className="mt-0.5 text-sm text-violet-400">{role}</p>
      {location && (
        <p className="mt-1 text-xs text-zinc-500">{location}</p>
      )}
      {bio && (
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">{bio}</p>
      )}
      {links.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {links.map(({ platform, label, url }) => (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200"
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
