# Contributing

## Setup

```bash
git clone https://github.com/YOUR_USERNAME/component-library-cli
cd component-library-cli
pnpm install
```

## Development

```bash
# Run tests in watch mode
pnpm test

# Typecheck
pnpm --filter @complib/cli exec tsc --noEmit

# Try the CLI locally (runs from source via tsx, no build needed)
node packages/cli/bin/index.dev.mjs --help
node packages/cli/bin/index.dev.mjs build   # from packages/registry/
```

## Project layout

```
packages/
  cli/          The npm-publishable CLI (Commander.js + @clack/prompts)
    src/
      cli/      Entry point and command wiring
      commands/ init, add, build, list, info
      schemas/  Zod schemas for config and registry items
      utils/    pm, resolver, transformer, registry, fs, css, logger
  registry/     Component sources + registry.json
    src/        Component .tsx files (one folder per component)
    public/r/   Built output — checked in so hosting is optional
```

## Adding a component to the registry

1. Create `packages/registry/src/<name>/<name>.tsx`
2. Add an entry to `packages/registry/registry.json`
3. Run `pnpm --filter @complib/registry run build:registry`
4. Commit both the source and the built `public/r/<name>.json`

## Submitting a PR

- Keep PRs focused — one feature or fix per PR
- All tests must pass (`pnpm test`)
- Typecheck must be clean (`tsc --noEmit`)
- No new dependencies without discussion first
