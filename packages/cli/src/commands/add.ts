import { intro, isCancel, multiselect, outro, spinner } from '@clack/prompts'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import type { ComponentsConfig } from '../schemas/config'
import type { RegistryItemFile } from '../schemas/registry'
import { loadConfig } from '../utils/config'
import { injectCSSVars } from '../utils/css'
import { ensureWrite, readTextFile, resolveAliasToPath } from '../utils/fs'
import { logger } from '../utils/logger'
import { detectPackageManager, runInstall } from '../utils/pm'
import { fetchRegistryIndex } from '../utils/registry'
import { resolveItems } from '../utils/resolver'
import { transformFile } from '../utils/transformer'

export interface AddOptions {
  overwrite?: boolean
  dryRun?: boolean
}

export async function runAdd(
  components: string[],
  cwd: string,
  opts: AddOptions = {},
): Promise<void> {
  intro('complib add')

  const s = spinner()

  // Load config
  let config: ComponentsConfig
  try {
    config = await loadConfig(cwd)
  } catch (err) {
    logger.error(err instanceof Error ? err.message : String(err))
    process.exit(1)
  }

  // If no components specified, show an interactive multiselect
  if (components.length === 0) {
    let index: Awaited<ReturnType<typeof fetchRegistryIndex>>
    try {
      index = await fetchRegistryIndex(config)
    } catch (err) {
      logger.error(err instanceof Error ? err.message : String(err))
      process.exit(1)
    }

    const selected = await multiselect<string>({
      message: 'Select components to add',
      options: index.items.map(item => ({
        value: item.name,
        label: item.name,
        hint: item.description,
      })),
    })

    if (isCancel(selected)) {
      outro('Cancelled')
      process.exit(0)
    }

    components = selected as string[]
  }

  // Resolve the full dependency tree
  s.start(`Resolving ${components.join(', ')}`)
  let resolved: Awaited<ReturnType<typeof resolveItems>>
  try {
    resolved = await resolveItems(components, config)
  } catch (err) {
    s.stop('Resolution failed')
    logger.error(err instanceof Error ? err.message : String(err))
    process.exit(1)
  }
  s.stop(`Resolved ${resolved.items.length} item(s)`)

  // Build alias rewrite map: registry defaults → user's configured aliases
  const aliasMap = buildAliasMap(config)

  if (opts.dryRun) {
    logger.info('Dry run — no files will be written\n')
  }

  const writtenFiles: string[] = []

  for (const item of resolved.items) {
    for (const file of item.files) {
      const content = file.content
      if (!content) {
        logger.warn(`No content for ${file.path} in ${item.name} — skipping`)
        continue
      }

      const targetPath = resolveTargetPath(file, config, cwd)
      const relPath = targetPath.replace(cwd + '/', '')

      if (opts.dryRun) {
        const exists = existsSync(targetPath)
        logger.file(`${relPath}${exists ? '  (would overwrite)' : ''}`)
        writtenFiles.push(targetPath)
        continue
      }

      if (existsSync(targetPath) && !opts.overwrite) {
        logger.warn(`File exists: ${relPath}\n   Use --overwrite to replace.`)
        continue
      }

      const transformed = transformFile(content, file.path, {
        aliases: aliasMap,
        tsx: config.tsx,
      })

      await ensureWrite(targetPath, transformed)
      writtenFiles.push(targetPath)
    }

    // Inject CSS variables if the component declares any (skip on dry run)
    if (!opts.dryRun && item.cssVars && config.tailwind.css) {
      const cssFilePath = join(cwd, config.tailwind.css)
      if (existsSync(cssFilePath)) {
        const cssContent = await readTextFile(cssFilePath)
        const updated = injectCSSVars(cssContent, item.cssVars)
        await ensureWrite(cssFilePath, updated)
      }
    }
  }

  if (opts.dryRun) {
    outro(`Dry run complete — ${writtenFiles.length} file(s) would be written.`)
    return
  }

  // Install npm dependencies
  if (resolved.npmDependencies.length > 0) {
    const pm = detectPackageManager(cwd)
    s.start(`Installing ${resolved.npmDependencies.join(', ')}`)
    try {
      await runInstall(pm, resolved.npmDependencies, cwd)
      s.stop('Dependencies installed')
    } catch {
      s.stop('Install failed')
      const pm2 = detectPackageManager(cwd)
      logger.error(
        `Dependency install failed. Run manually:\n   ${pm2} add ${resolved.npmDependencies.join(' ')}`,
      )
    }
  }

  if (writtenFiles.length === 0) {
    outro('Nothing written — all files already exist (use --overwrite to replace).')
    return
  }

  outro(`Added ${writtenFiles.length} file(s):`)
  for (const f of writtenFiles) {
    logger.file(f.replace(cwd + '/', ''))
  }
}

/**
 * Builds the alias rewrite map from the user's components.json.
 *
 * Registry source files use shadcn's default aliases; this map rewrites
 * them to whatever the user configured.
 */
function buildAliasMap(config: ComponentsConfig): Record<string, string> {
  return {
    '@/lib/utils':    config.aliases.utils,
    '@/components/ui': config.aliases.ui,
    '@/components':   config.aliases.components,
    '@/lib':          config.aliases.lib,
    '@/hooks':        config.aliases.hooks,
    '@/registry/ui':  config.aliases.ui,  // shadcn internal alias
  }
}

/**
 * Maps a registry file to an absolute filesystem path.
 *
 * If the file has an explicit `target`, that is used directly.
 * Otherwise the file type determines which alias directory to write into.
 */
function resolveTargetPath(
  file: RegistryItemFile,
  config: ComponentsConfig,
  cwd: string,
): string {
  if (file.target) return join(cwd, file.target)

  let alias: string
  switch (file.type) {
    case 'hook':  alias = config.aliases.hooks; break
    case 'lib':   alias = config.aliases.lib;   break
    default:      alias = config.aliases.ui;    break   // component, page, file, font
  }

  const dir = resolveAliasToPath(alias, cwd)
  return join(dir, file.path)
}
