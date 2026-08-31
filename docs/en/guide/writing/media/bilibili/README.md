---
title: Bilibili Video
createTime: 2026/08/31 23:30:00
permalink: /en/guide/writing/media/bilibili/
---

Shirone provides zero-overhead Bilibili video embeds utilizing lightweight Facade placeholder patterns with optional viewport preloading.

## Syntax

Use the `::bilibili` leaf directive with configurable parameters:

```markdown
::bilibili{bvid="BV1fK4y1s7Qf" title="Demo Video" p=1 preload="auto"}
```

## Attribute Parameters

| Attribute | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `bvid` | `string` | Yes | None | Bilibili video BV identifier |
| `title` | `string` | Yes | None | Video title for accessibility and captions |
| `p` | `number` | No | `1` | Part or episode number |
| `preload` | `string` | No | `"none"` | Preload policy: `"none"` (default facade) or `"auto"` (viewport preloading) |

## Preloading Policies (preload)

- **`preload="none"` (Default)**:
  Zero initial requests. Only cover posters and play buttons render until clicked.
- **`preload="auto"` (Viewport Preloading)**:
  Prepares player metadata as the video card scrolls near the viewport, ensuring instantaneous playback response upon user click.
