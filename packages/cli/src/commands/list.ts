import chalk from 'chalk'
import { loadConfig } from '../utils/config'
import { fetchRegistryIndex } from '../utils/registry'
import { logger } from '../utils/logger'

export async function runList(cwd: string): Promise<void> {
  let config: Awaited<ReturnType<typeof loadConfig>>
  try {
    config = await loadConfig(cwd)
  } catch (err) {
    logger.error(err instanceof Error ? err.message : String(err))
    process.exit(1)
  }

  let index: Awaited<ReturnType<typeof fetchRegistryIndex>>
  try {
    index = await fetchRegistryIndex(config)
  } catch (err) {
    logger.error(err instanceof Error ? err.message : String(err))
    process.exit(1)
  }

  if (index.items.length === 0) {
    logger.info('No components found in registry.')
    return
  }

  const nameWidth = Math.max(...index.items.map(i => i.name.length), 4)

  console.log()
  console.log(`  ${chalk.bold('NAME'.padEnd(nameWidth))}  ${chalk.bold('TYPE')}`)
  console.log(`  ${'─'.repeat(nameWidth)}  ${'─'.repeat(24)}`)

  for (const item of index.items) {
    const type = item.type.replace('registry:', '')
    const desc = item.description ? chalk.dim(`  ${item.description}`) : ''
    console.log(`  ${chalk.cyan(item.name.padEnd(nameWidth))}  ${chalk.dim(type.padEnd(24))}${desc}`)
  }

  console.log()
  console.log(chalk.dim(`  ${index.items.length} component(s) available`))
  console.log()
}
