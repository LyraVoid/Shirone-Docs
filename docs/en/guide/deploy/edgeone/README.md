---
title: Deploy to EdgeOne Pages
createTime: 2026/08/31 21:54:00
permalink: /en/guide/deploy/edgeone/
---

EdgeOne Pages is a static site hosting platform by Tencent Cloud providing optimized edge delivery for visitors in mainland China.

## Highlights

- Low latency for readers in China via optimized edge nodes
- Generous free tier for personal static blogs
- Direct GitHub integration with build on push
- Automated SSL certificate management

## Prerequisites

- Code hosted on GitHub
- A Tencent Cloud account
- `site` configured in `src/config/siteConfig.ts` with your official domain

## Deployment Steps

::: steps

1. In the [Tencent Cloud Console](https://console.cloud.tencent.com/), search for **EdgeOne Pages**.

2. Click **Create Project → Import Git Repository** and authorize GitHub access.

3. Select your Shirone repository and production branch (`main`).

4. Configure build settings:

   | Setting | Value |
   | --- | --- |
   | Framework | `Astro` |
   | Build Command | `pnpm build` |
   | Output Directory | `dist` |
   | Install Command | `pnpm install` |

5. Under **Environment Variables**, add `NODE_VERSION = 22`.

6. Click **Confirm and Deploy**.

:::

## Custom Domains and ICP

- You can bind custom international domains directly with global acceleration.
- For mainland China edge node acceleration, custom domains require an active ICP filing in China.

## FAQ

::: collapse
- Build failure: `npm ERR!` or `only-allow pnpm`
  Ensure the build command uses pnpm (`pnpm build`). If the platform image has an outdated pnpm version causing lockfile mismatch, set environment variable `PNPM_VERSION=9` or execute `corepack enable && pnpm build`.

- Build failure: Node.js version incompatibility
  Confirm Node.js is configured to `22`. Syntax errors in logs indicate an older Node.js runtime.

- Dual-Repo Mode (Shirone-Content)
  Configure `CONTENT_REPO_URL` in project environment variables. `content:sync` will automatically clone and sync your private content repo at build time.

- Search feature is unavailable
  Pagefind index files are output to `dist/pagefind/`. Ensure the entire `dist` output directory is uploaded to EdgeOne Pages.
:::
