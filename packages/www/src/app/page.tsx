import Link from 'next/link'
import { CopyButton } from '@/components/copy-button'

const COMPONENTS = [
  'button',
  'badge',
  'card',
  'input',
  'textarea',
  'skeleton',
  'spinner',
  'alert',
  'label',
  'separator',
  'progress',
  'checkbox',
  'switch',
  'slider',
  'tabs',
  'tooltip',
  'utils',
]

const FEATURES = [
  {
    icon: '⌘',
    title: 'One command to start',
    body: 'Run eugui init once. Then add any component with eugui add button. That is all you need.',
  },
  {
    icon: '◈',
    title: 'You own the code',
    body: 'Components land directly in your repo. Edit them, delete them, fork them — no update cycle to worry about.',
  },
  {
    icon: '⬡',
    title: 'Host your registry',
    body: 'Write components once and distribute to anyone. Serve as static JSON from Vercel or GitHub Pages.',
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center overflow-hidden px-4 text-center">
        {/* Grid background */}
        <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:32px_32px]" />
        {/* Center glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-600/25 blur-[100px]" />

        <div className="relative z-10 flex flex-col items-center gap-6">
          {/* Badge */}
          <a
            href="https://github.com/azkriven16/component-library-cli"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/80 px-4 py-1.5 text-xs text-zinc-400 backdrop-blur-sm transition-colors hover:border-zinc-600 hover:text-zinc-300"
          >
            🎉
            <span className="h-3 w-px bg-zinc-700" />
            Open source · MIT licensed →
          </a>

          {/* Headline */}
          <h1 className="max-w-3xl text-balance text-5xl font-semibold tracking-tighter sm:text-7xl">
            <span className="bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
              Your own component
              <br />
              library. Your rules.
            </span>
          </h1>

          {/* Subheading */}
          <p className="max-w-xl text-balance text-base text-zinc-400 md:text-lg">
            {'Copy-paste React components built with '}
            <strong className="font-medium text-zinc-300">React</strong>
            {', '}
            <strong className="font-medium text-zinc-300">TypeScript</strong>
            {', '}
            <strong className="font-medium text-zinc-300">Tailwind CSS</strong>
            . The shadcn model — for your own library.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <div className="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/80 px-4 py-2 backdrop-blur-sm">
              <code className="font-mono text-sm text-zinc-300">npx eugui@latest init</code>
              <CopyButton text="npx eugui@latest init" />
            </div>
            <Link
              href="/components"
              className="inline-flex items-center gap-1 rounded-full bg-white px-5 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
            >
              Browse Components
              {' →'}
            </Link>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="border-y border-zinc-800 py-5">
        <div className="relative flex overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-zinc-950" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-zinc-950" />
          <div className="flex animate-marquee gap-10">
            {[...COMPONENTS, ...COMPONENTS].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="inline-flex shrink-0 items-center gap-2.5 text-sm text-zinc-600"
              >
                <span className="size-1 rounded-full bg-zinc-700" />
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-6xl px-4 py-24">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-semibold tracking-tight text-zinc-50">
            How it works
          </h2>
          <p className="text-zinc-500">
            Inspired by shadcn/ui. Built for your own component library.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {FEATURES.map(({ icon, title, body }) => (
            <div
              key={title}
              className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-colors hover:border-zinc-700 hover:bg-zinc-900"
            >
              <div className="mb-4 text-2xl text-zinc-600 transition-colors group-hover:text-zinc-300">
                {icon}
              </div>
              <h3 className="mb-2 font-medium text-zinc-100">{title}</h3>
              <p className="text-sm leading-relaxed text-zinc-500">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-zinc-800 py-24 text-center">
        <div className="mx-auto max-w-lg px-4">
          <h2 className="mb-3 text-3xl font-semibold tracking-tight text-zinc-50">Ready to start?</h2>
          <p className="mb-8 text-zinc-500">Initialize your project in one command.</p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <div className="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2">
              <code className="font-mono text-sm text-zinc-300">npx eugui@latest init</code>
              <CopyButton text="npx eugui@latest init" />
            </div>
            <Link
              href="/components"
              className="text-sm font-medium text-zinc-400 underline-offset-4 hover:text-zinc-200 hover:underline"
            >
              Browse 17 components →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 text-center text-xs text-zinc-600">
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
            href="https://github.com/azkriven16/component-library-cli"
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
