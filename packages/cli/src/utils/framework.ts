import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export type Framework = 'next' | 'vite' | 'remix' | 'astro' | 'laravel' | 'unknown'

export async function detectFramework(cwd: string): Promise<Framework> {
  // Config file presence is the most reliable signal
  const nextConfigs = ['next.config.js', 'next.config.ts', 'next.config.mjs']
  if (nextConfigs.some(f => existsSync(join(cwd, f)))) return 'next'

  if (existsSync(join(cwd, 'vite.config.js')) || existsSync(join(cwd, 'vite.config.ts'))) return 'vite'
  if (existsSync(join(cwd, 'remix.config.js'))) return 'remix'
  if (existsSync(join(cwd, 'astro.config.mjs'))) return 'astro'
  if (existsSync(join(cwd, 'artisan'))) return 'laravel'

  // Fallback: check package.json dependencies
  const pkgPath = join(cwd, 'package.json')
  if (existsSync(pkgPath)) {
    try {
      const raw = JSON.parse(await readFile(pkgPath, 'utf-8')) as {
        dependencies?: Record<string, string>
        devDependencies?: Record<string, string>
      }
      const deps = { ...raw.dependencies, ...raw.devDependencies }
      if ('next' in deps) return 'next'
      if ('vite' in deps) return 'vite'
      if ('@remix-run/react' in deps) return 'remix'
      if ('astro' in deps) return 'astro'
    } catch {
      // Malformed package.json — fall through to unknown
    }
  }

  return 'unknown'
}

export function frameworkLabel(fw: Framework): string {
  const labels: Record<Framework, string> = {
    next:    'Next.js',
    vite:    'Vite',
    remix:   'Remix',
    astro:   'Astro',
    laravel: 'Laravel',
    unknown: 'Unknown',
  }
  return labels[fw]
}
