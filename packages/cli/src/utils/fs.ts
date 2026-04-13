import { existsSync } from 'node:fs'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

export async function ensureWrite(filePath: string, content: string): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true })
  await writeFile(filePath, content, 'utf-8')
}

export async function readTextFile(filePath: string): Promise<string> {
  return readFile(filePath, 'utf-8')
}

/**
 * Resolves a TypeScript path alias (e.g. `@/lib/utils`) to an absolute filesystem path.
 *
 * Heuristic: if a `src/` directory exists under `cwd`, `@/` maps to `src/`.
 * Otherwise it maps to `cwd` directly. This matches the two most common project layouts.
 */
export function resolveAliasToPath(alias: string, cwd: string): string {
  const srcBase = existsSync(join(cwd, 'src')) ? join(cwd, 'src') : cwd

  if (alias.startsWith('@/')) return join(srcBase, alias.slice(2))
  if (alias.startsWith('~/')) return join(cwd, alias.slice(2))
  if (alias.startsWith('/'))  return alias
  return join(cwd, alias)
}
