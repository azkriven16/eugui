import chalk from 'chalk'

export const logger = {
  info:    (msg: string) => console.log(`${chalk.blue('ℹ')}  ${msg}`),
  success: (msg: string) => console.log(`${chalk.green('✓')}  ${msg}`),
  warn:    (msg: string) => console.log(`${chalk.yellow('⚠')}  ${msg}`),
  error:   (msg: string) => console.error(`${chalk.red('✗')}  ${chalk.red('Error:')} ${msg}`),
  detail:  (msg: string) => console.log(`   ${chalk.dim(msg)}`),
  file:    (path: string) => console.log(`   ${chalk.dim('+')} ${chalk.cyan(path)}`),
}
