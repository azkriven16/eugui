import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { configSchema } from '../schemas/config'
import type { ComponentsConfig } from '../schemas/config'

const CONFIG_FILENAME = 'components.json'

export async function loadConfig(cwd: string): Promise<ComponentsConfig> {
  const configPath = join(cwd, CONFIG_FILENAME)

  if (!existsSync(configPath)) {
    throw new Error(
      `No ${CONFIG_FILENAME} found.\n   Run \`eugui init\` to initialize your project.`,
    )
  }

  const raw = JSON.parse(await readFile(configPath, 'utf-8')) as unknown
  const result = configSchema.safeParse(raw)

  if (!result.success) {
    const issues = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('\n   ')
    throw new Error(`Invalid ${CONFIG_FILENAME}:\n   ${issues}`)
  }

  return result.data
}

export async function writeConfig(cwd: string, config: ComponentsConfig): Promise<void> {
  const configPath = join(cwd, CONFIG_FILENAME)
  await writeFile(configPath, JSON.stringify(config, null, 2) + '\n', 'utf-8')
}
