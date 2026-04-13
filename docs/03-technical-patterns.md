# Core Technical Patterns

Reference for implementation decisions.

---

## 1. The `cn` Utility (Required Foundation)

Every component in this ecosystem depends on this:

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Why both libraries?**
- `clsx`: Handles conditional class logic (`{ 'bg-red': isError }`, arrays, falsy values)
- `tailwind-merge`: Deduplicates *conflicting* Tailwind utilities (`px-2 px-4` → `px-4`)
- Without `twMerge`, user overrides via `className` don't work reliably

**Install**: `npm install clsx tailwind-merge`

---

## 2. Class Variance Authority (CVA) Pattern

For components with multiple variants, CVA is the standard:

```typescript
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base classes (always applied)
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:     "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:     "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost:       "hover:bg-accent hover:text-accent-foreground",
        link:        "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm:      "h-8 rounded-md px-3 text-xs",
        default: "h-10 px-4 py-2",
        lg:      "h-11 rounded-md px-8",
        icon:    "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Type that merges HTML button props with CVA variants
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { buttonVariants }
```

**Key points**:
- Export both the component AND `buttonVariants` so callers can use variant classes without rendering the component
- `asChild` pattern (Radix Slot) allows polymorphic rendering
- `VariantProps<typeof buttonVariants>` gives full TypeScript inference on variant props

**Install**: `npm install class-variance-authority`

---

## 3. CLI Framework Stack

### Recommended Stack

| Package | Purpose | Alternative |
|---|---|---|
| `commander` | Command/argument parsing | `yargs`, `meow` |
| `@clack/prompts` | Interactive prompts (modern, elegant) | `inquirer`, `prompts` |
| `ora` | Spinner / progress indicators | `@clack/prompts` spinners |
| `chalk` | Terminal colors | `picocolors` (lighter) |
| `execa` | Shell command execution | `cross-spawn` |
| `fs-extra` | File system helpers | `node:fs/promises` |
| `zod` | Config/registry schema validation | `ajv` |
| `ts-morph` | TypeScript AST manipulation | `@typescript-eslint/parser` |
| `tsdown` | Bundle CLI for distribution | `tsup` (unmaintained), `esbuild` |
| `vitest` | Testing | `jest` |

### Why `@clack/prompts` over Inquirer?

`@clack/prompts` has a cleaner API, better visual output (group/cancel/intro/outro), and is actively maintained. shadcn itself migrated to it.

```typescript
import { intro, outro, select, text, spinner, isCancel, cancel } from '@clack/prompts'

async function run() {
  intro('component-library-cli')

  const framework = await select({
    message: 'Which framework are you using?',
    options: [
      { value: 'next', label: 'Next.js' },
      { value: 'vite', label: 'Vite' },
      { value: 'remix', label: 'Remix' },
    ],
  })

  if (isCancel(framework)) {
    cancel('Setup cancelled.')
    process.exit(0)
  }

  const s = spinner()
  s.start('Installing dependencies')
  await installDeps()
  s.stop('Dependencies installed')

  outro('You\'re all set!')
}
```

---

## 4. Registry Schema (Zod)

Validate registry items at build and fetch time:

```typescript
import { z } from 'zod'

const registryItemFileSchema = z.object({
  path: z.string(),
  content: z.string().optional(),       // Embedded when built
  type: z.enum(['component', 'hook', 'lib', 'page', 'file', 'font']),
  target: z.string().optional(),        // Required for page/file types
})

const registryItemSchema = z.object({
  $schema: z.string().optional(),
  name: z.string(),
  type: z.enum([
    'registry:component',
    'registry:block',
    'registry:page',
    'registry:file',
    'registry:hook',
    'registry:lib',
    'registry:font',   // shadcn v4: first-class font type
    'registry:base',   // shadcn v4: full design system payload
  ]),
  title: z.string().optional(),
  description: z.string().optional(),
  author: z.string().optional(),
  categories: z.array(z.string()).optional(),
  dependencies: z.array(z.string()).default([]),
  devDependencies: z.array(z.string()).default([]),
  registryDependencies: z.array(z.string()).default([]),
  files: z.array(registryItemFileSchema),
  cssVars: z.object({
    light: z.record(z.string()).optional(),
    dark: z.record(z.string()).optional(),
  }).optional(),
  css: z.string().optional(),
  docs: z.string().optional(),
})

export type RegistryItem = z.infer<typeof registryItemSchema>
```

---

## 5. Package Manager Detection

