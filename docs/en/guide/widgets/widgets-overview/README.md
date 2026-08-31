---
title: Widgets Overview
createTime: 2026/09/01 00:40:00
permalink: /en/guide/widgets/widgets-overview/
---

The sidebar consists of 8 widgets, orchestrated via the `components` array in `sidebarConfig.ts`. This page is the contract overview—where each widget gets its data, how it renders, and where it shows by default. For orchestration (slot/column/pages) see [Sidebar Layout](/en/guide/layout/sidebar/).

## Widget Contract Overview

| type | Widget | Data source | Default slot | Presentation & role |
| --- | --- | --- | --- | --- |
| `profile` | Profile card | `profileConfig.ts` | `top` | Avatar, name, bio, social links |
| `music` | Music player | `musicConfig.ts` / `data/music.ts` / Meting | `top` | M3 card player; playback persists across navigation |
| `announcement` | Site announcement | `announcementConfig.ts` | `top` | Plain card (no title shell), dismissible with memory |
| `categories` | Category list | Auto-aggregated from posts (`getCategoryList()`) | `sticky` | Category list, collapsible |
| `tags` | Tag list | Auto-aggregated from posts (`getTagList()`) | `sticky` | Tag chip list, collapsible |
| `stats` | Site stats | Memoized site computations | `top` | Total words, post count, running days, etc. |
| `calendar` | Monthly post calendar | Post date aggregation | `top` | Calendar view (Svelte hydration island) |
| `toc` | Current post TOC | Current page's Markdown headings | `sticky` | Smooth position highlighting, independently scrollable |

## Orchestration Recap

Each component entry supports these common properties (detailed semantics in [Sidebar Layout](/en/guide/layout/sidebar/)):

```ts
{
  type: "announcement",
  enable: true,           // per-widget switch
  slot: "top",            // "top" fixed | "sticky" scroll-pinned
  column: "primary",      // "primary" main | "secondary" secondary (dual mode)
  pages: ["home"],        // page range filter; omitted = all pages
  collapseAfter: 5,       // collapse threshold (categories/tags only)
}
```

## Default Orchestration

The theme's default dual-column arrangement:

- **Main** (left): profile (top) → music (top) → announcement (top, home only) → categories (sticky) → tags (sticky)
- **Secondary** (right): stats (top, home/archive/categories/tags) → calendar (top) → toc (sticky, posts only)

## Where to Configure Each Widget

| Widget | Config file | Dedicated page |
| --- | --- | --- |
| profile | `profileConfig.ts` | [Footer & Profile](/en/guide/layout/footer-profile/) |
| music | `musicConfig.ts` | [Music Player](/en/guide/widgets/music/) |
| announcement | `announcementConfig.ts` | [Announcement](/en/guide/widgets/announcement/) |
| toc | `siteConfig.toc` (depth/switch) | [Site Config](/en/guide/layout/site-config/) |
| categories / tags / stats / calendar | None (auto-aggregated) | [Basic Widgets](/en/guide/widgets/basic-widgets/) |

## Widget Design Conventions (Theme Internals)

These conventions explain much of the theme's behavior:

1. **Zero overhead**: optional widgets (music, announcement) output no DOM and make no requests when disabled or empty
2. **Persistent frame**: the sidebar lives outside the Swup container—no rebuild on navigation; music progress and collapse states persist
3. **Auto data**: categories/tags/stats/calendar aggregate from posts automatically—nothing to maintain manually
4. **Mobile complementarity**: the desktop sidebar TOC hands over to the FAB floating TOC on mobile/tablet (see [Floating Controls](/en/guide/article/fab/))

## FAQ

::: collapse
- Show a widget only on specific pages

  Use `pages` filtering. The identifier list is in [Standalone Pages Overview](/en/guide/pages/pages-overview/).

- Reordering widgets

  The `components` array order is the render order (within each column)—just reorder the array.

- I don't want the sidebar at all

  `sidebarConfig.enable: false`; or hide per-page via each entry's `pages` whitelist.
:::
