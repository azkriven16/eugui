import { z } from 'zod'

const registryItemFileSchema = z.object({
  path: z.string(),
  content: z.string().optional(),
  type: z.enum(['component', 'hook', 'lib', 'page', 'file', 'font']),
  target: z.string().optional(),
})

export const registryItemSchema = z.object({
  $schema: z.string().optional(),
  name: z.string(),
  type: z.enum([
    'registry:component',
    'registry:block',
    'registry:page',
    'registry:file',
    'registry:hook',
    'registry:lib',
    'registry:font',  // shadcn v4
    'registry:base',  // shadcn v4
  ]),
  title: z.string().optional(),
  description: z.string().optional(),
  author: z.string().optional(),
  categories: z.array(z.string()).optional(),
  dependencies: z.array(z.string()).default([]),
  devDependencies: z.array(z.string()).default([]),
  registryDependencies: z.array(z.string()).default([]),
  files: z.array(registryItemFileSchema),
  cssVars: z
    .object({
      light: z.record(z.string()).optional(),
      dark: z.record(z.string()).optional(),
    })
    .optional(),
  css: z.string().optional(),
  docs: z.string().optional(),
})

export type RegistryItem = z.infer<typeof registryItemSchema>
export type RegistryItemFile = z.infer<typeof registryItemFileSchema>

// ---------------------------------------------------------------------------
// Registry manifest — the root registry.json file authored by library owners.
// Items here are the same shape as registry items but files have no `content`
// (content gets embedded during the `build` command).
// ---------------------------------------------------------------------------

export const registryManifestSchema = z.object({
  $schema: z.string().optional(),
  name: z.string(),
  homepage: z.string().optional(),
  items: z.array(registryItemSchema),
})

export type RegistryManifest = z.infer<typeof registryManifestSchema>

// ---------------------------------------------------------------------------
// Registry index — the public/r/index.json file served by hosted registries.
// Same items as the manifest but without embedded file content.
// ---------------------------------------------------------------------------

export const registryIndexSchema = z.object({
  name: z.string().optional(),
  items: z.array(registryItemSchema),
})

export type RegistryIndex = z.infer<typeof registryIndexSchema>
