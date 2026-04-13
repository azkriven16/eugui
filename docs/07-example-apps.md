# Example Apps & Usage Walkthroughs

Concrete examples of what the CLI looks like in practice — both from the user's perspective (consuming a registry) and the registry author's perspective (building one).

---

## Example 1: User Installing Components (Happy Path)

### Setup: Fresh Next.js 14 App Router project

```bash
npx create-next-app@latest my-app --typescript --tailwind --app
cd my-app

# Install the CLI and initialize
npx your-cli@latest init
```

**`init` interaction:**

```
┌  your-cli v0.1.0
│
◇  Which framework are you using?
│  ● Next.js (App Router)
│
◇  Are you using TypeScript?
│  ● Yes
│
◇  Which Tailwind version?
│  ● v4 (no config file)
│
◇  Where is your global CSS file?
│  app/globals.css
│
◇  What alias for components? (@/components/ui)
│  @/components/ui
│
◇  What alias for utils? (@/lib/utils)
│  @/lib/utils
│
◆  Installing dependencies...
│  ✓  clsx, tailwind-merge installed
│
◆  Writing files...
│  ✓  components.json
│  ✓  lib/utils.ts
│
└  Done! Run `npx your-cli add [component]` to add components.
```

**`components.json` written:**

```json
{
  "$schema": "https://yourui.com/schema.json",
  "style": "default",
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "rsc": true,
  "tsx": true,
  "aliases": {
    "utils": "@/lib/utils",
    "components": "@/components/ui",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

**`lib/utils.ts` written:**

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

### Adding Components

```bash
npx your-cli add button
```

```
◆  Resolving components...
│  button → [utils]
│
◆  Installing npm deps: @radix-ui/react-slot
│
◆  Writing files:
│  ✓  components/ui/button.tsx
│
└  Done! Added: button
```

```bash
# Add multiple at once
npx your-cli add card dialog input
```

```
◆  Resolving components...
│  card    → []
│  dialog  → [@radix-ui/react-dialog, label]
│  input   → []
│
◆  Installing npm deps: @radix-ui/react-dialog
│
◆  Writing files:
│  ✓  components/ui/card.tsx
│  ✓  components/ui/dialog.tsx
│  ✓  components/ui/label.tsx
│  ✓  components/ui/input.tsx
│
└  Done! Added: card, dialog, input (label installed as dependency)
```

---

### Preview Before Installing (--dry-run)

```bash
npx your-cli add button --dry-run
```

```
◆  DRY RUN — no files will be written
│
│  Would write:
│  + components/ui/button.tsx (247 lines)
│
│  Would install:
│  + @radix-ui/react-slot
│
│  Run without --dry-run to apply.
└
```

---

### Diff Against Existing File (--diff)

```bash
npx your-cli add button --diff
```

```
◆  Diff for components/ui/button.tsx:
│
│  @@ -12,7 +12,7 @@
│     variant: {
│       default: "bg-primary text-primary-foreground hover:bg-primary/90",
│  -    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
│  +    secondary: "bg-secondary/80 text-secondary-foreground hover:bg-secondary",
│     }
│
◇  Apply changes? (y/n)
│  ● Yes
│
└  ✓  Updated: components/ui/button.tsx
```

---

## Example 2: Building a Custom Registry

Scenario: You have an internal design system at `acme.com`. You want your team to install components via:
```bash
npx your-cli add @acme/button
```

### Step 1: Create Registry Repo

```bash
mkdir acme-registry && cd acme-registry
pnpm init
pnpm add -D your-cli
```

### Step 2: Write `registry.json`

```json
{
  "$schema": "https://yourui.com/schema/registry.json",
  "name": "acme-registry",
  "homepage": "https://acme.com/design-system",
  "items": [
    {
      "name": "button",
      "type": "registry:component",
      "title": "Acme Button",
      "description": "Acme branded button with company variants",
      "dependencies": ["@radix-ui/react-slot"],
      "registryDependencies": ["utils"],
      "files": [
        {
          "path": "src/button/button.tsx",
          "type": "component",
          "target": "components/ui/button.tsx"
        }
      ],
      "cssVars": {
        "light": {
          "--acme-primary": "221 83% 53%",
          "--acme-primary-foreground": "0 0% 100%"
        },
        "dark": {
          "--acme-primary": "217 91% 60%",
          "--acme-primary-foreground": "0 0% 100%"
        }
      }
    },
    {
      "name": "data-table",
      "type": "registry:component",
      "title": "Acme Data Table",
      "dependencies": ["@tanstack/react-table"],
      "registryDependencies": ["button", "input"],
      "files": [
        {
          "path": "src/data-table/data-table.tsx",
          "type": "component",
          "target": "components/ui/data-table.tsx"
        },
        {
          "path": "src/data-table/data-table-toolbar.tsx",
          "type": "component",
          "target": "components/ui/data-table-toolbar.tsx"
        }
      ]
    }
  ]
}
```

### Step 3: Write Component Source

```tsx
// src/button/button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--acme-primary] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:  "bg-[hsl(var(--acme-primary))] text-[hsl(var(--acme-primary-foreground))] hover:bg-[hsl(var(--acme-primary))]/90",
        outline:  "border-2 border-[hsl(var(--acme-primary))] text-[hsl(var(--acme-primary))] hover:bg-[hsl(var(--acme-primary))]/10",
        ghost:    "hover:bg-[hsl(var(--acme-primary))]/10 text-[hsl(var(--acme-primary))]",
        danger:   "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        sm:      "h-8 px-3 text-xs",
        default: "h-10 px-6",
        lg:      "h-12 px-8 text-base",
        icon:    "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
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

