---
title: npm Package
createTime: 2026/09/05 12:00:00
permalink: /en/guide/npm-package/
---

Besides cloning the source and running it directly, Shirone is also published as the ==`shirones`== npm package. npm package mode needs no clone and no Astro starter — one command in any empty folder initializes a complete blog, with routes, layouts, components, styles and the Markdown pipeline all provided by the package.

## Two Ways to Use It

| | Source mode | npm package mode |
| :--- | :--- | :--- |
| Get it | `git clone` the theme repo | `npx shirones init` |
| Content & config | `src/content/`, `src/config/` | `shirones/content/`, `shirones/config/` |
| Theme code | Checked out with the repo, directly editable | Comes from the package in `node_modules` |
| Theme upgrades | `git pull` and merge | Bump the `shirones` dependency version |
| Overriding components | `src/components/` | `src/components/` (same) |

::: tip Who is it for?
npm package mode suits users who want to stay fully decoupled from the theme code and manage their blog like any ordinary dependency. If you prefer to edit the theme source directly, keep using source mode.
:::

## Requirements

- [Node.js](https://nodejs.org/) ==**22.12** or higher==
- [pnpm](https://pnpm.io/) (recommended; npm and yarn also work)

## Quick Start

```bash
mkdir my-blog
cd my-blog
npx shirones init
pnpm dev
```

Once the server starts, open `http://localhost:4321` in your browser.

::: tip No Astro setup needed
`init` writes a `package.json` and installs `astro`, the theme and all of its peer dependencies for you, so there is no need to run `pnpm create astro` first or install anything by hand.
:::

## What `init` does

On the first run in an empty folder, `npx shirones init`:

1. Creates `astro.config.mjs` and registers the theme integration (an existing config that does not register the theme is backed up and replaced);
2. Creates the `shirones/` directory with the typed configuration, example content and static assets;
3. Creates `src/content.config.ts` to register the content collections;
4. Merges static assets into `public/` (favicons, banners, demo images, …; ==existing files are never overwritten=={.tip});
5. Writes root files (`.gitignore`, `.env.example`, `pagefind.yml`, …), again without overwriting anything;
6. Writes `tsconfig.json` with the theme path aliases (`@/`, `@components/`, …);
7. Writes `package.json` (dependencies plus `dev`/`build`/`preview` scripts) and approves the `sharp` and `esbuild` install scripts;
8. Installs all dependencies automatically.

## Project Layout

```text
my-blog/
├── astro.config.mjs        # the only Astro config
├── src/
│   ├── content.config.ts   # one line: defineCollections()
│   ├── components/         # drop a file here to override a theme component
│   └── layouts/            # …same for layouts
├── shirones/
│   ├── config/             # typed site configuration
│   │   └── data/           # friends, projects, skills, timeline, …
│   └── content/            # posts, moments, about
├── public/                 # static assets
└── package.json
```

## Configuring Your Site

Every module under `shirones/config/` shadows the theme's default of the same name and keeps full TypeScript types:

```ts title="shirones/config/siteConfig.ts"
import type { SiteConfig } from "@/types/config";

export const siteConfig: SiteConfig = {
  site: "https://example.com/",
  title: "My Blog",
  themeColor: { hue: 315, fixed: false, style: "tonalSpot", spec: "2025" },
  // …
};
```

Delete a file to fall back to the theme default.

## Overriding Components and Layouts

Mirror the theme's structure inside your own `src/components/` or `src/layouts/`:

```text
src/components/atoms/blog/PostCard.astro   ← replaces the theme's PostCard
src/layouts/Layout.astro                   ← replaces the theme's Layout
```

Or wire it explicitly in `astro.config.mjs`:

```js title="astro.config.mjs"
shirones({
  components: {
    "atoms/blog/PostCard": "./src/components/MyPostCard.astro",
  },
})
```

See `manifest.json` inside the package for the full list of overridable components, layouts and config modules.

## Writing Posts

Posts live in `shirones/content/posts/` and support both Markdown and MDX — just create a file (npm package mode does not provide the `pnpm new-post` scaffold command from source mode). The frontmatter fields are identical to source mode.

## Updating and Drift Checking

- Running `npx shirones init` again does not re-initialize; it enters ==drift check and repair=={.tip} mode, reporting missing or stale files and safely restoring them — ==your files are never overwritten=={.tip};
- Add `--force` to overwrite with the template files;
- `npx shirones info` prints the package's resolved paths, content directory and route injection status.

## About pnpm's Build-Script Approval

pnpm 10+ refuses to run a dependency's install script until you approve it, and the theme needs two: `sharp` (image optimisation) and `esbuild` (loading your TypeScript config). `init` writes the approval into `pnpm-workspace.yaml` before installing, so the normal flow never hits `ERR_PNPM_IGNORED_BUILDS`. You only see it if you run `pnpm add shirones` yourself before `init` — in that case run `npx shirones init` once and then `pnpm install`.

## Deployment

npm package mode deploys exactly like source mode: set `site` and `base` in `shirones/config/siteConfig.ts`, then run:

```bash
pnpm install --frozen-lockfile
pnpm build
```

On your hosting platform, set the build command to `pnpm build` and the output directory to `dist`. See [Deployment](/en/guide/deploy/vercel/).

---

## Next Steps

- Back to [Get Started](/en/guide/get-started/) for the source-mode local workflow
- Read [Project Structure](/en/guide/project-structure/) for the directory conventions shared by both modes
- Head to [Site Configuration](/en/guide/layout/site-config/) for the full configuration reference
