---
title: Deploy to EdgeOne Pages
createTime: 2026/08/31 21:54:00
permalink: /en/guide/deploy/edgeone/
---

EdgeOne Pages is a static site hosting platform by Tencent Cloud providing optimized edge delivery for visitors in mainland China.

## Highlights

- Low latency for readers in China via optimized edge nodes
- A free tier that is usually enough for a personal static blog
- GitHub import with builds on push
- Automatic SSL certificates

## Prerequisites

- Code hosted on GitHub
- A Tencent Cloud account
- `site` set to your official domain (single repo: `src/config/siteConfig.ts`; dual repo: `config/site.yaml` in the content repo)

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
   | Node.js Version | `24` |

   EdgeOne currently offers Node.js 24 as its highest selectable version. Shirone builds correctly on Node.js 24. Do not select 26: it is not available on this platform.

5. For dual-repo mode, add `CONTENT_REPO_URL` (private repos: `https://x-access-token:<TOKEN>@github.com/...`), optional `CONTENT_REPO_REF=main`, and `GIT_TERMINAL_PROMPT=0`.

6. Click **Confirm and Deploy**.

:::

## Custom Domains and ICP

- You can bind custom international domains directly with global acceleration.
- For mainland China edge node acceleration, custom domains require an active ICP filing in China.

## FAQ

::: collapse
- Build failure: `npm ERR!` or `only-allow pnpm`

  Ensure the build command uses pnpm (`pnpm build`). If the platform image has an outdated pnpm version causing a lockfile mismatch, change the build command to `npm i -g pnpm@11.28.2 && pnpm build`. EdgeOne has no documented `PNPM_VERSION` variable, and Node.js 24 does not bundle corepack.

- Build failure: Node.js version incompatibility

  Confirm Node.js is configured to `24`. EdgeOne does not offer Node.js 26; selecting a nonexistent version can fall back or fail outright.

- Dual-Repo Mode (Shirone-Content)

  Set `CONTENT_REPO_URL` (private repos: `https://x-access-token:<TOKEN>@github.com/...`), optional `CONTENT_REPO_REF=main`, and `GIT_TERMINAL_PROMPT=0`. `pnpm build` already runs `content:sync`; do not prepend `pnpm content:sync &&`. Site config belongs in the content repo's `config/site.yaml`.

- Search feature is unavailable

  Pagefind index files are output to `dist/pagefind/`. Ensure the entire `dist` output directory is uploaded to EdgeOne Pages.
:::
