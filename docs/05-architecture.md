# System Architecture

---

## Monorepo Layout

```
component-library-cli/
├── packages/
│   ├── cli/                    ← Published npm package (the CLI)
│   │   ├── src/
│   │   │   ├── index.ts        ← Entry: Commander setup, command registration
│   │   │   ├── commands/
│   │   │   │   ├── init.ts     ← `init` command implementation
│   │   │   │   ├── add.ts      ← `add` command implementation
│   │   │   │   ├── build.ts    ← `build` command implementation
│   │   │   │   ├── search.ts   ← `search` command implementation
│   │   │   │   ├── list.ts     ← `list` command implementation
│   │   │   │   └── info.ts     ← `info` command implementation
│   │   │   ├── utils/
│   │   │   │   ├── config.ts       ← Read/write components.json
│   │   │   │   ├── registry.ts     ← Fetch + validate registry items
│   │   │   │   ├── resolver.ts     ← BFS dependency resolution
│   │   │   │   ├── transformer.ts  ← AST import rewriting (ts-morph)
│   │   │   │   ├── css.ts          ← CSS variable injection
│   │   │   │   ├── framework.ts    ← Framework detection
│   │   │   │   ├── pm.ts           ← Package manager detection + install
│   │   │   │   ├── fs.ts           ← File read/write helpers
│   │   │   │   └── logger.ts       ← Chalk-based output helpers
│   │   │   └── schemas/
│   │   │       ├── config.ts       ← Zod: components.json schema
│   │   │       └── registry.ts     ← Zod: registry-item.json schema
│   │   ├── tsdown.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── registry/               ← Component source files
│   │   ├── registry.json       ← Root manifest (items array)
│   │   ├── src/
│   │   │   ├── button/
│   │   │   │   ├── button.tsx
│   │   │   │   └── index.ts
│   │   │   ├── card/
│   │   │   │   └── card.tsx
│   │   │   └── ...
│   │   └── public/
│   │       └── r/              ← Built registry JSON files (gitignored in dev)
│   │           ├── index.json
│   │           ├── button.json
│   │           └── card.json
│   │
│   └── www/                    ← Docs + preview site
│       ├── app/
│       │   ├── page.tsx        ← Homepage
│       │   ├── docs/           ← Documentation pages
│       │   └── components/     ← Live component previews
│       └── package.json
│
├── docs/                       ← This research/planning folder
├── package.json                ← Root (private: true)
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── .agents/skills/             ← Locally installed CLI skills
```

---

## Data Flow: `add button`

```
User runs: npx your-cli add button
                    │
                    ▼
          ┌─────────────────┐
          │   index.ts      │  Commander parses "add button"
          │   program.parse │
          └────────┬────────┘
                   │
                   ▼
          ┌─────────────────┐
          │   add.ts        │  Command handler
          └────────┬────────┘
                   │
          ┌────────▼────────┐
          │ loadConfig(cwd) │  Read components.json → Config object
          └────────┬────────┘
                   │
          ┌────────▼─────────────┐
          │ resolveRegistryURL() │  Lookup "button" → registry URL
          └────────┬─────────────┘
                   │
          ┌────────▼──────────────────┐
          │ fetchRegistry(url)        │  GET /r/button.json → validate Zod
          └────────┬──────────────────┘
                   │
          ┌────────▼──────────────────┐
          │ resolveItems(item, cfg)   │  BFS: button → [utils, label, ...]
          └────────┬──────────────────┘
                   │
          ┌────────▼──────────────────────────┐
          │ For each item's files:            │
          │   transformFile(content, aliases) │  ts-morph rewrite
          │   injectCSSVars(css, item.cssVars)│  CSS injection
          └────────┬──────────────────────────┘
                   │
          ┌────────▼──────────────────┐
          │ writeFiles(files, cwd)    │  mkdir -p + write each file
          └────────┬──────────────────┘
                   │
          ┌────────▼──────────────────────────────┐
          │ runInstall(pm, collectedDeps, cwd)    │  npm/pnpm/yarn/bun add
          └────────┬──────────────────────────────┘
                   │
                   ▼
          Print success summary
```

---

## Module Contracts

### `config.ts`

