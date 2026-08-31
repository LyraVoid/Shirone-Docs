---
title: Sidebar Layout
createTime: 2026/08/31 22:34:00
permalink: /en/guide/layout/sidebar/
---

Sidebars in Shirone are data-driven: `sidebarConfig.ts` controls single or dual-column arrangements, left/right positioning, and the order, sticky behavior, and page filtering for 8 distinct widget types.

## Core Concepts

```ts title="src/config/sidebarConfig.ts"
export const sidebarConfig = withUserConfig("sidebar", {
  enable: true,
  arrangement: "dual", // "single" | "dual"
  side: "left",        // "left" | "right" (primary sidebar position)
  components: [ /* widget list */ ],
})
```

| Field | Options | Description |
| --- | --- | --- |
| `enable` | `boolean` | Master toggle for sidebar rendering |
| `arrangement` | `"single"` / `"dual"` | Single sidebar (default) or dual sidebars |
| `side` | `"left"` / `"right"` | Physical side for the primary column |

## Single vs Dual Arrangement

| Mode | Behavior | Container Width |
| --- | --- | --- |
| `"single"` (default) | All widgets render in a single column | 85rem |
| `"dual"` | Widgets with `column: "secondary"` move to the secondary column (viewports ≥ 1280px) | 96rem |

Responsive degradation is automatic: between 1024px and 1279px, dual mode smoothly degrades to a single column (showing the primary sidebar).

## Widget Types (components)

| Type | Widget | Configuration Source |
| --- | --- | --- |
| `profile` | Profile card | `profileConfig.ts` |
| `music` | Music player | `musicConfig.ts` + `src/data/music.ts` |
| `announcement` | Announcement box | `announcementConfig.ts` |
| `categories` | Categories tree | Auto-aggregated from post frontmatter |
| `tags` | Tag cloud | Auto-aggregated from post frontmatter |
| `stats` | Site statistics | Auto-generated metrics |
| `calendar` | Heatmap calendar | Auto-generated contribution graph |
| `toc` | Table of contents | `siteConfig.toc` |

### Widget Configuration Options

```ts
{
  type: "categories",
  enable: true,            // Enable or disable widget
  slot: "sticky",          // "top" (fixed) | "sticky" (pinned on scroll)
  column: "primary",       // "primary" (default) | "secondary" (dual mode only)
  pages: ["home", "post"], // Target pages (omitted = all pages)
  collapseAfter: 5,        // Collapse threshold for long item lists
}
```

### Page Filter (pages)

Valid page identifiers: `home`, `archive`, `friends`, `moments`, `anime`, `compass`, `skills`, `projects`, `devices`, `timeline`, `albums`, `about`, `post`, `categories`, `tags`.
