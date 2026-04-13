import { spinner } from '@clack/prompts'
import { Command } from 'commander'
import { runAdd } from '../commands/add'
import { runBuild } from '../commands/build'
import { runInfo } from '../commands/info'
import { runInit } from '../commands/init'
import { runList } from '../commands/list'
import { logger } from '../utils/logger'

const program = new Command()
  .name('complib')
  .description('A shadcn-style CLI for distributing component libraries')
  .version('0.1.0')

program
  .command('init')
  .description('Initialize your project with complib')
  .action(async () => {
    await runInit(process.cwd())
  })

program
  .command('add')
  .description('Add components to your project')
  .argument('[components...]', 'Component names to add')
  .option('--overwrite', 'Overwrite existing files', false)
  .option('--dry-run',   'Preview what would be written without writing', false)
  .action(async (components: string[], opts: { overwrite: boolean; dryRun: boolean }) => {
    await runAdd(components, process.cwd(), { overwrite: opts.overwrite, dryRun: opts.dryRun })
  })

program
  .command('list')
  .description('List all available components in the configured registry')
  .action(async () => {
    await runList(process.cwd())
  })

program
  .command('info')
  .description('Show metadata for a component without installing it')
  .argument('<component>', 'Component name')
  .action(async (component: string) => {
    await runInfo(component, process.cwd())
  })

program
  .command('build')
  .description('Build registry JSON from source files (for registry authors)')
  .option('--registry <path>', 'Path to registry.json', 'registry.json')
  .option('--out <dir>',       'Output directory',       'public/r')
  .option('--src <dir>',       'Source root directory',  'src')
  .action(async (opts: { registry: string; out: string; src: string }) => {
    const s = spinner()
    s.start('Building registry')
    try {
      const result = await runBuild(process.cwd(), opts)
      s.stop(`Built ${result.count} item(s) → ${result.outDir}/`)
    }
    catch (err) {
      s.stop('Build failed')
      logger.error(err instanceof Error ? err.message : String(err))
      process.exit(1)
    }
  })

program.parse()
