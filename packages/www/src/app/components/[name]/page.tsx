import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CodeBlock } from '@/components/code-block'
import { ComponentPreview } from '@/components/component-preview'
import { CopyButton } from '@/components/copy-button'
import { getRegistryIndex, getRegistryItem } from '@/lib/registry'

export async function generateStaticParams() {
  const index = await getRegistryIndex()
  return index.items
    .filter(item => item.type !== 'registry:block')
    .map(item => ({ name: item.name }))
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  const item = await getRegistryItem(name)
  return {
    title: item
      ? `${item.title ?? item.name} — eugui`
      : 'Not found — eugui',
    description: item?.description,
  }
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  const item = await getRegistryItem(name)

  if (!item || item.type === 'registry:block') {
    notFound()
  }

  const installCmd = `npx eugui@latest add ${item.name}`

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/components" className="hover:text-zinc-300">
          Components
        </Link>
        <span>/</span>
        <span className="text-zinc-300">{name}</span>
      </nav>

      {/* Header */}
      <div className="mb-2 flex items-center gap-3">
        <h1 className="text-3xl font-bold text-zinc-50">{item.title ?? item.name}</h1>
        <span className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-400">
          {item.type.replace('registry:', '')}
        </span>
      </div>
      {item.description && (
        <p className="mb-10 text-zinc-400">{item.description}</p>
      )}

      {/* Preview */}
      <ComponentPreview name={name} />

      {/* Install */}
      <section className="mb-10">
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
          Install
        </h2>
        <div className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3">
          <code className="flex-1 font-mono text-sm text-zinc-300">{installCmd}</code>
          <CopyButton text={installCmd} />
        </div>
      </section>

      {/* npm Dependencies */}
      {item.dependencies.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
            npm Dependencies
          </h2>
          <div className="flex flex-wrap gap-2">
            {item.dependencies.map(dep => (
              <span
                key={dep}
                className="rounded bg-zinc-800 px-2 py-1 font-mono text-sm text-zinc-300"
              >
                {dep}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Registry dependencies */}
      {item.registryDependencies.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
            Registry Dependencies
          </h2>
          <div className="flex flex-wrap gap-2">
            {item.registryDependencies.map(dep => (
              <Link
                key={dep}
                href={`/components/${dep}`}
                className="rounded bg-zinc-800 px-2 py-1 font-mono text-sm text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100"
              >
                {dep}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Source */}
      <section>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
          Source
        </h2>
        {item.files.map(file => (
          <div key={file.path} className="mb-6">
            <div className="flex items-center justify-between rounded-t-lg border border-b-0 border-zinc-800 bg-zinc-900 px-4 py-2">
              <span className="font-mono text-xs text-zinc-500">{file.path}</span>
              {file.content && <CopyButton text={file.content} />}
            </div>
            {file.content && <CodeBlock code={file.content} lang="tsx" />}
            {!file.content && (
              <div className="rounded-b-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-500">
                No source available.
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  )
}
