import { describe, expect, it, vi } from 'vitest'
import type { RegistryItem } from '../schemas/registry'
import { resolveItems } from './resolver'

// Minimal config for testing
const baseConfig = {
  style: 'default',
  tailwind: { config: '', css: 'app/globals.css', baseColor: 'neutral', cssVariables: true, prefix: '' },
  rsc: false,
  tsx: true,
  aliases: {
    utils: '@/lib/utils',
    components: '@/components/ui',
    ui: '@/components/ui',
    lib: '@/lib',
    hooks: '@/hooks',
  },
  registries: { default: 'https://example.com/r' },
}

function makeItem(
  name: string,
  deps: string[] = [],
  npmDeps: string[] = [],
): RegistryItem {
  return {
    name,
    type: 'registry:component',
    dependencies: npmDeps,
    devDependencies: [],
    registryDependencies: deps,
    files: [{ path: `${name}.tsx`, type: 'component', content: `// ${name}` }],
  }
}

describe('resolveItems', () => {
  it('resolves a single component with no deps', async () => {
    const fetchFn = vi.fn().mockResolvedValue(makeItem('button'))
    const result = await resolveItems(['button'], baseConfig, fetchFn)

    expect(result.items).toHaveLength(1)
    expect(result.items[0]?.name).toBe('button')
    expect(fetchFn).toHaveBeenCalledOnce()
  })

  it('resolves transitive registryDependencies (BFS)', async () => {
    const fetchFn = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes('command')) return makeItem('command', ['utils'])
      if (url.includes('utils'))   return makeItem('utils')
      throw new Error(`Unexpected URL: ${url}`)
    })

    const result = await resolveItems(['command'], baseConfig, fetchFn)
    const names = result.items.map(i => i.name)

    expect(names).toContain('command')
    expect(names).toContain('utils')
    expect(fetchFn).toHaveBeenCalledTimes(2)
  })

  it('handles circular registryDependencies without infinite loop', async () => {
    const fetchFn = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes('a')) return makeItem('a', ['b'])
      if (url.includes('b')) return makeItem('b', ['a'])  // circular
      throw new Error(`Unexpected URL: ${url}`)
    })

    const result = await resolveItems(['a'], baseConfig, fetchFn)
    // Should resolve both exactly once
    expect(result.items).toHaveLength(2)
    expect(fetchFn).toHaveBeenCalledTimes(2)
  })

  it('deduplicates npm dependencies across the tree', async () => {
    const shared = makeItem('shared-dep', [], ['clsx'])
    const fetchFn = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes('a'))          return makeItem('a', ['shared-dep'], ['clsx'])
      if (url.includes('b'))          return makeItem('b', ['shared-dep'], ['clsx'])
      if (url.includes('shared-dep')) return shared
      throw new Error(`Unexpected URL: ${url}`)
    })

    const result = await resolveItems(['a', 'b'], baseConfig, fetchFn)
    expect(result.npmDependencies).toEqual(['clsx'])  // deduplicated
  })

  it('collects npm dependencies from all resolved items', async () => {
    const fetchFn = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes('button')) return makeItem('button', ['utils'], ['@radix-ui/react-slot'])
      if (url.includes('utils'))  return makeItem('utils',  [],        ['clsx', 'tailwind-merge'])
      throw new Error(`Unexpected URL: ${url}`)
    })

    const result = await resolveItems(['button'], baseConfig, fetchFn)
    expect(result.npmDependencies).toContain('@radix-ui/react-slot')
    expect(result.npmDependencies).toContain('clsx')
    expect(result.npmDependencies).toContain('tailwind-merge')
  })
})
