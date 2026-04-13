# component-library-cli — Docs Index

A shadcn-style CLI for distributing component libraries via copy-paste registry.

## Documents

| File | Contents |
|---|---|
| [01-research-shadcn.md](01-research-shadcn.md) | Deep technical analysis of shadcn/ui CLI internals |
| [02-similar-tools.md](02-similar-tools.md) | Competitive landscape — Aceternity, MagicUI, Cult-UI, OriginUI, Preline |
| [03-technical-patterns.md](03-technical-patterns.md) | Core patterns: registry schema, cn utility, CVA, CLI stack |
| [04-build-plan.md](04-build-plan.md) | Phased implementation plan with tasks and milestones |
| [05-architecture.md](05-architecture.md) | System architecture: monorepo layout, module boundaries, data flow |
| [06-launch-plan.md](06-launch-plan.md) | Go-to-market: versioning, npm publish, docs site, launch checklist |
| [07-example-apps.md](07-example-apps.md) | Sample registries and usage walkthroughs |

## Installed Skills (local)

| Skill | Purpose |
|---|---|
| `arch-tsdown-cli` | tsdown/tsup bundling patterns for CLI packages |
| `component-library` | Component library architecture guidance |
| `npm-package` | npm package setup, package.json best practices |

Skills are in `.agents/skills/` and are available to Claude Code in this project.

## Quick Start (once built)

```bash
# Initialize in a project
npx your-cli@latest init

# Add a component
npx your-cli@latest add button

# Add from a custom registry
npx your-cli@latest add https://your-registry.com/r/card.json
```
