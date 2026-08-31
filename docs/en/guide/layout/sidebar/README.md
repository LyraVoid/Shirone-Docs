---
title: Sidebar Arrangement
createTime: 2026/08/31 22:39:00
permalink: /en/guide/layout/sidebar/
---

`sidebarConfig.ts` governs the blog sidebar layout, supporting both single-column and dual-column responsive arrangements, sticky widgets, and granular per-page visibility filters.

## Core Concepts

The layout coordinates main content and sidebar columns across viewports:

- **Single Column (`arrangement: "single"`)**: One primary sidebar positioned on the left or right.
- **Dual Column (`arrangement: "dual"`)**: Primary sidebar on one side, secondary sidebar on the other side.
- **Responsive Adaptability**: Dual-column collapses to single-column on medium tablets, and folds into a bottom navigation drawer on mobile viewports (< 1024px).

## Single vs Dual Arrangement

```ts title="src/config/sidebarConfig.ts"
export const sidebarConfig = withUserConfig("sidebar", {
  enable: true,
  arrangement: "dual", // "single" | "dual"
  side: "left",        // Primary column side: "left" | "right"
  components: [ ... ],
})
```

## Widget Types (components)

Shirone provides 8 built-in widget types:

| type | Widget | Configuration Source |
| --- | --- | --- |
| `profile` | Author Profile Card | `profileConfig.ts` |
| `music` | Music Player | `musicConfig.ts` + `src/data/music.ts` |
| `announcement` | Site Announcement | `announcementConfig.ts` |
| `categories` | Category Tree | Automatically aggregated |
| `tags` | Tag Cloud | Automatically aggregated |
| `stats` | Site Statistics | Automatically aggregated |
| `calendar` | Activity Calendar | Generated from post dates |
| `toc` | Article Table of Contents | `siteConfig.toc` |

### Widget Attributes

```ts
{
  type: "categories",
  enable: true,            // Toggle widget
  slot: "sticky",          // "top" (static header) | "sticky" (scroll follower)
  column: "primary",       // "primary" (default) | "secondary" (dual mode only)
  pages: ["home", "post"], // Target pages (omitted = all pages)
  collapseAfter: 5,        // Max visible items before collapse button
}
```

## Default Arrangement Structure

The standard dual-column arrangement:

```ts title="src/config/sidebarConfig.ts"
components: [
  { type: "profile", enable: true, slot: "top" },
  { type: "music", enable: true, slot: "top" },
  { type: "announcement", enable: true, slot: "top", pages: ["home"] },
  { type: "categories", enable: true, slot: "sticky", collapseAfter: 5, pages: ["home", "archive", "post"] },
  { type: "tags", enable: true, slot: "sticky", collapseAfter: 6, pages: ["home", "archive", "post"] },
  { type: "stats", enable: true, slot: "top", column: "secondary", pages: ["home", "archive", "categories", "tags"] },
  { type: "calendar", enable: true, slot: "top", column: "secondary" },
  { type: "toc", enable: true, slot: "sticky", column: "secondary", pages: ["post"] },
]
```

## Practical Examples

**Minimalist Single-Column Sidebar**

```ts title="src/config/sidebarConfig.ts"
{
  enable: true,
  arrangement: "single",
  side: "left",
  components: [
    { type: "profile", enable: true, slot: "top" },
    { type: "announcement", enable: true, slot: "top", pages: ["home"] },
    { type: "toc", enable: true, slot: "sticky", pages: ["post"] },
  ],
}
```

## FAQ

::: collapse
- How to reorder sidebar widgets
  The order of elements in the `components` array directly determines visual rendering order. Move items up or down in the array.

- Behavior of secondary items in single-column mode
  `column: "secondary"` is only active when `arrangement: "dual"`. In single mode, secondary widgets automatically render inside the primary column without losing content.

- Category or Tag list is too long
  Configure the `collapseAfter` threshold (e.g. `collapseAfter: 5`) to fold excess entries behind an expandable button.

- Sidebar is completely missing
  Verify `sidebarConfig.enable: true`, confirm that the current page is included in widget `pages` whitelists, and check viewport width (mobile screens fold sidebars into drawers).

- Does client-side page navigation reset widget state
  No. Sidebars belong to Swup's persistent outer framework and are never destroyed between page transitions—preserving music playback and collapse states seamlessly.
:::
