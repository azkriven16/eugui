import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { runBuild } from './build'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function writeRegistry(tmp: string, data: object): void {
  writeFileSync(join(tmp, 'registry.json'), JSON.stringify(data, null, 2))
}

function writeSource(tmp: string, itemName: string, fileName: string, content: string): void {
  const dir = join(tmp, 'src', itemName)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, fileName), content)
}

function makeItem(name: string, type: string, files: object[]) {
  return { name, type, dependencies: [], devDependencies: [], registryDependencies: [], files }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('runBuild', () => {
  let tmp: string

  beforeEach(() => {
    tmp = join(tmpdir(), `complib-build-${Date.now()}`)
    mkdirSync(tmp, { recursive: true })
  })

  afterEach(() => {
    rmSync(tmp, { recursive: true, force: true })
  })

  it('embeds source file content into the output JSON', async () => {
    writeRegistry(tmp, {
      name: 'test-reg',
      items: [makeItem('utils', 'registry:lib', [{ path: 'utils.ts', type: 'lib' }])],
    })
    writeSource(tmp, 'utils', 'utils.ts', 'export function cn() {}')

    await runBuild(tmp)

    const out = JSON.parse(await readFile(join(tmp, 'public/r/utils.json'), 'utf-8')) as {
      name: string
      files: { content?: string }[]
    }
    expect(out.name).toBe('utils')
    expect(out.files[0]?.content).toBe('export function cn() {}')
  })

  it('returns the correct count', async () => {
    writeRegistry(tmp, {
      name: 'test-reg',
      items: [
        makeItem('utils',  'registry:lib',       [{ path: 'utils.ts',  type: 'lib' }]),
        makeItem('button', 'registry:component',  [{ path: 'button.tsx', type: 'component' }]),
      ],
    })
    writeSource(tmp, 'utils',  'utils.ts',   'export function cn() {}')
    writeSource(tmp, 'button', 'button.tsx', 'export const Button = () => null')

    const result = await runBuild(tmp)
    expect(result.count).toBe(2)
  })

  it('writes index.json listing all items', async () => {
    writeRegistry(tmp, {
      name: 'test-reg',
      items: [
        makeItem('utils',  'registry:lib',      [{ path: 'utils.ts',   type: 'lib' }]),
        makeItem('button', 'registry:component', [{ path: 'button.tsx', type: 'component' }]),
      ],
    })
    writeSource(tmp, 'utils',  'utils.ts',   'export function cn() {}')
    writeSource(tmp, 'button', 'button.tsx', 'export const Button = () => null')

    await runBuild(tmp)

    const index = JSON.parse(await readFile(join(tmp, 'public/r/index.json'), 'utf-8')) as {
      items: { name: string }[]
    }
    const names = index.items.map(i => i.name)
    expect(names).toContain('utils')
    expect(names).toContain('button')
  })

  it('index.json items do not contain embedded file content', async () => {
    writeRegistry(tmp, {
      name: 'test-reg',
      items: [makeItem('utils', 'registry:lib', [{ path: 'utils.ts', type: 'lib' }])],
    })
    writeSource(tmp, 'utils', 'utils.ts', 'export function cn() {}')

    await runBuild(tmp)

    const index = JSON.parse(await readFile(join(tmp, 'public/r/index.json'), 'utf-8')) as {
      items: { files: { content?: string }[] }[]
    }
    expect(index.items[0]?.files[0]?.content).toBeUndefined()
  })

  it('supports a custom output directory via --out', async () => {
    writeRegistry(tmp, {
      name: 'test-reg',
      items: [makeItem('utils', 'registry:lib', [{ path: 'utils.ts', type: 'lib' }])],
    })
    writeSource(tmp, 'utils', 'utils.ts', 'export function cn() {}')

    await runBuild(tmp, { out: 'dist/r' })

    const out = JSON.parse(await readFile(join(tmp, 'dist/r/utils.json'), 'utf-8')) as { name: string }
    expect(out.name).toBe('utils')
  })

  it('supports a custom source directory via --src', async () => {
    writeRegistry(tmp, {
      name: 'test-reg',
      items: [makeItem('utils', 'registry:lib', [{ path: 'utils.ts', type: 'lib' }])],
    })
    // Write source in a non-default location
    const dir = join(tmp, 'components', 'utils')
    mkdirSync(dir, { recursive: true })
    writeFileSync(join(dir, 'utils.ts'), 'export function cn() {}')

    await runBuild(tmp, { src: 'components' })

    const out = JSON.parse(await readFile(join(tmp, 'public/r/utils.json'), 'utf-8')) as { name: string }
    expect(out.name).toBe('utils')
  })

  it('throws when registry.json is missing', async () => {
    await expect(runBuild(tmp)).rejects.toThrow('Registry file not found')
  })

  it('throws when a source file is missing', async () => {
    writeRegistry(tmp, {
      name: 'test-reg',
      items: [makeItem('button', 'registry:component', [{ path: 'button.tsx', type: 'component' }])],
    })
    // Deliberately not creating button.tsx

    await expect(runBuild(tmp)).rejects.toThrow(/Build failed/)
  })

  it('throws when registry.json has invalid shape', async () => {
    writeFileSync(join(tmp, 'registry.json'), JSON.stringify({ invalid: true }))
    await expect(runBuild(tmp)).rejects.toThrow('Invalid registry.json')
  })
})
