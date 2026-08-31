---
title: Local Build
createTime: 2026/08/31 21:57:00
permalink: /en/guide/deploy/local/
---

Local building is the foundation of all deployment methods. Understanding how the local build pipeline works helps diagnose and troubleshoot issues on remote CI/CD platforms.

## Build Steps

```bash
# 1. Install dependencies using locked versions
pnpm install --frozen-lockfile

# 2. Build production artifacts
pnpm build

# 3. Preview built artifacts locally
pnpm preview
```

The local preview server runs at `http://localhost:4321`.

## What Happens During pnpm build

The Shirone build pipeline performs several automated tasks:

1. `content:sync`: Synchronizes external content repository and validates frontmatter metadata.
2. Icon generation and thumbnail compilation for Moments and Posts.
3. Font subsetting: Compresses large CJK web fonts based on configured character sets.
4. `astro build`: Compiles Svelte components, Markdown, MDX, and generates static HTML.
5. `pagefind`: Builds static search indices in `dist/pagefind/`.

## Common Commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Starts local development server with hot module replacement |
| `pnpm build` | Compiles full production static site into `dist/` |
| `pnpm preview` | Serves local `dist/` directory on port 4321 |
| `npx astro check` | Runs TypeScript and Astro component type checks |
