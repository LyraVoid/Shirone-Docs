---
title: Standalone Pages Overview
createTime: 2026/09/01 00:20:00
permalink: /en/guide/pages/pages-overview/
---

Shirone ships with a set of standalone personal pages: About, Moments, Friends, Albums, Anime, Compass, Skills, Projects, Devices, and Timeline. This page explains their overall organization—the enable system, navigation linkage, and page identifiers. Page-specific configs follow in later pages.

## Page List

| Page | URL | Data/Content Source | Behavior Config |
| --- | --- | --- | --- |
| About | `/about/` | `src/content/spec/about.md` | None (plain Markdown) |
| Moments | `/moments/` | `src/content/moments/*.md` | None dedicated |
| Friends | `/friends/` | `src/data/friends.ts` | None (data is content) |
| Albums | `/albums/` | Album data | Encryption protected |
| Anime | `/anime/` | `src/data/anime.ts` or snapshots | `animeConfig.ts` |
| Compass | `/compass/` | `src/data/compass.ts` | None dedicated |
| Skills | `/skills/` | `src/data/skills.ts` | `skillsConfig.ts` |
| Projects | `/projects/` | `src/data/projects.ts` | `projectsConfig.ts` |
| Devices | `/devices/` | `src/data/devices.ts` | `devicesConfig.ts` |
| Timeline | `/timeline/` | `src/data/timeline.ts` | `timelineConfig.ts` |

## Enable System and Navigation Linkage

Pages with behavior configs (Skills, Projects, Devices, Timeline, Anime) share one rule:

```ts
enable: true,   // when false:
                // 1. the navigation entry hides automatically
                // 2. direct visits to the page return 404
```

Disabling a page **requires no navbar changes**—nav entries are conditionally mounted on each page's `enable` (see the `more` group section in [Navigation Bar](/en/guide/layout/navbar/)).

Content-only pages (About, Moments, Friends, etc.) have no switch and always exist; to remove one, simply drop its entry from the navigation (stop referencing the preset).

## Config / Data Separation

This is the core principle for all page configs (see [Site Config](/en/guide/layout/site-config/#configuration-data-separation)):

| Question | Belongs to | Location |
| --- | --- | --- |
| Page on/off? Category order? Disable one item? | **Config** | `src/config/xxxConfig.ts` |
| The actual entries shown on the page? | **Data** | `src/data/xxx.ts` |

Taking the skills page as an example: `skillsConfig.enable` toggles the page, `categories` orders the filter chips, `disabledNames` disables individual skills—while skill names, levels, icons, and descriptions all live in `src/data/skills.ts`.

## Page Identifiers (pages)

Every page has a unified identifier used for `pages` filtering in sidebar widgets and the FAB:

```text
home | archive | friends | moments | anime | compass | skills |
projects | devices | timeline | albums | about | post | categories | tags
```

For example, the announcement widget defaults to `pages: ["home"]` and the floating TOC to `pages: ["post"]` (see [Sidebar Layout](/en/guide/layout/sidebar/) and [Floating Controls](/en/guide/article/fab/)).

## Navigation Mounting

All page URLs are registered in the `LinkPresets` table. The default navbar mounts common pages directly and folds low-frequency pages (Timeline, Projects, Devices, Skills) into the "More" dropdown—also conditional on each `enable`. See [Navigation Bar](/en/guide/layout/navbar/) for adjustments.

## FAQ

::: collapse
- What happens to old links after disabling a page

  Direct visits return 404. If the page was indexed by search engines, configure 301 redirects at the hosting platform level.

- Can I change a page's URL

  The `url` in presets can be overridden via custom links (e.g. `/moments/` → `/say/`), see the custom links section in [Navigation Bar](/en/guide/layout/navbar/).

- Adding my own standalone page

  Create an Astro page under `src/pages/`—but it won't automatically get navigation entries or widget filtering; register it in `LinkPresets`.
:::
