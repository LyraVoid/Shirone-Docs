---
title: Quick Start
createTime: 2026/08/31 21:30:00
permalink: /en/guide/get-started/
---

Shirone supports both single-repo and dual-repo modes. This guide explains how to prepare your environment, choose a route, run the site locally, and publish your first post.

## Choose a route

| | Single repo | Dual repo |
| --- | --- | --- |
| Where posts live | `src/content/` in the theme repo | A separate content repo |
| Who it suits | First blog, content can be public | Private drafts, or long-term theme updates |
| Extra work | None | One more repository and a content source |

::: tip Not sure yet?
Start with the single repo. You can split later with `pnpm content:eject`, which moves existing posts and configuration into a new repository without rewriting anything.
:::

## Route A: single repository

::: steps

1. **Install requirements**

   You need Node.js 26.13 or later, pnpm 11.28.2, and Git.

   ```bash
   node -v   # should be >= v26.13.0
   pnpm -v   # should be 11.x
   ```

   If pnpm is missing, run `npm install -g pnpm@11.28.2`. Node.js 26 no longer bundles corepack, so `corepack enable` reports a missing command.

2. **Clone the theme and start it**

   ```bash
   git clone https://github.com/LyraVoid/Shirone.git
   cd Shirone
   pnpm install
   pnpm dev
   ```

   Open `http://localhost:4321` in your browser.

   You can also initialize an empty directory with the npm package: `npx shirones init`. See [npm package](/en/guide/npm-package/).

3. **Set site details**

   At minimum, change two fields in `src/config/siteConfig.ts`:

   | Field | Purpose |
   | --- | --- |
   | `site` | Production URL, used by RSS, the sitemap, and share cards |
   | `title` | Site name |

   Profile, navigation, and sidebar live in `profileConfig.ts`, `navBarConfig.ts`, and `sidebarConfig.ts`. Other configuration files are covered on matching feature pages.

4. **Write your first post**

   ```bash
   pnpm new-post my-first-post
   ```

   The file is created in `src/content/posts/`. Markdown and MDX are supported. Minimal frontmatter:

   ```yaml
   ---
   title: My first post
   published: 2026-08-26
   description: A short summary shown in lists and search results.
   tags: [Astro, Notes]
   category: Writing
   ---
   ```

5. **Build and publish**

   ```bash
   pnpm build
   ```

   Output is written to `dist/`. To choose a host, see [Deployment Overview](/en/guide/deploy/overview/). Every platform uses `pnpm build` and publishes `dist`. The platform pages explain the extra settings needed for each host.

:::

::: warning Windows
If PowerShell blocks scripts, use `pnpm.cmd` and `npx.cmd` instead of `pnpm` and `npx`.
:::

## Route B: dual repository

Work through the steps in order. Each step is self-contained, so you can stop after any of them.

::: steps

1. **Understand the repository split**

   Read [Architecture Overview](/en/guide/content-separation/concepts/) and decide whether you need two repositories.

2. **Create the content repository**

   [Move content out of the theme repo, or clone the official template](/en/guide/content-separation/init-repo/).

3. **Run the site locally**

   [Point the theme repo at the content repo](/en/guide/content-separation/local-preview/) and confirm the site reads your posts.

4. **Configure the content source**

   Use `.env` locally and platform environment variables in production. See [Content Sources](/en/guide/content-separation/content-sources/).

5. **Customize the site with YAML**

   Title, navigation, and sidebar are configured in the content repo. See [Configuration Overlay](/en/guide/content-separation/config-overlay/).

6. **Set up automatic publishing**

   Build on every push with [Cross-Repo CI](/en/guide/content-separation/ci-dispatch/), or use [deployment hooks](/en/guide/content-separation/deploy-hooks/).

:::

After step 3, day-to-day writing only requires the content repository. The theme repo stays untouched.

## Requirements

| Dependency | Version | Notes |
| --- | --- | --- |
| Node.js | 26.13.0 or later | Required by `engines.node` |
| pnpm | 11.28.2 | Pinned in the repo; other 11.x versions usually work |
| Git | Recent version | Needed for the dual-repo setup |

## Common commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm new-post <name>` | Create a post |
| `pnpm content:sync` | Copy the content repo into the theme repo (dual repo) |
| `pnpm content:validate` | Check content structure and YAML |
| `pnpm build` | Full build into `dist/` |
| `pnpm preview` | Preview the build output locally |
| `pnpm check` | Run Astro diagnostics |
| `pnpm type-check` | Run TypeScript checks |
| `pnpm format` | Format code under `src/` |

## Next steps

- Single repo: open [Deployment Overview](/en/guide/deploy/overview/) and pick a host.
- Dual repo: read [Architecture Overview](/en/guide/content-separation/concepts/).
- Feature tour: read [Introduction](/en/guide/intro/).
