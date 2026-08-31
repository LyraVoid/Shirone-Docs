---
title: Troubleshooting
createTime: 2026/09/01 01:00:00
permalink: /en/guide/faq/troubleshooting/
---

Symptom-categorized troubleshooting manual. General principle: **Check build log error line numbers → Compare recent changes → Clear cache and retry → Consult this page**. Feature-specific FAQs live in their respective doc pages; this page focuses on cross-cutting issues.

## Build Stage

::: collapse
- `Unsupported engine` / `only-allow pnpm` error

  Node or package manager version does not meet requirements. Confirm Node.js >= 22.12 and use pnpm 9.x (`pnpm@9.14.4` pinned in repo); run `corepack enable` to align versions. See [Get Started](/en/guide/get-started/).

- `spawn EPERM` / esbuild launch failure

  Sporadic process permission issue (common on Windows antivirus or sandboxed runners). Rerunning the build once usually resolves it; add project directory to security whitelist if persistent.

- Content frontmatter validation failure

  The first step `content:sync` validates all frontmatter and `config/*.yaml` types. Correct according to reported file and line numbers; separate steps keep content errors decoupled from build errors in logs.

- YAML syntax errors

  Check space after colons, indentation consistency, and quotation around special characters. See [Frontmatter](/en/guide/frontmatter/#yaml-syntax-notes).
:::

## Pages & Content

::: collapse
- Post or Moment not displaying

  Checklist: Is `draft` set to `true`? → Frontmatter YAML syntax → File location (`src/content/posts/`, `src/content/moments/`) → Did you rebuild?

- Custom items (Projects/Skills/Devices) added but hidden

  Triple check: Page `enable: true` → Item category key exists in `categories` list → Not blacklisted in disabled arrays (`disabledKeys`, `disabledNames`, `disabledTitles`, `disabledIds`).

- Icons display as empty boxes

  Missing Iconify icon set: run `pnpm add @iconify-json/<set-name>` and rebuild. Verify set on [icones.js.org](https://icones.js.org/).

- Markdown enhancements display as raw code

  Container syntax requires strict structures. Ill-formed syntax gracefully falls back to plain Markdown. Compare with examples in [Writing Section](/en/guide/writing/markdown/).

- Markdown edits not updating in dev mode

  Astro dev server cached old compiler output:
  ```bash
  # Stop dev server and run:
  # Windows PowerShell
  Remove-Item -LiteralPath ".astro/data-store.json" -Force
  pnpm dev
  ```
:::

## Runtime & Features

::: collapse
- Search unavailable (404 on /pagefind/*)

  Pagefind indexes are built at the tail of `pnpm build` into `dist/pagefind/`. Ensure deployment artifacts are complete and build command is not reduced to bare `astro build`.

- Comments, Music, or Stats widgets missing

  All three have silent deactivation mechanisms when incomplete. Check `enable` and required config keys: [Comments](/en/guide/article/comments/), [Music Player](/en/guide/widgets/music/), [Umami](/en/guide/features/umami/).

- Sidebar icons empty

  Sidebar icons consume Remix Icon (`ri:*`), which differs from internal `material-symbols:*`. Check valid names on [icones.js.org](https://icones.js.org/).

- Styling glitches (colors/radii/spacing)

  Debug order: DOM correctness → Stylesheet rule inclusion → Computed style override (cascade layer / typography specificity).
:::

## Deployment

::: collapse
- Works locally, fails online

  Compare environments: `site`/`base` configuration, artifact upload completeness (including dotfiles), and CDN cache rules. See [Deployment Section](/en/guide/deploy/vercel/).

- 404 on deployed pages

  Verify build output directory (`dist`), `base` sub-path matching, and static server try_files routing (see [Server Deployment](/en/guide/deploy/server/)).

- Build times out on hosting platform

  Shirone's pipeline is comprehensive. Enable platform build caching, or switch to CI builds delivering pure artifacts via `deploy.yml.example`.
:::

## Common Diagnostics

| Diagnostic | Command | Purpose |
| --- | --- | --- |
| Type Diagnostics | `npx astro check` | Syntax and template checks (must be 0 errors) |
| Type Checking | `pnpm type-check` | TypeScript deep compiler audit |
| Full Rebuild | `pnpm build` | Content, font subset, and schema validation |
| Cache Reset | Delete `.astro/data-store.json` then `pnpm dev` | Stale markdown compilation recovery |
| Local Preview | `pnpm preview` | Differentiate build issues from deployment issues |

::: warning Mandatory Pre-Commit
`pnpm format` (Biome format) is required before commits; `npx astro check` must pass with zero errors.
:::

Still unresolved after all checks? Open a [High-Quality Issue](/en/guide/faq/asking-questions/).
