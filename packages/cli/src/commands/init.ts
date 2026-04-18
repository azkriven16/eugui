import {
  cancel,
  intro,
  isCancel,
  outro,
  select,
  spinner,
  text,
} from '@clack/prompts'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import type { ComponentsConfig } from '../schemas/config'
import { writeConfig } from '../utils/config'
import { ensureWrite, resolveAliasToPath } from '../utils/fs'
import { detectFramework, frameworkLabel } from '../utils/framework'
import { logger } from '../utils/logger'
import { detectPackageManager, runInstall } from '../utils/pm'

const CN_UTILS_TS = `import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`

const CN_UTILS_JS = `import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
`

function abortIfCancelled(value: unknown): void {
  if (isCancel(value)) {
    cancel('Setup cancelled.')
    process.exit(0)
  }
}

export async function runInit(cwd: string): Promise<void> {
  intro('eugui init')

  // Check for existing config
  if (existsSync(join(cwd, 'components.json'))) {
    const reinit = await select({
      message: 'components.json already exists. Re-initialize?',
      options: [
        { value: true,  label: 'Yes, overwrite it' },
        { value: false, label: 'No, keep existing' },
      ],
    })
    abortIfCancelled(reinit)
    if (!reinit) {
      outro('Keeping existing config.')
      return
    }
  }

  // Detect environment
  const framework = await detectFramework(cwd)
  const pm = detectPackageManager(cwd)
  logger.detail(`Detected: ${frameworkLabel(framework)} · ${pm}`)

  // Prompts
  const tsx = await select({
    message: 'TypeScript or JavaScript?',
    options: [
      { value: true,  label: 'TypeScript (.tsx / .ts)' },
      { value: false, label: 'JavaScript (.jsx / .js)' },
    ],
  })
  abortIfCancelled(tsx)

  const tailwindVersion = await select({
    message: 'Tailwind CSS version?',
    options: [
      { value: 'v4', label: 'Tailwind v4  (no config file, CSS-only)' },
      { value: 'v3', label: 'Tailwind v3  (tailwind.config.js)' },
    ],
  })
  abortIfCancelled(tailwindVersion)

  const defaultCssPath = framework === 'next' ? 'app/globals.css' : 'src/index.css'

  const componentsDir = await text({
    message: 'Where should components be installed?',
    placeholder: '@/components/ui',
    defaultValue: '@/components/ui',
  })
  abortIfCancelled(componentsDir)

  const utilsAlias = await text({
    message: 'Where is your utils file (the `cn` function)?',
    placeholder: '@/lib/utils',
    defaultValue: '@/lib/utils',
  })
  abortIfCancelled(utilsAlias)

  const cssPath = await text({
    message: 'Path to your global CSS file?',
    placeholder: defaultCssPath,
    defaultValue: defaultCssPath,
  })
  abortIfCancelled(cssPath)

  // Build config object
  const compDir = componentsDir as string
  const utils   = utilsAlias as string
  const css     = cssPath as string
  const isTsx   = tsx as boolean
  const isTv4   = (tailwindVersion as string) === 'v4'
  const libAlias = utils.replace(/\/[^/]+$/, '')  // strip last segment: @/lib/utils → @/lib

  const config: ComponentsConfig = {
    style: 'default',
    tailwind: {
      config: isTv4 ? '' : 'tailwind.config.js',
      css,
      baseColor: 'neutral',
      cssVariables: true,
      prefix: '',
    },
    rsc: framework === 'next',
    tsx: isTsx,
    aliases: {
      utils,
      components: compDir,
      ui: compDir,
      lib: libAlias,
      hooks: '@/hooks',
    },
    registries: {
      default: 'https://eugui.dev/r',
    },
  }

  const s = spinner()

  // Write components.json
  s.start('Writing components.json')
  await writeConfig(cwd, config)
  s.stop('components.json written')

  // Write lib/utils
  const ext = isTsx ? '.ts' : '.js'
  const utilsFilePath = resolveAliasToPath(utils, cwd) + ext
  s.start(`Writing ${utils}${ext}`)
  await ensureWrite(utilsFilePath, isTsx ? CN_UTILS_TS : CN_UTILS_JS)
  s.stop(`${utils}${ext} written`)

  // Install base dependencies
  s.start(`Installing clsx, tailwind-merge via ${pm}`)
  await runInstall(pm, ['clsx', 'tailwind-merge'], cwd)
  s.stop('Base dependencies installed')

  outro(`You're all set! Run \`eugui add <component>\` to add your first component.`)
}
