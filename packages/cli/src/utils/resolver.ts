import type { ComponentsConfig } from '../schemas/config'
import type { RegistryItem } from '../schemas/registry'
import { resolveRegistryURL, fetchRegistryItem } from './registry'

export interface ResolvedTree {
  items: RegistryItem[]
  npmDependencies: string[]
  npmDevDependencies: string[]
}

/**
 * BFS resolution of component names to a full dependency tree.
 *
 * Accepts an optional `fetchFn` for testing — defaults to `fetchRegistryItem`.
 * Handles circular registryDependencies safely via the `seen` set.
 */
export async function resolveItems(
  names: string[],
  config: ComponentsConfig,
  fetchFn: (url: string) => Promise<RegistryItem> = fetchRegistryItem,
): Promise<ResolvedTree> {
  const seen = new Set<string>()
  const items: RegistryItem[] = []
  const queue = [...names]

  while (queue.length > 0) {
    const name = queue.shift()
    if (name === undefined) break
    if (seen.has(name)) continue
    seen.add(name)

    const url = resolveRegistryURL(name, config)
    const item = await fetchFn(url)
    items.push(item)

    for (const dep of item.registryDependencies) {
      if (!seen.has(dep)) queue.push(dep)
    }
  }

  const npmDependencies = [...new Set(items.flatMap(i => i.dependencies))]
  const npmDevDependencies = [...new Set(items.flatMap(i => i.devDependencies))]

  return { items, npmDependencies, npmDevDependencies }
}
