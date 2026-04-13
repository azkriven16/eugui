import Link from 'next/link'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-semibold text-zinc-100 hover:text-white">
          complib
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/components"
            className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
          >
            Components
          </Link>
          <a
            href="https://github.com/YOUR_USERNAME/component-library-cli"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  )
}