export { Button, buttonVariants }
```

### Step 4: Build Registry

```bash
# Add build script to package.json
# "scripts": { "build": "your-cli build" }

pnpm build
```

```
◆  Building registry...
│  ✓  button.json
│  ✓  data-table.json
│  ✓  index.json
│
└  Registry built to public/r/ (3 files)
```

### Step 5: Deploy + Configure Users

Deploy to `https://acme.com/r/` (Vercel, etc.).

Users add this to their `components.json`:
```json
{
  "registries": {
    "@acme": "https://acme.com/r/{name}.json"
  }
}
```

Then install:
```bash
npx your-cli add @acme/button
npx your-cli add @acme/data-table   # auto-installs button + input as deps
```

---

## Example 3: Registry JSON Format (Built Output)

What `public/r/button.json` looks like after `build`:

```json
{
  "$schema": "https://yourui.com/schema/registry-item.json",
  "name": "button",
  "type": "registry:component",
  "title": "Button",
  "description": "A button component with multiple variants.",
  "dependencies": ["@radix-ui/react-slot", "class-variance-authority"],
  "devDependencies": [],
  "registryDependencies": ["utils"],
  "files": [
    {
      "path": "button.tsx",
      "type": "component",
      "target": "components/ui/button.tsx",
      "content": "import * as React from \"react\"\nimport { Slot } from \"@radix-ui/react-slot\"\n..."
    }
  ],
  "cssVars": {
    "light": {},
    "dark": {}
  }
}
```

The `content` field is the full file source embedded inline. This is what the CLI reads and writes to the user's project after transforming imports.

---

## Example 4: `search` Command

```bash
npx your-cli search form
```

```
┌  Searching "form" in 2 registries...
│
│  default registry (https://yourui.com/r):
│  ─────────────────────────────────────────
│  form              Form wrapper with react-hook-form integration
│  form-field        Individual form field with label + error
│  input             Basic text input
│
│  @acme (https://acme.com/r):
│  ─────────────────────────────────────────
│  form-layout       Acme branded two-column form layout
│
└  Run `npx your-cli add [name]` to install
```

---

## Example 5: Monorepo Usage

In a monorepo where apps live in `apps/web/` and the design system is at `packages/ui/`:

```json
{
  "aliases": {
    "utils": "@repo/ui/lib/utils",
    "components": "@repo/ui/components",
    "ui": "@repo/ui/components/ui",
    "lib": "@repo/ui/lib",
    "hooks": "@repo/ui/hooks"
  }
}
```

The CLI writes components to `packages/ui/components/ui/` and rewrites all `@/` imports to `@repo/ui/`.

---

## Example 6: GitHub Actions — Auto-Build Registry on Push

```yaml
# .github/workflows/registry.yml
name: Build Registry
on:
  push:
    branches: [main]
    paths:
      - 'src/**'
      - 'registry.json'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run build:registry
      - name: Deploy to Vercel
        run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```
