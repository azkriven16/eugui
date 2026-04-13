import { defineConfig } from 'tsdown'

export default defineConfig({
  fixedExtension: true,
  entry: ['src/**/*.ts', '!src/**/*.test.ts'],
  format: ['esm'],
  clean: true,
  dts: true,
  external: [
    '@clack/prompts',
    'chalk',
    'commander',
    'execa',
    'ts-morph',
    'vitest',
    'zod',
  ],
})
