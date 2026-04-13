# Build Plan — Phased Implementation

## Phase Overview

| Phase | Name | Goal | Deliverable |
|---|---|---|---|
| 0 | Scaffold | Monorepo + tooling | Buildable empty CLI |
| 1 | Core CLI | `init` + `add` commands | Working local registry |
| 2 | Registry | Build + serve pipeline | Public JSON registry |
| 3 | Components | First component set | 20+ usable components |
| 4 | DX Polish | Diff, search, dry-run | Production-ready CLI |
| 5 | Launch | npm publish + docs site | Public release |

---

## Phase 0 — Scaffold (Day 1–2)

**Goal**: Working monorepo with a CLI that builds and runs.

### Tasks

- [ ] Init monorepo with pnpm workspaces
  ```
  packages/
    cli/          ← the npx-able CLI package
    registry/     ← component source files + registry.json
    www/          ← docs/demo site (Next.js)
  ```
- [ ] Set up `packages/cli/`
  - `tsdown.config.ts` with `#!/usr/bin/env node` banner
  - `package.json` with `bin` field
  - Basic Commander.js entry: `index.ts` → `program.version().parse()`
- [ ] Add root-level scripts: `build`, `dev`, `test`, `lint`
- [ ] Configure TypeScript (`tsconfig.base.json` + per-package `tsconfig.json`)
- [ ] Add Vitest for testing
- [ ] Add ESLint + Prettier
- [ ] Verify: `node packages/cli/dist/index.js --version` prints version

### Key Files

```
component-library-cli/
├── package.json              (root, private: true)
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── packages/
│   ├── cli/
│   │   ├── package.json
│   │   ├── tsdown.config.ts
│   │   ├── src/
│   │   │   ├── index.ts      (entry, Commander setup)
│   │   │   ├── commands/
│   │   │   └── utils/
│   │   └── tsconfig.json
│   ├── registry/
│   │   ├── registry.json
│   │   └── src/
│   └── www/
│       └── (Next.js app)
└── docs/
```

---

## Phase 1 — Core CLI Commands (Day 3–7)

**Goal**: `init` and `add` work end-to-end against a local registry.

### `init` Command

- [ ] Detect framework (next/vite/remix/astro/unknown)
- [ ] Detect package manager (bun/pnpm/yarn/npm)
- [ ] Prompt user for:
  - TypeScript or JavaScript
  - Tailwind CSS version (v3 with config / v4 inline)
  - Components directory alias (default `@/components/ui`)
  - Utils alias (default `@/lib/utils`)
  - CSS file path (default `app/globals.css` or `src/index.css`)
- [ ] Write `components.json` to project root
- [ ] Install base dependencies (`clsx`, `tailwind-merge`)
- [ ] Write `lib/utils.ts` (the `cn` function)
- [ ] Inject Tailwind base styles into CSS file if needed
- [ ] Show success summary

### `add` Command

- [ ] Accept component name(s) as args: `add button` or `add button card input`
- [ ] Load `components.json` from project root (error if missing → prompt to run `init`)
- [ ] Resolve registry URL from config
- [ ] Fetch component JSON from registry (local file path or HTTP)
- [ ] Validate with Zod schema
- [ ] BFS resolve `registryDependencies`
- [ ] Collect all npm `dependencies` from the component graph
- [ ] Transform each file:
  - Rewrite import aliases (ts-morph)
  - Apply string literal substitutions
