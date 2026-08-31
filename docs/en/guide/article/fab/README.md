---
title: Floating Controls (FAB)
createTime: 2026/09/01 00:11:00
permalink: /en/guide/article/fab/
---

The FAB (Floating Action Button) is the floating action bar at the bottom-right corner, aggregating back-to-top, a floating table of contents, jump-to-comments, and back-home actions. `fabConfig.ts` controls its visibility, position, size, and button list.

## Config Overview

```ts title="src/config/fabConfig.ts"
export const fabConfig = withUserConfig("fab", {
  enable: true,
  align: "end",       // "start" left | "end" right (default)
  size: "regular",    // "small" | "regular" | "large"
  offset: {
    bottom: "var(--m3e-space-8)",
    right: "var(--m3e-space-6)",
  },
  items: [ /* button list, rendered in array order */ ],
})
```

| Field | Values | Default | Description |
| --- | --- | --- | --- |
| `enable` | `boolean` | `true` | Master switch for the action bar |
| `align` | `"start"` / `"end"` | `"end"` | Horizontal position: left / right |
| `size` | `"small"` / `"regular"` / `"large"` | `"regular"` | Button size tier |
| `offset` | CSS values | Design tokens | Bottom-right margins; CSS variables or pixel values |
| `items` | `array` | Four buttons | Button list |

## Button Types

| type | Action | Default behavior |
| --- | --- | --- |
| `top` | Smooth scroll to top | Appears after scrolling past the banner height threshold |
| `toc` | Floating table of contents panel | Desktop already has a sticky sidebar TOC, so it shows on mobile/tablet only by default |
| `comment` | Jump to the comments area | **Zero DOM** when the comment system is off or the post disables comments |
| `home` | Back to home | `onlySubPages: true` shows it only on non-home pages |

Common properties per button entry:

```ts
{
  type: "toc",
  enable: true,                        // per-button switch
  icon: "material-symbols:…",          // custom icon (optional)
  devices: ["mobile", "tablet"],       // device matrix; omitted = all devices
  pages: ["post"],                     // page range filter
}
```

### Device Matrix (devices)

Three tiers matching the breakpoints in `fabConfig`:

- `"mobile"`: below 768px
- `"tablet"`: 768px ~ 1023px
- `"desktop"`: 1024px and above

Omitting `devices` applies to all devices. The SSR stage outputs Tailwind responsive classes directly (e.g. `flex lg:hidden`)—**zero first-screen flicker, CLS = 0**.

### Page Filter (pages)

Uses the same page identifiers as the sidebar (e.g. `["post"]` for post pages only). During Swup in-site navigation, visibility syncs via the `data-current-page` attribute on `#swup-container`.

## Default Config Explained

```ts title="src/config/fabConfig.ts"
items: [
  { type: "top", enable: true, devices: ["mobile", "tablet", "desktop"] },
  { type: "toc", enable: true, devices: ["mobile", "tablet"], pages: ["post"],
    depth: 3, closeOnSelect: true },
  { type: "comment", enable: true, devices: ["mobile", "tablet"], pages: ["post"] },
  { type: "home", enable: true, devices: ["mobile", "tablet"], onlySubPages: true },
]
```

Design intent: `top` works on all devices; `toc`, `comment`, and `home` are scoped to mobile and tablet (desktop gets TOC/comments from the sidebar and the page itself). The floating TOC includes headings up to h3 (`depth: 3`) and collapses on selection (`closeOnSelect: true`).

## Customization

The `items` array order is the render order—reorder, add, or remove freely:

```ts title="src/config/fabConfig.ts"
items: [
  { type: "top", enable: true },
  { type: "home", enable: true, onlySubPages: true },
  {
    type: "toc",
    enable: true,
    devices: ["mobile", "tablet", "desktop"],  // also show on desktop
    pages: ["post"],
    depth: 2,
    closeOnSelect: false,
  },
]
```

## Zero-Overhead Notes

- Comment button: zero DOM when the comment system is off or the post disables comments—no extra requests
- The FAB deliberately **excludes a music player**—avoiding dual-state confusion with the sidebar `MusicSidebar` and bundle bloat
- Architecture spec: `docs/fab-system.md` in the theme repository

## Practical Examples

**Minimal (back-to-top only)**

```ts title="src/config/fabConfig.ts"
items: [{ type: "top", enable: true }],
```

**Full-device TOC following**

```ts title="src/config/fabConfig.ts"
items: [
  { type: "top", enable: true },
  { type: "toc", enable: true, pages: ["post"], depth: 3, closeOnSelect: true },
  { type: "comment", enable: true, pages: ["post"] },
]
```

## FAQ

::: collapse
- The floating TOC is missing on desktop

  The default `devices` is `["mobile", "tablet"]`—desktop relies on the sticky sidebar TOC. Add `desktop` to `devices` if you want the floating TOC there too.

- The comment button doesn't appear

  Check three layers: the button's `enable` in `fabConfig` → the global `commentConfig.enable` (see [Comment System](/en/guide/article/comments/)) → whether the current page is within `pages`. Zero DOM when comments are off is by design.

- The back-to-top button doesn't appear

  The scroll position hasn't passed the banner height threshold. On short posts that fit one screen, the button stays hidden.
:::
