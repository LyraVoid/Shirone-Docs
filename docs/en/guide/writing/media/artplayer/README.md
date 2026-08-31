---
title: ArtPlayer Player
createTime: 2026/08/31 23:33:00
permalink: /en/guide/writing/media/artplayer/
---

The ArtPlayer video component plays self-hosted video files and direct media streams (supporting MP4, WebM, and HLS streaming).

## Syntax

Use `::artplayer` with configurable parameters:

```markdown
::artplayer{src="/videos/demo.mp4" title="Demo Video" poster="/assets/poster.webp" preload="auto"}
```

## Attribute Parameters

| Attribute | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `src` | `string` | Yes | None | Video direct URL or local path under `/public` |
| `title` | `string` | Yes | None | Video title |
| `poster` | `string` | No | None | Poster image displayed before playback |
| `preload` | `string` | No | `"none"` | Preload policy: `"none"` (default) or `"auto"` (viewport preloading) |

## Features

- Modern controls including playback speed, volume slider, fullscreen, and picture-in-picture modes.
- ArtPlayer bundles load asynchronously only on pages containing the directive.