- [ ] Write transformed files to target paths (respect user's alias dirs)
- [ ] Run package manager install for collected npm deps
- [ ] Print success summary with file list

### Utils to Build

- [ ] `loadConfig(cwd)` — reads + validates `components.json`
- [ ] `fetchRegistry(url)` — GET JSON, validate schema, return typed object
- [ ] `resolveItems(items, registry)` — BFS dependency resolution
- [ ] `transformFile(content, aliases)` — AST import rewrite
- [ ] `writeFile(path, content)` — mkdir -p + write
- [ ] `runInstall(pm, packages, cwd)` — execa wrapper
- [ ] `detectFramework(cwd)` — config file + package.json checks
- [ ] `detectPackageManager(cwd)` — lockfile checks

### Tests (Phase 1)

- Unit: `resolveItems` handles circular deps
- Unit: `transformFile` correctly rewrites imports
- Unit: `detectPackageManager` returns correct pm per lockfile
- Integration: `init` writes valid `components.json`
- Integration: `add button` writes file + installs dep against fixture project

---

## Phase 2 — Registry Build Pipeline (Day 8–10)

**Goal**: Build command turns source files into serveable JSON. Registry is hosted.

### `build` Command

- [ ] Read `registry.json` from cwd or `--registry` flag path
- [ ] For each item, read each file from disk and embed content
- [ ] Validate every item against `registryItemSchema`
- [ ] Output to `public/r/[name].json` (configurable via `--out`)
- [ ] Also output root `public/r/index.json` listing all items

### Registry Hosting Options (to document)

1. **Static file hosting**: Build registry JSON → push to Vercel/Netlify/GitHub Pages
2. **Next.js API route**: Serve dynamically from `app/r/[name]/route.ts`
3. **GitHub raw**: Host source JSON in a public repo, reference raw URLs directly

### Namespace Support

- [ ] Support `@namespace/component` resolution in `components.json` registries map
- [ ] `{name}` template substitution in registry URLs: `"https://example.com/r/{name}.json"`
- [ ] Resolve `@namespace/component` → template-fill URL → fetch

---

## Phase 3 — First Component Set (Day 11–18)

**Goal**: 20+ quality components in the registry.

### Starter Set (priority order)

**Primitives** (no deps beyond cn):
- [ ] `button` — variants: default, outline, ghost, destructive, link; sizes: sm/md/lg/icon
- [ ] `badge` — variants: default, secondary, outline, destructive
- [ ] `label` — with `htmlFor` passthrough
- [ ] `separator` — horizontal/vertical
- [ ] `skeleton` — loading placeholder with animation
- [ ] `spinner` — loading indicator

**Inputs**:
- [ ] `input` — styled text input
- [ ] `textarea` — styled textarea
- [ ] `checkbox` — Radix or native
- [ ] `switch` — toggle
- [ ] `select` — native or Radix
- [ ] `slider` — Radix

**Layout/Overlay**:
- [ ] `card` — card + card-header + card-content + card-footer
- [ ] `dialog` — modal with Radix Dialog
- [ ] `sheet` — side drawer
- [ ] `popover` — Radix Popover
- [ ] `tooltip` — Radix Tooltip
- [ ] `dropdown-menu` — Radix DropdownMenu

**Navigation**:
- [ ] `tabs` — Radix Tabs
- [ ] `breadcrumb`
- [ ] `pagination`

**Feedback**:
- [ ] `alert` — info/warning/error/success variants
- [ ] `toast` — via sonner
- [ ] `progress` — Radix Progress

### Per-Component Deliverables

For each component:
- Source `.tsx` file in `packages/registry/src/[component]/`
- Entry in `registry.json`
- Built `public/r/[component].json`
- Preview in docs site

---

## Phase 4 — DX Polish (Day 19–23)

**Goal**: CLI feels professional. Ready for external users.

### Features

- [ ] `--dry-run` flag on `add` — show what would be written without writing
- [ ] `--diff` flag on `add` — show unified diff against existing files
- [ ] `--overwrite` flag on `add` — skip confirmation for existing files
- [ ] `search [query]` command — fuzzy search component names/categories
- [ ] `list` command — show all available components in configured registries
- [ ] `update [component]` command — re-fetch and overwrite a component
- [ ] `info [component]` command — show metadata, deps, files without installing
- [ ] Interactive mode on `add` when no component specified — checkbox multi-select
- [ ] Error messages with actionable next steps (not just "Error: fetch failed")
- [ ] `--silent` flag for CI environments

### Robustness

- [ ] Retry logic on registry fetch (3 attempts, exponential backoff)
- [ ] Offline detection with clear error
- [ ] Handle conflicting file writes (prompt to overwrite or skip)
- [ ] Validate `components.json` schema and surface friendly errors
- [ ] Handle registry items with missing or malformed files

---

## Phase 5 — Launch (Day 24–30)

See [06-launch-plan.md](06-launch-plan.md) for full details.

### Checklist Summary

- [ ] npm publish `@yourscope/cli` under final package name
- [ ] `npx your-cli@latest init` works in a fresh Next.js project
- [ ] `npx your-cli@latest add button` works end-to-end
- [ ] Registry hosted at stable public URL
- [ ] Docs site live with component previews
- [ ] README with quick-start
- [ ] GitHub repo public with MIT license
- [ ] Announce on X/Twitter + Discord communities

---

## Tech Decisions Log

| Decision | Choice | Rationale |
|---|---|---|
| Monorepo tool | pnpm workspaces | Lightweight, no Nx overhead needed at this scale |
| CLI framework | Commander.js | Battle-tested, shadcn uses it, excellent help generation |
| Prompts | @clack/prompts | Modern, elegant UI, shadcn migrated to it |
| Bundler | tsdown | tsup successor from the Rolldown/Vite ecosystem; ESM-first, actively maintained (tsup is unmaintained) |
| Validation | zod | Type inference from schemas; runtime + compile-time safety |
| AST | ts-morph | Higher-level than raw tsc API; sufficient for import rewriting |
| Testing | vitest | Fast, ESM-native, excellent TypeScript support |
| Colors | chalk | Widest adoption, 256/truecolor support |
