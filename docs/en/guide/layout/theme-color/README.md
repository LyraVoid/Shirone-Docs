---
title: Dynamic Color System
createTime: 2026/08/31 22:31:00
permalink: /en/guide/layout/theme-color/
---

The dynamic color system is a signature capability of Shirone: built upon Google's ==HCT color space== and Material Color Utilities, it derives ==8 tonal palettes and over 25 semantic color roles== from a single seed hue. Components across the entire site (buttons, cards, code blocks, banner waves, etc.) consume these unified role tokens.

## Quick Overview

```ts title="src/config/siteConfig.ts"
themeColor: {
  hue: 315,           // Default seed hue 0-360
  fixed: false,       // Hide theme color picker from visitors
  style: "tonalSpot", // Tonal palette variant
  spec: "2025",       // Design specification version
},
```

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `hue` | `number` | `315` | Seed hue angle across the 0-360 color wheel |
| `fixed` | `boolean` | `false` | When `true`, visitor theme color switcher is hidden and locked |
| `style` | `string` | `"tonalSpot"` | Material palette derivation variant (9 styles available) |
| `spec` | `string` | `"2025"` | `"2021"` (Material Design 3) or `"2025"` (Material 3 Expressive) |

## Seed Hue

`hue` acts as the algorithmic seed for the entire color system. Shirone defaults to `315` (soft violet-pink, curated for anime aesthetics):

| hue | Visual Impression |
| --- | --- |
| `315` | Violet-pink (default, anime style) |
| `262` | Purple |
| `345` | Pink |

The 0-360 range spans the full color wheel: `0` Red, `120` Green, `210` Cyan, `270` Violet. Modifying `hue` requires no other changes—all semantic color roles automatically regenerate.

> [!TIP]
> **Wallpaper Color Extraction**
> When banner wallpaper mode is active, the theme can dynamically extract the dominant theme color from the current wallpaper image. The configured seed `hue` serves as the initial baseline before user interaction.

## Palette Style

`style` defines the algorithmic curve used by Material Color Utilities to derive tones from the seed hue:

| style | Characteristics |
| --- | --- |
| `tonalSpot` | Default. Soft tones, balanced lightness steps—safest default |
| `vibrant` | High saturation, vivid and energetic |
| `content` | Derived from content colors, optimized for contrast |
| `expressive` | Broad hue shifts, dynamic expression (recommended for M3 Expressive) |
| `rainbow` | Broad multi-hue distribution |
| `fruitSalad` | Mixed playful accents |
| `monochrome` | Clean grayscale tonal steps |
| `neutral` | Low-chroma near-neutral hues |
| `fidelity` | Strict fidelity to source hue |

## Design Specification Version (spec)

| spec | Specification | Details |
| --- | --- | --- |
| `"2021"` | Material Design 3 | Classic MD3 palette calculation |
| `"2025"` | Material 3 Expressive | Default. Same color role definitions, updated modern derivation curves |

Shirone is designed around Material 3 Expressive (larger border radii, expressive motion), so keeping the default `"2025"` is recommended.

## Display Settings Panel

Visitors can adjust visual preferences in real time via the frontend "Display Settings" dialog:

```ts title="src/config/siteConfig.ts"
displaySettings: {
  colorStyle: true,    // 9-style palette switcher
  colorSpec: true,     // Color specification selector (2021/2025)
  wallpaperMode: true, // Background mode (banner/solid) toggle
  layoutMode: true,    // Post list layout (list/grid) toggle
  reduceMotion: true,  // Motion reduction toggle
  texture: true,       // Ambient texture selector
},
```

Visitor choices are saved in browser LocalStorage. Setting options to `false` completely removes them from the UI.

Pairing with `themeColor.fixed: true` strictly locks the palette—preventing external override.

## Practical Examples

**Minimalist Grayscale Site (Locked Theme)**

```ts title="src/config/siteConfig.ts"
themeColor: {
  hue: 210,
  fixed: true,
  style: "monochrome",
  spec: "2025",
},
displaySettings: {
  colorStyle: false,
  colorSpec: false,
  wallpaperMode: false,
  layoutMode: true,
  reduceMotion: true,
  texture: false,
},
```

**Vibrant Anime Aesthetics (Default Recommended)**

```ts title="src/config/siteConfig.ts"
themeColor: {
  hue: 345,
  fixed: false,
  style: "vibrant",
  spec: "2025",
},
```

## FAQ

::: collapse
- Hue changed but site colors remain unchanged

  The browser has cached the visitor's previous selection in LocalStorage. Clear site LocalStorage or test in an incognito window.

- Relationship between fixed and displaySettings.colorStyle

  `fixed: true` locks the theme color and removes the switcher entirely; `displaySettings.colorStyle: false` hides the dialog item while keeping the current style active.

- Does setting spec to 2021 cause issues

  No. Color tokens and role sets remain identical, with only the tonal derivation formula changing slightly.

- How is Dark Mode handled

  Dark mode colors are derived automatically from the same HCT seed. When toggled, the theme computes dark-role equivalents with no separate CSS maintenance required.
:::
