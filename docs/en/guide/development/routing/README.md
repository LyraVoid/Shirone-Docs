---
title: Routing System
createTime: 2026/09/01 03:40:00
permalink: /en/guide/development/routing/
---

Shirone combines Astro file routing with content collections to generate static pages. See [Permalinks](/en/guide/writing/advanced/permalink/) for permalink precedence.

| File | Responsibility |
| --- | --- |
| `src/pages/[...page].astro` | Home page and paginated post lists |
| `src/pages/posts/[...slug].astro` | Default `/posts/<slug>/` article routes |
| `src/pages/[...permalink].astro` | Global templates and custom post permalinks |
| `src/pages/about.astro` and others | About, anime, friends, projects, and standalone pages |
| `src/pages/albums/[id]/index.astro` | Album detail pages |

Creating an `.astro` file under `src/pages/` creates a route but does not add it to navigation. Register it in `src/config/navBarConfig.ts` or the content-repository navigation overlay, and add SEO metadata and an accessible title.

Do not register the same path through multiple entries. When changing a published URL, update permalink handling, the Sitemap, and redirects for the old address.
