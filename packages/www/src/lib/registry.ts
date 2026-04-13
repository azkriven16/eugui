import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'

// process.cwd() = packages/www when Next.js runs
const REGISTRY_DIR = join(process.cwd(), '..', 'registry', 'public', 'r')

export interface RegistryItemFile {
  path: string
  type: string
  content?: string
  target?: string
}

export interface RegistryItem {
  name: string
  type: string
  title?: string
  description?: string
  dependencies: string[]
  devDependencies: string[]
  registryDependencies: string[]
  files: RegistryItemFile[]
}

export interface RegistryIndex {
  name?: string
  items: RegistryItem[]
}

export async function getRegistryIndex(): Promise<RegistryIndex> {
  const raw = await readFile(join(REGISTRY_DIR, 'index.json'), 'utf-8')
  return JSON.parse(raw) as RegistryIndex
}

export async function getRegistryItem(name: string): Promise<RegistryItem | null> {
  try {
    const raw = await readFile(join(REGISTRY_DIR, `${name}.json`), 'utf-8')
    return JSON.parse(raw) as RegistryItem
  }
  catch {
    return null
  }
}
