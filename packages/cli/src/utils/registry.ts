import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { registryItemSchema, registryIndexSchema } from '../schemas/registry'
import type { RegistryItem, RegistryIndex } from '../schemas/registry'
import type { ComponentsConfig } from '../schemas/config'

const DEFAULT_REGISTRY = 'https://ui.shadcn.com/r'

/**
 * Resolves a component name/URL to the full fetch URL.
 *
 * Formats handled:
 *  - `button`                  → `{default registry}/button.json`
 *  - `@namespace/button`       → template-fill from registries map
 *  - `https://example.com/...` → used as-is
 *  - `./local/button.json`     → local file path
 */
export function resolveRegistryURL(name: string, config: ComponentsConfig): string {
  // Direct URL
  if (name.startsWith('http://') || name.startsWith('https://')) return name

  // Local file path
  if (name.startsWith('./') || name.startsWith('/')) return name

  // Namespaced: @namespace/component
  const namespaceMatch = /^(@[^/]+)\/(.+)$/.exec(name)
  if (namespaceMatch) {
    const namespace = namespaceMatch[1]
    const componentName = namespaceMatch[2]
    if (!namespace || !componentName) throw new Error(`Invalid component name: "${name}"`)

    const template = config.registries?.[namespace]
    if (!template) {
      throw new Error(
        `No registry configured for namespace "${namespace}".\n   Add it to your components.json registries map.`,
      )
    }
    return template.replace('{name}', componentName)
  }

  // Plain name — use default registry
  const defaultRegistry = config.registries?.['default'] ?? DEFAULT_REGISTRY
  return `${defaultRegistry}/${name}.json`
}

/**
 * Resolves the index.json URL for the default registry.
 */
export function resolveIndexURL(config: ComponentsConfig): string {
  const base = (config.registries?.['default'] ?? DEFAULT_REGISTRY).replace(/\/$/, '')
  return `${base}/index.json`
}

/**
 * Fetches the registry's index.json and validates it.
 */
export async function fetchRegistryIndex(config: ComponentsConfig): Promise<RegistryIndex> {
  const urlOrPath = resolveIndexURL(config)
  let raw: unknown

  if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')) {
    const res = await fetch(urlOrPath)
    if (!res.ok) {
      throw new Error(`Could not fetch registry index (${res.status}). Check your registry URL.`)
    }
    raw = await res.json()
  } else {
    if (!existsSync(urlOrPath)) {
      throw new Error(`Registry index not found: ${urlOrPath}`)
    }
    raw = JSON.parse(await readFile(urlOrPath, 'utf-8')) as unknown
  }

  const result = registryIndexSchema.safeParse(raw)
  if (!result.success) {
    const issues = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ')
    throw new Error(`Invalid registry index: ${issues}`)
  }

  return result.data
}

export async function fetchRegistryItem(urlOrPath: string): Promise<RegistryItem> {
  let raw: unknown

  if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')) {
    const res = await fetch(urlOrPath)
    if (!res.ok) {
      const hint = res.status === 404
        ? `Component not found. Check the name and your registry URL.`
        : `Registry returned ${res.status}.`
      throw new Error(`Could not fetch "${urlOrPath}".\n   ${hint}`)
    }
    raw = await res.json()
  } else {
    // Local file
    if (!existsSync(urlOrPath)) {
      throw new Error(`Registry file not found: ${urlOrPath}`)
    }
    raw = JSON.parse(await readFile(urlOrPath, 'utf-8')) as unknown
  }

  const result = registryItemSchema.safeParse(raw)
  if (!result.success) {
    const issues = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ')
    throw new Error(`Registry returned invalid data: ${issues}`)
  }

  return result.data
}
