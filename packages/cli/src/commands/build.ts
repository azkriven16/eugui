import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { registryItemSchema, registryManifestSchema } from '../schemas/registry'
import type { RegistryItem } from '../schemas/registry'

export interface BuildOptions {
  /** Path to registry.json, relative to cwd. Default: `registry.json` */
  registry?: string
  /** Output directory, relative to cwd. Default: `public/r` */
  out?: string
  /** Source root directory, relative to cwd. Default: `src` */
  src?: string
}

export interface BuildResult {
  count: number
  outDir: string
}

/**
 * Reads registry.json, embeds each source file's content inline,
 * validates, and writes static JSON to the output directory.
 *
 * File layout expected in <src>/:
 *   <src>/<item.name>/<file.path>
 *
 * Example: src/button/button.tsx → embedded into public/r/button.json
 *
 * Pure function — no terminal output. The CLI command wraps this with a spinner.
 */
export async function runBuild(cwd: string, opts: BuildOptions = {}): Promise<BuildResult> {
  const registryFile = opts.registry ?? 'registry.json'
  const outDir       = opts.out      ?? 'public/r'
  const srcDir       = opts.src      ?? 'src'

  // Read and validate the manifest
  const manifestPath = join(cwd, registryFile)
  if (!existsSync(manifestPath)) {
    throw new Error(`Registry file not found: ${manifestPath}`)
  }

  const rawManifest = JSON.parse(await readFile(manifestPath, 'utf-8')) as unknown
  const manifestResult = registryManifestSchema.safeParse(rawManifest)
  if (!manifestResult.success) {
    const issues = manifestResult.error.issues
      .map(i => `${i.path.join('.')}: ${i.message}`)
      .join('\n  ')
    throw new Error(`Invalid registry.json:\n  ${issues}`)
  }
  const manifest = manifestResult.data

  // Create the output directory
  const outPath = join(cwd, outDir)
  await mkdir(outPath, { recursive: true })

  const builtItems: RegistryItem[] = []
  const errors: string[] = []

  for (const item of manifest.items) {
    try {
      // Read each source file from disk and embed its content
      const filesWithContent = await Promise.all(
        item.files.map(async (file) => {
          const filePath = join(cwd, srcDir, item.name, file.path)
          if (!existsSync(filePath)) {
            throw new Error(
              `Source file not found: ${filePath}\n  ` +
              `Expected: ${srcDir}/${item.name}/${file.path}`,
            )
          }
          const content = await readFile(filePath, 'utf-8')
          return { ...file, content }
        }),
      )

      const builtItem = { ...item, files: filesWithContent }

      // Re-validate the fully-populated item
      const result = registryItemSchema.safeParse(builtItem)
      if (!result.success) {
        throw new Error(result.error.issues.map(i => i.message).join(', '))
      }

      builtItems.push(result.data)

      // Write per-item JSON: public/r/button.json
      await writeFile(
        join(outPath, `${item.name}.json`),
        JSON.stringify(result.data, null, 2) + '\n',
        'utf-8',
      )
    }
    catch (err) {
      errors.push(`${item.name}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  // Write index.json — all item metadata without embedded file content
  const indexItems = builtItems.map(item => ({
    ...item,
    files: item.files.map(f => ({
      path: f.path,
      type: f.type,
      ...(f.target !== undefined ? { target: f.target } : {}),
    })),
  }))

  await writeFile(
    join(outPath, 'index.json'),
    JSON.stringify({ name: manifest.name, items: indexItems }, null, 2) + '\n',
    'utf-8',
  )

  if (errors.length > 0) {
    throw new Error(`Build failed with ${errors.length} error(s):\n  ${errors.join('\n  ')}`)
  }

  return { count: builtItems.length, outDir }
}
