# shadcn/ui CLI — Deep Technical Research

> Researched: April 2026. Sources: shadcn official docs, GitHub source, community analysis.

## Overview

shadcn/ui is the dominant copy-paste component library. Its CLI (`npx shadcn@latest`) is the gold standard for this category. Understanding it thoroughly is the foundation for building a competitive alternative or extension.

---

## CLI Command Surface

| Command | Purpose |
|---|---|
| `init` | Initialize project (installs deps, sets up cn utility, configures Tailwind, writes `components.json`) |
| `add [component]` | Fetch component(s) from registry, install deps, write files |
| `build` | Generate `public/r/*.json` registry files from local source |
| `search [query]` | Query registries by component name |
| `view [component]` | Display component content before installing |
| `create` | Launch website-based custom design system builder |

---

## Execution Pipeline for `add`

```
1. Parse args (Commander.js)
        ↓
2. Read components.json → locate registry URL(s)
        ↓
3. Resolve component from registry (local JSON or remote URL)
        ↓
4. resolveRegistryItems() → BFS dependency graph
        ↓
5. Fetch all transitive deps (components + npm packages)
        ↓
6. Transform files (AST + string literal rewriting)
        ↓
7. Write files to disk (with optional --diff preview)
        ↓
8. Run package manager install (npm/pnpm/yarn/bun detected)
```

---

## `components.json` — Project Config File

Written at project root during `init`. Tells the CLI where things live.

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true,
    "prefix": ""
  },
  "rsc": true,
  "tsx": true,
  "aliases": {
    "utils": "@/lib/utils",
    "components": "@/components/ui",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "registries": {
    "default": "https://ui.shadcn.com/r",
    "@cult-ui": "https://cult-ui.com/r/{name}.json",
    "@aceternity": "https://ui.aceternity.com/registry/{name}.json"
  }
}
```

**Key insight**: `style` cannot be changed post-init. All other fields are adjustable. The `registries` map is how namespace prefixes (`@cult-ui/button`) are resolved to URLs.

---

## Registry Format

### `registry.json` — Root Manifest

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "my-registry",
  "homepage": "https://example.com",
  "items": [
    { "name": "button", "type": "registry:component", "files": [...] }
  ]
}
```

### `registry-item.json` — Per-Component Schema

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "button",
  "type": "registry:component",
  "title": "Button",
  "description": "A clickable component",
  "author": "shadcn",
  "categories": ["forms"],
  "dependencies": ["@radix-ui/react-slot"],
  "devDependencies": [],
  "registryDependencies": ["utils"],
  "files": [
    {
      "path": "button.tsx",
      "type": "component",
      "target": "components/ui/button.tsx"
    }
  ],
  "cssVars": {
    "light": { "--primary": "222.2 47.4% 11.2%" },
    "dark":  { "--primary": "210 40% 98%" }
  },
  "css": "@layer components { .btn { ... } }",
  "docs": "Optional custom install instructions shown after adding"
}
```

### Item Types

| Type | Description | Requires `target`? |
|---|---|---|
| `registry:component` | React component (.tsx/.jsx) | No |
| `registry:hook` | Custom React hook | No |
| `registry:lib` | Utility functions | No |
| `registry:block` | Multi-file template/example | No |
| `registry:page` | Full page component | Yes |
| `registry:file` | Arbitrary file copy | Yes |
| `registry:font` | Font references for @import | No |

---

## Dependency Resolution Algorithm

BFS (breadth-first search) over `registryDependencies`:

```
queue = [requested_component]
seen = {}

while queue not empty:
  item = queue.shift()
  if item in seen: continue
  seen[item] = true
  
  fetch item from registry
  queue.push(...item.registryDependencies)

merge all npm `dependencies` from seen items
run package_manager install
```

Three dependency declaration forms:
1. **Built-in**: `"registryDependencies": ["button", "input"]`
2. **Namespaced**: `"registryDependencies": ["@acme/input-form"]`
3. **URL**: `"registryDependencies": ["https://example.com/r/utils.json"]`

---

## File Transformation Pipeline

### Two-Layer Approach

**Layer 1 — ts-morph AST transforms**:
- Parse TypeScript into AST
- Rewrite import paths based on user's alias configuration
- Migrate physical CSS properties to logical equivalents (RTL support)
- Rewrite Radix UI imports (v2 migration)

**Layer 2 — String literal rewriting**:
- Replace `@/registry/...` paths
- Replace `@/lib/utils` with user's configured utils alias
- These don't parse as traditional imports so need direct string matching

### Transform Sequence

```
raw file from registry
        ↓
1. Read user aliases from components.json
2. Read tsconfig.json paths for resolution
3. AST parse (ts-morph)
4. Rewrite import declarations
5. Apply string literal substitutions
        ↓
transformed file ready for disk write
```

---

## Framework Detection

The CLI detects the project framework via:

1. **Config file presence**: `next.config.{js,ts,mjs}`, `vite.config.{js,ts}`, `remix.config.js`, `astro.config.mjs`
2. **package.json dependencies**: Checks for `next`, `vite`, `@remix-run/react`, `astro`, etc.
3. **tsconfig.json paths**: Infers alias conventions

Supported frameworks:
- Next.js (App Router + Pages Router)
- Vite (React)
- Remix / React Router v7
- Astro
- TanStack Start
- Laravel (via Inertia)

---

## Monorepo Support (v3+)

The CLI resolves workspace paths and installs components/dependencies to the correct package within a monorepo. Cross-package imports are handled with proper path rewriting.

---

## Package Manager Detection

Checked in order: `bun.lockb` → `pnpm-lock.yaml` → `yarn.lock` → `package-lock.json`. Falls back to `npm`.

---

## Registry Build Process

Run `shadcn build` in a project that has `registry.json`:

1. Reads `registry.json` items
2. Reads each referenced source file from disk
3. Embeds file content inline into JSON
4. Outputs to `public/r/[name].json`
5. These static JSON files are then served over HTTP

---

## Evolution Timeline

| Version | Date | Key Changes |
|---|---|---|
| v1 | 2023 | Initial release, basic add/init |
| v2 | 2024 | Registry API, components.json |
| v3 | Aug 2025 | Namespaced registries, MCP server, `create` command |
| v4 | Mar 2026 | Full framework templates, improved monorepo support |

---

## Sources

- https://ui.shadcn.com/docs/cli
- https://ui.shadcn.com/docs/components-json
- https://ui.shadcn.com/docs/registry/registry-json
- https://ui.shadcn.com/docs/registry/registry-item-json
- https://ui.shadcn.com/docs/registry/getting-started
- https://github.com/shadcn-ui/ui
