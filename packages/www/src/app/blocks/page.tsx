import Link from 'next/link'
import { getRegistryIndex } from '@/lib/registry'

export default async function BlocksPage() {
  const index = await getRegistryIndex()
  const blocks = index.items.filter(i => i.type === 'registry:block')

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-zinc-50">Blocks</h1>
        <p className="text-zinc-400">
          {blocks.length}
          {' ready-to-use page sections · run '}
          <code className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-xs text-zinc-300">
            npx eugui@latest add &lt;block&gt;
          </code>
          {' to install'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {blocks.map(item => (
          <Link
            key={item.name}
            href={`/blocks/${item.name}`}
            className="group rounded-lg border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-zinc-600 hover:bg-zinc-800/80"
          >
            <div className="mb-2 flex items-start justify-between">
              <h2 className="font-semibold text-zinc-100 group-hover:text-white">
                {item.title ?? item.name}
              </h2>
              <span className="ml-2 shrink-0 rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-500 group-hover:bg-zinc-700">
                block
              </span>
            </div>
            {item.description && (
              <p className="text-sm text-zinc-400">{item.description}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
