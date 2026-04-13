import { z } from 'zod'

export const configSchema = z.object({
  $schema: z.string().optional(),
  style: z.string(),
  tailwind: z.object({
    config: z.string(),         // empty string for Tailwind v4
    css: z.string(),
    baseColor: z.string(),
    cssVariables: z.boolean(),
    prefix: z.string().optional().default(''),
  }),
  rsc: z.boolean().default(false),
  tsx: z.boolean().default(true),
  aliases: z.object({
    utils: z.string(),
    components: z.string(),
    ui: z.string(),
    lib: z.string(),
    hooks: z.string(),
  }),
  registries: z.record(z.string()).optional().default({}),
})

export type ComponentsConfig = z.infer<typeof configSchema>
