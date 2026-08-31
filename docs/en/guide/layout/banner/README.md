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
  desktop: ["assets/images/banner/desktop/1.webp"],  // ≥ 1024px
  mobile: ["assets/images/banner/mobile/1.webp"],    // < 1024px (homepage only)
},
```

- **desktop**: Displayed on viewports ≥ 1024px.
- **mobile**: Used exclusively on the homepage for viewports < 1024px. Non-home pages on mobile use a compact header to preserve screen real estate.
- Array order represents carousel playback order. For a static banner, supply a single image.

::: tip Asset Path Recommended
Placing images in `src/assets/` allows build-time automatic generation of responsive AVIF/WebP formats.
:::

## Position and Dimming

```ts
position: "center",  // "top" | "center" | "bottom"
dim: {
  enable: true,   // Dark overlay for increased contrast with header text
  opacity: 0.24,  // Value between 0 and 1
},
```

## Homepage Text (homeText)

```ts
homeText: {
  enable: true,          // Centered title and subtitle on homepage banner
  title: "Shirone",      // Large centered banner title
  subtitle: [
    "A journey of words and memories",
    "Finding light in every story",
  ],
  typewriter: {
    enable: true,     // Character-by-character typewriter animation
    speed: 100,       // Typing delay per char (ms)
    deleteSpeed: 50,  // Backspacing delay (ms)
    pauseTime: 2000,  // Pause time before next phrase (ms)
    loop: true,       // Loop continuously
  },
},
```

## Carousel Settings (carousel)

```ts
carousel: {
  enable: true,
  interval: 6000,       // Interval in ms (min 3000ms enforced at runtime)
  fadeDuration: 1200,   // Crossfade duration (ms)
  animation: "ken-burns", // Camera motion mode
},
```

| Animation | Effect |
| --- | --- |
| `ken-burns` | Gentle breathing zoom and pan |
| `zoom-in` | Slow forward zoom |
| `zoom-out` | Slow backward zoom |
| `pan-left` | Leftward pan |
| `pan-right` | Rightward pan |
| `none` | Static crossfade |

## Wave Transition (waves)

```ts
waves: { enable: true },
```

Renders subtle wave curves colored with the surface background at the bottom edge of the banner, smoothing the transition into post content.

## Background Texture System

```ts
texture: {
  enable: true,
  defaultPreset: "starlight",
  defaultOpacity: 0.12,
  allowMotion: true,
},
```

| Preset | Description |
| --- | --- |
| `none` | No texture |
| `starlight` | Subtle starlight points (default) |
| `cyber-dots` | Cyber dot grid |
| `topography` | Topographic contours |
| `geometric` | Clean geometric lines |
| `sakura` | Cherry blossom petals |

Texture colors adapt to the dynamic theme color automatically. When disabled, zero DOM elements and zero CSS overhead are produced.
