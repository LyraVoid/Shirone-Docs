---
title: Dynamic Color System
createTime: 2026/08/31 22:31:00
permalink: /en/guide/layout/theme-color/
---

The dynamic color system is a signature capability of Shirone: built upon Google's HCT color space and Material Color Utilities, it derives 8 tonal palettes and over 25 semantic color roles from a single seed hue.

## Quick Overview

```ts title="src/config/siteConfig.ts"
themeColor: {
  hue: 315,           // Default seed hue (0-360)
  fixed: false,       // Hide theme color picker from visitors
  style: "tonalSpot", // Tonal palette variant
  spec: "2025",       // Design specification version
},
```

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `hue` | `number` | `315` | Seed hue angle (0-360) |
| `fixed` | `boolean` | `false` | When `true`, visitor theme color switcher is hidden and locked |
| `style` | `string` | `"tonalSpot"` | Palette generation style (9 styles available) |
| `spec` | `string` | `"2025"` | `"2021"` (Material 3) or `"2025"` (Material 3 Expressive) |

## Seed Hue

`hue` acts as the seed for all derived color roles. Shirone defaults to `315` (soft violet-pink).

| hue | Color Impression |
| --- | --- |
| `315` | Violet-pink (default) |
| `262` | Purple |
| `345` | Pink |

## Palette Style

`style` defines the algorithmic curve used by Material Color Utilities:

| Style | Description |
| --- | --- |
| `tonalSpot` | Default. Balanced contrast and natural saturation |
| `vibrant` | High saturation, vivid and lively |
| `content` | Contrast-driven palette |
| `expressive` | Extended hue shifts, recommended for M3 Expressive |
| `rainbow` | Broad spectrum distribution |
| `fruitSalad` | Multi-hue mixed accents |
| `monochrome` | Minimal grayscale tonal steps |
| `neutral` | Low-chroma near-neutral tones |
| `fidelity` | Strict fidelity to source hue |

## Display Settings Panel

Visitors can configure visual preferences via the display settings panel in the frontend:

```ts title="src/config/siteConfig.ts"
displaySettings: {
  colorStyle: true,    // 9-style palette switcher
  colorSpec: true,     // Color specification selector (2021/2025)
  wallpaperMode: true, // Background mode (banner/none)
  layoutMode: true,    // Post list layout (list/grid)
  reduceMotion: true,  // Motion reduction toggle
  texture: true,       // Ambient texture switcher
},
```

Visitor preferences are preserved in local storage. Setting items to `false` removes corresponding options from the UI.
