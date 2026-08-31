---
title: Banner & Background
createTime: 2026/08/31 22:32:00
permalink: /en/guide/layout/banner/
---

The Banner is the primary visual centerpiece at the top of the homepage. Shirone supports multi-image carousels, camera motion effects, typewriter subtitles, bottom wave transitions, wallpaper/solid background modes, and ambient texture overlays.

## Quick Overview

```ts title="src/config/siteConfig.ts"
wallpaperMode: { defaultMode: "banner" },  // "banner" wallpaper | "none" solid color
texture: {
  enable: true,
  defaultPreset: "starlight",
  defaultOpacity: 0.12,
  allowMotion: true,
},
banner: {
  src: { desktop: [...], mobile: [...] },
  position: "center",
  dim: { enable: true, opacity: 0.24 },
  homeText: { ... },
  carousel: { ... },
  waves: { enable: true },
},
```

## Banner Images (src)

```ts
src: {
  desktop: ["assets/images/banner/desktop/1.webp"],  // Viewport ≥ 1024px
  mobile: ["assets/images/banner/mobile/1.webp"],    // Viewport < 1024px (homepage only)
},
```

- **desktop**: Displayed on viewports ≥ 1024px.
- **mobile**: Used exclusively on the homepage for viewports < 1024px. Non-home pages on mobile use a compact header to preserve screen real estate.
- Array order represents carousel playback order. For a static banner, supply a single image in each array.

> [!TIP]
> **Asset Path Recommended**
> Placing images in `src/assets/` and referencing them via relative paths allows build-time automatic generation of responsive AVIF/WebP formats. Leading `/` paths under `public/` and remote URLs remain supported as unmodified pass-throughs.

### Crop Focus (position)

```ts
position: "center",  // "top" | "center" | "bottom"
```

Controls vertical cropping focus across varying screen aspect ratios.

### Dim Overlay (dim)

```ts
dim: {
  enable: true,   // Dark overlay over the image to enhance text contrast
  opacity: 0.24,  // 0-1
},
```

Increase opacity for bright wallpaper assets to ensure white hero typography remains crisp and accessible.

## Homepage Hero Text (homeText)

```ts
homeText: {
  enable: true,          // Visible only on homepage banner, centered vertically
  title: "Shirone",      // Hero title in banner center
  subtitle: [
    "Exploring possibilities through code and creativity",
    "Light always finds a way forward",
  ],
  typewriter: {
    enable: true,     // Character-by-character typewriter effect
    speed: 100,       // Typing speed per char in ms
    deleteSpeed: 50,  // Backspace deletion speed in ms
    pauseTime: 2000,  // Pause delay after line completion in ms
    loop: true,       // Continuous looping
  },
},
```

Setting `typewriter.enable: false` renders the complete subtitle immediately without animation.

## Carousel (carousel)

```ts
carousel: {
  enable: true,           // Active when multiple images are provided
  interval: 6000,         // Interval between slides in ms (enforced min 3000ms)
  fadeDuration: 1200,     // Crossfade duration in ms
  animation: "ken-burns", // Camera motion preset
},
```

| animation | Effect |
| --- | --- |
| `ken-burns` | Default. Subtle breathing camera zoom |
| `zoom-in` | Smooth forward zoom |
| `zoom-out` | Smooth backward zoom |
| `pan-left` | Horizontal pan left |
| `pan-right` | Horizontal pan right |
| `none` | Static crossfade |

## Wave Transition (waves)

```ts
waves: { enable: true },
```

Renders smooth SVG water waves in the page background color at the base of the banner, creating an organic transition into content cards. When disabled, wave DOM elements are completely omitted.

## Background Modes and Textures

### Wallpaper vs Solid Color (wallpaperMode)

```ts
wallpaperMode: { defaultMode: "banner" },
```

- `"banner"`: Uses the wallpaper banner as the page backdrop.
- `"none"`: Uses clean Material surface colors.

Visitors can switch modes via the display settings panel (when `displaySettings.wallpaperMode: true`).

### Texture System (texture)

```ts
texture: {
  enable: true,              // Master switch
  defaultPreset: "starlight", // Default texture preset
  defaultOpacity: 0.12,       // Opacity range 0.05 ~ 0.25
  allowMotion: true,          // Ambient motion (auto-disabled with reduced-motion)
},
```

| Preset | Aesthetic |
| --- | --- |
| `none` | No texture |
| `starlight` | Starlight shimmer (default) |
| `cyber-dots` | Cyberpunk dot grid |
| `topography` | Topographic contour lines |
| `geometric` | Minimal geometric lattice |
| `sakura` | Cherry blossom petals |

Texture colors are computed dynamically via HCT, harmonizing with the active theme color with zero runtime overhead when disabled.

## Practical Examples

**Static Banner + Zero Motion (Performance Focused)**

```ts title="src/config/siteConfig.ts"
banner: {
  src: {
    desktop: ["assets/images/banner/desktop/1.webp"],
    mobile: ["assets/images/banner/mobile/1.webp"],
  },
  homeText: {
    enable: true,
    title: "My Blog",
    subtitle: ["Writing quietly, living mindfully"],
    typewriter: { enable: false, speed: 100, deleteSpeed: 50, pauseTime: 2000, loop: false },
  },
  carousel: { enable: false, interval: 6000, fadeDuration: 1200, animation: "none" },
  waves: { enable: true },
},
```

**Immersive Multi-Image Showcase**

```ts title="src/config/siteConfig.ts"
banner: {
  src: {
    desktop: [
      "assets/images/banner/desktop/1.webp",
      "assets/images/banner/desktop/2.webp",
      "assets/images/banner/desktop/3.webp",
    ],
    mobile: ["assets/images/banner/mobile/1.webp"],
  },
  homeText: {
    enable: true,
    title: "Shirone",
    subtitle: ["First sentence", "Second sentence", "Third sentence"],
    typewriter: { enable: true, speed: 80, deleteSpeed: 40, pauseTime: 3000, loop: true },
  },
  carousel: { enable: true, interval: 5000, fadeDuration: 1200, animation: "ken-burns" },
  waves: { enable: true },
},
```

## FAQ

::: collapse
- Banner image does not display
  Check in sequence: relative path under `src/assets/` or leading `/` under `public/`, file existence, whether `wallpaperMode.defaultMode` is `"none"`, or whether visitor local storage has selected solid background mode.

- Mobile non-home pages have no banner
  This is deliberate design: mobile subpages use a compact header to maximize viewport content area.

- Carousel interval below 3000ms does not take effect
  A runtime floor of 3000ms is enforced to prevent rapid flickering and excessive GPU overhead.

- Texture is too faint or too strong
  Adjust `defaultOpacity` (recommended range 0.05 ~ 0.25). Textures serve as ambient decoration; values above 0.25 may distract from article reading.
:::
