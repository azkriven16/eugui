import { describe, expect, it } from 'vitest'
import { transformFile } from './transformer'

describe('transformFile', () => {
  it('rewrites a direct alias import', () => {
    const src = `import { cn } from '@/lib/utils'\n`
    const out = transformFile(src, 'test.ts', {
      aliases: { '@/lib/utils': '@/utils' },
      tsx: false,
    })
    expect(out).toContain(`'@/utils'`)
    expect(out).not.toContain(`'@/lib/utils'`)
  })

  it('rewrites a sub-path import', () => {
    const src = `import { Button } from '@/components/ui/button'\n`
    const out = transformFile(src, 'test.tsx', {
      aliases: { '@/components/ui': '@/ui' },
      tsx: true,
    })
    expect(out).toContain(`'@/ui/button'`)
  })

  it('rewrites multiple aliases in a single file', () => {
    const src = [
      `import { cn } from '@/lib/utils'`,
      `import { Button } from '@/components/ui/button'`,
      `import { useTheme } from '@/hooks/use-theme'`,
    ].join('\n')

    const out = transformFile(src, 'test.tsx', {
      aliases: {
        '@/lib/utils': '@/utils',
        '@/components/ui': '@/ui',
        '@/hooks': '@/app/hooks',
      },
      tsx: true,
    })
    expect(out).toContain(`'@/utils'`)
    expect(out).toContain(`'@/ui/button'`)
    expect(out).toContain(`'@/app/hooks/use-theme'`)
  })

  it('does not touch unrelated imports', () => {
    const src = `import React from 'react'\nimport { useState } from 'react'\n`
    const out = transformFile(src, 'test.tsx', {
      aliases: { '@/lib/utils': '@/utils' },
      tsx: true,
    })
    expect(out).toContain(`from 'react'`)
  })

  it('is a passthrough when aliases map is empty', () => {
    const src = `import { cn } from '@/lib/utils'\n`
    const out = transformFile(src, 'test.ts', { aliases: {}, tsx: false })
    expect(out).toBe(src)
  })

  it('rewrites string literals in layer 2 (non-import usages)', () => {
    const src = `const path = '@/lib/utils'\n`
    const out = transformFile(src, 'test.ts', {
      aliases: { '@/lib/utils': '@/utils' },
      tsx: false,
    })
    expect(out).toContain(`'@/utils'`)
  })
})
