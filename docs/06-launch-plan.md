# Launch Plan

---

## Package Naming

Pick one of these approaches before publishing:

| Approach | Example | Pros | Cons |
|---|---|---|---|
| Scoped package | `@yourname/ui` | Namespace-safe, professional | Needs npm org |
| Unscoped | `yourui` | `npx yourui init` is clean | May be taken |
| `add-` prefix | `add-ui` | Descriptive | Unconventional |

**Recommendation**: Go scoped (`@yourname/ui` or `@yourname/cli`). Run:
```bash
npm org create yourname
```

---

## Versioning Strategy

Follow **semantic versioning** with pre-release tags:

```
0.1.0-alpha.1  ← private testing
0.1.0-beta.1   ← public beta (invite-only)
0.1.0          ← first stable release
0.2.0          ← new commands / features
1.0.0          ← stable API, committed to BC
```

**Alpha/Beta**: Use `--tag next` on publish so `npx pkg@latest` doesn't pull it by default.

---

## npm Publishing Checklist

### Before First Publish

- [ ] Final package name decided and available on npm
- [ ] `package.json` fields complete:
  - `name`, `version`, `description`
  - `bin` field pointing to built entry
  - `engines.node: ">=18"`
  - `files: ["dist"]` (don't ship `src/`)
  - `keywords`: `["cli", "components", "shadcn", "tailwind", "react", "ui"]`
  - `repository`, `homepage`, `bugs` URLs
  - `license: "MIT"`
- [ ] `LICENSE` file present (MIT)
- [ ] `.npmignore` or `files` field excludes dev files
- [ ] `npm pack --dry-run` reviewed — nothing sensitive included
- [ ] `prepublish` script runs `build`

### Publish Commands

```bash
# Dry run first
npm publish --dry-run

# Alpha (not tagged latest)
npm publish --tag alpha

# Stable
npm publish --access public
```

### CI Publishing (GitHub Actions)

```yaml
# .github/workflows/publish.yml
name: Publish
on:
  push:
    tags: ['v*']
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: 'https://registry.npmjs.org'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## Registry Hosting

### Option A: Vercel (Recommended for v1)

Host the `www` package (Next.js). Registry JSON served as:
- Static files from `public/r/` → Vercel serves at `https://yourui.com/r/button.json`
- Or Next.js route handlers at `app/r/[name]/route.ts`

**Deploy**:
```bash
vercel --prod
```

**Users install via**:
```bash
npx your-cli add button
# or from custom registry
npx your-cli add https://yourui.com/r/button.json
```

### Option B: GitHub Raw URLs (Zero cost)

Push built registry JSON to a public GitHub repo. Users reference:
```
https://raw.githubusercontent.com/yourname/yourui/main/registry/button.json
```

Downside: No versioning per install, raw URLs are long.

### Option C: npm as Registry Storage

Publish registry JSON as a separate npm package (`@yourname/registry`). The CLI fetches from `unpkg.com` or `jsdelivr.net`:
```
https://cdn.jsdelivr.net/npm/@yourname/registry/r/button.json
```

---

## Docs Site

### Stack

- **Framework**: Next.js App Router (in `packages/www/`)
- **Styling**: Tailwind CSS (dogfood your own library)
- **Component previews**: Live renders inside iframes or direct page embeds
- **Docs**: MDX files with syntax highlighting (shiki)
- **Search**: Fuse.js client-side or Algolia DocSearch

### Site Structure

```
/                    ← Hero, quick-start, install command
/docs                ← Getting started, concepts
/docs/cli            ← CLI reference (init, add, build, search)
/docs/components     ← Component index
/docs/components/button    ← Button docs + live preview
/docs/registry       ← How to build your own registry
/docs/theming        ← CSS variable system
```

### Hero Section Copy

```
Own your components.

Install once, own forever.
No runtime. No black box.
Your code, your rules.

npx yourcli@latest init
```

---

## Pre-Launch Checklist

### Code Quality
- [ ] All Phase 1–4 tasks complete
- [ ] Zero TypeScript errors (`tsc --noEmit`)
- [ ] All tests passing (`vitest run`)
- [ ] `npx your-cli init` works in a fresh Next.js 14 project
- [ ] `npx your-cli init` works in a fresh Vite + React project
- [ ] `npx your-cli add button` works end-to-end
- [ ] `npx your-cli add button card input` (multi-add) works
- [ ] `--dry-run` flag shows correct output without writing
- [ ] `--diff` shows correct unified diff

### Distribution
- [ ] npm package published (alpha tag first)
- [ ] `npx your-cli@latest --version` returns correct version
- [ ] Registry JSON hosted at stable URL
- [ ] All 20+ components built and in registry

### Docs Site
- [ ] Deployed to production URL
- [ ] All component pages have live previews
- [ ] CLI reference complete
- [ ] "Getting started" walkthrough tested end-to-end

### Community
- [ ] GitHub repo public, MIT license
- [ ] README with install + quick-start
- [ ] CONTRIBUTING.md
- [ ] GitHub Issues enabled with templates

---

## Launch Announcements

### Channels

1. **X/Twitter** — Thread showing `init` + `add` in a GIF terminal recording
2. **Hacker News** — "Show HN: A CLI for distributing React components like shadcn"
3. **Reddit** — r/reactjs, r/webdev, r/nextjs
4. **Discord** — Tailwind CSS Discord, shadcn Discord (if community channels allow)
5. **Dev.to** — Tutorial post: "Build your own component library the shadcn way"

### Launch Tweet Template

```
Introducing [name] — a CLI for copy-paste component libraries.

Like shadcn, but for YOUR components.

→ Host your own registry
→ Users run: npx [name] add button
→ They get the code, they own it

npx [name]@latest init

github.com/you/repo
```

### Demo GIF Plan

Record with `vhs` (charm.sh):
1. Fresh Next.js project in terminal
2. Run `npx yourcli init` → show prompts + success
3. Run `npx yourcli add button card` → show registry fetch + file writes
4. Open VS Code showing the written files
5. Show component rendering in browser

---

## Post-Launch Roadmap (v2+)

| Feature | Priority | Why |
|---|---|---|
| Svelte/Vue/Solid support | High | Huge untapped market |
| Private registry auth (Bearer token) | High | Enterprise teams |
| Component versioning (pin to v1.2.0) | Medium | Production stability |
| Registry analytics | Medium | Know what people install |
| MCP server (`shadcn` has one) | Medium | AI assistant integration |
| `update` command (check for registry changes) | Medium | Keep components current |
| Local registry discovery (`npx your-cli search`) | Low | DX improvement |
| GUI (web-based registry browser) | Low | Onboarding |
