---
title: Image Tonal Bloom
createTime: 2026/09/01 00:51:00
permalink: /en/guide/features/image-bloom/
---

Tonal Bloom provides **anti-jank size placeholders with color transitions** for all site images: before an image loads, a blurred placeholder block derived from the same HCT color system as the theme appears; once loaded, it smoothly transitions to the clear image—eliminating layout jumps and white flashes during loading.

> [!NOTE]
> **Accessibility & Motion Adaptation**
> Ambient bloom filters automatically disable transition animations when `prefers-reduced-motion` is detected or enabled in Display Settings.

## Configuration

```ts title="src/config/imageBloomConfig.ts"
export const imageBloomConfig = withUserConfig("imageBloom", {
  enable: true,
  blurRadius: 20,
  opacity: 0.7,
  transitionDuration: 300,
})
```

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `enable` | `boolean` | `true` | Bloom placeholder switch |
| `blurRadius` | `number` | `20` | Placeholder blur radius (px) |
| `opacity` | `number` | `0.7` | Placeholder opacity (0 ~ 1) |
| `transitionDuration` | `number` | `300` | Transition duration after load (ms) |

## How It Works

1. Before load: a blurred placeholder block derived from the theme's HCT palette is rendered, **locking in the size in advance**—the layout never jumps due to image loading (CLS = 0)
2. After load: the blur block fades out smoothly over `transitionDuration`, revealing the clear image

The placeholder color derives from the theme's dynamic palette—changing the theme color shifts the bloom tint too.

## Tuning Tips

**Faster / slower transitions**

```ts
transitionDuration: 150,  // quick cut, for sites with mostly small images
transitionDuration: 600,  // soft, for photography-heavy blogs
```

**More pronounced bloom**

```ts
blurRadius: 30,
opacity: 0.85,
```

A larger `blurRadius` makes the block more diffuse; higher `opacity` makes the color denser. The defaults (20 / 0.7) balance looks and distraction.

**Disable entirely**

```ts
enable: false,
```

Images then render through the normal loading flow (no placeholder block), which may cause layout shifts during loading.

## FAQ

::: collapse
- I still see the blur block after the image loads
  That's the transition's mid-state. If it lingers noticeably beyond `transitionDuration`, the image itself is loading slowly (compress large images first).

- The placeholder color doesn't match the image
  The placeholder comes from the theme's HCT palette, not per-image color extraction—it's a theme-level unified block. It's a separate mechanism from "extracting a theme color from the banner wallpaper."

- Does it affect performance
  The placeholder is a pure CSS blur block with no JavaScript color-extraction cost; disabling leaves zero residue.
:::
