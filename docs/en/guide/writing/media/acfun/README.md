---
title: AcFun Video
createTime: 2026/08/31 23:32:00
permalink: /en/guide/writing/media/acfun/
---

Shirone supports embedding video content from AcFun with optional preloading.

## Syntax

Use the `::acfun` directive with parameters:

```markdown
::acfun{acid="ac48649632" title="AcFun Video Content" preload="auto"}
```

## Attribute Parameters

| Attribute | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `acid` | `string` | Yes | None | AcFun AC video identifier |
| `title` | `string` | Yes | None | Video title and accessibility description |
| `preload` | `string` | No | `"none"` | Preload policy: `"none"` (default) or `"auto"` (viewport preloading) |

## Features

- Responsive 16:9 aspect ratio container.
- Supports `preload="auto"` to initialize player resources as the element enters the viewport.
