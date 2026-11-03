---
title: Get Started
createTime: 2026/08/31 21:30:00
permalink: /en/guide/get-started/
---

Set up your own Shirone blog from scratch.

::: tip Don't want to clone the repository?
Shirone is also published as the `shirones` npm package — run `npx shirones init` in an empty folder to initialize your blog. See [npm Package](/en/guide/npm-package/).
:::

## Requirements

- [Node.js](https://nodejs.org/) ==**26.13.0** or higher== (Node.js 26 LTS)
- [pnpm](https://pnpm.io/) **11.x** (the repo is pinned to `pnpm@11.28.2`)
- [Git](https://git-scm.com/)

Once installed, verify the versions in your terminal:

```bash
node -v   # should be >= v26.13.0
pnpm -v   # should be 11.x
```

::: tip Don't have pnpm?
Install the pinned version globally:

```bash
npm install -g pnpm@11.28.2
```

Node.js 25+ no longer bundles corepack, so Node.js 26 reports `corepack: command not found`. If you still want corepack, run `npm install -g corepack` first.
:::

## Local Development

```bash
git clone https://github.com/LyraVoid/Shirone.git
cd Shirone
npm install -g pnpm@11.28.2
pnpm install
pnpm dev
```

Once the server starts, open `http://localhost:4321` in your browser.

::: warning Windows Users
If the PowerShell script execution policy blocks commands, use `pnpm.cmd` and `npx.cmd` instead.
:::

## Customize Your Site

1. Set the official URL, title, language, theme, banner and display options in `src/config/siteConfig.ts`.
2. Update your profile and navigation in `src/config/profileConfig.ts` and `src/config/navBarConfig.ts`.
3. Go through the configuration files under `src/config/`; inline comments explain the defaults and available options.
4. Replace the sample posts, personal data and media assets in `src/content/`, `src/data/` and `public/`.

### Core Configuration

| File | Purpose |
| --- | --- |
| `src/config/siteConfig.ts` | Site URL, identity, language, dynamic colors, banner, textures, TOC and display settings |
| `src/config/profileConfig.ts` | Author profile and social links |
| `src/config/navBarConfig.ts` | Primary navigation |
| `src/config/sidebarConfig.ts` | Sidebar layout, widgets and page filtering |
| `src/config/postListConfig.ts` | Pagination and list/grid display |
| `src/config/articleConfig.ts` | Update notices, related posts and article sharing |
| `src/config/commentConfig.ts` | Optional comment service |
| `src/config/musicConfig.ts` | Optional local, custom, Meting or mixed music sources |
| `src/config/animeConfig.ts` | Anime page with local/Bangumi/Bilibili snapshot data sources |

See `src/config/README.md` in the theme repository for the full configuration contract.

## Writing Posts

Posts live in `src/content/posts/` and support both Markdown and MDX.

Create a new post with the scaffold command, then edit the file:

```bash
pnpm new-post my-first-post
```

Minimal frontmatter example:

```yaml
---
title: My First Post
published: 2026-08-26
description: A short summary shown in the post list and metadata.
image: ./cover.webp
tags: [Astro, Notes]
category: Writing
draft: false
---
```

Common optional fields include `updated`, `pinned`, `comment`, `lang`, `encrypted`, `password`, `passwordHint` and `hideHomeContent`.

Images can be remote URLs, absolute paths starting from `public/`, or paths relative to the post file.

## Common Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the dev server |
| `pnpm new-post <filename>` | Create a new post |
| `pnpm format` | Format code with Biome (required before committing) |
| `pnpm check` | Run Astro diagnostics |
| `pnpm type-check` | Run TypeScript checks |
| `pnpm test` | Run Playwright tests |
| `pnpm build` | Build the site and Pagefind index into `dist/` |
| `pnpm preview` | Preview the production build |

## Deployment

Shirone generates a static `dist/` directory that can be deployed to Vercel, Netlify, GitHub Pages or any static hosting service.

Before deploying, update `site` and `base` (single repo: `src/config/siteConfig.ts`; dual repo: `config/site.yaml` in the content repo), then run:

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm type-check
pnpm build
```

On your hosting platform, set the build command to `pnpm build` and the output directory to `dist`.

## Content Separation (Optional)

If you prefer to manage theme code and personal content in separate repositories (e.g. keep the content repo private), use the official companion repository [Shirone-Content](https://github.com/LyraVoid/Shirone-Content): put posts, moments, data, media and the `config/*.yaml` content overrides into an independent repository, then point the theme repo to it.

Most users can write inside `src/content/` of the theme repo. See the [Content Separation Overview](/en/guide/content-separation/concepts/) for details.

---

## Next Steps

- Review the [Introduction](/en/guide/intro/) to learn about Shirone's design philosophy and key features
- Read the [Content Separation Overview](/en/guide/content-separation/concepts/) to explore dual-repo decoupled architecture