```typescript
export interface ComponentsConfig {
  $schema?: string
  style: string
  tailwind: {
    config: string       // empty string for Tailwind v4
    css: string
    baseColor: string
    cssVariables: boolean
    prefix?: string
  }
  rsc: boolean
  tsx: boolean
  aliases: {
    utils: string
    components: string
    ui: string
    lib: string
    hooks: string
  }
  registries?: Record<string, string>
}

export function loadConfig(cwd: string): Promise<ComponentsConfig>
export function writeConfig(cwd: string, config: ComponentsConfig): Promise<void>
```

### `registry.ts`

```typescript
export interface RegistryItem {
  name: string
  type: string
  title?: string
  description?: string
  dependencies: string[]
  devDependencies: string[]
  registryDependencies: string[]
  files: RegistryFile[]
  cssVars?: { light?: Record<string, string>; dark?: Record<string, string> }
  css?: string
  docs?: string
}

export function fetchRegistryItem(url: string): Promise<RegistryItem>
export function resolveRegistryURL(name: string, config: ComponentsConfig): string
```

### `resolver.ts`

```typescript
export interface ResolvedTree {
  items: RegistryItem[]
  npmDependencies: string[]
  npmDevDependencies: string[]
}

export function resolveItems(
  names: string[],
  config: ComponentsConfig
): Promise<ResolvedTree>
```

### `transformer.ts`

```typescript
export interface TransformOptions {
  aliases: Record<string, string>  // from→to alias mapping
  tsx: boolean
}

export function transformFile(
  content: string,
  filename: string,
  opts: TransformOptions
): string
```

---

## Registry Item Resolution Rules

### Name formats and how they resolve:

| Input | Resolution |
|---|---|
| `button` | `{config.registries.default}/button.json` |
| `@namespace/button` | Template-fill `config.registries["@namespace"]` with `name=button` |
| `https://example.com/r/button.json` | Fetch directly |
| `./local/button.json` | Read from filesystem |

### URL template syntax:

```
"@cult-ui": "https://cult-ui.com/r/{name}.json"
                                        ↑
                              Replaced with component name
```

---

## Config Schema (components.json)

```typescript
// Zod schema
const configSchema = z.object({
  $schema: z.string().optional(),
  style: z.string(),
  tailwind: z.object({
    config: z.string(),         // "" for Tailwind v4
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
```

---

## Error Handling Strategy

### Error types and handling:

| Error | User Message | Recovery |
|---|---|---|
| `components.json` not found | "No components.json found. Run `init` first." | Prompt to run init |
| Registry fetch 404 | "Component 'X' not found in registry." | List available components |
| Registry fetch network error | "Could not reach registry. Check your connection." | Suggest `--offline` |
| Schema validation fail | "Registry returned invalid data for 'X'." | Show Zod error path |
| File write conflict | "File already exists: X. Use --overwrite to replace." | Skip or overwrite |
| npm install fail | "Dependency install failed. Run manually: `pm add X Y`" | Print command to copy |
| No framework detected | "Could not detect framework. Please specify in components.json." | Prompt |

All errors use a consistent format:
```
✗  Error: [short message]
   [detail line]
   [action line]
```

---

## Testing Strategy

### Unit tests (fast, no file system)
- `resolver.ts`: BFS handles cycles, multiple roots, URL deps
- `transformer.ts`: Import rewriting covers all alias forms
- `config.ts`: Schema validation rejects bad inputs
- `registry.ts`: URL resolution for all name formats
- `pm.ts`: Package manager detection + command generation

### Integration tests (temp directories)
- `init` command: full run against fixture projects (next, vite)
- `add` command: fetch from local mock registry, write correct files
- `build` command: reads source files, outputs valid registry JSON

### Fixture projects
Stored in `packages/cli/tests/fixtures/`:
- `next-app/` — minimal Next.js App Router project
- `vite-react/` — minimal Vite + React project
- `no-framework/` — plain Node project (tests unknown framework path)

---

## Performance Considerations

- **Registry fetches**: Parallel fetch all deps simultaneously (Promise.all)
- **File transforms**: Can be parallelized per file
- **Install**: Single install call with all packages batched
- **No caching in v1**: Keep it simple; add a local cache layer in v2 if needed
- **Bundle size of CLI**: Target < 5MB for the dist bundle (not install size — ts-morph + TypeScript in node_modules will be larger, which is normal for CLIs in this category); avoid heavy deps in the CLI itself