```typescript
import { existsSync } from 'node:fs'
import { join } from 'node:path'

type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun'

export function detectPackageManager(cwd: string): PackageManager {
  if (existsSync(join(cwd, 'bun.lock')))          return 'bun'  // Bun v1.2+ text lockfile
  if (existsSync(join(cwd, 'bun.lockb')))         return 'bun'  // Legacy binary lockfile
  if (existsSync(join(cwd, 'pnpm-lock.yaml')))    return 'pnpm'
  if (existsSync(join(cwd, 'yarn.lock')))         return 'yarn'
  return 'npm'
}

export function getInstallCommand(pm: PackageManager, packages: string[]): string {
  const pkgs = packages.join(' ')
  switch (pm) {
    case 'bun':  return `bun add ${pkgs}`
    case 'pnpm': return `pnpm add ${pkgs}`
    case 'yarn': return `yarn add ${pkgs}`
    default:     return `npm install ${pkgs}`
  }
}
```

---

## 6. Framework Detection

```typescript
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { readPackageJSON } from './utils'

type Framework = 'next' | 'vite' | 'remix' | 'astro' | 'laravel' | 'unknown'

export async function detectFramework(cwd: string): Promise<Framework> {
  // Config file presence is most reliable
  if (existsSync(join(cwd, 'next.config.js')) ||
      existsSync(join(cwd, 'next.config.ts')) ||
      existsSync(join(cwd, 'next.config.mjs')))   return 'next'

  if (existsSync(join(cwd, 'vite.config.js')) ||
      existsSync(join(cwd, 'vite.config.ts')))    return 'vite'

  if (existsSync(join(cwd, 'remix.config.js')))   return 'remix'
  if (existsSync(join(cwd, 'astro.config.mjs')))  return 'astro'
  if (existsSync(join(cwd, 'artisan')))            return 'laravel'

  // Fallback: check package.json deps
  const pkg = await readPackageJSON(join(cwd, 'package.json'))
  const deps = { ...pkg.dependencies, ...pkg.devDependencies }
  if ('next' in deps)           return 'next'
  if ('vite' in deps)           return 'vite'
  if ('@remix-run/react' in deps) return 'remix'
  if ('astro' in deps)          return 'astro'

  return 'unknown'
}
```

---

## 7. AST Import Rewriting (ts-morph)

```typescript
import { Project, SyntaxKind } from 'ts-morph'

export function rewriteImports(
  sourceText: string,
  aliases: Record<string, string>  // { '@/lib/utils': '@/utils', '@/components': '@/ui' }
): string {
  const project = new Project({ useInMemoryFileSystem: true })
  const file = project.createSourceFile('temp.tsx', sourceText)

  file.getImportDeclarations().forEach((decl) => {
    const moduleSpecifier = decl.getModuleSpecifierValue()
    for (const [from, to] of Object.entries(aliases)) {
      if (moduleSpecifier === from || moduleSpecifier.startsWith(from + '/')) {
        decl.setModuleSpecifier(moduleSpecifier.replace(from, to))
        break
      }
    }
  })

  return file.getFullText()
}
```

---

## 8. tsdown Config for CLI Distribution

> **Note**: tsdown is the actively maintained successor to tsup (which is unmaintained). The `arch-tsdown-cli` skill covers the full setup pattern.

```typescript
// tsdown.config.ts
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],       // ESM-first; tsdown handles this cleanly
  dts: true,
  clean: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
  external: ['fs', 'path', 'os', 'child_process'],
})
```

And the `package.json` bin field:

```json
{
  "name": "your-cli",
  "version": "0.1.0",
  "type": "module",
  "bin": {
    "your-cli": "./dist/index.js"
  },
  "exports": {
    ".": "./dist/index.js"
  },
  "files": ["dist"],
  "engines": { "node": ">=20" }
}
```

---

## 9. CSS Variable Injection

When a component declares `cssVars`, the CLI needs to inject them into `globals.css`:

```typescript
export function injectCSSVars(
  css: string,
  vars: { light?: Record<string, string>; dark?: Record<string, string> }
): string {
  let result = css

  if (vars.light) {
    const lightVars = Object.entries(vars.light)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join('\n')
    // Inject into :root block or create it
    result = injectIntoSelector(result, ':root', lightVars)
  }

  if (vars.dark) {
    const darkVars = Object.entries(vars.dark)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join('\n')
    result = injectIntoSelector(result, '.dark', darkVars)
  }

  return result
}
```

---

## 10. Tailwind v4 Compatibility

Tailwind v4 uses `@import "tailwindcss"` and `@theme` blocks instead of `tailwind.config.js`:

```css
/* globals.css for Tailwind v4 */
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.21 0.006 285.885);
  --radius: 0.625rem;
}
```

**Detection**: Check if `tailwind.config.js/ts` exists. If not, assume v4 and use CSS-only approach for injecting theme tokens.
