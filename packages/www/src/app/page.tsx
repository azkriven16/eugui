import Link from 'next/link'
import { CopyButton } from '@/components/copy-button'

export default function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
        Open source · MIT license
      </div>

      <h1 className="mb-4 text-5xl font-bold tracking-tight text-zinc-50 sm:text-6xl">
        Build your own
        <br />
        component library.
      </h1>

      <p className="mb-10 max-w-xl text-lg text-zinc-400">
        Distribute React components like shadcn — users copy the code, you host the registry.
        No runtime dependency. No black box.
      </p>

      <div className="mb-8 flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3">
        <code className="font-mono text-sm text-zinc-300">
          npx eugui@latest init
        </code>
        <CopyButton text="npx eugui@latest init" />
      </div>

      <div className="flex items-center gap-6 text-sm">
        <Link
          href="/components"
          className="font-medium text-zinc-100 underline-offset-4 hover:underline"
        >
          Browse components →
        </Link>
        <a
          href="https://github.com/YOUR_USERNAME/component-library-cli"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-400 underline-offset-4 hover:underline"
        >
          View on GitHub
        </a>
      </div>

      <div className="mt-20 grid max-w-3xl grid-cols-1 gap-6 text-left sm:grid-cols-3">
        {[
          {
            title: 'You own the code',
            body: 'Components are copied directly into your project. No runtime package to maintain or update.',
          },
          {
            title: 'Host your own registry',
            body: 'Publish your components as a static JSON registry. Deploy anywhere — Vercel, GitHub Pages, wherever.',
          },
          {
            title: 'Works with any stack',
            body: 'Next.js, Vite, Remix, Astro — eugui detects your framework and writes files where they belong.',
          },
        ].map(({ title, body }) => (
          <div key={title} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
            <h3 className="mb-2 font-semibold text-zinc-100">{title}</h3>
            <p className="text-sm text-zinc-400">{body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
