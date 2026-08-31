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

::: steps

1. **`content:sync`**: Synchronizes external content repository and validates frontmatter metadata.
2. **Media Preprocessing**: Generates icons and compiles responsive thumbnails for Moments and Posts.
3. **Font Subsetting**: Compresses large CJK web fonts based on configured character sets.
4. **`astro build`**: Compiles Svelte components, Markdown, MDX, and generates static HTML.
5. **`pagefind`**: Builds static search indices in `dist/pagefind/`.
6. **Font Check**: Validates total bundle size budgets and font subset integrity.

:::

## Common Commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Starts local development server with hot module replacement |
| `pnpm build` | Compiles full production static site into `dist/` |
| `pnpm preview` | Serves local `dist/` directory on port 4321 |
| `npx astro check` | Runs TypeScript and Astro component type checks |

## FAQ

::: collapse
- Build succeeds but search returns 404

  The output is missing `pagefind/`. This happens when `astro build` is run directly instead of `pnpm build`.

- Local preview works but online site fails

  Check differences between environments: `site` / `base` configuration, whether hidden files in `dist/` were uploaded, or whether upstream CDN is incorrectly caching HTML files.

- How to speed up previewing without full builds

  Use `pnpm dev` during writing. A complete `pnpm build` is only necessary when building production distribution artifacts.
:::
