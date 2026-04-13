import chalk from 'chalk'
import { loadConfig } from '../utils/config'
import { resolveRegistryURL, fetchRegistryItem } from '../utils/registry'
import { logger } from '../utils/logger'

export async function runInfo(component: string, cwd: string): Promise<void> {
  let config: Awaited<ReturnType<typeof loadConfig>>
  try {
    config = await loadConfig(cwd)
  } catch (err) {
    logger.error(err instanceof Error ? err.message : String(err))
    process.exit(1)
  }

  let item: Awaited<ReturnType<typeof fetchRegistryItem>>
  try {
    const url = resolveRegistryURL(component, config)
    item = await fetchRegistryItem(url)
  } catch (err) {
    logger.error(err instanceof Error ? err.message : String(err))
    process.exit(1)
  }

  console.log()
  console.log(`  ${chalk.bold(item.name)}  ${chalk.dim(item.type)}`)

  if (item.description) {
    console.log()
    console.log(`  ${item.description}`)
  }

  if (item.dependencies.length > 0) {
    console.log()
    console.log(`  ${chalk.bold('Dependencies:')}`)
    for (const dep of item.dependencies) {
      console.log(`    ${chalk.cyan(dep)}`)
    }
  }

  if (item.devDependencies.length > 0) {
    console.log()
    console.log(`  ${chalk.bold('Dev dependencies:')}`)
    for (const dep of item.devDependencies) {
      console.log(`    ${chalk.cyan(dep)}`)
    }
  }

  if (item.registryDependencies.length > 0) {
    console.log()
    console.log(`  ${chalk.bold('Registry deps:')}`)
    for (const dep of item.registryDependencies) {
      console.log(`    ${chalk.cyan(dep)}`)
    }
  }

  console.log()
  console.log(`  ${chalk.bold('Files:')}`)
  for (const f of item.files) {
    console.log(`    ${chalk.cyan(f.path)}  ${chalk.dim(f.type)}`)
  }

  console.log()
}
