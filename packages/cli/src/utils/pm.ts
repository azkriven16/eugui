import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { execa } from 'execa'

export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun'

export function detectPackageManager(cwd: string): PackageManager {
  if (existsSync(join(cwd, 'bun.lock')))          return 'bun'   // Bun v1.2+ text lockfile
  if (existsSync(join(cwd, 'bun.lockb')))         return 'bun'   // Legacy binary lockfile
  if (existsSync(join(cwd, 'pnpm-lock.yaml')))    return 'pnpm'
  if (existsSync(join(cwd, 'yarn.lock')))         return 'yarn'
  return 'npm'
}

export function getInstallArgs(pm: PackageManager, packages: string[]): [string, string[]] {
  switch (pm) {
    case 'bun':  return ['bun',  ['add',     ...packages]]
    case 'pnpm': return ['pnpm', ['add',     ...packages]]
    case 'yarn': return ['yarn', ['add',     ...packages]]
    default:     return ['npm',  ['install', ...packages]]
  }
}

export async function runInstall(
  pm: PackageManager,
  packages: string[],
  cwd: string,
): Promise<void> {
  if (packages.length === 0) return
  const [bin, args] = getInstallArgs(pm, packages)
  await execa(bin, args, { cwd, stdio: 'inherit' })
}
