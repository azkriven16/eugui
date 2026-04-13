import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { detectPackageManager, getInstallArgs } from './pm'

describe('detectPackageManager', () => {
  let tmp: string

  beforeEach(() => {
    tmp = join(tmpdir(), `complib-pm-test-${Date.now()}`)
    mkdirSync(tmp, { recursive: true })
  })

  afterEach(() => {
    rmSync(tmp, { recursive: true, force: true })
  })

  it('detects bun from bun.lock (Bun v1.2+ text lockfile)', () => {
    writeFileSync(join(tmp, 'bun.lock'), '')
    expect(detectPackageManager(tmp)).toBe('bun')
  })

  it('detects bun from bun.lockb (legacy binary lockfile)', () => {
    writeFileSync(join(tmp, 'bun.lockb'), '')
    expect(detectPackageManager(tmp)).toBe('bun')
  })

  it('prefers bun.lock over bun.lockb when both exist', () => {
    writeFileSync(join(tmp, 'bun.lock'), '')
    writeFileSync(join(tmp, 'bun.lockb'), '')
    expect(detectPackageManager(tmp)).toBe('bun')
  })

  it('detects pnpm', () => {
    writeFileSync(join(tmp, 'pnpm-lock.yaml'), '')
    expect(detectPackageManager(tmp)).toBe('pnpm')
  })

  it('detects yarn', () => {
    writeFileSync(join(tmp, 'yarn.lock'), '')
    expect(detectPackageManager(tmp)).toBe('yarn')
  })

  it('falls back to npm when no lockfile is found', () => {
    expect(detectPackageManager(tmp)).toBe('npm')
  })
})

describe('getInstallArgs', () => {
  it('returns correct args for each package manager', () => {
    const pkgs = ['clsx', 'tailwind-merge']
    expect(getInstallArgs('bun',  pkgs)).toEqual(['bun',  ['add',     'clsx', 'tailwind-merge']])
    expect(getInstallArgs('pnpm', pkgs)).toEqual(['pnpm', ['add',     'clsx', 'tailwind-merge']])
    expect(getInstallArgs('yarn', pkgs)).toEqual(['yarn', ['add',     'clsx', 'tailwind-merge']])
    expect(getInstallArgs('npm',  pkgs)).toEqual(['npm',  ['install', 'clsx', 'tailwind-merge']])
  })
})
