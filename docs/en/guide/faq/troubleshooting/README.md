---
title: Troubleshooting
createTime: 2026/09/01 01:00:00
permalink: /en/guide/faq/troubleshooting/
---

A symptom-based troubleshooting manual. Universal principle: **read the build log's error line → compare against recent changes → clear caches and retry → then check this page**. Feature-specific FAQs live on their own doc pages; this page only collects cross-section issues.

## Build Stage

**`Unsupported engine` / `only-allow pnpm` errors**

Node or package manager versions don't meet requirements. Confirm Node.js ≥ 22.12, use pnpm 9.x (repo pins `pnpm@9.14.4`); `corepack enable` aligns versions. See [Get Started](/en/guide/get-started/).

**`spawn EPERM` / esbuild launch failure**

An occasional process-permission issue (common with Windows security software or sandboxed environments). A single retry usually recovers; if persistent, whitelist the project directory in your security software.

**Content frontmatter validation failed**

Shirone's first build step, `content:sync`, validates all frontmatter and `config/*.yaml` types. Fix the file and line the error points to; being a separate step means content issues and build issues separate naturally in logs.

**YAML syntax errors**

Check spaces after colons, indentation consistency, and quoting of special characters. See [Frontmatter](/en/guide/frontmatter/#yaml-syntax-notes).

## Pages and Content

**Posts / moments not showing**

Check in order: is `draft` `true` → frontmatter syntax → file location (`src/content/posts/`, `src/content/moments/`) → did you rebuild.

**Entries (projects/skills etc.) added but not showing**

Three layers: page `enable` → does the entry's category key exist in `categories` → is it hit by a disable list (`disabledKeys` / `disabledNames` / `disabledTitles` / `disabledIds`).

**Icons render as squares**

An iconify set isn't installed: `pnpm add @iconify-json/<set>` then rebuild. Confirm the set at [icones.js.org](https://icones.js.org/). Note different contexts use different sets (the sidebar uses `ri:*`; Shirone's internals mostly use `material-symbols:*`).

**Enhancement syntax displays as-is**

Most container syntaxes have strict structure requirements; invalid input is intentionally kept as ordinary Markdown. Fix the structure against the [Writing section](/en/guide/writing/markdown/) examples.

**Markdown changes don't take effect in dev**

Astro dev cached stale compilation results (new CSS appears but the new DOM doesn't—a typical signal):

```bash
# stop the dev server first
# Windows PowerShell
Remove-Item -LiteralPath ".astro/data-store.json" -Force
pnpm dev
```

Only clear `node_modules/.vite` and the whole `.astro` when Svelte scope hashes or Stylus output are also inconsistent.

## Feature Malfunctions

**Search unavailable (404 on /pagefind/*)**

The Pagefind index is generated at the end of `pnpm build` into `dist/pagefind/`. Check that deploy artifacts are complete—easiest to miss in custom CI; confirm the build command wasn't reduced to a bare `astro build`.

**Comments / music / stats widgets don't appear**

All three silently disable when config is incomplete (zero DOM, no error). Check the corresponding config's enable and required fields: comments in [Comment System](/en/guide/article/comments/), music's triple condition in [Music Player](/en/guide/widgets/music/), Umami's resolution rules in [Umami Analytics](/en/guide/features/umami/).

**Sidebar icons are blank**

Sidebar icons use the Remix Icon (`ri:*`) set, which doesn't share names with the theme's internal `material-symbols:*`. Confirm valid names at [icones.js.org](https://icones.js.org/) under the Remix Icon collection.

**Styles look wrong (colors/radii/spacing)**

Check in order: is the DOM correct (do component classes exist) → does the stylesheet contain the rule → is the computed style overridden (cascade layers / Typography ownership). The order must be DOM → stylesheet → computed style → cache.

## Deployment

**Works locally, broken online**

Compare environments: `site`/`base` config, artifact upload completeness (including hidden files), platform caching. Platform-specific issues live in each [deployment page](/en/guide/deploy/vercel/)'s FAQ.

**404 after deployment**

Check the platform build command and output directory (`pnpm build` → `dist`), `base` config vs. the access path, and static server try_files rules (see [Server Deployment](/en/guide/deploy/server/)).

**Platform builds time out**

Shirone's build chain is long. Enable platform build caching, or switch to CI-built artifact delivery per the theme repo's `deploy.yml.example`.

## Universal Tools

| Tool | Command | Purpose |
| --- | --- | --- |
| Type diagnostics | `npx astro check` | Config and page syntax; must report 0 errors |
| Type checking | `pnpm type-check` | Deep TypeScript checks |
| Full rebuild | `pnpm build` | Content/font/schema verification |
| Clear cache & restart | delete `.astro/data-store.json`, then `pnpm dev` | Stale Markdown compilation cache |
| Preview artifacts | `pnpm preview` | Distinguish "build issue" from "deploy issue" |

::: warning Before Committing
`pnpm format` (Biome formatting) is mandatory before committing, and `npx astro check` must report zero errors.
:::

Still stuck after all this? File a [high-quality Issue](/en/guide/faq/asking-questions/) in the theme repository.