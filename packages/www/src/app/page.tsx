import Link from 'next/link'

import { CopyButton } from '@/components/copy-button'
import { MorphingText } from '@/ui/morphing-text'

const COMPONENTS = [
  'Tilt Card',
  'Magnetic Button',
  'Animated Beam',
  'Particles',
  'Morphing Text',
  'Glitch Text',
  'Typewriter Text',
  'Count Up',
  'Gradient Text',
  'Glass Card',
  'Gradient Mesh',
  'Split Text',
  'Spotlight Card',
  'Aurora BG',
  'Dot Grid',
  'Gradient Border',
  'Trail Cursor',
  'Spotlight Cursor',
  'Blob Cursor',
  'Reveal On Scroll',
  'Staggered List',
  'Scroll Progress',
  'Project Card',
  'Timeline Item',
  'Skill Bar',
  'Stat Counter',
  'Profile Card',
  'Tech Badge',
  'Review Card',
  'Parallax Layer',
]

const FEATURES = [
  {
    icon: '✦',
    title: 'Built for portfolios',
    body: 'Animated, 3D, visually impressive components that make your projects stand out — not just functional, but memorable.',
  },
  {
    icon: '◈',
    title: 'You own the code',
    body: 'Components land directly in your repo. No black box, no update cycle. Edit them, extend them, make them entirely yours.',
  },
  {
    icon: '⬡',
    title: 'Zero lock-in',
    body: 'No runtime library to ship. Just React, Tailwind, and motion. Install what you need, leave the rest.',
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center overflow-hidden px-4 text-center">
        {/* Grid background */}
        <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:40px_40px]" />
        {/* Violet glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 size-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px]" />

        <div className="relative z-10 flex flex-col items-center gap-6">
          {/* Badge */}
          <a
            href="https://github.com/azkriven16/eugui"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs text-violet-300 backdrop-blur-sm transition-colors hover:border-violet-400/50 hover:text-violet-200"
          >
            <span className="size-1.5 rounded-full bg-violet-400" />
            Open source · MIT licensed
            <span className="text-violet-500">→</span>
          </a>

          {/* Headline */}
          <h1 className="max-w-3xl text-balance text-5xl font-semibold tracking-tighter sm:text-7xl">
            <span className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
              Your UI,
              <br />
              {' elevated.'}
            </span>
          </h1>

          {/* Morphing subline */}
          <p className="text-2xl font-medium tracking-tight text-zinc-500">
            {'Components that are '}
            <MorphingText
              words={['animated', '3D', 'stunning', 'yours']}
              className="text-violet-400"
              duration={2200}
            />
          </p>

          {/* Subheading */}
          <p className="max-w-md text-balance text-base text-zinc-500">
            Portfolio-ready components built with React, TypeScript, and Tailwind.
            Copy paste into your project. You own every line.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <div className="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/80 px-4 py-2 backdrop-blur-sm">
              <code className="font-mono text-sm text-zinc-300">npx eugui@latest init</code>
              <CopyButton text="npx eugui@latest init" />
            </div>
            <Link
              href="/components"
              className="inline-flex items-center gap-1 rounded-full bg-violet-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500"
            >
              Browse Components
              {' →'}
            </Link>
          </div>
        </div>
      </section>

      {/* Scrolling component name strip */}
      <section className="border-y border-zinc-800/60 py-4">
        <div className="relative flex overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-zinc-950" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-zinc-950" />
          <div className="flex animate-marquee gap-12">
            {[...COMPONENTS, ...COMPONENTS].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="inline-flex shrink-0 items-center gap-2.5 text-sm font-medium text-zinc-600"
              >
                <span className="size-1 rounded-full bg-violet-500/60" />
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-5xl px-4 py-24">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-semibold tracking-tight text-zinc-50">
            Why eugui
          </h2>
          <p className="text-zinc-500">
            Not another component library. A collection of things worth copying.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {FEATURES.map(({ body, icon, title }) => (
            <div
              key={title}
              className="group rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 transition-all hover:border-violet-500/30 hover:bg-zinc-900/70"
            >
              <div className="mb-4 text-xl text-violet-500/60 transition-colors group-hover:text-violet-400">
                {icon}
              </div>
              <h3 className="mb-2 font-medium text-zinc-100">{title}</h3>
              <p className="text-sm leading-relaxed text-zinc-500">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-zinc-800/60 py-24 text-center">
        <div className="mx-auto max-w-lg px-4">
          <h2 className="mb-3 text-3xl font-semibold tracking-tight text-zinc-50">
            Start building
          </h2>
          <p className="mb-8 text-zinc-500">
            One command. Then add exactly what you need.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <div className="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2">
              <code className="font-mono text-sm text-zinc-300">npx eugui@latest init</code>
              <CopyButton text="npx eugui@latest init" />
            </div>
            <Link
              href="/components"
              className="text-sm font-medium text-violet-400 underline-offset-4 hover:text-violet-300 hover:underline"
            >
              Browse components →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 py-8 text-center text-xs text-zinc-600">
        <p>
          {'Built by '}
          <a
            href="https://github.com/azkriven16"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 transition-colors hover:text-zinc-200"
          >
            azkriven16
          </a>
          {' · '}
          <a
            href="https://github.com/azkriven16/eugui"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 transition-colors hover:text-zinc-200"
          >
            Source on GitHub
          </a>
        </p>
      </footer>
    </div>
  )
}
