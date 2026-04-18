'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

export interface GlitchTextProps {
  children: string
  className?: string
  speed?: 'slow' | 'normal' | 'fast'
  color1?: string
  color2?: string
}

export function GlitchText({
  children,
  className,
  speed = 'normal',
  color1 = '#ff2020',
  color2 = '#2060ff',
}: GlitchTextProps) {
  const uid = React.useId().replace(/:/g, '')
  const dur = speed === 'fast' ? '1.5s' : speed === 'slow' ? '5s' : '3s'

  return (
    <>
      <style>
        {`
          .glitch-${uid} {
            position: relative;
            display: inline-block;
          }
          .glitch-${uid}::before,
          .glitch-${uid}::after {
            content: attr(data-text);
            position: absolute;
            inset: 0;
            overflow: hidden;
          }
          .glitch-${uid}::before {
            color: ${color1};
            animation: glitch-a-${uid} ${dur} infinite steps(1);
            clip-path: inset(0 0 80% 0);
          }
          .glitch-${uid}::after {
            color: ${color2};
            animation: glitch-b-${uid} ${dur} infinite steps(1);
            clip-path: inset(60% 0 0 0);
          }
          @keyframes glitch-a-${uid} {
            0%,89%,100% { transform:translate(0);      clip-path:inset(0 0 80% 0); }
            90%          { transform:translate(-4px,2px);  clip-path:inset(5% 0 72% 0); }
            92%          { transform:translate(4px,-1px);  clip-path:inset(15% 0 65% 0); }
            94%          { transform:translate(-2px,3px);  clip-path:inset(2% 0 78% 0); }
            96%          { transform:translate(3px,0);     clip-path:inset(20% 0 58% 0); }
            98%          { transform:translate(-3px,-2px); clip-path:inset(0 0 82% 0); }
          }
          @keyframes glitch-b-${uid} {
            0%,89%,100% { transform:translate(0);      clip-path:inset(60% 0 0 0); }
            91%          { transform:translate(4px,1px);   clip-path:inset(72% 0 5% 0); }
            93%          { transform:translate(-3px,-2px); clip-path:inset(55% 0 15% 0); }
            95%          { transform:translate(2px,2px);   clip-path:inset(68% 0 2% 0); }
            97%          { transform:translate(-4px,0);    clip-path:inset(75% 0 0 0); }
            99%          { transform:translate(1px,-1px);  clip-path:inset(60% 0 8% 0); }
          }
        `}
      </style>
      <span
        className={cn(`glitch-${uid}`, className)}
        data-text={children}
      >
        {children}
      </span>
    </>
  )
}
