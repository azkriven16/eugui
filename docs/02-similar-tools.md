# Competitive Landscape — Component Library CLIs

> Researched: April 2026

## Summary Table

| Tool | Install Method | CLI? | Own CLI? | Framework | Animations | License |
|---|---|---|---|---|---|---|
| **shadcn/ui** | `npx shadcn@latest add` | Yes | Yes | React / multiple | Optional | MIT |
| **Origin UI** | `npx shadcn@latest add` | Via shadcn | No | React | Minimal | MIT |
| **Magic UI** | `npx shadcn@latest add @magicui/*` | Via shadcn | Was own, merged | React | Framer Motion | MIT |
| **Cult UI** | `npx shadcn@beta add @cult-ui/*` | Via shadcn | No | React | CSS + Motion | MIT |
| **Aceternity UI** | `npx shadcn@latest add https://...` | Via shadcn | No | React | Framer Motion | MIT |
| **Animate UI** | `npx shadcn@latest add @animate-ui/*` | Via shadcn | No | React | Motion | MIT |
| **Preline UI** | `npm install preline` | No | No | Multi | JS-driven | MIT |

---

## shadcn/ui

**The pioneer.** Set the standard for the copy-paste CLI approach.

- **Market share**: 52,100+ websites use it (2025)
- **Architecture**: Registry-based, BFS dependency resolution, AST transforms
- **Key advantage**: First mover, massive ecosystem, framework-agnostic
- **Weakness**: Opinionated Tailwind + Radix dependency chain; not easily adapted for non-Radix component bases

---

## Origin UI

**Broadest coverage.** 400+ components across 25+ categories.

- **Install**: Uses shadcn CLI natively — no separate CLI needed
- **Philosophy**: Free, MIT-licensed "upgrade" to shadcn's built-in components
- **Audience**: Beginners who want more variety without building from scratch
- **Positioning**: "shadcn but more components"
- **Registry**: Follows shadcn registry-item schema exactly
- **Weakness**: No differentiated style — looks like shadcn with more options

---

## Magic UI

**Animation-first.** Framer Motion component companion for shadcn.

- **Install**: `npx shadcn@latest add @magicui/[component]`
- **Key dependency adds**: `framer-motion` (heavy — 100KB+)
- **Init**: Configures `tailwind.config.js` + CSS variables for animations
- **History**: Had own `magicui-cli` package on npm; merged into shadcn registry
- **Niche**: Animated landing page blocks — carousels, marquees, sparkles, etc.
- **Weakness**: Bundle size from Framer Motion; component quality inconsistent

---

## Cult UI

**Design-forward.** Apple OS-inspired, bold animated components.

- **Install**: `npx shadcn@beta add @cult-ui/[component]`
- **Registry config**: Add to `components.json` registries map
- **Tech**: TypeScript + Tailwind CSS v4 + Motion + CSS animations
- **Build**: `pnpm build:registry` generates registry from source
- **Sample components**: texture-card, text-gif, floating-panel, sidebar
- **Strength**: Distinctive visual style not found elsewhere
- **Weakness**: Smaller component set; "beta" maturity

---

## Aceternity UI

**Premium animations.** Best-known for scroll-triggered and 3D effects.

- **Install v1**: `npx shadcn@latest add https://ui.aceternity.com/registry/[component].json`
- **Install v2**: `npx shadcn@latest add @aceternity/[component]` (namespaced)
- **Philosophy**: "copy-paste owned code"
- **Standout components**: 3D card, spotlight, moving border, glare card
- **Use case**: Landing pages, portfolio sites, SaaS marketing pages
- **Weakness**: Many components require Framer Motion; can be heavy for prod apps

---

## Animate UI

**Motion primitives.** Extends shadcn with animated versions of base primitives.

- **Built on**: React + TypeScript + Tailwind CSS + Motion (Framer Motion)
- **Install**: `npx shadcn@latest add @animate-ui/[component]`
- **Approach**: Each component is an animated wrapper over a shadcn primitive
- **MIT licensed**, fully open-source
- **Strength**: Complements shadcn instead of replacing it
- **Weakness**: Directly couples to Motion library

---

## Preline UI

**Traditional npm package.** Not copy-paste — distributed as an npm module.

- **Install**: `npm i preline` (plus `npm install -D @tailwindcss/forms`)
- **Setup**: Manually add JS path + CSS variants import to Tailwind config
- **Requires**: Tailwind Forms plugin, JavaScript runtime for interactivity
- **Frameworks**: Vue, Angular, Laravel, Solid.js, React
- **Strength**: Widest framework support; largest component set
- **Weakness**: Black-box — you don't own the code; harder to customize deeply

---

## Key Takeaways for Building Your Own CLI

### What the market lacks:
1. **Non-React support** — all copy-paste CLIs are React-only (Svelte, Vue, Solid opportunity)
2. **Framework-agnostic registry** — ability to serve components for multiple frameworks from one registry
3. **Theming beyond CSS vars** — most assume Tailwind; opportunity for style-token-based theming
4. **Component versioning** — no tool currently lets you pin to a component version
5. **Registry analytics** — no visibility into which components users install
6. **Private registries with auth** — shadcn registries are all public; enterprise teams want private ones

### What you must have to compete:
- Namespace support (`@yourlib/component`)
- BFS dependency resolution
- Framework detection (Next.js, Vite at minimum)
- Package manager detection
- Tailwind v4 support (no config file)
- Interactive prompts (clack or inquirer)
- TypeScript-first
