---
title: Theme Development & Contribution
createTime: 2026/09/01 03:40:00
permalink: /en/guide/development/theme-contributing/
---

Shirone combines Astro pages with Svelte interactive components. Before adding a feature, decide whether it belongs to static output, client interaction, configuration, or data.

| Type | Location | Convention |
| --- | --- | --- |
| Static pages and layouts | `src/pages/`, `src/layouts/` | Prefer Astro SSR |
| Interactive controls | `src/components/` | Svelte 5 Runes and selective hydration |
| Configuration behavior | `src/config/*Config.ts` | Maintain defaults and types separately |
| Content entities | `src/data/`, `src/content/` | Keep site content out of components |
| Markdown extensions | `src/plugins/markdown/` | Register plugins and styles together |

## Pre-Commit Checks

```bash
pnpm format
pnpm lint
pnpm type-check
npx astro check
pnpm test
pnpm build
```

New components should provide accessible semantics, keyboard behavior, dark-mode styling, and reduced-motion handling. Disabling an optional feature should remove unnecessary scripts, DOM, and external requests.
