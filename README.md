# eugui

A shadcn-style CLI for distributing React component libraries via copy-paste.

Users run one command and own the code — no runtime dependency, no black box.

```bash
npx eugui@latest init
npx eugui@latest add button
```

---

## Quick start

### For users (adding components)

**1. Initialize your project**

```bash
npx eugui@latest init
```

Detects your framework and package manager, prompts for aliases and CSS path, then writes `components.json` and `lib/utils.ts`.

**2. Add components**

```bash
# Add one component
npx eugui@latest add button

# Add several at once
npx eugui@latest add button card input

# Interactive picker (no args = multiselect)
npx eugui@latest add

# Preview without writing
npx eugui@latest add button --dry-run
```

**3. Browse available components**

```bash
npx eugui@latest list
npx eugui@latest info button
```

---

## CLI reference

| Command | Description |
|---|---|
| `init` | Set up your project — writes `components.json` and installs base deps |
| `add [components...]` | Copy components into your project |
| `add --dry-run` | Preview what would be written without writing |
| `add --overwrite` | Overwrite existing files without prompting |
| `list` | Show all components available in your registry |
| `info <component>` | Show metadata, deps, and files for a component |
| `build` | Build registry JSON from source (for registry authors) |

---

## For registry authors

### Project structure

```
your-registry/
├── registry.json          ← component manifest
├── src/
│   ├── button/
│   │   └── button.tsx
│   └── utils/
│       └── utils.ts
└── public/
    └── r/                 ← built output (served as static files)
        ├── index.json
        ├── button.json
        └── utils.json
```

### registry.json format

```json
{
  "name": "my-registry",
  "homepage": "https://yoursite.com",
  "items": [
    {
      "name": "button",
      "type": "registry:component",
      "title": "Button",
      "description": "A styled button component.",
      "dependencies": ["class-variance-authority"],
      "devDependencies": [],
      "registryDependencies": ["utils"],
      "files": [
        { "path": "button.tsx", "type": "component" }
      ]
    }
  ]
}
```

### Build and serve

```bash
# Build → public/r/
eugui build

# Custom paths
eugui build --src components --out dist/registry
```

Then deploy `public/r/` as static files (Vercel, GitHub Pages, etc.).

### Point users at your registry

Users add your registry URL to their `components.json`:

```json
{
  "registries": {
    "default": "https://yoursite.com/r"
  }
}
```

---

## Stack

- **Commander.js** — argument parsing
- **@clack/prompts** — interactive terminal UI
- **chalk** — terminal colors
- **ts-morph** — AST-based import rewriting
- **Zod** — schema validation
- **tsdown** — ESM bundler
- **Vitest** — tests

---

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build CLI
pnpm --filter @eugui/cli run build

# Build registry (from packages/registry/)
pnpm --filter @eugui/registry run build:registry
```

---

## License

MIT
