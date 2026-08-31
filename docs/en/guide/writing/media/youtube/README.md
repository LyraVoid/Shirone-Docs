---
title: YouTube Video
createTime: 2026/08/31 23:31:00
permalink: /en/guide/writing/media/youtube/
---

Shirone supports YouTube video embeds with privacy-friendly Facade placeholder patterns and preload policies.

## Syntax

Use the `::youtube` directive with configurable parameters:

```markdown
::youtube{id="5gIf0_xpFPI" title="YouTube Demo Video" preload="auto"}
```

## Attribute Parameters

| Attribute | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `id` | `string` | Yes | None | 11-character unique YouTube video ID |
| `title` | `string` | Yes | None | Video title and accessibility label |
| `preload` | `string` | No | `"none"` | Preload policy: `"none"` (default) or `"auto"` (viewport preloading) |

## Preload & Privacy Policies

- `preload="none"`: Third-party scripts and cookies remain blocked until the user actively clicks the poster.
- `preload="auto"`: Prepares container and metadata as the video card scrolls into the active viewport.
