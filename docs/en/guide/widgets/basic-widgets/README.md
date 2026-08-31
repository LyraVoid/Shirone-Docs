---
title: Basic Widgets
createTime: 2026/09/01 00:43:00
permalink: /en/guide/widgets/basic-widgets/
---

Six widgets aggregate data automatically and need no dedicated config file: Categories, Tags, Site Stats, Calendar, TOC, and the Profile card. Their only "configuration" is the orchestration properties (switch, position, page filter, collapse threshold) on their `sidebarConfig` entries.

## Categories

- **Data source**: aggregated from all posts' `category` field (`getCategoryList()`), with per-category counts
- **Rendering**: category list; clicking navigates to the categories page
- **Dedicated property**: `collapseAfter`—collapses beyond the count with an expand button (default 5)

```ts
{ type: "categories", enable: true, slot: "sticky", collapseAfter: 5 }
```

## Tags

- **Data source**: aggregated from all posts' `tags` (`getTagList()`)
- **Rendering**: tag chip list
- **Dedicated property**: `collapseAfter` (default 6)

```ts
{ type: "tags", enable: true, slot: "sticky", collapseAfter: 6 }
```

## Site Stats (stats)

- **Data source**: memoized site computations (total words, post count, running days, etc.)
- **Rendering**: key-value grid
- **Note**: heavy shared computations are memoized—repeated rendering costs nothing extra

```ts
{ type: "stats", enable: true, slot: "top", column: "secondary",
  pages: ["home", "archive", "categories", "tags"] }
```

## Calendar

- **Data source**: post date aggregation (per-month publishing)
- **Rendering**: month calendar view with publishing days highlighted; a Svelte hydration island (`client:visible`—activates when scrolled into view)
- **Note**: pure display, zero configuration

```ts
{ type: "calendar", enable: true, slot: "top", column: "secondary" }
```

## Table of Contents (toc)

- **Data source**: the current post's Markdown heading hierarchy (passed through by the page layout)
- **Rendering**: heading list with smooth highlighting of the reading position (M3 tonal pill state); the content area is height-capped (`calc(100dvh - 15rem)`) and scrolls independently
- **Page range**: defaults to `pages: ["post"]`
- **Mobile complementarity**: shown on desktop (≥1024px); on mobile/tablet the FAB floating TOC panel takes over (see [Floating Controls](/en/guide/article/fab/))
- **Heading source**: inclusion depth is controlled by `siteConfig.toc.depth` (see [Site Config](/en/guide/layout/site-config/))

```ts
{ type: "toc", enable: true, slot: "sticky", column: "secondary", pages: ["post"] }
```

## Profile Card

- **Data source**: `profileConfig.ts` (avatar/name/bio/social links)
- **Rendering**: avatar + name + bio + social icon buttons (with tooltips)
- **Position**: usually the very top of the main column, `slot: "top"`
- **Config details**: see [Footer & Profile](/en/guide/layout/footer-profile/)

```ts
{ type: "profile", enable: true, slot: "top" }
```

## Orchestration Examples

**Stats and calendar in the secondary column (dual mode)**

```ts title="src/config/sidebarConfig.ts"
{ type: "stats", enable: true, slot: "top", column: "secondary" },
{ type: "calendar", enable: true, slot: "top", column: "secondary" },
```

**Promoting the TOC to the main column (single mode)**

```ts title="src/config/sidebarConfig.ts"
{ enable: true, arrangement: "single", components: [
  { type: "profile", enable: true, slot: "top" },
  { type: "toc", enable: true, slot: "sticky", pages: ["post"] },
] }
```

## FAQ

**The categories/tags lists are empty**

Data aggregates from posts. Content appears after publishing at least one post with `category` / `tags`.

**Where does the "running days" stat come from**

It's a memoized metric computed from site data (like the site creation date), updating automatically with posts and time.

**A calendar month has no highlights**

No posts were published that month. The calendar only reflects the `published` date distribution.

**Why can't I see the sidebar TOC on mobile**

The sidebar folds into a drawer on mobile, and the TOC is served by the FAB floating panel—a designed complementary mechanism. See [Floating Controls](/en/guide/article/fab/).
